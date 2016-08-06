'use strict';

angular.module('crm_app')
	.controller('StudentsCtrl', ['$scope', 'Student', '$http',
		function($scope, Student, $http) {

			$http.defaults.withCredentials = true;

			$scope.Students = [];
			$scope.Alerts = [];
			$scope.current = {};
			$scope.isEditing = false;

			$scope.find = function() {
				Student.query({}, function(Students) {
					$scope.Students = Students;
				});
				Alert.query({}, function(Alerts) {
					$scope.Alerts = Alerts;
				});
			};

			$scope.submitNew = function() {
				if ($scope.current['_id'])
					return;

				//save New Student
				var c = new Student($scope.current);
				c.$save(
					function(data) {
						if (data.message) alert(data.message)

						$scope.cancel();
						$scope.find();
					}
				);
			};

			$scope.submitEdit = function() {
				if (!$scope.current['_id'])
					return;

				var c = new Student($scope.current);
				c.$update(
					function(data) {
						if (data.message) alert(data.message)

						$scope.cancel();
						$scope.find();
					}
				);
			}

			$scope.edit = function(c) {
				$scope.showForm = true;
				$scope.isEditing = true;
				$scope.current = angular.copy(c);
			};

			$scope.cancel = function() {
				$scope.current = {};
				$scope.isEditing = false;
				$scope.showForm = false;
			}

			$scope.delete = function(c) {

				var r = confirm("Etes vous sûr de vouloir supprimer " + c.name + ' ?');
				if (r != true)
					return
				else {

					c = new Student(c);
					c.$delete(
						function(data) {
							if (data.message) alert(data.message)

							$scope.showForm = false;
							$scope.find();
						}
					);
				}
			}

		}
	]);
