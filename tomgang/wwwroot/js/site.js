$(document).ready(function () {
	//Timer, 1sekund
	//setInterval(timer, 1000);

	liftClickPost();
	upgradeBtnsPost();	

	

});

function timer() { //Do shit
	updateGainsCounter();
	$.ajax({
		type: "GET",
		url: 'Game/checkUpgrades',
		success: function(data) {

			console.log(data);
			for (let i = 0; i < $("[id*='click']").length; i++) {
				if($('[id="' + 'click' + i + '"]').attr('id') == data[i].item1){
					$('[id="' + 'click' + i + '"]').show();
				}
			}		
			for (let i = 0; i < $("[id*='passive']").length; i++) {
				if($('[id="' + 'passive' + i + '"]').attr('id') == data[i+5].item1){
					$('[id="' + 'passive' + i + '"]').show();
				}
				
			}
		}
	});
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
	//UPGRADES
	for (let i = 0; i < $("[id*='click']").length; i++) {

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
	}

	
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
