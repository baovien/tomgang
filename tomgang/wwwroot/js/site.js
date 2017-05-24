var hub;

$(document).ready(function () {
	//Timer, 1sekund
	setInterval(timer, 1000);

	liftClickPost();
	upgradeBtnsPost();	


	//-----------------CHAT -------------------

	//Hent tidligere meldinger
	getPostList();
	connectToHub();
	userSubmitMessage();


});

function timer() { 
	//Do shit
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

//-----------Chat functions-------------

function addPostsList(posts){
	$.each(posts, function (index) {
		var post2 = posts[index]
		var post = posts;
		addPost(post);
	});
}

function addPost(post){
	console.log('New post from server: ', post);
	$("#postsList").append('<li>' + '(' + post.timestamp.substring(11,16) + ') ' + post.author + ': ' + post.content + '</li>');
	var posteliste = $("#postsList").get(0);
	posteliste.scrollTop = posteliste.scrollHeight;
}

function getPostList(){
	$.ajax({
        url: '/chatroom/',
        method: 'GET',
        dataType: 'JSON',
        success: addPostsList
    });
}

function connectToHub(){
	// Connect to the broadcaster on the server
    hub = $.connection.broadcaster;
    // A function we will call from the server
    $.connection.broadcaster.client.addChatMessage = addPost;
	// log for debug
	$.connection.hub.logging = true;
	// Connecting to SignalR Hub
    $.connection.hub.start().done(function(signalr) {
        console.log('Connected!');
        console.log('SignalR object: ', signalr);

        // The subscribe method lets you subscribe to a specific method on the server
        // You could use this method to subscribe to a specific chatroom,
        // listen for updates to a specific resource, or whatever you would want to "subscribe" to.
        
        hub.server.subscribe("MainChatroom");
    }).fail(function(error) {
        // Just in case we fail to connect
        console.log('Failed to start connection! Error: ', error);
    });
}

function userSubmitMessage(){

	
		// If the User wants to send the message with the "Return" button
		$("#textInput").keypress(function (e){
			if(e.keyCode==13){
				$("#publishPostButton").click();
			}
		});

		// If the User wants to send the message with the button
		$("#publishPostButton").click(function (){
				if($("#textInput").val() != ""){ //Feilsjekk, om textboksen er tom, kan ikke sende.
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
					}).fail(function(e) {
						console.log(e);
					});
					$("#textInput").val("");
				}
		});
	
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
$(document).ready(function()
{
	$("#login-dp").click(function(e){
  		e.stopPropagation(); 
	});
});