createViewCtrl = function ($scope, $state, apiService, $rootScope,$cookieStore, $modalInstance, $modal, viewData) {
    $scope.params = {};
    $scope.loadingDemo = false;
    $scope.createView = function (isValid) {
        if (isValid) {
            $scope.loadingDemo = true;
            $scope.disabled = true;
            var postData = {
                organization_id: $cookieStore.get('orgID'),
                user_id: $cookieStore.get('userId'),
                grid_name: viewData.grid,
                sort_by: viewData.sort.field,
                sort_order:viewData.sort.dir,
                column_names: viewData.col,
                view_name:$scope.params.viewName
            }
            apiService.post('Notes/CreateGridView', postData).then(function (response) {
                $scope.openSucessfullPopup();

                $scope.cancel();
                if (viewData.grid == 'lead') $rootScope.$broadcast('REFRESH2', { name: 'ViewCreated', data: $scope.params.viewName });
                if (viewData.grid == 'contact') $rootScope.$broadcast('REFRESH1', { name: 'ViewCreated', data: $scope.params.viewName });
                if (viewData.grid == 'client') $rootScope.$broadcast('REFRESH3', { name: 'ViewCreated', data: $scope.params.viewName });
                if (viewData.grid == 'call') $rootScope.$broadcast('REFRESH', { name: 'ViewCreated', data: $scope.params.viewName });
                $scope.loadingDemo = false;
            }, function (error) {

            })

        }
    }

    $scope.cancel = function () {
        $modalInstance.dismiss();
    }

    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'sm',
            resolve: { items: { title: "View" } }
        });
    }
}