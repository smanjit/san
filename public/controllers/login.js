var app = angular.module("myApp");
app.controller("loginController", function($scope, $location, $rootScope, $resource,  $http, $window) {
  $scope.errmessage = " ";

  $scope.page = "Login";
  $window.localStorage["loggedin"]=0;

  $scope.validate = function() {
    $http({
      url: '/login',
      method: 'post',
      data: {"userid": $scope.userid, "pass": $scope.password}
    }).then(function(data){
      // alert(JSON.stringify(data));
    if(data.data.group=="admin"){
      $window.localStorage["loggedin"] = 1;
      $window.localStorage["userid"] = data.data.userid;
      $window.localStorage["username"] = data.data.username;
      $window.localStorage["group"] = data.data.group;
      $location.path('/admin_dashboard').replace();


    }
    else if (data.data.group=='lead') {
      $window.localStorage["loggedin"] = 1;
      $window.localStorage["userid"] = data.data.userid;
      $window.localStorage["username"] = data.data.username;
      $window.localStorage["group"] = data.data.group;
      $location.path('/lead_dashboard').replace();
    }
    else if (data.data.group=='user' ) {
      $window.localStorage["loggedin"] = 1;
      $window.localStorage["userid"] = data.data.userid;
      $window.localStorage["username"] = data.data.username;
      $window.localStorage["group"] = data.data.group;
      $location.path('/user_dashboard').replace();
    }
    else
    $scope.errmessage = 'Invalid Credentials!'
  }, function(err){})
  }
});
