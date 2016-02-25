angular.module('eventcampaign', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.eventcampaign', {
                url: '/eventcampaign',
                templateUrl: 'eventcampaign/eventcampaign.tpl.html',
                controller: 'EventCampaignController',

            })
    

    }]);