/**
 * Created by dwellarkaruna on 20/10/15.
 */
angular.module('dashboard', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.dashboard', {
                url: '/dashboard',
                templateUrl: 'dashboard/dashboard.html',
                controller: 'DashboardController',
                title: 'dashboard'
            })
        
             
    }]);