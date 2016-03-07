var AssignController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $rootScope) {
    console.log('AssignController');

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $rootScope.$broadcast('REFRESH', 'mainGridOptions');
    $scope.reset = function () {
        $scope.params = {};
    }

};