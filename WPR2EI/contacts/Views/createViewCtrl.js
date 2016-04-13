createViewCtrl = function ($scope, $state, apiService, $rootScope, $cookieStore, $modalInstance, $modal, viewData) {
    $scope.params = {};
    $scope.loadingDemo = false;
    $scope.title = viewData.type;
    $scope.setDefault = false;
    $scope.title = viewData.type;
    $scope.createView = function (isValid) {
        if (isValid) {
            $scope.loadingDemo = true;
            $scope.disabled = true;


            postData = {//view
                default_view: $scope.setDefault,
                organization_id: $cookieStore.get('orgID'),
                user_id: $cookieStore.get('userId'),
                grid_name: viewData.grid,
                sort_by: viewData.sort ? viewData.sort.field : null,
                sort_order: viewData.sort ? viewData.sort.dir : null,
                column_names: viewData.col ? JSON.stringify(viewData.col) : null,
                view_name: $scope.params.viewName,
                query_string: viewData.filterQuery ? JSON.stringify(viewData.filterQuery) : null,
                query_type: viewData.type,
                filters: viewData.filterObj ? JSON.stringify(viewData.filterObj) : null

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
            resolve: { items: { title: viewData.type } }
        });
    }
}