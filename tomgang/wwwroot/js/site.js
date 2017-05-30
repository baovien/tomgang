$(document).ready(function () {

  //Vise popover info for upgradsa
  $('.upgradeImg').popover();
  $('.itemImg').popover();

  //MAIN
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

function initialize() {
  //Spillfunksjoner
  liftClickPost();
  upgradeBtnsPost();
  itemBtnsPost();

  updateItemsCost();
  updateItemsStatus();
}


function update() { //Kjøres i timer funksjon i index.
  //Oppdaterer current gains
  getEligibleUpgrades();
  getCurrentGains();

  increaseGains();
  updateUpgradesStatus();
  updateItemsStatus();
  updateGainsCounter();
}