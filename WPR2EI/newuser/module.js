/**
 * Created by dwellarkaruna on 20/10/15.
 */
angular.module('newuser', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.newuser', {
                url: '/users',
                templateUrl: 'newuser/newuser.tpl.html',
                controller: 'newuserController',
                title: 'NewUser'
            })
        .state('app.newuserdetail', {
            url: '/users/details',
            templateUrl: 'newuser/newuserdetail.tpl.html',
            controller: 'newuserdetailController',
            title: 'User Details'
        })
             
    }]);