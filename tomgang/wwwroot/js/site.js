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
    $("#goback").show();
  });
  $("#goback").click(function () {
    $("#testlols").load("Manage/Index", $('#testlols').serialize());
    $("#goback").hide();
  });
});

function update() { //Kjøres i timer funksjon i index.  
  if (window.isInitialized && window.update !== undefined) {
    getEligibleUpgrades();
    increaseGains();
    updateVariables();
    updateUpgradesStatus();
    updateItemsStatus();
    updateGainsCounter();
    updateInfoTab();
    updateHighscoreTab();
  }else{
    console.log(window.isInitialized);
    console.log(window.update);
  }
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


function getHighscoreValues() {
  window.hub.server.getHighscore().done(function (value) {
    window.highscore = value;
  });
}

function increaseGains() {
  window.hub.server.increaseGains();
}

function updateInfoTab() {
  $("#gpsec").text(window.incomevalue);
  $("#gplift").text(window.clickValue);
  $("#totgains").text(window.totalGains);
  $("#timesClicked").text(window.timesClicked);
  $("#joindate").text(window.timeJoined);
}

function updateHighscoreTab() {
  var i = 0;
  var rowCount = $('#hstable tbody tr').length;

  window.highscore.forEach(function (element) {
    $('#addr' + i).html("<td class='pos'>" + (i + 1) + "</td><td class='name'>" + element.item1 + " </td><td class='score'>" + element.item2 + "</td>");

    //sjekker om ny entry. append kun hvis hsliste size har økt
    if (rowCount < window.highscore.length) {
      $('#hstable').append('<tr id="addr' + (i + 1) + '"></tr>');
    }

    //Sorterer listen etter score
      $('#hstable tbody > tr').sort(function (a, b) {
        return +$('td.score', b).text() > +$('td.score', a).text();
      }).appendTo('tbody').find('td:first').text(function (index) {
        return ++index;
      });

    i++;
  }, this);
}
