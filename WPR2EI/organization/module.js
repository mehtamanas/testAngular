/**
 * Created by dwellarkaruna on 20/10/15.
 */
angular.module('organization', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.organization', {
                url: '/organization',
                templateUrl: 'organization/organization.tpl.html',
                controller: 'OrganizationController',
                title: 'organization'
            })
      
    }]);