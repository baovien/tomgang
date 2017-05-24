$(document).ready(function () {
	//Connecter til chathub
	chatHub();
	
	//Første innlastning
	update();
	
	//Spillfunksjoner
	liftClickPost();
	upgradeBtnsPost();
	
	//Vise popover info for upgradsa
	$('.upgradeImg').popover();
});


function update() { //Kjøres i timer funksjon i index.
	//Oppdaterer current gains
	getEligibleUpgrades();
	getCurrentGains();
	updateUpgradesStatus();
	updateGainsCounter();
}

function updateUpgradesStatus(){
	/*
	Itererer gjennom alle upgrades som brukeren kan kjøpe og viser de. 
	De som brukeren ikke har råd til blir gråfarga. Ellers får de som er affordable grønn bakgrunn,
	*/

	window.upgrades.forEach(function (element) {
		if (window.gains <= element.item2) { //Cost er større enn playergains.
			$('[id="' + element.item1 + '"]').addClass("upgradeGreyed");
			$('[id="' + element.item1 + '"]').css({
				"background-color": ""
			});
		} else { //Cost er mindre enn playergains.
			$('[id="' + element.item1 + '"]').removeClass("upgradeGreyed");
			$('[id="' + element.item1 + '"]').css({
				"background-color": "green"
			});
		}

		//Viser de upgradene som trengs
		$('[id="' + element.item1 + '"]').show();
	});
}

//Liftclick posting
function liftClickPost() {
	$('#benkmann').click(function () {
		$.ajax({
			type: 'POST',
			url: '/Game/liftClick',
			cache: false,
			success: function (data) {
				updateUpgradesStatus();
				$('#gainNumber').text(window.gains +=1); //Oppdaterer client før server for smoothere opplevelse.
			}
		});
	});
}

function getCurrentGains() {
	$.ajax({
		type: "GET",
		url: 'Game/getCurrentGains',
		async: false,
		success: function (data) {
			window.gains = data;
		},
		error: function (xhr) {
			console.log("Could not request getCurrentGains");
		}
	});
}

function getEligibleUpgrades() {
	$.ajax({
		type: "GET",
		url: "Game/checkUpgrades",
		async: false,
		success: function (data) {
			window.upgrades = data;
		},
		error: function (xhr) {
			console.log("Could not request checkUpgrades");
		}
	});
}

function updateGainsCounter() {
	$('#gainNumber').text(window.gains);
}

function upgradeBtnsPost() {
	$(".upgradeImg").each(function () {
		$(this).on("click", function () {
			if (window.gains >= this.dataset.cost) {
				$(this).remove();
				$(".popover").remove();
				$('#gainNumber').text(window.gains - this.dataset.cost); //Smoothere update på client
			}
			$.ajax({
				type: 'POST',
				data: {
					'id': $(this).attr("id")
				},
				url: '/Game/upgradeClick',
				cache: false
			});
		});
	});

}

function addPostsList(posts) {
	$.each(posts, function (index) {
		var post2 = posts[index];
		var post = posts;
		addPost(post);
	});
}

function addPost(post) {
	console.log('New post from server: ', post);
	$("#postsList").append('<li>' + '(' + post.timestamp.substring(11, 16) + ') ' + post.author + ': ' + post.content + '</li>');
	var posteliste = $("#postsList").get(0);
	posteliste.scrollTop = posteliste.scrollHeight;
}

function getPostList() {
	$.ajax({
		url: '/chatroom/',
		method: 'GET',
		dataType: 'JSON',
		success: addPostsList
	});
}

function chatHub() {
	// Connect to the broadcaster on the server
	hub = $.connection.broadcaster;
	// A function we will call from the server
	$.connection.broadcaster.client.addChatMessage = addPost;
	// log for debug
	$.connection.hub.logging = true;
	// Connecting to SignalR Hub
	$.connection.hub.start().done(function (signalr) {
		console.log('Connected!');
		console.log('SignalR object: ', signalr);

		// The subscribe method lets you subscribe to a specific method on the server
		// You could use this method to subscribe to a specific chatroom,
		// listen for updates to a specific resource, or whatever you would want to "subscribe" to.

		hub.server.subscribe("MainChatroom");
	}).fail(function (error) {
		// Just in case we fail to connect
		console.log('Failed to start connection! Error: ', error);
	});

	// If the User wants to send the message with the "Return" button
	$("#textInput").keypress(function (e) {
		if (e.keyCode == 13) {
			$("#publishPostButton").click();
		}
	});

	// If the User wants to send the message with the button
	$("#publishPostButton").click(function () {
		if ($("#textInput").val() !== "") { //Feilsjekk, om textboksen er tom, kan ikke sende.
			var post = {
				content: $("#textInput").val()
			};
			$.ajax({
				headers: {
					'Content-Type': 'application/json'
				},
				type: 'POST',
				url: '/chatroom/',
				data: JSON.stringify(post),
				dataType: 'json'
			}).fail(function (e) {
				console.log(e);
			});
			$("#textInput").val("");
		}
	});
}

//INNLOGGING
$(function () {

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

});

//CHANGE PASSWORD
$("#login-dp").click(function (e) {
	e.stopPropagation();
});

$("#letsgoleft").click(function () {
	$("#divContent").load('@Url.Action("ChangePassword","Manage")');
});