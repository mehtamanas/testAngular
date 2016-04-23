angular.module('unsubscribe', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.unsubscribe', {
                url: '/unsubscribe',
                templateUrl: 'unsubscribe/unsubscribe.html',
                controller: 'unsubscribeController',
            })
    }]);