angular.module('Bookings', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.bookings', {
                url: '/Booking',
                templateUrl: 'booking/booking.html',
                controller: 'BookController',
                title: 'Bookings'
            })

          .state('app.confirmBooking', {
              url: '/bookingPreview/:bookingId',
              params: { bookingId: null },
              templateUrl: 'booking/bookingPreview.html',
              controller: 'bookingPreviewCtrl',
              title: 'Bookings',

          })

    }]);