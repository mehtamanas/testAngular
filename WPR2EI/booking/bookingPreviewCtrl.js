angular.module('Bookings')
.controller('bookingPreviewCtrl', ['$scope', '$state', '$cookieStore', 'bookingService', '$rootScope', function ($scope, $state, $cookieStore, bookingService, $rootScope) {

    $scope.quoteId = $state.params.quoteId == null ? null : $state.params.quoteId;
    $scope.bookingId = $state.params.bookingId == null ? null : $state.params.bookingId;


    $scope.bookingPreviewInit = function () {

        if ($scope.quoteId != null) {
            bookingService.getBookingByQuoteId($scope.quoteId).then(function (response) {
                $scope.bookingModel = response.data;
            }, function (error) {
                alert(error.data.Message);
            });
        }
        else {
            //get bookingByBookingid
        }

    }

    $scope.bookingPreviewInit();

}]);
