var RoleController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $rootScope) {
    console.log('RoleController');

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $rootScope.$broadcast('REFRESH', 'mainGridOptions');
    $scope.reset = function () {
        $scope.params = {};
    }

};