/**
 * Created by dwellarkaruna on 20/10/15.
 */
angular.module('project', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.project', {
                url: '/projects',
                templateUrl: 'projects/project.tpl.html',
                controller: 'projectListController',
                title: 'Projects'
            })
        .state('app.projectdetail', {
            url: '/project/details',
            templateUrl: 'projects/ProjectDetail.tpl.html',
            controller: 'ProjectDetailController',
            title: 'Projects Details'
        })
             
    }]);
