angular.module('Bookings', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.bookings', {
                url: '/Booking',
                templateUrl: 'booking/booking.html',
                controller: 'BookController',
                title: 'Bookings'
            })


    }]);