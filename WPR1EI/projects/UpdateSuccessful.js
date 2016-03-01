var UpdateController = function ($scope, $state, $cookieStore, apiService, $modalInstance, items) {
    console.log('UpdateController');

    $scope.title = items.title;

    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {


            $scope.showValid = false;

        }

    }

};