/**
 * Created by dwellarkaruna on 20/10/15.
 */
angular.module('report', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.report', {
                url: '/report',
                templateUrl: 'report/report.tpl.html',
                controller: 'reportController',
                title: 'Report'
            })
        .state('app.home', {
            url: '/home',
            templateUrl: 'common/home.html',
        })
         .state('app.jqlreport', {
             url: '/jql_report',
             templateUrl: 'report/customreport/customreport.html',
             controller: 'CustomreportController',
             title: 'CustomReport'
         })
      
    }]);