/**
 * Created by dwellarkaruna on 20/10/15.
 */
angular.module('audit', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.audit', {
                url: '/audit',
                templateUrl: 'audit/audit.tpl.html',
                controller: 'AuditController',
                title: 'Audit'
            })
      
    }]);