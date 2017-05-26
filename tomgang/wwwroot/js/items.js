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

			var temp = window.gains;
			
			//startverdi*(e^0.14x)
			var itemPrice = Math.floor(this.dataset.cost * Math.exp(0.14 * window.itemAmount[$(this).attr("id")]));


			console.log("Onclick gains: " + temp + " - Itemprice: " + window.itemPrice);
			
			if (temp >= window.itemPrice) {

				$.ajax({
					url: '/Game/itemClick',
					type: 'POST',
					data: {
						'itemid': $(this).attr("id")
					},
					dataType: "json"
				});

				//Smoothere update på client
				updateItemsCost();
				$('#gainNumber').text(temp - window.itemPrice);
				console.log("inside if: " + window.itemPrice);
				console.log(window.itemAmount);

			}
		});
	});
}
 // TODO FIKS ITEM COST
function updateItemsCost() {
	$(".itemImg").each(function () {
		console.log("updateItemsCost: " + window.itemPrice);
		this.dataset.cost = window.itemPrice;
		this.dataset.content = "Cost: " + window.itemPrice + ", Income: " + this.dataset.income;
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