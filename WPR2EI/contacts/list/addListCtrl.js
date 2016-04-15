var addListCtrl = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal, $rootScope , $window) {
    console.log('addListCtrl');
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

    window.sessionStorage.selectedorgid = $cookieStore.get('orgID');

    var userId = $cookieStore.get('userId');
    var orgID = $cookieStore.get('orgID');
    $scope.name = $cookieStore.get('Name');
    $scope.description = $cookieStore.get('Description');
   


    //API functionality start
    $scope.params = {
        name: $scope.name,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),
        description: $scope.description,
       
    };

    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {
            $cookieStore.put('Name', $scope.params.name);
            $cookieStore.put('Description', $scope.params.description);
            $modalInstance.dismiss();
            $state.go('app.tagList');
            $scope.showValid = false;

        }
    }

    $scope.cancel = function () {
        $cookieStore.remove('Name');
        $cookieStore.remove('Description');
        $modalInstance.dismiss('cancel');
    };

};


