//uwp to javascript
self.onmessage = function(e) {  
    //postMessage(e.data);
    loop_rfdata_receive(e);
}

function loop_rfdata_receive(e) {
    //var getData = request_toUwp("rfid_getbuffer", "ef500");
    
    var str = UWPJAVASCRIPT.Communicator.getAnswer();    

    postMessage(str);

    setTimeout(function() {
        loop_rfdata_receive();
    }, 1000);
}