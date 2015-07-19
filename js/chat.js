var handleError = function(error) {
    console.log(error.message);
}

sinchClient = new SinchClient({
	applicationKey: 'f7c0e682-5d2f-4c3a-822b-29aae87abc81',
	capabilities: {calling: true},
	startActiveConnection: true, /* NOTE: This is required if application is to receive calls / instant messages. */ 
	//Note: For additional loging, please uncomment the three rows below
	onLogMessage: function(message) {
		console.log(message);
	},
});

var global_username = null;
sinchClient.newUser({'username': myId, 'password': 'noneedtoknowyourpassowrd'}, function(ticket) {
    //On success, start the client
    sinchClient.start(ticket, function() {
        global_username = myId;
    }).fail(handleError);
}).fail(handleError);

var callClient = sinchClient.getCallClient();
var call;

callClient.addEventListener({
  onIncomingCall: function(incomingCall) {
    console.log("CALL RECEIVED");
    call = incomingCall;
    try {
        call.answer();
    }
    catch(error) {
        handleError(error);
    }
  }
});

var callOpp = function() {
    if (myId < oppId) {
        console.log("WAITING FOR CALL!");
    }
    else {
        console.log("CALLING " + oppId);
        call = callClient.callUser(oppId);
    }
}
