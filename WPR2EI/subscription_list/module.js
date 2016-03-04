/**
 * Created by dwellarkaruna on 20/10/15.
 */
angular.module('subscription_list', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.subscription_list', {
                url: '/SubscriptionList',
                templateUrl: 'subscription_list/subscription_list.tpl.html',
                controller: 'SubscriptionListController',
                title: 'SubscriptionList'
            })
      
    }]);