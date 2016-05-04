angular.module('services.api').service('bookingService', [
    'apiService', function (apiService) {
        var service = {};

        service.getBookingByQuoteId = function (quoteId) {
            return apiService.getWithoutCaching("Booking/GetBookingByQuoteId", { quoteId: quoteId });
        }

        return service;
    }
]);