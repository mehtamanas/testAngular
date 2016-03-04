/**
 * Created by dwellarkaruna on 20/10/15.
 */
angular.module('billing', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.billing', {
                url: '/billings',
                templateUrl: 'billing/billing.tpl.html',
                controller: 'BillingController',
                title: 'Billing'
            })
      
    }]);