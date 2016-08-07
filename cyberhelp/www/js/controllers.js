angular.module('app.controllers', [])
  
.controller('alertCtrl', ['$scope', '$stateParams','$state','LocalStorageService',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$state,LocalStorageService) {
    var isAuthenticated = function(){   
        if(LocalStorageService.getAuthToken()){
            return true;
        }
        return false;
    }
    $scope.redirectToAlertDetails = function(){
        console.log("isAuth",isAuthenticated());
        if(!isAuthenticated()){
             $state.go('login');
        }
        else{
            $state.go('alertDTails');
        }
        
    }
     $scope.redirectToAlertSuivis = function(){
        $state.go('alertSuivis', {}, {reload: true});
        
    }
                     


}])
   
.controller('alertDTailsCtrl', ['$scope', '$stateParams',
'ApiService','LocalStorageService', '$ionicHistory','$state',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,ApiService,
LocalStorageService,$ionicHistory,$state) {
    $scope.typeProblemeOptions = [
        {
            title : "Plusieurs écoles",
            value : 1
        },
        {
            title : "Au sein de mon école",
            value : 2
        },
        {
            title : "Au sein de ma classe",
            value : 3
        }
        
    ];
    $scope.data = {
        alertType : "",
        message : ""
    };
    var user = LocalStorageService.getAuthToken()
    $scope.data.ionicToken = LocalStorageService.getIonicUserToken();
    $scope.sendAlert = function () {
        $scope.data.alertType = $scope.data.alertType.value;
        ApiService
            .sendAlert($scope.data, user.token)
            .then(function(data){
                console.log(" statuts ",data)
                 $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                 $state.go('alertSuivis', {}, {reload: true});
            })
            .catch(function(err){
                console.log("Err ",err)
            });
       
    }
}])
   
.controller('alertSuivisCtrl', ['$scope', '$stateParams','$state','ApiService','LocalStorageService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$state,ApiService,LocalStorageService){
    //$ionicConfigProvider.views.maxCache(0);
    $state.reload();
    $scope.alerts ={};
    $scope.init = function(){
        console.log(" Init")
        ApiService
            .getMyAlert( LocalStorageService.getAuthToken().token)
            .then(function(alerts){
                console.log(" alerts ",alerts)
                 $scope.alerts = alerts
            })
            .catch(function(err){
                console.log("Err ",err)
            });
    }


}])
   
.controller('loginCtrl', ['$scope', '$stateParams',
'$state','ApiService','LocalStorageService','$ionicHistory',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$state,ApiService,LocalStorageService,$ionicHistory) {
    $scope.credentials = {
        email: "",
        password: ""
    };
    if(LocalStorageService.getAuthToken()){
       $ionicHistory.nextViewOptions({
                    disableBack: true
       });
       $state.go('alert');  
           
    }
    $scope.login = function(){
        console.log(" credentials",$scope.credentials)
        ApiService
            .login($scope.credentials)
            .then(function(data){
                console.log(" user ",data)
                LocalStorageService.setAuthToken(JSON.stringify(data));
                $ionicHistory.nextViewOptions({
                    disableBack: true
                });
                 $state.go('alert');
            })
            .catch(function(err){
                console.log("Err ",err)
            });
    }


}])
 