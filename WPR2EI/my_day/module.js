/**
 * Created by dwellarkaruna on 20/10/15.
 */
angular.module('my_day', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.my_day', {
                url: '/my_day',
                templateUrl: 'my_day/my_day.html',
                controller: 'my_dayController',
                title: 'my_day'
            })
        
             
    }]);