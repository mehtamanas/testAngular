angular.module('call', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.calls', {
                url: '/calls',
                templateUrl: 'call/call.html',
                controller: 'CallController',
               
            })

    }]);