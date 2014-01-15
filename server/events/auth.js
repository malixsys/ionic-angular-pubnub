exports = module.exports = function(app, pubnub) {
  function checkLogin(info) {
    if(!(info.hasOwnProperty('username') && info.hasOwnProperty('password'))) {
      return false;
    }
    if(info.username.length < 2){
      return false;
    }
    if(info.password.length < 2){
      return false;
    }
    return true;
  }

  function handleLogin(message) {
    if(message.hasOwnProperty('source') === false) return;

    var key = message.source;

    console.log('[PUBNUB] Handling login for ' + key);
    setTimeout(function() {
      var success = checkLogin(message.data);
      pubnub.publish({
        channel: message.source,
        message: JSON.stringify(
          {type: 'login', success: success}
        )
      })
    }, 500);
  }

  function handlePresence(message) {
    if(message.hasOwnProperty('source') === false) return;

    var key = message.source;

    var steps = 2;

    var sendResponse = function() {
      if(steps === 0) {
        pubnub.publish({
          channel: message.source,
          message: JSON.stringify(
            {type: 'presence', success: true}
          )
        })
      }
    };
    console.log('[PUBNUB] Granting access to ' + key + ' for private channel');
    pubnub.grant({
      channel:  key,
      auth_key: key,
      read:     true,
      write:    true,
      callback: function(message) {
        console.log('[PUBNUB] Successfully made grant request for access to ' + key + ' for private channel');
        steps--;
        sendResponse();
      },
      error:    function(message) {
        console.log('[PUBNUB] [ERROR] On grant request access to ' + key + ' for private channel', message);
      },
      ttl:      0
    });
    pubnub.grant({
      channel:  key,
      auth_key: pubnub.secret_key,
      read:     true,
      write:    true,
      callback: function(message) {
        console.log('[PUBNUB] Successfully made grant request for access to ' + key + ' for private channel to self');
        steps--;
        sendResponse();
      },
      error:    function(message) {
        console.log('[PUBNUB] [ERROR] On grant request access to ' + key + ' for private channel to self', message);
      },
      ttl:      0
    });
  }

  var result = pubnub.subscribe({
    channel:    'authentication',
    callback:   function(message) {
      if (message.length < 2 || message.indexOf('{') !== 0) {
        return;
      }
      message = JSON.parse(message);
      if(message.type === 'login') {
        return handleLogin(message);
      }
      if(message.type === 'presence') {
        return handlePresence(message);
      }
      console.log(message);
    },
    error:      function(message) {
      console.log('[PUBNUB] [ERROR] On subscribe to broadcast', message);
    },
    restore:    true
  });
}