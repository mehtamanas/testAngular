angular.module('task', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.tasks', {
                url: '/task',
                templateUrl: 'task/task.html',
                controller: 'TaskGridController',
                title: 'form'
            })

    }]);