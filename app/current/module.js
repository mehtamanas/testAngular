/**
 * Created by dwellarkaruna on 20/10/15.
 */
angular.module('current', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.current', {
                url: '/current',
                templateUrl: 'current/current.tpl.html',
                controller: 'currentController',
                title: 'current'
            })
      
    }]);