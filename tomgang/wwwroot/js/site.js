$(document).ready(function () {
	//Timer, 1sekund
	setInterval(timer, 1000);

	liftClickPost();
	upgradeBtnsPost();	
});

function timer() { //Do shit
	updateGainsCounter();
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
	for (let i = 0; i < $('.upgradebtn').length; i++) {

		$('[id="' + 'test' + i + '"]').click(function () {
            //Hides button on click, shows editbtn
            $(this).hide();
			console.log("button " + i);

			 $.ajax({    
                type: 'POST',
                data: {'id':'test'+ i},
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
