var SECRET = "SECRET";

var initialize = function(pubnub, callback) {
  var allDone = 4;
  var onDone = function(err) {
    if (err !== null) {
      if (allDone > 0) {
        allDone = -1;
        callback(err);
      }
      return;
    }
    allDone--;
    if (allDone === 0) {
      console.log("All rights granted");
      callback(null);
    }
  };
  console.log("Granting read-only access to broadcast channel");
  pubnub.grant({
    channel:  'broadcast',
    read:     true,
    write:    false,
    callback: function(message) {
      console.log("Successfully made grant request for broadcast");
      onDone(null);
    },
    error:    function(message) {
      console.log("[ERROR] On grant request for broadcast", message);
      onDone(message);
    },
    ttl:      0
  });
  console.log("Granting access to self for broadcast channel");
  pubnub.grant({
    channel:  'broadcast',
    auth_key: SECRET,
    read:     true,
    write:    true,
    callback: function(message) {
      console.log("Successfully made grant request for self for broadcast");
      onDone(true);
    },
    error:    function(message) {
      console.log("[ERROR] On grant request for self for broadcast", message);
      onDone(message);
    },
    ttl:      0
  });
  console.log("Granting access for authentication channel");
  pubnub.grant({
    channel:  'authentication',
    read:     false,
    write:    true,
    callback: function(message) {
      console.log("Successfully made grant request for authentication");
      onDone(true);
    },
    error:    function(message) {
      console.log("[ERROR] On grant request for authentication", message);
      onDone(message);
    },
    ttl:      0
  });
  console.log("Granting access for self on auth");
  pubnub.grant({
    channel:  'authentication',
    auth_key: SECRET,
    read:     true,
    write:    true,
    callback: function(message) {
      console.log("Successfully made grant request for self authentication");
      onDone(true);
    },
    error:    function(message) {
      console.log("[ERROR] On grant request for self authentication", message);
      onDone(message);
    },
    ttl:      0
  });
};

exports = module.exports = function() {
  
  var pubnub = require('pubnub').init({
    publish_key:   'pub-c-9595c3b6-29b2-4030-9a3b-be73265fc5d6',
    subscribe_key: 'sub-c-5fc45ee2-7716-11e3-9291-02ee2ddab7fe',
    secret_key:    SECRET,
    auth_key:      SECRET,
    origin:        'pubsub.pubnub.com',
    ssl:           true
  });

  var ret = {
  };
  
  ret.initialize = function(callback) {
    initialize(pubnub,function(err){
      if(err) {
        callback(err);
      } else {
        callback(null, pubnub);
      }
    });
  }
  
  return ret;
//  var runMain = function() {
//    console.log('Started');
//
//    var result = pubnub.subscribe({
//      channel:    'broadcast',
//      callback:   function(message) {
//        console.log(message);
//      },
//      error:      function(message) {
//        console.log("[ERROR] On subscribe to broadcast", message);
//        process.exit(1);
//      },
//      connect:    function() {
//        console.log("Connected")
//      },
//      disconnect: function() {
//        console.log("Disconnected")
//      },
//      reconnect:  function() {
//        console.log("Reconnected")
//      },
//      restore:    true
//    });
//
//    setInterval(function() {
//      pubnub.publish({
//        channel: 'broadcast',
//        message: 'PING'
//      })
//    }, 10000);
//
//  };  
}
