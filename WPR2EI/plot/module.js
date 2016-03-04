angular.module('plot', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.plot', {
                url: '/Plot',
                templateUrl: 'plot/PlotDetail.tpl.html',
                controller: 'PlotDetailController',
                title: 'Plot'
            })
        

    }]);