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

function itemBtnsPost() {
	$(".itemImg").each(function () {
		$(this).on("click", function () {
			//Oppdaterer gains i tilfelle client ikke har polla fra server
			getItemAmount();
			getCurrentGains();

			var gains = window.gains;
			//startverdi*(e^0.14x)
			var itemPrice = this.dataset.cost * Math.exp(0.14 * window.itemAmount[$(this).attr("id")]);

			
			if (gains >= itemPrice) {

				//Increment item amount
				$.ajax({
					url: '/Game/itemClick',
					type: 'POST',
					data: {
						'itemid': $(this).attr("id")
					},
					dataType: "json"
				});
				
				//Update gains i view
				$('#gainNumber').text(gains - itemPrice);

				//Regn ut neste cost for item
				getItemAmount();
				itemPrice = this.dataset.cost * Math.exp(0.14 * window.itemAmount[$(this).attr("id")]);

				//Update cost i view
				this.dataset.cost = itemPrice;
				this.dataset.content = "Cost: " + itemPrice + ", Income: " + this.dataset.income;
				$(this).popover("show");

				console.log("Onclick gains: " + gains + " - Next Itemprice: " + itemPrice);

				console.log(window.itemAmount);

			}
			
			

		});
	});
}
 // TODO FIKS ITEM COST
function updateItemsCost() {
	$(".itemImg").each(function () {
		getItemAmount();
		var itemPrice = Math.floor(this.dataset.cost * Math.exp(0.14 * window.itemAmount[$(this).attr("id")]));
		console.log("updateItemsCost: " + itemPrice);
		
	});
}

function getItemAmount() {
	$.ajax({
		type: "GET",
		url: 'Game/getItemAmount',
		async: false,
		success: function (data) {
			//Gjor om slik at key er id, val er amount
			window.itemAmount = data.reduce(function (result, item) {
				result[item.item1] = item.item2;
				return result;
			}, {});
		},
		error: function (xhr) {
			console.log("Could not request getCurrentGains");
		}
	});
}