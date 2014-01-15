angular.module('app', ['ionic', 'ngAnimate'])

  .directive('swipeNavItem', function($parse, $ionicGesture) {
    return {
      restrict: 'A',
      link: function($scope, $element, $attr) {
        var o = function(type, d) {
          var onSwipeNavItem = $parse($attr.swipeNavItem)($scope);
          if (onSwipeNavItem != void 0) {
            if (d[2] === 'right' && typeof onSwipeNavItem.right === 'function') {
              onSwipeNavItem.right();
            }
            else if (d[2] === 'left' && typeof onSwipeNavItem.left === 'function') {
              onSwipeNavItem.left();
            }
          }
        };
        var swipeFn = function(e) {
          e.gesture.srcEvent.preventDefault();
          o('swipe', [e.gesture.touches[0].pageX, e.gesture.touches[0].pageY, e.gesture.direction]);
        };

        var swipeGesture = $ionicGesture.on('swipe', swipeFn, $element);

        $scope.$on('$destroy', function() {
          $ionicGesture.off(swipeGesture, 'swipe', swipeFn);
        });
      }
    }
  })
  .config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
      .state('signin', {
        url: '/sign-in',
        templateUrl: 'sign-in.html',
        controller: 'SignInCtrl'
      })
      .state('forgotpassword', {
        url: '/forgot-password',
        templateUrl: 'forgot-password.html',
        controller: 'ForgotPasswordCtrl'
      })
      .state('contact', {
        url: '/contact',
        templateUrl: 'contact.html'
      })
      .state('tabs', {
        url: '/autos',
        abstract: true,
        templateUrl: 'tabs.html'
      })
      .state('tabs.autolist', {
        url: '/list',
        views: {
          'auto-ui-view': {
            templateUrl: 'auto-list.html',
            controller: 'AutoListCtrl'
          }
        }
      })
      .state('tabs.addauto', {
        url: '/add',
        views: {
          'add-autos-ui-view': {
            templateUrl: 'add-auto.html',
            controller: 'AutoAddCtrl'
          }
        }
      })
      .state('tabs.autodetail', {
        url: '/auto/:id',
        views: {
          'auto-ui-view': {
            templateUrl: 'auto-detail.html',
            controller: 'AutoDetailCtrl'
          }
        }
      })
      .state('tabs.about', {
        url: '/about',
        views: {
          'about-ui-view': {
            templateUrl: 'about.html',
            controller: 'AboutCtrl'
          }
        }
      });


    $urlRouterProvider.otherwise('/sign-in');

  })

  .controller('SignInCtrl', function($scope, $state, $timeout, $ionicLoading, Auth, Events, Actions) {
    $scope.user = {
      username: '',
      password: ''
    }

    var loading = null;

    Events.on('login', function(message){
      if (loading !== null) {
        loading.hide();
        loading = null;
      }
      $timeout(function(){
        if(message.success === true) {
          $state.go('tabs.autolist');
        } else {
          Actions.error('login refused');
        }
      }, 500);
    });
    $scope.doSignIn = function() {
      loading = $ionicLoading.show({content: 'logging in...'});
      Auth.login($scope.user);
    };
  })

  .controller('ForgotPasswordCtrl', function($scope, $state) {
    //console.log('ForgotPasswordCtrl');
    $scope.password = Math.round(Math.random() * 10000);
  })

  .controller('AutoListCtrl', function($scope, $state, Autos) {

    Autos.list(function(autos) {
      $scope.autos = autos;
    });

    $scope.autoListData = 'AutoListCtrl Data';

    $scope.stateGo = function(id) {
      var toParams = { id: id };
      $state.go('tabs.autodetail', toParams);
    };

    $scope.hideBackButton = true;

    $scope.leftButtons = [];

    $scope.rightButtons = [
      { content: '',
        type: 'button button-clear icon ion-gear-a',
        tap: function() {
          $scope.sideMenuController.toggleRight();
        }
      }
    ];

  })

  .controller('AutoDetailCtrl', function($scope, $state, $stateParams, Autos) {
    var index = parseInt($stateParams.id, 10);
    $scope.autoDetailData = 'AutoDetailCtrl Data';

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
    $scope.newAutoData = 'AutoAddCtrl Data';
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
  .controller('AppCtrl', function($scope, $state, $timeout, PubNub, Events, $ionicLoading) {
    var loading = null;
    var pubnub = PubNub
      .onOnlineStatusChanged(function(isOnline) {
        $scope.isOnline = isOnline;
        if (isOnline) {
          if (loading !== null) {
            loading.hide();
            loading = null;
          }
        } else {
          loading = $ionicLoading.show({content: 'network offline detected, please reconnect to continue'});
        }
      });

    $timeout(function() {
      Events.start();
    }, 10);

  });


;