angular.module('app', ['ionic'])

  .controller('NotSuportedCtrl', function($scope, $timeout, Modal, ActionSheet) {
    // Triggered on a button click, or some other target
    $scope.not_supported = function() {

      // Show the action sheet
      ActionSheet.show({

        // The various non-destructive button choices
        buttons: [
        ],

        // The title text at the top
        titleText: 'Not supported yet',

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
    };
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
            templateUrl: "about.html" ,
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

  .factory('Autos', function($http){
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

    Autos.list(function(autos){
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
    $scope.autoDetailData = "AutoDetailCtrl Data";

    Autos.list(function(autos){
      $scope.auto = autos[$stateParams.id];
    });

    $scope.hideBackButton = true;

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
    Autos.about(function(results){
      $scope.info = results;
    });
  })

  .controller('AutoAddCtrl', function($scope) {
    $scope.newAutoData = "AutoAddCtrl Data";
  })

  .controller('AppCtrl', function($scope, $state) {

  });


;