var emailAddPreviewCtrl = function ($scope, items, $modalInstance) {
    $scope.params={
        bodyText: items
    }

    $scope.cancel = function () {
        $modalInstance.dismiss();
    }
};