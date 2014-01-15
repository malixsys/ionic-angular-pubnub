exports = module.exports = function(app, pubnub) {

  setInterval(function() {
    pubnub.publish({
      channel: 'broadcast',
      message: JSON.stringify({time: (new Date()).getTime(), type: 'PING'})
    })
  }, 30000);

  var result = pubnub.subscribe({
    channel:    'broadcast',
    callback:   function(message) {
      if (message.length < 2 || message.indexOf('{') !== 0) {
        return;
      }
      console.log(JSON.parse(message));
    },
    error:      function(message) {
      console.log('[PUBNUB] [ERROR] On subscribe to broadcast', message);
    },
    connect:    function() {
      console.log('[PUBNUB] Connected')
    },
    disconnect: function() {
      console.log('[PUBNUB] Disconnected')
    },
    reconnect:  function() {
      console.log('[PUBNUB] Reconnected')
    },
    restore:    true
  });

}