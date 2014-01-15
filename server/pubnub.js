var initialize = function(pubnub, SECRET, callback) {
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
      console.log('[PUBNUB] All rights granted');
      callback(null);
    }
  };
  console.log('[PUBNUB] Granting read-only access to broadcast channel');
  pubnub.grant({
    channel:  'broadcast',
    read:     true,
    write:    false,
    callback: function(message) {
      console.log('[PUBNUB] Successfully made grant request for broadcast');
      onDone(null);
    },
    error:    function(message) {
      console.log('[PUBNUB] [ERROR] On grant request for broadcast', message);
      onDone(message);
    },
    ttl:      0
  });
  console.log('[PUBNUB] Granting access to self for broadcast channel');
  pubnub.grant({
    channel:  'broadcast',
    auth_key: SECRET,
    read:     true,
    write:    true,
    callback: function(message) {
      console.log('[PUBNUB] Successfully made grant request for self for broadcast');
      onDone(null);
    },
    error:    function(message) {
      console.log('[PUBNUB] [ERROR] On grant request for self for broadcast', message);
      onDone(message);
    },
    ttl:      0
  });
  console.log('[PUBNUB] Granting access for authentication channel');
  pubnub.grant({
    channel:  'authentication',
    read:     false,
    write:    true,
    callback: function(message) {
      console.log('[PUBNUB] Successfully made grant request for authentication');
      onDone(null);
    },
    error:    function(message) {
      console.log('[PUBNUB] [ERROR] On grant request for authentication', message);
      onDone(message);
    },
    ttl:      0
  });
  console.log('[PUBNUB] Granting access for self on auth');
  pubnub.grant({
    channel:  'authentication',
    auth_key: SECRET,
    read:     true,
    write:    true,
    callback: function(message) {
      console.log('[PUBNUB] Successfully made grant request for self authentication');
      onDone(null);
    },
    error:    function(message) {
      console.log('[PUBNUB] [ERROR] On grant request for self authentication', message);
      onDone(message);
    },
    ttl:      0
  });
};

exports = module.exports = function(SECRET) {

  var pubnub = require('pubnub').init({
    publish_key:   'pub-c-9595c3b6-29b2-4030-9a3b-be73265fc5d6',
    subscribe_key: 'sub-c-5fc45ee2-7716-11e3-9291-02ee2ddab7fe',
    secret_key:    SECRET,
    auth_key:      SECRET,
    origin:        'pubsub.pubnub.com',
    ssl:           true
  });

  var ret = {
    secret_key: SECRET
  };

  ret.initialize = function(callback) {
    initialize(pubnub, SECRET, function(err) {
      if (err) {
        callback(err);
      } else {
        callback(null, ret);
      }
    });
  };

  ret.grant = pubnub.grant;

  ret.subscribe = pubnub.subscribe;

  ret.publish = pubnub.publish;

  return ret;
}
