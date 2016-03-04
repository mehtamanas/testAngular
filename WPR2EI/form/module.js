angular.module('form', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.forms', {
                url: '/form',
                templateUrl: 'form/form.html',
                controller: 'FormTeamController',
                title: 'form'
            })
           
    }]);