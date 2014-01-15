angular.module('app')
  .factory('Loader', ['$rootScope', '$document', '$compile', function($rootScope, $document, $compile) {
    return {
      /**
       * Load an action sheet with the given template string.
       *
       * A new isolated scope will be created for the
       * action sheet and the new element will be appended into the body.
       *
       * @param {object} opts the options for this ActionSheet (see docs)
       */
      show: function(opts) {
        var defaults = {
          content: '',
          animation: 'fade-in',
          showBackdrop: true,
          maxWidth: 200,
          showDelay: 2000
        };

        opts = angular.extend(defaults, opts);

        console.log(opts);

        var scope = $rootScope.$new(true);
        angular.extend(scope, opts);

        // Make sure there is only one loading element on the page at one point in time
        var existing = angular.element($document[0].querySelector('.loading-backdrop'));
        if(existing.length) {
          scope = existing.scope();
          if(scope.loading) {
            scope.loading.hide();
          }
        }

        // Compile the template
        var element = $compile('<loading>' + opts.content + '</loading>')(scope);

        $document[0].body.appendChild(element[0]);

        var loading = new ionic.views.Loading({
          el: element[0],
          maxWidth: opts.maxWidth,
          showDelay: opts.showDelay
        });

        loading.show();

        scope.loading = loading;

        return loading;
      }
    };
  }])

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
      uuid: authKey,
      publish: function(channel, message) {
        message.source = authKey;
        info = {
          channel: channel,
          message: JSON.stringify(message)
        };
        pubnub.publish(info);
      },
      subscribe: function(channel, callback) {
        var result = pubnub.subscribe({
          channel: channel,
          callback: function(message) {
            if (message.length < 2 || message.indexOf('{') !== 0) {
              callback("server error");
              return;
            }
            callback(null, JSON.parse(message));
          },
          error: function(message) {
            callback(message);
          }
        });
      },
      onOnlineStatusChanged: function(callback) {
        var result = pubnub.subscribe({
          channel: 'broadcast',
          callback: function(message) {
            if (message.length < 2 || message.indexOf('{') !== 0) {
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
      error: function(title) {

        // Show the action sheet
        $ionicActionSheet.show({

          // The title text at the top
          titleText: title,

          // The text of the cancel button
          cancelText: 'OK',

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
      },
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
  .factory('Events', function($rootScope, $timeout, PubNub) {
    PubNub.subscribe(PubNub.uuid, function(err, message) {
      if (err) {
        return console.log(err, message);
      }
      console.log(message);
      $rootScope.$broadcast(message.type, message);
    });
    return {
      on: function(type, callback) {
        $rootScope.$on(type, function(scope, message){
          callback(message);
        });
      },
      start: function(user) {
        $timeout(function() {
          PubNub.publish('authentication', {time: (new Date()).getTime(), type: 'presence'});
        }, 100);
      }
    };
  })
  .factory('Auth', function(PubNub) {
    return {
      login: function(user) {
        setTimeout(function() {
          PubNub.publish('authentication', {time: (new Date()).getTime(), type: 'login', data: user});
        }, 10);
      }
    }
  })

;
