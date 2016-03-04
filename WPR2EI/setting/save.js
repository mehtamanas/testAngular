var SaveController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $rootScope) {
    console.log('SaveController');

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    //$rootScope.$broadcast('REFRESH', 'mainGridOptions');
    $scope.reset = function () {
        $scope.params = {};
    }

};