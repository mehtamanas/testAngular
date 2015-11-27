/**
 * Created by dwellarkaruna on 20/10/15.
 */
angular.module('team', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.team', {
                url: '/teams',
                templateUrl: 'team/team.tpl.html',
                controller: 'TeamListController',
                title: 'Team'
            })
        .state('app.teamdetail', {
            url: '/team/details',
            templateUrl: 'team/TeamDetail.tpl.html',
            controller: 'TeamDetailController',
            title: 'Team Details'
        })
             
    }]);