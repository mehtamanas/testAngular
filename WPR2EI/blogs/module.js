angular.module('blogs', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.integration', {
                url: '/integration',
                templateUrl: 'blogs/integration.html',
                controller: 'IntegrationController',

            })

    }]);