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

  .controller('AppCtrl', function($scope, $state) {

    $scope.autos = [
      { make: 'Cord', model: '810', year: '1936', desc: 'Styled by Gordon M. Buehrig, it featured front-wheel drive and independent front suspension;[ the front drive enabled the 810 to be so low, runningboards were unnecessary. Powered by a 4,739 cc (289 cu in) Lycoming V8 of the same 125 hp (93 kW) as the L-29, The 810 had a four-speed electrically-selected semi-automatic transmission, among other innovative features.', url: 'http://en.wikipedia.org/wiki/Cord_810/812' },
      { make: 'DeLorean', model: 'DMC-12', year: '1981', desc: 'The DeLorean DMC-12 is a sports car manufactured by John DeLorean\'s DeLorean Motor Company for the American market in 1981–82. Featuring gull-wing doors with a fiberglass "underbody", to which non-structural brushed stainless steel panels are affixed, the car became iconic for its appearance as a modified time machine in the Back to the Future film trilogy.', url: 'http://en.wikipedia.org/wiki/DeLorean_DMC-12' },
      { make: 'Duesenberg', model: 'Model SJ', year: '1933', desc: 'The rare supercharged Model J version, with 320 hp (239 kW) was also created by Fred Duesenberg and introduced in May 1932, only 36 units were built. Special-bodied models, such as the later "Mormon Meteor" chassis, achieved an average speed of over 135 mph (217 km/h)[17] and a one-hour average of over 152 mph (245 km/h) at Bonneville Salt Flats, Utah.', url: 'http://en.wikipedia.org/wiki/Duesenberg_Model_J' },
      { make: 'Hudson', model: 'Hornet', year: '1951', desc: 'The Hornet, introduced for the 1951 model year, was based on Hudson\'s "step-down" design that was first seen in the 1948 model year on the Commodore. The design merged body and chassis frame into a single structure, with the floor pan recessed between the car\'s chassis rails instead of sitting on top of them. Thus one "stepped down" into a Hudson. The step-down chassis\'s "lower center of gravity...was both functional and stylish. The car not only handled well, but treated its six passengers to a sumptuous ride. The low-slung look also had a sleekness about it that was accentuated by the nearly enclosed rear wheels.', url: 'http://en.wikipedia.org/wiki/Hudson_Hornet' },
      { make: 'Shelby', model: 'Cobra', year: '1965', desc: 'Shelby wanted the AC Cobras to be "Corvette-Beaters" and at nearly 500 lb (227 kg) less than the Chevrolet Corvette, the lightweight roadster accomplished that goal at Riverside International Raceway on 2 February 1963. Driver Dave MacDonald piloted CSX2026 past a field of Corvettes, Jaguars, Porsches, and Maseratis and recorded the Cobra\'s historic first-ever victory.', url: 'http://en.wikipedia.org/wiki/Shelby_Cobra' },
      { make: 'Tesla', model: 'Roadster', year: '2008', desc: 'Tesla Motors\' first production vehicle, the Tesla Roadster, was an all-electric sports car. The Roadster was the first highway-capable all-electric vehicle in serial production for sale in the United States in the modern era. The Roadster was also the first production automobile to use lithium-ion battery cells and the first production BEV (all-electric) to travel more than 200 miles (320 km) per charge.', url: 'http://en.wikipedia.org/wiki/Tesla_Roadster' },
      { make: 'Tucker', model: '48', year: '1948', desc: 'The Tucker 48 (named after its model year) was an advanced automobile conceived by Preston Tucker and briefly produced in Chicago in 1948. Only 51 cars were made before the company folded on March 3, 1949, due to negative publicity initiated by the news media, a Securities and Exchange Commission investigation and a heavily publicized stock fraud trial (in which allegations were proven baseless in court with a full acquittal). Speculation exists that the Big Three automakers and Michigan senator Homer S. Ferguson also had a role in the Tucker Corporation\'s demise.', url: 'http://en.wikipedia.org/wiki/Tucker_Torpedo' }
    ];

  });


;