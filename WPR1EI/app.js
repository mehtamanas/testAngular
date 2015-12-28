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
    'resourcepermission',
    'plot',
    'ng.deviceDetector'


   

]).
    config(['$urlRouterProvider', function ($urlRouterProvider) {
        $urlRouterProvider.otherwise('/login');
    }])
    .constant('appConstants', {
        'APIBaseURL': 'https://dw-webservices-dev2.azurewebsites.net/'
    }).config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        //cfpLoadingBarProvider.latencyThreshold = 500;
        cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Loading...</div>';
        //cfpLoadingBarProvider.includeBar = false;
    }]);
    