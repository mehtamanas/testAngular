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

          .state('app.add_new_task', {
              url: '/taskpage',
              templateUrl: 'task/add_new_task.tpl.html',
              controller: 'AddTaskController',
              title: 'form'
          })
    }]);