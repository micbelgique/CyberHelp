angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

  .state('alert', {
    url: '/alert',
    templateUrl: 'templates/alert.html',
    controller: 'alertCtrl'
  })

  .state('alertDTails', {
    url: '/alert-details',
    templateUrl: 'templates/alertDTails.html',
    controller: 'alertDTailsCtrl'
  })

  .state('alertSuivis', {
    url: '/alert-suivis',
    templateUrl: 'templates/alertSuivis.html',
    controller: 'alertSuivisCtrl'
  })

  .state('login', {
    url: '/page5',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

$urlRouterProvider.otherwise('/alert')

  

});