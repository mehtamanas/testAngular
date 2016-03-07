var InviteController = function ($scope, $state, $cookieStore, apiService, $modalInstance) {
    console.log('InviteController');

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