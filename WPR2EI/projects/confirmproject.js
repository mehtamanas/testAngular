var ProjectconfirmationController = function ($scope, items, $state, $rootScope, $modal, apiService, $cookieStore, $modalInstance) {
    console.log('ProjectconfirmationController');

    $scope.title = items.title;
    var projectDelete = $cookieStore.get('projectDelete');
    $scope.length = parseInt(projectDelete.length);
    $scope.gotoDelete = function () {
        apiService.post("Project/DeleteMultipleProject", projectDelete).then(function (response) {
            var loginSession = response.data;
            $scope.openSucessDeletefullPopup();
            $rootScope.$broadcast('REFRESH', 'projectGrid');
           
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
                size: 'lg',
                resolve: { items: { title: "Project" } }

            });

        }

    }
    
};