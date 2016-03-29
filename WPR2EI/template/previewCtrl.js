var previewCtrl = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal, $rootScope, $window, agreementData) {
    $scope.params = {};
    $scope.params.htmlcontent = agreementData.description;

    };
