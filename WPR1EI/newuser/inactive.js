var InactiveController = function ($scope, $state, $cookieStore, apiService, $modalInstance) {
    console.log('InactiveController');

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }


   

   


    

   
  
};