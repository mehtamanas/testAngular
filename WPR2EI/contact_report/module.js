/**
 * Created by dwellarkaruna on 20/10/15.
 */
angular.module('contact_report', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.contact_report', {
                url: '/contact_report',
                templateUrl: 'contact_report/contact_report.html',
                controller: 'ContactReportController',
                title: 'contact_report'
            })
        
             
    }]);