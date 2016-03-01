angular.module('eventcampaign', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider

             .state('app.eventcampaigngrid', {
                 url: '/promoscampaigngrid',
                 templateUrl: 'eventcampaign/eventcampaigngrid.tpl.html',
                 controller: 'EventCampaignGridController',

             })
        
     

    }]);