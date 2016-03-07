/**
 * Created by dwellarkaruna on 20/10/15.
 */
angular.module('application', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.application', {
                url: '/application',
                templateUrl: 'application/application.tpl.html',
                controller: 'applicationController',
                title: 'application'
            })
         .state('app.channel_request', {
             url: '/application/channel_request',
             templateUrl: 'application/channel_request.tpl.html',
             controller: 'channel_requestController',
             title: 'channel_request'
         })
      
    }]);