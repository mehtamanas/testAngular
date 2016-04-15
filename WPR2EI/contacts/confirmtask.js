var confirmTaskController = function ($scope, items, $state, $rootScope, $modal, apiService, $cookieStore, $modalInstance) {
    console.log('confirmTaskController');

    $scope.title = items.title;
    var taskDelete = $cookieStore.get('taskDelete');
    $scope.length = parseInt(taskDelete.length);
    $scope.gotoDelete = function () {
        apiService.post("ToDoItem/DeleteMultipleTask", taskDelete).then(function (response) {
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
                resolve: { items: { title: "Task" } }

            });
            $rootScope.$broadcast('REFRESH', 'TaskGrid');
        }
    }


};