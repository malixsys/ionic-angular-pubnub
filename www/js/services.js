angular.module('app')
  .factory('PubNub', function() {
    var pubnub = null;
    var authKey = PUBNUB.uuid();

    console.log(authKey);

    pubnub = PUBNUB.init({
      publish_key: 'pub-c-9595c3b6-29b2-4030-9a3b-be73265fc5d6',
      subscribe_key: 'sub-c-5fc45ee2-7716-11e3-9291-02ee2ddab7fe',
      auth_key: authKey,
      origin: 'pubsub.pubnub.com',
      ssl: true
    });

    var isOnline = false;
    var onConnect = function(onOnlineStatusChanged) {
      var changed = isOnline === false;
      isOnline = true;
      if (typeof onOnlineStatusChanged === "function") {
        if (changed) {
          onOnlineStatusChanged(true);
        }
      }
    };
    var ret =
    {
      publish: function(info) {
        pubnub.publish(info);
      },
      onOnlineStatusChanged: function(callback) {
        var result = pubnub.subscribe({
          channel: 'broadcast',
          callback: function(message) {
            if(message.length < 2 || message.indexOf('{') !== 0) {
              return;
            }
            console.log(JSON.parse(message));
          },
          connect: function() {
            onConnect(callback);
          },
          disconnect: function() {
            var changed = isOnline === true;
            isOnline = false;
            if (typeof callback === "function") {
              if (changed) {
                callback(false);
              }
            }
          },
          reconnect: function() {
            onConnect(callback);
          },
          restore: true,
          error: function(message) {
            console.log(message);
          }
        });
      }
    };
    return ret;
  })
  .factory('Actions', function($timeout, $ionicModal, $ionicActionSheet) {
    return {
      not_supported: function(title) {

        // Show the action sheet
        $ionicActionSheet.show({

          // The various non-destructive button choices
          buttons: [
            {text: 'Not supported yet'}
          ],

          // The title text at the top
          titleText: title,

          // The text of the cancel button
          cancelText: 'Cancel',

          // Called when the sheet is cancelled, either from triggering the
          // cancel button, or tapping the backdrop, or using escape on the keyboard
          cancel: function() {
          },

          // Called when one of the non-destructive buttons is clicked, with
          // the index of the button that was clicked. Return
          // 'true' to tell the action sheet to close. Return false to not close.
          buttonClicked: function(index) {
            return true;
          },

          // Called when the destructive button is clicked. Return true to close the
          // action sheet. False to keep it open
          destructiveButtonClicked: function() {
            return true;
          }
        });
      }
    }
  })
  .factory('Autos', function($http) {
    var url;
    if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
      url = 'http://malix.com:5000';
    } else {
      url = 'http://' + (location.host || 'localhost').split(':')[0] + ':5000';
    }
    return {
      about: function(callback) {
        $http.get(url + '/about?' + (new Date()).getTime())
          .then(function(results) {
            callback(results.data);
          });
      },
      list: function(callback) {
        $http.get(url + '/autos')
          .then(function(results) {
            callback(results.data);
          });
      }
    }
  })
  .factory('Auth',function(PubNub){
    return {
      login: function(user) {
        PubNub.publish({
          channel: 'broadcast',
          message: JSON.stringify({time:(new Date()).getTime(), type:'login', data: user})
        })
      }
    }
  })

;
