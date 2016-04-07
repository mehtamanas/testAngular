var ServiceconfirmationController = function ($scope, items, $state, $rootScope, $modal, apiService, $cookieStore, $modalInstance) {
    console.log('ServiceconfirmationController');

    $scope.title = items.title;
    var serviceDelete = $cookieStore.get('serviceDelete');
    $scope.length = parseInt(serviceDelete.length);
    $scope.gotoDelete = function () {
        apiService.post("Services/DeleteMultipleServices", serviceDelete).then(function (response) {
            var loginSession = response.data;
            $scope.openSucessDeletefullPopup();
            $rootScope.$broadcast('REFRESH', 'serviceGrid');
           
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
                size: 'sm',
                resolve: { items: { title: "Service" } }

            });

        }

    }
    
};