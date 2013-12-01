var whenIn = angular.module("WhenIn", ['ionic', 'ngRoute', 'ngAnimate', 'google-maps']);

whenIn.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/home', {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'    
    });
    
    $routeProvider.when('/login', {
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
    });
    
    $routeProvider.when('/register', {
        templateUrl: 'templates/register.html',
        controller: 'RegCtrl'
    });
    
    $routeProvider.otherwise({
        redirectTo: '/home'
    });
});

whenIn.controller('LoginCtrl', function($scope, $location, $timeout) {
    $scope.headerTitle = "WhenIn";
    
    $scope.credentials = { username: "", password: ""};
    $scope.gotoregister = function() {
        $location.path('/register');   
    }

    $scope.errorClass = "errorHandlingResting";
    
    $scope.login = function() {
        
        if($scope.credentials.username === "" || $scope.credentials.password === "") {
          $scope.errorClass = "errorhandlingActive";
        } else {
             Parse.User.logIn($scope.credentials.username, $scope.credentials.password, {
                success: function(user) {
                    $scope.currentUser = user;
                    $scope.$apply();
                    
                    $timeout(function(){
                        $location.path("/home");
                    }, 100);
                },
                error: function(user, error) {
                    $timeout(function(){
                        $scope.alerts.newClass = 'visible';
                        $scope.alerts.message = 'Wrong username or password.';  
                    }, 100);
                }
                
            }); 
        }  
    }

});

whenIn.controller('HomeCtrl', function($scope, $location, $timeout, Modal, $http) {
    
    $scope.toggleMenu = function() {
          $scope.sideMenuController.toggleLeft();
    };
    
    Modal.fromTemplateUrl('modal.html', function(modal) {
    $scope.modal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function(form) {
    $scope.modal.hide();
    
    var Question = Parse.Object.extend("Questions");
    var question = new Question();
    
    question.set("header", form.questionHeader);
    question.set("question", form.questionText);

    question.save(null, {
      success: function() {
        $timeout(function() {
            console.log("Question added.");
        }, 100);
      }
    });
  };  
      
   
    // Map stuff
    
    
    $scope.center = { latitude: 59.92960173988886, 
                    longitude: 10.731727894442757, };
    
    $scope.markClick = true;
    $scope.zoom = 16;
    $scope.fit = true;
    
    $scope.geolocationAvailable = navigator.geolocation ? true : false;

    $scope.markers = [];
		
    $scope.markerLat = null;
    $scope.markerLng = null;
    
    $scope.addmarker = function () {
        $scope.markers.push({
            latitude: parseFloat($scope.markerLat),
            longitude: parseFloat($scope.markerLng)
        });
        
        $scope.markerLat = null;
        $scope.markerLng = null;
    };
    
    $scope.addquestion = function() {
        $location.path('/addquestion');
    };
    
    (function() {  
        
        if ($scope.geolocationAvailable) {
            
            navigator.geolocation.getCurrentPosition(function (position) {
                $scope.center = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                };
               $scope.markers.push({latitude: position.coords.latitude,
                    longitude: position.coords.longitude});
                
                $scope.latitude = $scope.markers[0].latitude;
                $scope.longitude = $scope.markers[0].longitude;

                $scope.urlinfo = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + $scope.latitude + "," + $scope.longitude + "&sensor=true";
                
                $http.get($scope.urlinfo).then(function(res){
                
                    $scope.findmeh = res.data;
                    console.log($scope.findmeh.results[2].address_components[0].long_name);
                  
                });
                
                $scope.$apply();
                
                
                
            }, function () {
                
            });
        }	
    })();
});

whenIn.controller('RegCtrl', function($scope, $location, $timeout) {
    
});

