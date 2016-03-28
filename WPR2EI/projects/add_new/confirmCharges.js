var ChargeconfirmationController = function ($scope, items, $state, $rootScope, $modal, apiService, $cookieStore, $modalInstance) {
    console.log('ChargeconfirmationController');

    $scope.title = items.title;
    var chargeDelete = $cookieStore.get('chargeDelete');
    $scope.length = parseInt(chargeDelete.length);
    $scope.gotoDelete = function () {
        apiService.post("Charges/DeleteMultipleCharge", chargeDelete).then(function (response) {
            var loginSession = response.data;
            $scope.openSucessDeletefullPopup();
            $rootScope.$broadcast('REFRESH', 'ChargesGrid');
           
            $modalInstance.dismiss();

        },
       function (error) {
           if (error.status === 400)
               alert(error.data.Message);
           else
               alert("Network issue");
       });

        $scope.openSucessDeletefullPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/delete.html',
                backdrop: 'static',
                controller: DeleteController,
                size: 'md',
                resolve: { items: { title: "Charge" } }

            });

        }

    }
    
};