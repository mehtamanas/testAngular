var sendSuccessfulCtrl = function ($scope, $state, $cookieStore, apiService, $modalInstance, items) {
    console.log('sendSuccessfulCtrl');

    $scope.title = items.title;
    //Audit log start
  

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }

 

    //end


   
 

    


   

   

   

};