'use strict';

angular.module('crm_app')
	.controller('SchoolsCtrl', ['$scope', 'School', '$http',
		function($scope, School, $http) {

			$http.defaults.withCredentials = true;

			$scope.schools = [];
			$scope.current = {};
			$scope.isEditing = false;

			$scope.find = function() {
				School.query({}, function(schools) {
					$scope.schools = schools;
				});
			};

			$scope.submitNew = function() {
				if ($scope.current['_id'])
					return;

				//save New School
				var c = new School($scope.current);
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

				var c = new School($scope.current);
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

					c = new School(c);
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
