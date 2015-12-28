angular.module('resourcepermission', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.resourcepermission', {
                url: '/ResourcePermission',
                templateUrl: 'resource/rpermission.tpl.html',
                controller: 'ResourcePermissionController',
                title: 'ResourcePermission'
            })

    }]);