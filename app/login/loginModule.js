/**
 * Created by dwellarkaruna on 27/10/15.
 */
angular.module('app.guest.login', [])

    .config(function config($stateProvider) {
        $stateProvider.state('login', {
            url: '/login',

            templateUrl: 'login/login.tpl.html',
            controller: 'LoginController'



        })

        .state('app.sales_enquiries', {
            url: '/login/sales_enquiries',
            templateUrl: 'login/sales_enquiries.tpl.html',
            controller: 'SalesPopUpController',
            title: 'sales_enquiries'
        })
    });