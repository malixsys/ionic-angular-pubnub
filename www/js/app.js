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
        url: "/tabs",
        abstract: true,
        templateUrl: "tabs.html"
      })
      .state('tabs.autolist', {
        url: "/autos",
        views: {
          'auto-ui-view': {
            templateUrl: "auto-list.html",
            controller: 'AutoListCtrl'
          }
        }
      })
      .state('tabs.addauto', {
        url: "/add-auto",
        views: {
          'add-autos-ui-view': {
            templateUrl: "add-auto.html",
            controller: 'AutoAddCtrl'
          }
        }
      })
      .state('tabs.autodetail', {
        url: "/autos/:id",
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
            templateUrl: "about.html"
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

  .controller('ForgotPasswordCtrl', function($scope, $state) {
    //console.log('ForgotPasswordCtrl');
    $scope.password = Math.round(Math.random() * 10000);
  })

  .controller('AutoListCtrl', function($scope, $state) {
    $scope.autoListData = "AutoListCtrl Data";

    $scope.rightButtons = [
      { content: '',
        type: 'button button-clear icon ion-gear-a',
        tap: function(){
          console.log($scope);
          $scope.sideMenuController.toggleRight();
        }
      }
    ];

    $scope.testStateGo = function() {
      var toParams = { id: 4 };
      $state.go('tabs.autodetail', toParams);
    };
  })

  .controller('AutoDetailCtrl', function($scope, $state, $stateParams) {
    $scope.autoDetailData = "AutoDetailCtrl Data";

    $scope.auto = $scope.autos[$stateParams.id];
  })

  .controller('AutoAddCtrl', function($scope) {
    $scope.newAutoData = "AutoAddCtrl Data";
  })

  .controller('AppCtrl', function($scope, $state, $http) {

    var url = "http://malix.com:5000/autos";

    $http.get(url)
      .then(function(results) {
        $scope.autos = results.data;
      });
  });


;