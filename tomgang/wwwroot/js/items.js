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
			getCurrentGains();
			var temp = window.gains;

			if (temp >= this.dataset.cost) {
				
				$.ajax({
					url: '/Game/itemClick',
					type: 'POST',
					data: {
						'itemid': $(this).attr("id")
					},
					dataType: "json"
				});
				
				//Smoothere update på client
				$('#gainNumber').text(temp - this.dataset.cost); 

			}
		});
	});

}