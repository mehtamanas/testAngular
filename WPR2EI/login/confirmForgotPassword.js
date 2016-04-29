var confirmResetPassword = function ($scope, $state, $cookieStore, apiService, $modalInstance) {
    console.log('confirmResetPassword');

    $scope.resetAccountEmail = $cookieStore.get('AccountEmail');
 

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }



    //end


 

};