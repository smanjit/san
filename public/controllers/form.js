var app = angular.module("myApp");
// lead controllers

app.controller("lead_accomplishController", function ($scope, $location, $rootScope, $resource, $http, $window) {
	$scope.group = $window.localStorage["group"];
	$scope.username = $window.localStorage["username"];
	$scope.userid = $window.localStorage["userid"];
	$scope.delegations = {}

	var functionalteams = $resource('/getfteam');
	functionalteams.query(function (result) {
		$scope.functionalteams = result;
	})

	var typenames = $resource('/gettypenames');
	typenames.query(function (result) {
		$scope.typenames = result;
	})
	var delegations = $resource('/getdelegates');
	delegations.query(function (result) {
		$scope.delegations = result;
	})

	$scope.addform = function (item) {
		item.date.setTime(item.date.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
		var currentTime = new Date();
		var ISTTime = new Date(currentTime.getTime() + (330) * 60000);
		if (!item.fteam) {
			$scope.openalert("Select functional team");
			$scope.item = {};
			return;
		}

	                if(item.ilc!=null){
                        console.log('ilc not null '+item.ilc);
                        var rex = /^(\d{0,3}(\.\d{0,1})?)$/;
                        console.log(item.ilc);
                        if(!rex.test(item.ilc)){
                                console.log('not match');
                                 $scope.openalert("Accomplishment not saved , ILC hours should be non- decimal max 1 decimal");
                                 $scope.item = {};
                         return;
                        }
                }

		var arr = item.name.split("|");
		item.name = arr[0];
		item.point = arr[1];
		item.cDate = ISTTime;
		// alert(item.fteam)
		item.userid = $scope.userid;
		item.username = $scope.username;
		$http({
			url: '/validateuser',
			method: 'post',
			data: {
				"userid": item.userid
			}
		}).then(function (data) {
			if (data.data.success) {
				$http({
					url: '/addform',
					method: 'post',
					data: item
				}).then(function (data) {
					if (data.data.success) {
						$scope.item = {};
						$scope.openalert(data.data.message);
					} else {
						$scope.item = {};
						$scope.openalert(data.data.message);
					}
				}, function (err) {});

			} else {
				$scope.openalert("INVALID USERID");
			}
		}, function (err) {});
	}
});
app.controller("lead_topController", function ($scope, $location, $rootScope, $resource, $http, $window) {
	$scope.group = $window.localStorage["group"];
	$scope.username = $window.localStorage["username"];
	$scope.userid = $window.localStorage["userid"];

	$scope.topperformer = function (item) {
		if (item.startdate > item.enddate) {
			alert("TO date should be greater than FROM date");
			return;
		}
		item.startdate.setTime(item.startdate.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
		item.enddate.setTime(item.enddate.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
		item.userid = $scope.userid;
		$http({
			url: '/leadtopperformer',
			method: 'post',
			data: item
		}).then(function (data) {
			if (data.data.success) {
				$scope.topperform = data.data.data;
			} else {
				$scope.openalert(data.data.message);
				$scope.item = {}
			}
		}, function (err) {});


	}


});
app.controller("lead_dashController", function ($scope, $location, $rootScope, $resource, $http, $window,$uibModal) {
	$scope.group = $window.localStorage["group"];
	$scope.username = $window.localStorage["username"];
	$scope.userid = $window.localStorage["userid"];
	$scope.currentPage = 0;
	$scope.pageSize = "5";
	$scope.q = '';
	$scope.count = 0;
	$scope.totalpages = 0;
	var leadfeed = $resource('/leadfeed');

	// var myteams = $resource('/myteams');
	//
	// myteams.query({userid: $scope.userid}, function(result) {
	//     $scope.myteams = result[0].myteams;
	//     alert(JSON.stringify($scope.myteams))
	//   })
	leadfeed.query({
		userid: $scope.userid
	}, function (result) {
		$scope.leadfeed = result;
		$scope.count = result.length;

	})

	$scope.numberOfPages = function () {

		return Math.ceil($scope.count / $scope.pageSize);
	}


	$scope.leadexport = function () {
		$http({
			url: '/export_lead?userid=' + $scope.userid,
			method: 'get'
		}).then(function (data) {
			window.location = '/exportfile.xlsx'
		}, function (err) {});
	}


	$scope.deleteform = function (item) {
		// alert("here")
		$http({
			url: '/deleteform',
			method: 'post',
			data: item
		}).then(function (data) {
			if (data.data.success) {
				$scope.item = {};
				$scope.openalert(data.data.message);
			} else {
				$scope.item = {};
				$scope.openalert(data.data.message);
			}
		}, function (err) {});

	}

        $scope.editform = function (item) {
                var modalInstance = $uibModal.open({
                        templateUrl: "../views/modal.html",
                        controller: "ModalContentCtrl",
                        size: 'md',
                        resolve: {
                                pass: function () {
                                        return item;
                                }
                        }
                });

        };

});

//admin controllers

app.controller("admin_accomplishController", function ($scope, $location, $rootScope, $resource, $http, $window) {
	$scope.group = $window.localStorage["group"];
	$scope.username = $window.localStorage["username"];
	$scope.userid = $window.localStorage["userid"];


	var functionalteams = $resource('/getfteam');
	functionalteams.query(function (result) {
		$scope.functionalteams = result;
	})

	var typenames = $resource('/gettypenames');
	typenames.query(function (result) {
		$scope.typenames = result;
	})
	$scope.addform = function (item) {
		item.date.setTime(item.date.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
		var currentTime = new Date();
		var ISTTime = new Date(currentTime.getTime() + (330) * 60000);
		if (!item.fteam) {
			$scope.openalert("Select functional team");
			$scope.item = {};
			return;
		}


		if(item.ilc!=null){
			console.log('ilc not null '+item.ilc);
			var rex = /^(\d{0,3}(\.\d{0,1})?)$/;
			console.log(item.ilc);
			if(!rex.test(item.ilc)){
	               		console.log('not match');
			 	 $scope.openalert("Accomplishment not saved , ILC hours should be non- decimal max 1 decimal");
        	                 $scope.item = {};
                         return;
			}
		}
		var arr = item.name.split("|");
		item.name = arr[0];
		item.point = arr[1];
		item.cDate = ISTTime;
		// alert(item.fteam)
		item.userid = $scope.userid;
		item.username = $scope.username;
		// alert(JSON.stringify(item))
		$http({
			url: '/validateuser',
			method: 'post',
			data: {
				"userid": item.userid
			}
		}).then(function (data) {
			if (data.data.success) {
				$http({
					url: '/addform',
					method: 'post',
					data: item
				}).then(function (data) {
					if (data.data.success) {
						$scope.item = {};
						$scope.openalert(data.data.message);
					} else {
						$scope.item = {};
						$scope.openalert(data.data.message);
					}
				}, function (err) {});

			} else {
				$scope.openalert("INVALID USERID");
			}
		}, function (err) {});
	}

});
app.controller("admin_topController", function ($scope, $location, $rootScope, $resource, $http, $window) {
	$scope.group = $window.localStorage["group"];
	$scope.username = $window.localStorage["username"];
	$scope.userid = $window.localStorage["userid"];
	// alert($window.localStorage["topperformer"]);

	$scope.topperformer = function (item) {
		if (item.startdate > item.enddate) {
			alert("TO date should be greater than FROM date");
			return;
		}
		item.startdate.setTime(item.startdate.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
		item.enddate.setTime(item.enddate.getTime() - new Date().getTimezoneOffset() * 60 * 1000);

		$http({
			url: '/topperformer',
			method: 'post',
			data: item
		}).then(function (data) {
			if (data.data.success) {
				$scope.topperform = data.data.data;
			} else {
				$scope.openalert(data.data.message);
				$scope.item = {}
			}
		}, function (err) {});


	}

	$scope.GetParticularDetails = function () {
		$scope.points = this.item;

	}

});
app.controller("admin_dashController", function ($scope, $location, $rootScope, $resource, $http, $window, $uibModal) {
	$scope.group = $window.localStorage["group"];
	$scope.username = $window.localStorage["username"];
	$scope.userid = $window.localStorage["userid"];
	$scope.currentPage = 0;
	$scope.pageSize = "5";
	$scope.q = '';
	$scope.count = 0;
	var adminfeed = $resource('/adminfeed');
	adminfeed.query({
		userid: $scope.userid
	}, function (result) {
		$scope.adminfeed = result;
		$scope.count = result.length;
	})

	$scope.adminexport = function () {
		$http({
			url: '/export_admin',
			method: 'get'
		}).then(function (data) {
			window.location = '/exportfile.xlsx'
		}, function (err) {});
	}


	$scope.numberOfPages = function () {
		return Math.ceil($scope.count / $scope.pageSize);
	}
	$scope.deleteform = function (item) {
		$http({
			url: '/deleteform',
			method: 'post',
			data: item
		}).then(function (data) {
			if (data.data.success) {
				$scope.item = {};
				$scope.openalert(data.data.message);
			} else {
				$scope.item = {};
				$scope.openalert(data.data.message);
			}
		}, function (err) {});

	}

        $scope.editform = function (item) {
                console.log(item._id);
		var modalInstance = $uibModal.open({
                        templateUrl: "../views/modal.html",
                        controller: "ModalContentCtrl",
                        size: 'md',
                        resolve: {
                                pass: function () {
                                        return item;
                                }
                        }
                });

        };

});

app.controller("admin_manage", function ($scope, $location, $rootScope, $resource, $http, $window) {
	$scope.group = $window.localStorage["group"];
	$scope.username = $window.localStorage["username"];
	$scope.userid = $window.localStorage["userid"];
	$scope.functionalteams = {}
	var functionalteams = $resource('/getfteam');
	functionalteams.query(function (result) {
		$scope.functionalteams = result;
	})

	var typenames = $resource('/gettypenames');
	typenames.query(function (result) {
		$scope.typenames = result;
	})

	var delegations = $resource('/getdelegates');
	delegations.query(function (result) {
		$scope.delegations = result;
	})


	$scope.delegate = function (item) {
		item._id = item.userid;
		$http({
			url: '/validateuser',
			method: 'post',
			data: {
				"userid": item.userid
			}
		}).then(function (data) {
			if (data.data.success) {
				$http({
					url: '/delegate',
					method: 'post',
					data: item
				}).then(function (data) {
					if (data.data.success) {
						$scope.item = {};
						$scope.openalert(data.data.message);
					} else {
						$scope.item = {};
						$scope.openalert(data.data.message);
					}
				}, function (err) {});

			} else {
				$scope.openalert("INVALID USERID");
			}
		}, function (err) {});
	}

	$scope.deletedelegate = function (item) {
		$http({
			url: '/deletedelegate',
			method: 'post',
			data: item
		}).then(function (data) {
			if (data.data.success) {
				$scope.openalert(data.data.message);

			} else {
				$scope.openalert(data.data.message);
			}
		}, function (err) {});
	}


	$scope.addfteam = function (item) {
		item._id = item.fteam;
		$http({
			url: '/addfteam',
			method: 'post',
			data: item
		}).then(function (data) {
			if (data.data.success) {
				$scope.item = {};
				$scope.openalert(data.data.message);

			} else {
				$scope.openalert(data.data.message);
			}
		}, function (err) {});
	}

	$scope.deletefteam = function (item) {
		$http({
			url: '/deletefteam',
			method: 'post',
			data: item
		}).then(function (data) {
			if (data.data.success) {
				$scope.openalert(data.data.message);

			} else {
				$scope.openalert(data.data.message);
			}
		}, function (err) {});
	}

	$scope.addnames = function (typename) {
		// alert(typename);
		if (typename.type == "patentfiled" || typename.type == "patentpublish")
			typename.name = "N/A";
		if (!typename.name)
			typename.name = "N/A";

		$http({
			url: '/addname',
			method: 'post',
			data: typename
		}).then(function (data) {
			if (data.data.success) {
				$scope.typename = {};
				$scope.openalert(data.data.message);

			} else {
				$scope.typename = {};
				$scope.openalert(data.data.message);
			}
		}, function (err) {});
	}

	$scope.deletename = function (item) {
		$http({
			url: '/deletename',
			method: 'post',
			data: item
		}).then(function (data) {
			if (data.data.success) {
				$scope.openalert(data.data.message);

			} else {
				$scope.openalert(data.data.message);
			}
		}, function (err) {});
	}


});

//user controllers

app.controller("user_accomplishController", function ($scope, $location, $rootScope, $resource, $http, $window) {
	$scope.group = $window.localStorage["group"];
	$scope.username = $window.localStorage["username"];
	$scope.userid = $window.localStorage["userid"];

	var functionalteams = $resource('/getfteam');
	functionalteams.query(function (result) {
		$scope.functionalteams = result;
	})

	var typenames = $resource('/gettypenames');
	typenames.query(function (result) {
		$scope.typenames = result;
	})

	$scope.addform = function (item) {
		item.date.setTime(item.date.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
		var currentTime = new Date();
		var ISTTime = new Date(currentTime.getTime() + (330) * 60000);
		if (!item.fteam) {
			$scope.openalert("Select functional team");
			$scope.item = {};
			return;
		
		}
                if(item.ilc!=null){
                        console.log('ilc not null '+item.ilc);
                        var rex = /^(\d{0,3}(\.\d{0,1})?)$/;
                        console.log(item.ilc);
                        if(!rex.test(item.ilc)){
                                console.log('not match');
                                 $scope.openalert("Accomplishment not saved , ILC hours should be non- decimal max 1 decimal");
                                 $scope.item = {};
                         return;
                        }
                }
	

		var arr = item.name.split("|");
		item.name = arr[0];
		item.point = arr[1];
		item.cDate = ISTTime;
		// alert(item.fteam)
		item.userid = $scope.userid;
		item.username = $scope.username;
		console.log($scope.userid);
		console.log(item.username);
		$http({
			url: '/validateuser',
			method: 'post',
			data: {
				"userid": item.userid
			}
		}).then(function (data) {
			if (data.data.success) {
				$http({
					url: '/addform',
					method: 'post',
					data: item
				}).then(function (data) {
					if (data.data.success) {
						$scope.item = {};
						$scope.openalert(data.data.message);
					} else {
						$scope.item = {};
						$scope.openalert(data.data.message);
					}
				}, function (err) {});

			} else {
				$scope.openalert("INVALID USERID");
			}
		}, function (err) {});


	}


});

app.controller("user_dashController", function ($scope, $location, $rootScope, $resource, $http, $window, $uibModal) {
	$scope.group = $window.localStorage["group"];
	$scope.username = $window.localStorage["username"];
	$scope.userid = $window.localStorage["userid"];
	$scope.currentPage = 0;
	$scope.pageSize = "5";
	$scope.q = '';
	$scope.count = 1;

	var userfeed = $resource('/userfeed');
	userfeed.query({
		userid: $scope.userid
	}, function (result) {
		$scope.userfeed = result;
		$scope.count = result.length;
		// alert(JSON.stringify(result));
	})

	$scope.numberOfPages = function () {

		return Math.ceil($scope.count / $scope.pageSize);
	}

	$scope.userexport = function () {
		$http({
			url: '/export_user?userid=' + $scope.userid,
			method: 'get'
		}).then(function (data) {
			window.location = '/exportfile.xlsx'
		}, function (err) {});
	}


	$scope.deleteform = function (item) {
		$http({
			url: '/deleteform',
			method: 'post',
			data: item
		}).then(function (data) {
			if (data.data.success) {
				$scope.item = {};
				$scope.openalert(data.data.message);
			} else {
				$scope.item = {};
				$scope.openalert(data.data.message);
			}
		}, function (err) {});

	}

	$scope.editform = function (item) {
		var modalInstance = $uibModal.open({
			templateUrl: "../views/modal.html",
			controller: "ModalContentCtrl",
			size: 'md',
			resolve: {
				pass: function () {
					return item;
				}
			}
		});

	};

});

app.controller('ModalContentCtrl', function ($scope, $uibModalInstance, $http, $window, pass) {
console.log(pass._id);
console.log(pass._rev);
        $scope.title = pass.title;
        $scope.fteam = pass.fteam;
        $scope.type = pass.type;
        $scope.name = pass.name;
        $scope.date = new Date(pass.date);
        $scope.endDate = new Date(pass.enddate);
        $scope.description = pass.description;
        $scope.ilc = pass.ilc;
        $scope.url=pass.url;
        const backupItem = pass;

        $scope.cancel = function () {
        console.log("Cancel modal");
                $uibModalInstance.dismiss();
        }
        $scope.save = function () {
        console.log("saving edited modal");
        $scope.date.setTime($scope.date.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
        console.log($scope.endDate);
        if($scope.endDate == 'Thu Jan 01 1970 05:30:00 GMT+0530 (India Standard Time)'){
                $scope.endDate = '';
        }else
        {
                $scope.endDate.setTime($scope.endDate.getTime() - new Date().getTimezoneOffset() * 60 * 1000);
        }
                const dataToSend = {
                        _id: pass._id,
                        _rev: pass._rev,
                        title: $scope.title,
                        type: $scope.type,
                        name: $scope.name,
                        date: $scope.date,
                        fteam: $scope.fteam,
                        enddate: $scope.endDate,
                        ilc: $scope.ilc,
                        url: $scope.url,
                        description: $scope.description,
                        cDate: pass.cDate,
                        point: pass.point,
                        userid: pass.userid,
                        username: pass.username
                 }
                $http({
                        url: '/update_user?id='+pass._id,
                        method: 'post',
                        data: dataToSend
                }).then(function (data) {
                        console.log('editing done');
                }, function (err) {});
        $window.location.reload();
}

}


);
