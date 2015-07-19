var callOpp = function() {
    // App ID from the Respoke Dashboard for your App
    var appId = "5da1c24f-6d19-4fc0-96fc-52881ea2cc1a";

    // The unique username identifying the user
    var endpointId = myId;

    // Create an instance of the Respoke client using your App ID
    var client = respoke.createClient({
        appId: appId,
        developmentMode: true
    });

    // "connect" event fired after successful connection to Respoke
    client.listen("connect", function(e) {
        console.log("Connected to Respoke!", e);

        var endpoint = client.getEndpoint({
            id: oppId
        });

        if (myId < oppId) {
            setTimeout(function() {
                console.log("CALLING", oppId);
                var call = endpoint.startAudioCall({
                        videoLocalElement: document.getElementById("localVideo"),
                        videoRemoteElement: document.getElementById("remoteVideo")
                });
            }, 15000);
        }
        else {
            console.log("WAITING FOR CALL");
            client.listen("call", function(e) {
                console.log("CALL RECEIVED");
                var call = e.call;

                // Show some UI to answer or hangup the call
                // For illustration, let us just answer the call
                if(call.caller !== true) {
                    call.answer({
                        videoLocalElement: document.getElementById("localVideo"),
                        videoRemoteElement: document.getElementById("remoteVideo")
                    });
                }
            }); 
        }
    });

    // Execute some signin event, then connect to Respoke with
    client.connect({
        endpointId: endpointId
    });

    var recorder = new Recorder();
    recorder.setStreamVideo(document.getElementById('localVideo'));
    recorder.addEventListener('silence', function(stream) {
        query('/chat_recognize', stream);
    });
}

