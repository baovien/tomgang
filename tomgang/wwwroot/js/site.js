var _upgrades;
var _gains;

$(document).ready(function () {
	//Timer, 1sekund
	setInterval(timer, 1000);

	liftClickPost();
	upgradeBtnsPost();	

	$('.upgradebtn').popover();
	

});

function timer() { //Do shit
	//updateGainsCounter();

	$.when(
		$.get("Game/checkUpgrades", function(upgrades) {
			_upgrades = upgrades; 
  		}),
		$.get("Game/getCurrentGains", function(gains) {
			_gains = gains;
  		})

	).then(function(){
		$('#gainNumber').html(_gains);

		_upgrades.forEach(function(element) {
			if(_gains <= element.item2){
				$('[id="' + element.item1 + '"]').css({"background-color":"grey"});
				$('[id="' + element.item1 + '"]').addClass("disabled");
			}else{
				$('[id="' + element.item1 + '"]').css({"background-color":"green"});
				$('[id="' + element.item1 + '"]').removeClass("disabled");
			}
			$('[id="' + element.item1 + '"]').show();
		}, this);

	});

	/*$.ajax({
		type: "GET",
		url: 'Game/checkUpgrades',
		success: function(data) {
			console.log(data);
			data.forEach(function(element) {
				$('[id="' + element.item1 + '"]').show();

			}, this);
		}
	});*/
}

//Update gains counteren
function updateGainsCounter(){ 	
	$.ajax({
		type: "GET",
		url: 'Game/getCurrentGains',
		success: function(data) {
			// data is ur summary
			$('#gainNumber').html(data);
		}

   });
}

//Liftclick posting
function liftClickPost(){ 	
	$('#benkmann').click(function(){
		$.ajax({
			type: 'POST',
			url: '/Game/liftClick',
			cache:false
		});

		updateGainsCounter();
	});

	
}

function upgradeBtnsPost(){

	$("[id*='click']").each(function(){
		$(this).on("click", function(){
			$(this).hide();
			
			 $.ajax({    
                type: 'POST',
                data: {'id': $(this).attr("id")},
                url: '/Game/upgradeClick',
                cache:false
			});
		});
	});

	$("[id*='passive']").each(function(){
		$(this).on("click", function(){
			$(this).hide();
			
			 $.ajax({    
                type: 'POST',
                data: {'id': $(this).attr("id")},
                url: '/Game/upgradeClick',
                cache:false
			});
		});
	});

	//UPGRADES
	/*for (let i = 0; i < $("[id*='click']").length; i++) {

		$('[id="' + 'click' + i + '"]').click(function () {
            //Hides button on click, shows editbtn
            $(this).hide();
			console.log("clickbtn " + i);

			 $.ajax({    
                type: 'POST',
                data: {'id':'click'+ i},
                url: '/Game/upgradeClick',
                cache:false

            });	
		});
	}
	for (let i = 0; i < $("[id*='passive']").length; i++) {
		$('[id="' + 'passive' + i + '"]').click(function () {
            //Hides button on click, shows editbtn
            $(this).hide();
			console.log("passivebtn " + i);

			 $.ajax({    
                type: 'POST',
                data: {'id':'passive'+ i},
                url: '/Game/upgradeClick',
                cache:false

            });	
		});
	}*/

	
}

//INNLOGGING
$(function() {

    $('#login-form-link').click(function(e) {
		$("#login-form").delay(100).fadeIn(100);
 		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#register-form-link').click(function(e) {
		$("#register-form").delay(100).fadeIn(100);
 		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});

});
