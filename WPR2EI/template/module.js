angular.module('templates', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.template', {
                url: '/templates',
                templateUrl: 'template/template.html',
                controller: 'templateCtrl',
                title: 'Template'
            })


    }]);