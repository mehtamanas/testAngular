var assigntopopup = function ($scope, $state, $cookieStore, apiService, $modalInstance) {
    console.log('assigntopopup');

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }

    AuditCreate($scope.params);

    //end
    $scope.user = function () {
        $modalInstance.dismiss();
        $state.go('newuser');

    }
};