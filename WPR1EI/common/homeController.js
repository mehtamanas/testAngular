/**
 * Created by dwellarkaruna on 03/11/15.
 */

angular.module('common')
    .controller('HomeController', ['$scope', '$cookieStore', '$location', 'security', '$rootScope', function ($scope, $cookieStore, $location, security, $rootScope) {
        $scope.activeBar = 0;
        security.isAuthorized().then(function (response) {
            nav = response;
            console.log(nav);
            $scope.loggedUser = $cookieStore.get('loggedUser');
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
            $cookieStore.remove('currentUser');
            $cookieStore.remove('authToken');
            $cookieStore.remove('userId');
            $cookieStore.remove('orgID');
            $location.url('/app/index.html#');

        };

    }]);