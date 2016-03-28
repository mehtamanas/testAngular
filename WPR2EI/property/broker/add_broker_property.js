angular.module('property')
.controller('brokerPropertyController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope) {
        console.log('brokerPropertyController');

        $scope.choices1 = [{ id: 'choice1' }]; // remove code
        $scope.addNewChoice1 = function (e) {
            var classname = e.currentTarget.className;
            if (classname == 'remove-field') {

            }
            else if ($scope.choices1.length) {
                var newItemNo = $scope.choices1.length + 1;
                $scope.choices1.push({ 'id': 'choice' + newItemNo });
            }
        };


    });