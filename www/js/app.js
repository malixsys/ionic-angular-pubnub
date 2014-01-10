angular.module('app', ['ionic'])

  .config(function($stateProvider, $urlRouterProvider) {

    // Set up the initial routes that our app will respond to.
    // These are then tied up to our nav router which animates and
    // updates a navigation bar
    $stateProvider
    // if none of the above routes are met, use this fallback
    $urlRouterProvider.otherwise('/');
  })
  .controller('page1', function($scope, $timeout, Modal, ActionSheet) {
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
;