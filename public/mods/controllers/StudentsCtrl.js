'use strict';

angular.module('crm_app')
	.controller('StudentsCtrl', ['$scope', 'Student', '$http','Alert',
		function($scope, Student, $http, Alert) {

			$http.defaults.withCredentials = true;

			$scope.students = [];
			$scope.alerts = [];
			$scope.current = {};
			$scope.isEditing = false;

			$scope.find = function() {
				Student.query({}, function(students) {
					$scope.students = students;
				});
				Alert.query({}, function(alerts) {
					console.log(alerts);
					$scope.alerts = alerts;
				},function(err){
					console.log("Error alert ",err);
				});
			};
			$scope.validate = function(alert){
				var a = new Alert(alert);
				a.status = 'accepted';

				a.$update(
					function(data) {
						if (data.message) alert(data.message)

						$scope.cancel();
						$scope.find();
					}
				);
			}

			$scope.refuse = function(alert){
				var a = new Alert(alert);
				a.status = 'closed';

				a.$update(
					function(data) {
						if (data.message) alert(data.message)

						$scope.cancel();
						$scope.find();
					}
				);
			}

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
