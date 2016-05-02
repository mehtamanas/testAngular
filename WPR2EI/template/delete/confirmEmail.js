var confirmEmailController = function ($scope, items, $state, $rootScope, $modal, apiService, $cookieStore, $modalInstance) {
    console.log('confirmEmailController');

    $scope.title = items.title;
    var templateDelete = $cookieStore.get('templateDelete');
    $scope.length = parseInt(templateDelete.length);
    $scope.gotoDelete = function () {
        apiService.post("Template/DeleteMultipleTemplates", templateDelete).then(function (response) {
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
                resolve: { items: { title: "Email Template" } }

            });
            $rootScope.$broadcast('REFRESH1', 'EmailTemplateGrid');
        }

    }

};