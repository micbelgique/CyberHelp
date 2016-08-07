angular.module('app.services', [])

.factory('ApiService', ['$http',function($http){
    var API_URL_LOCAL = "http://localhost:3001/";
    var API_URL_PROD = "http://ec2-52-28-6-186.eu-central-1.compute.amazonaws.com:3001/"
    return {
        login : login,
        sendAlert : sendAlert,
        getMyAlert : getMyAlert
    }
    

    function login(credentials){
        var req = {
            method: 'POST',
            url: API_URL_PROD+"api/members/login",
            headers: {
            },
            data: credentials
        }
        return $http(req)
            .then(function(res){
                return res.data
            }, function(res){
                console.log("RES -- ERROR ", res)
                throw res;
            });
    }

    function  sendAlert (data, authorizationToken){
        var req = {
            method: 'POST',
            url: API_URL_PROD+"api/alerts/",
            headers: {
                'Authorization': authorizationToken
            },
            data: data
        }
        return $http(req)
            .then(function(res){
                return res.data
            }, function(res){
                console.log("RES -- ERROR ", res)
                throw res;
            });
    }

    function getMyAlert(authorizationToken){
         var req = {
            method: 'GET',
            url: API_URL_PROD+"api/alerts/",
            headers: {
                'Authorization': authorizationToken
            }
        }
        return $http(req)
            .then(function(res){
                return res.data
            }, function(res){
                console.log("RES -- ERROR ", res)
                // return [
                //     {status :'sent',created_at:'il y a 2 jours'},
                //     {status :'reunion',created_at:'il y a 5 jours'},
                //     {status :'terminé',created_at:'il y a 3 mois'},
                // ]
                //throw res;
            });
    }
}])

.service('LocalStorageService', ['$window',function($window){
    var vm = this;
     var AUTH_TOKEN_KEY = 'jwtToken';

    vm.get = function(key){
        return $window.localStorage[key];
    }
    vm.set = function(key, value){
        $window.localStorage[key] = value;
    }
    vm.getAuthToken = function(){
        var token = $window.localStorage[AUTH_TOKEN_KEY];
                console.log("Token ",token);
        if(token)
            return JSON.parse(token);
        else
            return "";
    }
    vm.getIonicUserToken = function(){
        var json = $window.localStorage["ionic_io_push_token"];
                console.log("Token ",json);
        if(json)
            return JSON.parse(json).token;
        else
            return "";
    }
    vm.setAuthToken = function(value){
        return $window.localStorage[AUTH_TOKEN_KEY]= value;
    }
    return vm;
}]);