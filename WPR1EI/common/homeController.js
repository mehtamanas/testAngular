/**
 * Created by dwellarkaruna on 03/11/15.
 */

angular.module('common')
    .controller('HomeController', ['$scope', '$cookieStore', '$location', 'security', '$rootScope', '$cookies', function ($scope, $cookieStore, $location, security, $rootScope, $cookies) {

 $scope.loggedUser = $cookieStore.get('loggedUser');

        $('.nav-sub-dropdown > a').on('click', function () {
            if ($(this).parent('.nav-sub-dropdown').find('.nav-sub-bx').is(':hidden')) {
                $('.nav-sub-bx').slideUp(350);
                $('.nav-sub-dropdown > a').removeClass('nav-sub-active');
                $(this).parent('.nav-sub-dropdown').find('.nav-sub-bx').slideDown(350);
                $(this).addClass('nav-sub-active');
            }
            else {
                $(this).parent('.nav-sub-dropdown').find('.nav-sub-bx').slideUp(350);
                $(this).removeClass('nav-sub-active');
            }
        });

        $scope.activeBar = 0;
        security.isAuthorized().then(function (response) {
            nav = response;
            console.log(nav);
        if (nav.length > 0) {

            for (i = 0; i < nav.length; i++) {
                if (nav[i].resource === "Projects") $rootScope.projects = nav[i];
                if (nav[i].resource === "Users") $rootScope.users = nav[i];
                if (nav[i].resource === "Teams") $rootScope.teams = nav[i];

                if (nav[i].resource === "Billing") $rootScope.billing = nav[i];
                if (nav[i].resource === "Contacts") $rootScope.contacts = nav[i];
                if (nav[i].resource === "Organization") $rootScope.organization = nav[i];
                if (nav[i].resource === "Channel Partners") $rootScope.channelPartners = nav[i];
                if (nav[i].resource === "Audit Trail") $rootScope.auditTrail = nav[i];
                if (nav[i].resource === "Reports") $rootScope.reports = nav[i];
                if (nav[i].resource === "Builders") $rootScope.builders = nav[i];
                if (nav[i].resource === "Notifications") $rootScope.notifications = nav[i];
                if (nav[i].resource === "Support") $rootScope.support = nav[i];
                if (nav[i].resource === "Property") $rootScope.property = nav[i];
                if (nav[i].resource === "Shared Listings") $rootScope.sharedListings = nav[i];
                if (nav[i].resource === "Campaigns") $rootScope.campaigns = nav[i];
                if (nav[i].resource === "Tasks") $rootScope.tasks = nav[i];

            }
        }
        });

        $scope.logout = function () {
            $cookieStore.remove('Country');
            $cookieStore.remove('Device');
            $cookieStore.remove('Device_os');
            $cookieStore.remove('IP_Address');
            $cookieStore.remove('LatLon');
            $cookieStore.remove('Location');
            $cookieStore.remove('Platform');
            $cookieStore.remove('authToken');
            $cookieStore.remove('browser');
            $cookieStore.remove('currentUser');
            $cookieStore.remove('loggedUser');
            $cookieStore.remove('orgID');
            $cookieStore.remove('userId');
            localStorage.clear();
            console.log("loggedout");
            $location.url('/app/index.html#/login');
        };

    }]);