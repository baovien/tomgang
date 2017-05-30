function updateItemsStatus() {
	/*
	De som brukeren ikke har råd til blir gråfarga. Ellers får de som er affordable grønn bakgrunn,
	*/
	$(".itemImg").each(function (element) {
		if (window.gains < this.dataset.cost) { //Cost er større enn playergains.
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
		var amount = getSingleItemAmount($(this).attr("id"));
		this.dataset.cost = this.dataset.cost * Math.exp(0.14 * amount);
		this.dataset.content = "Amount: " + getSingleItemAmount($(this).attr("id"));
	});
}

function itemBtnsPost() {
	$(".itemImg").each(function () {
		$(this).on("click", function () {
			//startverdi*(e^0.14x)
			var itemid = this;
			window.hub.server.itemClick($(this).attr("id")).done(function (value) {
				if (value) {
					window.hub.server.getSingleItemAmount($(itemid).attr("id")).done(function (amount) {
						itemid.dataset.cost = itemid.dataset.cost * Math.exp(0.14 * amount);
						itemid.dataset.content = "Cost: " + itemid.dataset.cost + ", Amount: " + amount;
						$(itemid).popover('hide');
					});
				}
			});
		});
	});
}