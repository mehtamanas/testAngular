'use strict';

// Declare app level module which depends on views, and components
angular.module('MainApp', [
    'ui.router',
    'ui.bootstrap',
    'configs',
    'kendo.directives',
    'angular-loading-bar',
    'ngCookies',
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
    'flow',
   
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
    'ng.deviceDetector',
    'setting'


   

]).
    config(['$urlRouterProvider', function ($urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');
    }])
    .constant('appConstants', {
        
    }).config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        //cfpLoadingBarProvider.latencyThreshold = 500;
        cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Loading...</div>';
        //cfpLoadingBarProvider.includeBar = false;
    }])
.run(function ($rootScope, $location, $cookieStore) {
    $rootScope.$on("$stateChangeStart", function (event, next, current) {
        if (($cookieStore.get('userId') === undefined)) {
            if ((next.name).indexOf("app") > -1) {
                $location.url('/app/index.html#/login');
            }
        }
    })
});
    