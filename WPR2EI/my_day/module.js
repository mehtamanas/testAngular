
angular.module('my_day', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.my_day', {
                url: '/my_day',
                templateUrl: 'my_day/my_day.html',
                controller: 'my_dayController',
                title: 'my_day'
            })
         .state('app.edit_task_myday', {
             url: '/edit_task_myday?id',
             templateUrl: 'my_day/edit/edit_task_myday.html',
             controller: 'MyDayEditTask',
             title: 'Edit Task'
         })

        
             
    }]);