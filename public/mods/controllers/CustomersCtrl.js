'use strict';

angular.module('crm_app')
	.controller('CustomersCtrl', ['$scope', 'Customer', '$http',
		function($scope, Customer, $http) {

			$http.defaults.withCredentials = true;

			$scope.customers = [];
			$scope.current = {};
			$scope.isEditing = false;

			$scope.find = function() {
				Customer.query({}, function(customers) {
					$scope.customers = customers;
				});
			};

			$scope.submitNew = function() {
				if ($scope.current['_id'])
					return;

				//save New Customer
				var c = new Customer($scope.current);
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

				var c = new Customer($scope.current);
				c.$update(
					function(data) {
						if (data.message) alert(data.message)

						$scope.cancel();
						$scope.find();
					}
				);
			};

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

					c = new Customer(c);
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
