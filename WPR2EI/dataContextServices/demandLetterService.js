angular.module('services.api')
    .service('demandLetterService', ['apiService', function (apiService) {
        var service = {};

        service.getContactForPayment = function (payment_schedule_id) {
            return apiService.getWithoutCaching('Payment/GetContactByPayment?id=' + payment_schedule_id);
        }

        return service;
    }
]);