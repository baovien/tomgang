function updateItemsStatus() {
	/*
	De som brukeren ikke har råd til blir gråfarga. Ellers får de som er affordable grønn bakgrunn,
	*/
	$(".itemImg").each(function (element) {
		if (window.gains < getItemPrice(this)) { //Cost er større enn playergains.
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

// Viser alle data
function updateItemsCost() {
	$(".itemImg").each(function () {
		var itemAmountList = getItemAmountList();
		this.dataset.content = "Price: " + getItemPrice(this) + ", Amount:" + itemAmountList[$(this).attr("id")];
	});
}

function itemBtnsPost() {
	$(".itemImg").each(function () {
		$(this).on("click", function () {
			//startverdi*(e^0.14x)
			
			var bought;

			$.ajax({
				url: '/Game/itemClick',
				type: 'GET',
				data: {
					'itemid': $(this).attr("id")
				},
				success: function (data) {
					bought = data;
					console.log("success");
				},
				error: function () {
					console.log("Could not request itemClick");
				}
			});

			if (bought) {
				var itemPrice = getItemPrice(this);
				var gains = window.gains;
				$('#gainNumber').text(gains-itemPrice); ///????????????
				console.log(gains-itemPrice);
			}
			
			this.dataset.content = "Price: " + itemPrice + ", Amount:" + getSingleItemAmount($(this).attr("id"));
			$(this).popover('hide');
		});
	});
}

function getItemPrice(item){
	var amount = getSingleItemAmount($(item).attr("id"));
	//console.log($(item).attr("id") + ": " + amount);
	var itemPrice = item.dataset.cost * Math.exp(0.14 * amount); 
	return itemPrice;
}

function getSingleItemAmount(id) {
	var result = 0;
	$.ajax({
		type: "GET",
		url: 'Game/getSingleItemAmount',
		async: false,
		data: {
			'itemid': id
		},
		success: function (data) {
			result = data;
		},
		error: function (xhr) {
			console.log("Could not request getSingleItemAmount");
		}
	});
	return result;
}

function getItemAmountList() {
	var list = 0;
	$.ajax({
		type: "GET",
		url: 'Game/getItemAmount',
		async: false,
		success: function (data) {
			//Gjor om slik at key er id, val er amount
			list = data.reduce(function (result, item) {
				result[item.item1] = item.item2;
				return result;
			}, {});
		},
		error: function (xhr) {
			console.log("Could not request getCurrentGains");
		}
	});
	return list;
}