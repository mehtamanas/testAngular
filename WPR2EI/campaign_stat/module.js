angular.module('campaign_statistics', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.campaign_statistics', {
                url: '/campaign_statistics',
                templateUrl: 'campaign_stat/campaign_stat.html',
                controller: 'CampaignStatController',
                title: 'campaign'
            })
          
    }]);