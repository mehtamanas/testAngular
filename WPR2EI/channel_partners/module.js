/**
 * Created by dwellarkaruna on 20/10/15.
 */
angular.module('channel_partners', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.channel_partners', {
                url: '/channel partners',
                templateUrl: 'channel_partners/channel_partners.tpl.html',
                controller: 'Channel_PartnersController',
                title: 'Channel Partners'
            })

        $stateProvider
           .state('app.channel_form', {
               url: '/channel form',
               templateUrl: 'channel_partners/channelform.tpl.html',
               controller: 'Channel_FormController',
               title: 'Channel Partners Form'
           })
      
    }]);