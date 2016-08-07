'use strict';

angular.module('crm_app')
	.controller('ClassroomsCtrl', ['$scope', 'Classroom', '$http',
		function($scope, Classroom, $http) {

			$http.defaults.withCredentials = true;

			$scope.classrooms = [];
			$scope.current = {};
			$scope.isEditing = false;

			$scope.find = function() {
				Classroom.query({}, function(classrooms) {
					$scope.classrooms = classrooms;
				});
			};

			$scope.submitNew = function() {
				if ($scope.current['_id'])
					return;

				//save New Classroom
				var c = new Classroom($scope.current);
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

				var c = new Classroom($scope.current);
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

					c = new Classroom(c);
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
