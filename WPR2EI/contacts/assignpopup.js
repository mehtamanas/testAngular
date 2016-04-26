var assigntopopup = function ($scope, $state, $cookieStore, apiService, $modalInstance) {
    console.log('assigntopopup');

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }



    //end
   
};