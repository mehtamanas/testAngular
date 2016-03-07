'use strict';

// Declare app level module which depends on views, and components
angular.module('MainApp', [
    'ui.router',
    'ui.bootstrap',
    'configs',
    'kendo.directives',
    'angular-loading-bar',
    'ngCookies',
     'ngSanitize',
    'restangular',
    'pascalprecht.translate',
     'ngSwipebox',
    'angularFileUpload',
    'services.api',
    'security',
    'app.guest.login',
    'property',
     'project',
      'team',
    'contacts',
    'campaign_statistics',
     'ngIdle',
    'eventcampaign',
    'flow',
   'ngAnimate',
   'angularSpinner',
    'newuser',
   'organization',
   'subscription_list',
   'billing',
   'channel_partners',
   'audit',
   'report',
   'common',
   'application',
    'current',
    'plot',
    'my_day',
    'dashboard',
   'campaigns',
   'call',
 'task',
'form',
 'ngMessages',
   'templates',
    'ng.deviceDetector',
    'setting',
  'tag',
  'ngTagsInput'
  


   

]).
    config(['$urlRouterProvider', function ($urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');
    }])
    .constant('appConstants', {
        
    }).config(['cfpLoadingBarProvider', 'IdleProvider', 'KeepaliveProvider', function (cfpLoadingBarProvider, IdleProvider, KeepaliveProvider) {
        //cfpLoadingBarProvider.latencyThreshold = 500;
        IdleProvider.idle(1200); // in seconds
        IdleProvider.timeout(5); // in seconds
        cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Loading...</div>';
        //cfpLoadingBarProvider.includeBar = false;
    }])
.run(function ($rootScope, $location, $cookieStore, Idle) {
    $rootScope.$on("$stateChangeStart", function (event, next, current) {
        if (($cookieStore.get('userId') === undefined)) {
            if ((next.name).indexOf("app") > -1) {
                $location.url('/app/index.html#/login');
            }
        }
    })
});
    