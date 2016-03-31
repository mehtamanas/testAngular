﻿createViewCtrl = function ($scope, $state, apiService, $rootScope,$cookieStore, $modalInstance, $modal, viewData) {
    $scope.params = {};

    $scope.createView = function (isValid) {
        if (isValid) {
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
                if (viewData.grid == 'lead') $rootScope.$broadcast('REFRESH2', 'LeadGrid');
                if (viewData.grid == 'contact') $rootScope.$broadcast('REFRESH1', 'contactGrid');
                if (viewData.grid == 'client')  $rootScope.$broadcast('REFRESH3', 'ClientContactGrid');
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
            size: 'md',
            resolve: { items: { title: "View" } }
        });
    }
}