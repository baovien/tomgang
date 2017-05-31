function signalr() {
	// Connect to the broadcaster on the server. 
	window.hub = $.connection.broadcaster;

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

		//Caller currgains og upgr først siden senere funksjoner er avhengig av verdiene. Init etter upgr

		window.hub.server.getUserInfo().done(function(dict){
			window.currentGains = dict["currentGains"];
			window.incomevalue = dict["incomeValue"];
			window.clickValue = dict["clickValue"];
			window.totalGains = dict["totalGains"];
			window.timesClicked = dict["timesClicked"];
			window.timeJoined = dict["timeJoined"];

			updateGainsCounter();
			updateItemsCost();
  			updateItemsStatus();
			updateInfoTab();

			liftClickPost();
  			upgradeBtnsPost();
  			itemBtnsPost();
		});

		window.hub.server.checkUpgrades().done(function (value) {
			window.upgrades = value;
			updateUpgradesStatus();
		});

		window.hub.server.getHighscore().done(function(value){
			window.highscore = value;
			updateHighscoreTab();
		});

		window.hub.server.subscribe("MainChatroom");
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