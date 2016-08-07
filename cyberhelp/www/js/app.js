// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic','ionic.service.core', 'ionic.service.push', 'app.controllers', 'app.routes', 'app.directives','app.services',])

.run(function($ionicPlatform,$ionicPush) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
     $ionicPush.init({
        "debug": true,
        "onNotification": function(notification) {
          var payload = notification.payload;
          console.log("############## Notif  ##################")
          console.log(notification, payload);
        },
        "onRegister": function(data) {
          console.log("Onregister token user ionic",data.token);
        }
      });

      $ionicPush.register();
  });
})