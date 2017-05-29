$(document).ready(function () {
	
	//Vise popover info for upgradsa
	$('.upgradeImg').popover();
	$('.itemImg').popover();

	//Innlogging/registrering
	$('#login-form-link').click(function (e) {
		$("#login-form").delay(100).fadeIn(100);
		$("#register-form").fadeOut(100);
		$('#register-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	$('#register-form-link').click(function (e) {
		$("#register-form").delay(100).fadeIn(100);
		$("#login-form").fadeOut(100);
		$('#login-form-link').removeClass('active');
		$(this).addClass('active');
		e.preventDefault();
	});
	
	$("#login-dp").click(function(e){
  		e.stopPropagation(); 
	});

	$("#letsgoleft").click(function(){
  		$("#testlols").load("Manage/ChangePassword", $('#testlols').serialize()); 
	});
});

function initialize() {
	//Connecter til chathub
	chatHub();

	//Spillfunksjoner
	liftClickPost();
	upgradeBtnsPost();
	itemBtnsPost();

}

function update() { //Kjøres i timer funksjon i index.
	//Oppdaterer current gains
	getEligibleUpgrades();
	getCurrentGains();

	updateItemsCost();
	updateUpgradesStatus();
	updateItemsStatus();
	updateGainsCounter();
}
