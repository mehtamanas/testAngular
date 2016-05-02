

var InactiveController = function ($scope, $state, $cookieStore, apiService, items, $modalInstance, $rootScope) {
    console.log('InactiveController');

    $scope.title = items.title;
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $rootScope.$broadcast('REFRESH', 'mainGridOptions');
    $scope.reset = function () {
        $scope.params = {};
    }
  
};