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
// Oppdater ved itemclick
function updateSingleItemCost(item) {
	var amount = getSingleItemAmount($(item).attr("id"));
	item.dataset.cost = item.dataset.cost * Math.exp(0.14 * amount);
	item.dataset.content = "Cost: " + item.dataset.cost + ", Amount: " + getSingleItemAmount($(item).attr("id"));
	$(item).popover('hide');
}

function getSingleItemAmount(id) {
	var result = 0;
	window.hub.server.getSingleItemAmount(id).done(function (data) {
		result = data;
	});
	return result;
}


function itemBtnsPost() {
	$(".itemImg").each(function () {
		$(this).on("click", function () {
			//startverdi*(e^0.14x)

			var bought;

			window.hub.server.itemClick().done(function (value) {
				bought = value;
			});

			if (bought) {
				updateSingleItemCost($(item).attr("id"));
				console.log("h");
			}

		});
	});
}

function getItemAmountList() {
	var list = 0;
	window.hub.server.getItemAmount().done(function (data) {
		list = data.reduce(function (result, item) {
			result[item.item1] = item.item2;
			return result;
		}, {});
	});
	return list;
}