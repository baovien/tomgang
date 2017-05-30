//Liftclick posting
function liftClickPost() {
	$('#benkmann').click(function () {
		window.hub.server.liftClick();
		console.log("click");
		//$('#gainNumber').text(Math.floor(window.gains)); //Oppdaterer client før server for smoothere opplevelse.
	});
}

function getCurrentGains() {
	window.hub.server.getCurrentGains().done(function (value) {
		window.gains = value;
	});
}

function getEligibleUpgrades() {
	window.hub.server.checkUpgrades().done(function (value) {
		window.upgrades = value;
	});
}

function increaseGains() {
	window.hub.server.increaseGains();
}

function updateGainsCounter() {
	$('#gainNumber').text(Math.floor(window.gains));
}

function updateUpgradesStatus() {

	/*
	Itererer gjennom alle upgrades som brukeren kan kjøpe og viser de.
	De som brukeren ikke har råd til blir gråfarga. Ellers får de som er affordable grønn bakgrunn,
	*/
	window.upgrades.forEach(function (element) {
		if (window.gains <= element.item2) { //Cost er større enn playergains.
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

			var temp = window.gains;

			if (temp >= this.dataset.cost) {

				window.hub.server.upgradeClick($(this).attr('id')).done(function () {
					//Smoothere update på client
					$(this).remove();
					$(".popover").remove();
					$('#gainNumber').text(Math.floor(temp - this.dataset.cost));
				});
			}
		});
	});

}