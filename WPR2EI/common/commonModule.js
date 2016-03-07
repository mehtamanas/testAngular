/**
 * Created by dwellarkaruna on 03/11/15.
 */

angular.module('common', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app', {
                url: '/home',
                templateUrl: 'common/home.html',
                controller: 'HomeController',
                title: 'Home'
            })

           .state('subscription', {
               url: '/subscription',
               templateUrl: 'login/subscription.tpl.html',
               controller: 'subscriptionController',
               title: 'subscription Details'
           })
    }]);