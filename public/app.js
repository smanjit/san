var app = angular.module("myApp", ['ngResource', 'ngRoute','ui.bootstrap']);

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
  });

app.config(function($routeProvider) {
  $routeProvider

  .when('/login', {
    templateUrl: 'views/login.html',
    controller: 'loginController'
  })
  .when('/admin_delegates', {
    resolve: {
      "check": function($window,$location) {
        if($window.localStorage["loggedin"] != 1 || $window.localStorage["group"] != "admin") {
          $location.path('/login');
          return;
        }
      }
    },
    templateUrl: 'views/admin_delegates.html',
    controller: 'admin_manage'
  })
  .when('/admin_names', {
    resolve: {
      "check": function($window,$location) {
        if($window.localStorage["loggedin"] != 1 || $window.localStorage["group"] != "admin") {
          $location.path('/login');
          return;
        }
      }
    },
    templateUrl: 'views/admin_names.html',
    controller: 'admin_manage'
  })
  .when('/admin_functionalteams', {
    resolve: {
      "check": function($window,$location) {
        if($window.localStorage["loggedin"] != 1 || $window.localStorage["group"] != "admin") {
          $location.path('/login');
          return;
        }
      }
    },
    templateUrl: 'views/admin_functionalteams.html',
    controller: 'admin_manage'
  })
  .when('/admin_topperform', {
    resolve: {
      "check": function($window,$location) {
        if($window.localStorage["loggedin"] != 1 || $window.localStorage["group"] != "admin") {
          $location.path('/login');
          return;
        }
      }
    },
    templateUrl: 'views/admin_topperform.html',
    controller: 'admin_topController'
  })
  .when('/admin_accomplishment', {
    resolve: {
      "check": function($window,$location) {
        if($window.localStorage["loggedin"] != 1 || $window.localStorage["group"] != "admin") {
          $location.path('/login');
          return;
        }
      }
    },
    templateUrl: 'views/admin_accomplishment.html',
    controller: 'admin_accomplishController'
  })
  .when('/admin_dashboard', {
    resolve: {
      "check": function($window,$location) {
        if($window.localStorage["loggedin"] != 1 || $window.localStorage["group"] != "admin") {
          $location.path('/login');
          return;
        }
      }
    },
    templateUrl: 'views/admin_dashboard.html',
    controller: 'admin_dashController'
  })



  .when('/lead_topperform', {
    resolve: {
      "check": function($window,$location) {
        if($window.localStorage["loggedin"] != 1 || $window.localStorage["group"] != "lead") {
          $location.path('/login');
          return;
        }
      }
    },
    templateUrl: 'views/lead_topperform.html',
    controller: 'lead_topController'
  })
  .when('/lead_accomplishment', {
    resolve: {
      "check": function($window,$location) {
        if($window.localStorage["loggedin"] != 1 || $window.localStorage["group"] != "lead") {
          $location.path('/login');
          return;
        }
      }
    },
    templateUrl: 'views/lead_accomplishment.html',
    controller: 'lead_accomplishController'
  })
  .when('/lead_dashboard', {
    resolve: {
      "check": function($window,$location) {
        if($window.localStorage["loggedin"] != 1 || $window.localStorage["group"] != "lead") {
          $location.path('/login');
          return;
        }
      }
    },
    templateUrl: 'views/lead_dashboard.html',
    controller: 'lead_dashController'
  })
  .when('/user_accomplishment', {
    resolve: {
      "check": function($window,$location) {
        if($window.localStorage["loggedin"] != 1 || $window.localStorage["group"] != "user") {
          $location.path('/login');
          return;
        }
      }
    },
    templateUrl: 'views/user_accomplishment.html',
    controller: 'user_accomplishController'
  })
  .when('/user_dashboard', {
    resolve: {
      "check": function($window,$location) {
        if($window.localStorage["loggedin"] != 1 || $window.localStorage["group"] != "user") {
          $location.path('/login');
          return;
        }
      }
    },
    templateUrl: 'views/user_dashboard.html',
    controller: 'user_dashController'
  })
  .otherwise({
    redirectTo: '/login'
  })
});
app.controller('mainController', function($scope) {
  var today = new Date();
  // alert(today);
 var dd = today.getDate();

 var mm = today.getMonth()+1;
 var yyyy = today.getFullYear();
 if(dd<10)
 {
     dd='0'+dd;
 }

 if(mm<10)
 {
     mm='0'+mm;
 }
 today =+yyyy+"-"+mm+"-"+dd;
 $scope.today = today;
 // alert(today);
  // var modal = document.getElementById('01');
  // window.onclick = function(event) {
  //     if (event.target == modal) {
  //         modal.style.display = "none";
  //     }
  // }

  $scope.openalert = function(val){
  $scope.message = val;
  document.getElementById('01').style.display='block';
  }
  $scope.closealert = function () {
  document.getElementById('01').style.display='none';
  location.reload();
  }
})
