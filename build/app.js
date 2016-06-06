var app = angular.module('myApp', ['ngRoute']);
//var apiKey = 'd0b0a36196d5c7a7513a7350230d7975';

app.config(function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl: '/pages/directives/weatherReport.html',
			controller: 'homeCtrl'
		})
		.when('/:day', {
			templateUrl: '/pages/directives/weatherReportSeven.html',
			controller: 'homeCtrl'
		})
		.otherwise('/');
});

// DIRECTIVES

app.directive('weatherReport', function(){
	return {
		restrict: 'E',
		templateUrl: 'pages/directives/weatherReport.html',
		scope: {
			weatherDay: '=',
			degreeUnit: '=',
			convertToCelsius: "&",
			convertToFahrenheit: "&",
			convertToDate: "&"
		}
	}
});

app.directive('weatherReportSeven', function(){
	return {
		restrict: 'E',
		templateUrl: 'pages/directives/weatherReportSeven.html',
		scope: {
			weatherDay: '=',
			degreeUnit: '=',
			convertToCelsius: "&",
			convertToFahrenheit: "&",
			convertToDate: "&"
		}
	}
});

// CONTROLLER

app.controller('homeCtrl', ['$scope', '$http', '$routeParams', '$interval', function($scope, $http, $routeParams, $interval) {
	$scope.cityName = '';
	$scope.data ='';
	$scope.icon = '';
	$scope.currentResponse = null;
	$scope.fiveDaysResponse = null;
	$scope.sevenDaysResponse = null;
	$scope.currentDate = new Date();
	$scope.degreeConvert = 'celsius';
	/*$scope.position;*/
	$scope.urlCoordinates = '';
	$scope.hideSeven = false;

	$scope.getNewDay = function (milisec){
		$scope.currentDay = $scope.currentDate.getTime();
		var newDate = new Date ($scope.currentDay + milisec);
		return newDate.getDate();
	};

	$scope.currentDay = $scope.getNewDay(0);

	$scope.getCoordinates = function (){
		if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(function(position){
	      $scope.$apply(function(){
	        $scope.position = position;
	        $scope.latitudeCoord = $scope.position.coords.latitude;
	        $scope.longitudeCoord = $scope.position.coords.longitude;
	        $scope.urlCoordinates = 'lat=' + $scope.latitudeCoord + '&lon=' + $scope.longitudeCoord;
	      });
	      $scope.currentWeather();
	      $scope.fiveDays();
	    });
	  }
	};

	var timeShow = function() {
	  $scope.clock = Date.now();
	}
	timeShow();
	$interval(timeShow, 1000);

	location.hash = '#/' + $scope.currentDay;

	$scope.currentWeather = function() {
		var urlCoordinates = $scope.urlCoordinates;
		if ($scope.cityName != '') {
			var url = 'http://api.openweathermap.org/data/2.5/weather?q=' +  $scope.cityName + '&appid=d0b0a36196d5c7a7513a7350230d7975';
		} else {
			var url = 'http://api.openweathermap.org/data/2.5/weather?' +  urlCoordinates + '&appid=d0b0a36196d5c7a7513a7350230d7975';
		}
		$scope.showData(url, $scope.currentData);
	};

	$scope.fiveDays = function() {
		var urlCoordinates = $scope.urlCoordinates;
		if ($scope.cityName != '') {
			var url = 'http://api.openweathermap.org/data/2.5/forecast?q=' +  $scope.cityName + '&mode=json&&appid=d0b0a36196d5c7a7513a7350230d7975';
		} else {
			var url = 'http://api.openweathermap.org/data/2.5/forecast?' +  urlCoordinates + '&appid=d0b0a36196d5c7a7513a7350230d7975';
		}
		$scope.hideSeven = false;
		$scope.showData(url, $scope.fiveDaysData);
	};

	$scope.getMoreDays = function(days) {
		var urlCoordinates = $scope.urlCoordinates;
		if ($scope.cityName != '') {
			var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' +  $scope.cityName + '&cnt=' + days + '&mode=json&&appid=d0b0a36196d5c7a7513a7350230d7975';
		} else {
			var url = 'http://api.openweathermap.org/data/2.5/forecast/daily?' +  urlCoordinates + '&cnt=' + days + '&appid=d0b0a36196d5c7a7513a7350230d7975';
		}
		$scope.hideSeven = true;
		$scope.showData(url, $scope.moreDaysData);
	};

	$scope.showData = function(url, callback){
		$http.get(url)
			.success(function(response) {
		    	callback(response);
		  	})
			.error(function(data, status) {
		    	console.log(data);
			});
	};

	$scope.currentData = function(response) {
		$scope.currentResponse = response;
		$scope.icon = 'http://openweathermap.org/img/w/' + $scope.currentResponse.weather[0].icon + '.png';
	};

	$scope.fiveDaysData = function(response) {
			$scope.fiveDaysResponse = response.list;
			$scope.icon = 'http://openweathermap.org/img/w/' + $scope.fiveDaysResponse[0].weather[0].icon + '.png';
	};

	$scope.moreDaysData = function(response) {
		$scope.sevenDaysResponse = response.list;
		$scope.icon = 'http://openweathermap.org/img/w/' + $scope.sevenDaysResponse[0].weather[0].icon + '.png';
	};

	$scope.convertToCelsius = function(degK){
		return Math.round(degK - 273.15);
	};
	$scope.convertToFahrenheit = function(degK){
		return Math.round(degK * 9 / 5 - 459.67);
	};

	$scope.convertToDate = function(date){
		return new Date(date * 1000);
	};

	$scope.flow = function() {
	  $scope.fiveDays();
	  $scope.currentWeather();
	};

	$scope.getCoordinates();

}]);

// FILTER

app.filter('dateFormat', function() {
    return function(data) {
        return (new Date(data.dt * 1000)).getDate() == location.hash.slice(2);
    };
});