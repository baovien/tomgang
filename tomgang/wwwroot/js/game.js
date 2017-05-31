/****************LIFT*****************/
function liftClickPost() {
	$('#benkmann').click(function () {
		window.hub.server.liftClick();
		getCurrentGains();
		$('#gainNumber').text(Math.floor(window.currentGains)); //Oppdaterer client før server for smoothere opplevelse.
	});
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
				"background-color": "green"
			});
		}

		//Viser de upgradene som trengs
		$('[id="' + element.item1 + '"]').show();
	});
}

function upgradeBtnsPost() {
	$(".upgradeImg").each(function () {
		$(this).on("click", function () {

			updateVariables();
			var temp = window.currentGains;

			if (temp >= this.dataset.cost) {

				window.hub.server.upgradeClick($(this).attr('id'));

				//Fjern upgrade fra html
				$(this).remove();
				$(".popover").remove();

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
	$(".itemImg").each(function (element) {
		if (window.currentGains < this.dataset.cost) { //Cost er større enn playergains.
			$(this).addClass("upgradeGreyed");
			$(this).css({
				"background-color": ""
			});
		} else { //Cost er mindre enn playergains.
			$(this).removeClass("upgradeGreyed");
			$(this).css({
				"background-color": "green"
			});
		}
		$(this).show();
	});
}

// Oppdater ved siteload
function updateItemsCost() {
	$(".itemImg").each(function () {
		var itemid = this;
		window.hub.server.getSingleItemAmount($(itemid).attr("id")).done(function (amount) {
		itemid.dataset.cost = itemid.dataset.startingprice * Math.exp(0.14 * amount);
		itemid.dataset.content = "Cost: " + Math.round(itemid.dataset.cost) + ", Amount: " + amount;
		});
	});
}

function itemBtnsPost() {
	$(".itemImg").each(function () {
		$(this).on("click", function () {
			//startverdi*(e^0.14x)
			var itemid = this;
			window.hub.server.itemClick($(this).attr("id")).done(function (value) {
				if (value) {
						//Update gainnumber
						getCurrentGains();
						var temp = window.currentGains;
						$('#gainNumber').text(Math.floor(temp - itemid.dataset.cost)); 

						//Update item info
						window.hub.server.getSingleItemAmount($(itemid).attr("id")).done(function (amount) {
						itemid.dataset.cost = itemid.dataset.startingprice * Math.exp(0.14 * amount);
						itemid.dataset.content = "Cost: " + Math.round(itemid.dataset.cost) + ", Amount: " + amount;
						$(itemid).popover('hide');												
					});
				}
			});
		});
	});
}