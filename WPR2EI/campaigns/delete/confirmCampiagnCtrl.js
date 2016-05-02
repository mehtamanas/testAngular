var confirmCampiagnCtrl = function ($scope, items, $state, $rootScope, $modal, apiService, $cookieStore, $modalInstance) {
    console.log('confirmCampiagnCtrl');

    $scope.title = items.title;
    var campigansDelete = $cookieStore.get('contactDelete');
    $scope.length = parseInt(campigansDelete.length);
    $scope.gotoDelete = function () {
        apiService.post("CampaignEvent/DeleteMultipleCampaigns", campigansDelete).then(function (response) {
            var loginSession = response.data;
            $scope.openSucessfullPopup();
            $modalInstance.dismiss();

        },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    });

        $scope.openSucessfullPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/delete.html',
                backdrop: 'static',
                controller: DeleteController,
                size: 'sm',
                resolve: { items: { title: "Email Campiagn" } }

            });
            $rootScope.$broadcast('REFRESH', 'projectGrid');
        }

    }

};