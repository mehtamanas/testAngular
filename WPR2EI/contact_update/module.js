
angular.module('contact_update', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.contact_update', {
                url: '/contact_update',
                templateUrl: 'contact_update/contact_update.html',
                controller: 'ContactUpdateController',
                title: 'contact_update'
            })


    }]);