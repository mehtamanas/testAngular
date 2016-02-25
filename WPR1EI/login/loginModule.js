/**
 * Created by dwellarkaruna on 27/10/15.
 */
angular.module('app.guest.login', ['ngIdle'])

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
    })

.config(function(IdleProvider, KeepaliveProvider) {
    // configure Idle settings
    IdleProvider.idle(1200); // in seconds
    IdleProvider.timeout(5); // in seconds
    //KeepaliveProvider.interval(2); // in seconds
})
.run(function (Idle) {
    // start watching when the app runs. also starts the Keepalive service by default.
});

