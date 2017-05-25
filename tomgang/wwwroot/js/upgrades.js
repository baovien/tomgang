
function update() { //Kjøres i timer funksjon i index.
	//Oppdaterer current gains
	getEligibleUpgrades();
	getCurrentGains();
	updateUpgradesStatus();
	updateItemsStatus();
	updateGainsCounter();
}

function updateUpgradesStatus() {
	/*
	Itererer gjennom alle upgrades som brukeren kan kjøpe og viser de. 
	De som brukeren ikke har råd til blir gråfarga. Ellers får de som er affordable grønn bakgrunn,
	*/

	window.upgrades.forEach(function (element) {
		if (window.gains < element.item2) { //Cost er større enn playergains.
			$('[id="' + element.item1 + '"]').addClass("upgradeGreyed");
			$('[id="' + element.item1 + '"]').css({
				"background-color": ""
			});
		} else { //Cost er mindre enn playergains.
			$('[id="' + element.item1 + '"]').removeClass("upgradeGreyed");
			$('[id="' + element.item1 + '"]').css({
				"background-color": "green"
			});
		}

		//Viser de upgradene som trengs
		$('[id="' + element.item1 + '"]').show();
	});
}

//Liftclick posting
function liftClickPost() {
	$('#benkmann').click(function () {
		$.ajax({
			type: 'POST',
			url: '/Game/liftClick',
			cache: false,
			success: function (data) {
				updateUpgradesStatus();
				$('#gainNumber').text(window.gains += 1); //Oppdaterer client før server for smoothere opplevelse.
			}
		});
	});
}

function getCurrentGains() {
	$.ajax({
		type: "GET",
		url: 'Game/getCurrentGains',
		async: false,
		success: function (data) {
			window.gains = data;
		},
		error: function (xhr) {
			console.log("Could not request getCurrentGains");
		}
	});
}

function getEligibleUpgrades() {
	$.ajax({
		type: "GET",
		url: "Game/checkUpgrades",
		async: false,
		success: function (data) {
			window.upgrades = data;
		},
		error: function (xhr) {
			console.log("Could not request checkUpgrades");
		}
	});
}

function updateGainsCounter() {
	$('#gainNumber').text(window.gains);
}

function upgradeBtnsPost() {
	$(".upgradeImg").each(function () {
		$(this).on("click", function () {
			
			//Oppdaterer gains i tilfelle client ikke har polla fra server
			getCurrentGains();
			var temp = window.gains;

			if (temp >= this.dataset.cost) {
				
				$.ajax({
					url: '/Game/upgradeClick',
					type: 'POST',
					data: {
						'id': $(this).attr("id")
					},
					dataType: "json"
				});
				
				//Smoothere update på client
				$(this).remove();
				$(".popover").remove();
				$('#gainNumber').text(temp - this.dataset.cost); 

			}
		});
	});

}
