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
   'toaster',
   'angularSpinner',
    'newuser',
   'organization',
   'subscription_list',
   'billing',
   'channel_partners',
   'contact_update',
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
   'blogs',
   'ngMaterial',
   'ngMessages',
   'templates',
   'ng.deviceDetector',
   'setting',
  'tag',
  'contact_report',
  'ngTagsInput',
    'ngStorage',
     'testresult',
  'emailtransactions',
    'angular-ladda',
    'Bookings',
    'unsubscribe'
    
    
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

.run(function ($rootScope, $cookieStore, Idle, $location) {
    $rootScope.$on("$stateChangeStart", function (event, next, current) {
        //if ($location.protocol() !== 'https') { //redirect http to https
        //  $window.location.href = $location.absUrl().replace('http', 'https');
        //}
     
        if (($cookieStore.get('userId') === undefined)) {
            if ((next.name).indexOf("app") > -1) {
                var url = $location.path();
                $cookieStore.put('location', url);
                $location.path('/login');
            }
        }
        else if (($cookieStore.get('userId') !== undefined)&& $location.path()) {
            var url = $location.path();
            if (url === '/login') { $location.path('home/my_day'); }
            else { $location.path(); }
        }
        else {
            $location.path('home/my_day');
        }
    })
});
