angular.module('app', ['ionic','ngAnimate'])

  .directive('swipeNavItem', function($parse, Gesture){
    return {
      restrict: 'A',
      link: function($scope, $element, $attr) {
        var o = function(type, d) {
          var onSwipeNavItem = $parse($attr.swipeNavItem)($scope);
          if(onSwipeNavItem != void 0) {
            if(d[2] === "right" && typeof onSwipeNavItem.right === "function") {
              onSwipeNavItem.right();
            }
            else if(d[2] === "left" && typeof onSwipeNavItem.left === "function") {
              onSwipeNavItem.left();
            }
          }
        };
        var swipeFn = function(e) {
          e.gesture.srcEvent.preventDefault();
          o('swipe', [e.gesture.touches[0].pageX, e.gesture.touches[0].pageY, e.gesture.direction]);
        };

        var swipeGesture = Gesture.on('swipe', swipeFn, $element);

        $scope.$on('$destroy', function () {
          Gesture.off(swipeGesture, 'swipe', swipeFn);
        });
      }
    }
  })
  .factory('Actions', function($timeout, Modal, ActionSheet) {
    return {
      not_supported: function(title) {

        // Show the action sheet
        ActionSheet.show({

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
          // "true" to tell the action sheet to close. Return false to not close.
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
  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('signin', {
        url: "/sign-in",
        templateUrl: "sign-in.html",
        controller: 'SignInCtrl'
      })
      .state('forgotpassword', {
        url: "/forgot-password",
        templateUrl: "forgot-password.html",
        controller: 'ForgotPasswordCtrl'
      })
      .state('contact', {
        url: "/contact",
        templateUrl: "contact.html"
      })
      .state('tabs', {
        url: "/autos",
        abstract: true,
        templateUrl: "tabs.html"
      })
      .state('tabs.autolist', {
        url: "/list",
        views: {
          'auto-ui-view': {
            templateUrl: "auto-list.html",
            controller: 'AutoListCtrl'
          }
        }
      })
      .state('tabs.addauto', {
        url: "/add",
        views: {
          'add-autos-ui-view': {
            templateUrl: "add-auto.html",
            controller: 'AutoAddCtrl'
          }
        }
      })
      .state('tabs.autodetail', {
        url: "/auto/:id",
        views: {
          'auto-ui-view': {
            templateUrl: "auto-detail.html",
            controller: 'AutoDetailCtrl'
          }
        }
      })
      .state('tabs.about', {
        url: "/about",
        views: {
          'about-ui-view': {
            templateUrl: "about.html",
            controller: 'AboutCtrl'
          }
        }
      });


    $urlRouterProvider.otherwise("/sign-in");

  })

  .controller('SignInCtrl', function($scope, $state) {
    //console.log('SignInCtrl');

    $scope.signIn = function(user) {
      $state.go('tabs.autolist');
    };
  })

  .factory('Autos', function($http) {
    var url = "http://malix.com:5000";
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

  .controller('ForgotPasswordCtrl', function($scope, $state) {
    //console.log('ForgotPasswordCtrl');
    $scope.password = Math.round(Math.random() * 10000);
  })

  .controller('AutoListCtrl', function($scope, $state, Autos) {

    Autos.list(function(autos) {
      $scope.autos = autos;
    });

    $scope.autoListData = "AutoListCtrl Data";

    $scope.testStateGo = function() {
      var toParams = { id: 4 };
      $state.go('tabs.autodetail', toParams);
    };

    $scope.hideBackButton = true;

    $scope.leftButtons = [];

    $scope.rightButtons = [
      { content: '',
        type: 'button button-clear icon ion-gear-a',
        tap: function() {
          console.log($scope);
          $scope.sideMenuController.toggleRight();
        }
      }
    ];

  })

  .controller('AutoDetailCtrl', function($scope, $state, $stateParams, Autos) {
    var index = parseInt($stateParams.id, 10);
    $scope.autoDetailData = "AutoDetailCtrl Data";

    Autos.list(function(autos) {
      $scope.autos = autos;
      $scope.auto = autos[index];
    });

    $scope.hideBackButton = true;

    $scope.getNavFunction = function(delta) {
      return function() {
        var toParams = { id: Math.max(0, Math.min($scope.autos.length - 1, index + delta)) };
        $state.go('tabs.autodetail', toParams);
      }
    };

    $scope.leftButtons = [
      {
        content: ' Back to List',
        type: 'button button-clear icon ion-ios7-arrow-back',
        tap: function(e) {
          $state.go('tabs.autolist');
        }}
    ];

    $scope.rightButtons = [
      { content: '',
        type: 'button button-clear icon ion-gear-a',
        tap: function() {
          console.log($scope);
          $scope.sideMenuController.toggleRight();
        }
      }
    ];

  })

  .controller('AboutCtrl', function($scope, Autos) {
    Autos.about(function(results) {
      $scope.info = JSON.stringify(results, null, 4);
    });
  })

  .controller('AutoAddCtrl', function($scope, Actions) {
    $scope.newAutoData = "AutoAddCtrl Data";
    $scope.save = function() {
      Actions.not_supported('Add Auto')
    }
  })

  .controller('SettingsCtrl', function($scope, $state, Actions) {
    $scope.settings = [
      {
        text: 'profile',
        icon: 'ion-person',
        action: function() {
          Actions.not_supported('Profile')
        }
      }
    ];

  })
  .controller('AppCtrl', function($scope, $state) {
//    $scope.$root.$on('$stateChangeStart', function(to, toParams, from, fromParams) {
//      console.log([from.id, fromParams]);
//    });
  });


;