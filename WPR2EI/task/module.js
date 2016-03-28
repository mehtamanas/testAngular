angular.module('task', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.tasks', {
                url: '/task',
                templateUrl: 'task/task.html',
                controller: 'TaskGridController',
                title: 'form'
            })

         .state('app.edit_task', {
             url: '/edit_task?id',
             templateUrl: 'task/edit_task.html',
             controller: 'EditTaskGridController',
             title: 'Edit Task'
         })

    }]);