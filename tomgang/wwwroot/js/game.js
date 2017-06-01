/****************MAIN*****************/

function updateIntervals() {
	if (window.isInitialized && window.upgrades !== undefined) {
		getPlayerInfo();

		setInterval(function () {
			var now = new Date().getTime();
			var dt = 0;
			if (window.lastCall !== undefined) {
				dt = (now - window.lastCall) * 0.001;
			}
			window.lastCall = now;

			window.currentGains += (window.incomeValue * dt);
			$('#gainNumber').text(Math.floor(window.currentGains));

			updateUpgradesStatus();
			updateItemsStatus();

		}, 100);

		//Server data verification
		setInterval(function () {
			getPlayerInfo();
			getUnlockedAchis();
			getEligibleUpgrades();
			increaseGains();
			getHighscoreValues();
			updateHighscoreTab();
			updateAchievementsTab();
			updateItemsCost();
		}, 5000);
	} else {
		console.log(window.isInitialized);
		console.log(window.upgrades);
		setTimeout(updateIntervals, 500);
	}
}



function getCurrentGains() {
	window.hub.server.getCurrentGains().done(function (value) {
		window.currentGains = value;
	});
}

function getEligibleUpgrades() {
	window.hub.server.checkUpgrades().done(function (value) {
		window.upgrades = value;
	});
}

function getHighscoreValues() {
	window.hub.server.getHighscore().done(function (value) {
		window.highscore = value;
	});
}

function getUnlockedAchis() {
	window.hub.server.checkAchis().done(function (value) {
		window.achis = value;
	});
}

function increaseGains() {
	window.hub.server.increaseGains();
}

// INFO TABS
function getPlayerInfo() {
	window.hub.server.getUserInfo().done(function (dict) {
		window.currentGains = dict["currentGains"];
		window.incomeValue = dict["incomeValue"];
		window.clickValue = dict["clickValue"];
		window.totalGains = dict["totalGains"];
		window.timesClicked = dict["timesClicked"];
		window.timeJoined = dict["timeJoined"];

		$("#gpsec").text(window.incomeValue);
		$("#gplift").text(Math.floor(window.clickValue));
		$("#totgains").text(Math.floor(window.totalGains));
		$("#timesClicked").text(window.timesClicked);
		$("#joindate").text(window.timeJoined);
	});
}

function updateHighscoreTab() {
	var i = 0;
	var rowCount = $('#hstable tbody tr').length;

	window.highscore.forEach(function (element) {
		$('#addr' + i).html("<td class='pos'>" + (i + 1) + "</td><td class='name'>" + element.item1 + " </td><td class='score'>" + Math.floor(element.item2) + "</td>");

		//sjekker om ny entry. append kun hvis hsliste size har økt
		if (rowCount < window.highscore.length) {
			$('#hstable').append('<tr id="addr' + (i + 1) + '"></tr>');
		}

		//Sorterer listen etter score
		console.log($('#hstable tbody > tr'));
		$('#hstable tbody tr').sort(function (a, b) {
			return +$('td.score', b).text() > +$('td.score', a).text();
		}).appendTo('tbody').find('td:first').text(function (index) {
			return ++index;
		});

		i++;
	}, this);
}



/****************LIFT*****************/
function liftClickPost() {
	$('#benchman').click(function () {
		window.hub.server.liftClick().done(function () {
			window.currentGains += (window.clickValue);
		});

		$('#gainNumber').text(Math.floor(window.currentGains)); //Oppdaterer client før server for smoothere opplevelse.
		$("#timesClicked").text(+window.timesClicked + 1);

		$(this).on({
			'mousedown': function () {
				$(this).attr('src', $("#Weights").attr("data-weightimg") + 'up.png');
			},
			'mouseup': function () {
				$(this).attr('src', $("#Weights").attr("data-weightimg") + 'down.png');
			}
		});
	});
}

function autoLift() {

}

function updateBenchWeight() {
	var numWeights = $("#Weights").attr("data-amount");
	console.log(numWeights);
	var weightsOn = (numWeights / 10) | 0;
	if (weightsOn > 5) {
		weightsOn = 5;
	}

	$("#Weights").attr("data-weightimg", "images/benchman/bench" + weightsOn);
	$("#benchman").attr("src", "images/benchman/bench" + weightsOn + "down.png");

}

function updateGainsCounter() {
	$('#gainNumber').text(Math.floor(window.currentGains));
}

/****************UPGRADES*****************/

function updateUpgradesStatus() {
	/*
	Itererer gjennom alle upgrades som brukeren kan kjøpe og viser de.
	De som brukeren ikke har råd til blir gråfarga. Ellers får de som er affordable grønn bakgrunn,
	*/

	window.upgrades.forEach(function (element) {
		if (window.currentGains <= element.item2) { //Cost er større enn playergains.
			$('[id="' + element.item1 + '"]').addClass("upgradeGreyed");
			$('[id="' + element.item1 + '"]').css({
				"background-color": ""
			});
		} else { //Cost er mindre enn playergains.
			$('[id="' + element.item1 + '"]').removeClass("upgradeGreyed");
			$('[id="' + element.item1 + '"]').css({
				"background-color": "lightgreen"
			});
		}

		//Viser de upgradene som trengs
		$('[id="' + element.item1 + '"]').show();
	});
}

function upgradeBtnsPost() {
	$(".upgradeImg").each(function () {
		$(this).on("click", function () {
			console.log("Upgrade click");

			getPlayerInfo();
			var upgradeid = this;
			var temp = window.currentGains;

			if (temp >= this.dataset.cost) {
				$(upgradeid).hide();
				window.hub.server.upgradeClick($(upgradeid).attr('id')).done(function (bool) {
					//Fjern upgrade fra html
						console.log(bool);

					if (bool) {
						$(upgradeid).remove();
						$(".popover").remove();
					} else {
						$(upgradeid).show();
					}
				});
				//Smoothere update
				$('#gainNumber').text(Math.floor(temp - this.dataset.cost));
				updateUpgradesStatus();
			}
		});
	});
}

/******************ITEMS******************/

function updateItemsStatus() {
	/*
	De som brukeren ikke har råd til blir gråfarga. Ellers får de som er affordable grønn bakgrunn,
	*/

	$(".item").each(function (element) {
		if (window.currentGains < this.dataset.cost) { //Cost er større enn playergains.
			$(this).addClass("upgradeGreyed");
			$(this).css({
				"background-color": ""
			});
		} else { //Cost er mindre enn playergains.
			$(this).removeClass("upgradeGreyed");
			$(this).css({
				"background-color": "lightgreen"
			});
		}
		$(this).show();
	});
}

// Oppdater ved siteload
function updateItemsCost() {
	$(".item").each(function () {
		var itemid = this;
		window.hub.server.getSingleItemAmount($(itemid).attr("id")).done(function (amount) {
			itemid.dataset.cost = itemid.dataset.startingprice * Math.exp(0.14 * amount);
			itemid.dataset.amount = amount;
			$("font", itemid).text(amount);
			$("#itemprice", itemid).text("Price: " + Math.round(itemid.dataset.cost));
			updateBenchWeight();
			updateItemsStatus();
		});
	});
}

function itemBtnsPost() {
	$(".item").each(function () {
		$(this).on("click", function () {
			console.log("Item click");
			//getPlayerInfo();
			var itemid = this;
			var temp = window.currentGains;
			
			//Raskere visning
			if (temp >= this.dataset.cost) {
				itemid.dataset.amount++;
				window.currentGains -= itemid.dataset.cost;
				itemid.dataset.cost = itemid.dataset.startingprice * Math.exp(0.14 * itemid.dataset.amount);
				$("#itemprice", itemid).text("Price: " + Math.round(itemid.dataset.cost));
				$('#gainNumber').text(Math.floor(window.currentGains));
				$("font", itemid).text(itemid.dataset.amount);

				if (itemid.dataset.name == "Weights") {
					updateBenchWeight();
				}

				//Server call
				window.hub.server.itemClick($(this).attr("id")).done(function (value) {

				});
				//updateItemsStatus();
				
			}
			
		});
	});
}

/******************ACHI******************/

/**
 * Endrer de upgradsa playeren har til originalbilde
 */
function updateAchievementsTab() {
	if (window.achis !== undefined) {
		for (var i = 0; i < window.achis.length; i++) {
			var element = document.getElementById(window.achis[i]);
			if (window.achis[i] !== $(element).attr("id")) {
				//Do nothing
			} else { //Hvis achilist matcher med de på siden, endre tilbake til originalbilde
				var img = $(element).attr("data-imgPath");
				$(element).attr("src", img);
			}
		}
	}
}