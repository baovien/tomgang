$(document).ready(function () {

  //Vise popover info for upgradsa
  $('.upgradeImg').popover();
  $('.itemImg').popover();

  //Infopanel
  $(".btn-pref .btn").click(function () {
    $(".btn-pref .btn").removeClass("btn-primary").addClass("btn-default");
    // $(".tab").addClass("active"); // instead of this do the below
    $(this).removeClass("btn-default").addClass("btn-primary");
  });

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

  $("#login-dp").click(function (e) {
    e.stopPropagation();
  });

  $("#letsgoleft").click(function () {
    $("#testlols").load("Manage/ChangePassword", $('#testlols').serialize());
  });
  $("#goback").click(function () {
    $("#testlols").load("Manage/Index", $('#testlols').serialize());
  });
});

function update() { //Kjøres i timer funksjon i index.
  getEligibleUpgrades();
  increaseGains();
  updateVariables();
  updateUpgradesStatus();
  updateItemsStatus();
  updateGainsCounter();
}

function updateVariables() {
  window.hub.server.getUserInfo().done(function (dict) {
    window.currentGains = dict["currentGains"];
    window.incomevalue = dict["incomeValue"];
    window.clickValue = dict["clickValue"];
    window.totalGains = dict["totalGains"];
    window.timesClicked = dict["timesClicked"];
    window.timeJoined = dict["timeJoined"];
  });
}

function getCurrentGains() {
	window.hub.server.getCurrentGains().done(function (value) {
		window.currentGains = value;
	});
}

function getEligibleUpgrades() {
	window.hub.server.checkUpgrades().done(function (value) {
		window.upgrades = value;
	});
}

function increaseGains() {
	window.hub.server.increaseGains();
}
