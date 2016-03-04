angular.module('tag', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.tags', {
                url: '/tags',
                templateUrl: 'tag/tag.html',
                controller: 'tagController',

            })

    }]);