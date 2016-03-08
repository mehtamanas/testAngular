/**
 * Created by dwellarkaruna on 03/11/15.
 */

angular.module('common')
    .controller('HomeController', ['$scope', '$cookieStore', '$location', 'security', '$rootScope', '$cookies', 'apiService', function ($scope, $cookieStore, $location, security, $rootScope, $cookies, apiService) {


        $scope.loggedUser = $cookieStore.get('loggedUser');
        $scope.badge = (($scope.loggedUser).charAt(0)).toUpperCase();
        var userID = $cookieStore.get('userId');




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
        $rootScope.projects = { 'read': true, 'write': true, 'delete': true };
        $rootScope.users = { 'read': true, 'write': true, 'delete': true };
        $rootScope.teams = { 'read': true, 'write': true, 'delete': true };
        $rootScope.organization = { 'read': true, 'write': true, 'delete': true };
        $rootScope.channelPartners = { 'read': true, 'write': true, 'delete': true };
        $rootScope.auditTrail = { 'read': true, 'write': true, 'delete': true };
        $rootScope.reports = { 'read': true, 'write': true, 'delete': true };
        $rootScope.builders = { 'read': true, 'write': true, 'delete': true };
        $rootScope.notifications = { 'read': true, 'write': true, 'delete': true };
        $rootScope.support = { 'read': true, 'write': true, 'delete': true };
        $rootScope.sharedListings = { 'read': true, 'write': true, 'delete': true };
        $rootScope.campaigns = { 'read': true, 'write': true, 'delete': true };
        $rootScope.tasks = { 'read': true, 'write': true, 'delete': true };
        $rootScope.billing = { 'read': true, 'write': true, 'delete': true };
        $rootScope.contacts = { 'read': true, 'write': true, 'delete': true };
        $rootScope.property = { 'read': true, 'write': true, 'delete': true };

        security.isAuthorized().then(function (response) {
            nav = response;
        if (nav.length > 0) {
            $rootScope.projects = _.findWhere(nav, { resource: 'Projects' });
            $rootScope.users = _.findWhere(nav, { resource: 'Users' });
            $rootScope.teams = _.findWhere(nav, { resource: 'Teams' });
            $rootScope.billing = _.findWhere(nav, { resource: 'Billing' });
            $rootScope.contacts = _.findWhere(nav, { resource: 'Contacts' });
            $rootScope.organization = _.findWhere(nav, { resource: 'Organization' });
            $rootScope.channelPartners = _.findWhere(nav, { resource: 'Channel Partners' });
            $rootScope.auditTrail = _.findWhere(nav, { resource: 'Audit Trail' });
            $rootScope.reports =_.findWhere(nav, { resource: 'Reports' });
            $rootScope.builders = _.findWhere(nav, { resource: 'Builders' });
            $rootScope.notifications = _.findWhere(nav, { resource: 'Notifications' });
            $rootScope.support = _.findWhere(nav, { resource: 'Support' });
            $rootScope.property = _.findWhere(nav, { resource: 'Property' });
            $rootScope.sharedListings = _.findWhere(nav, { resource: 'Shared Listings' });
            $rootScope.campaigns = _.findWhere(nav, { resource: 'Campaigns' });
            $rootScope.tasks = _.findWhere(nav, { resource: 'Tasks' });
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
            $cookieStore.remove('authToken');
            $cookieStore.remove('builderflow');
            $cookieStore.remove('builderflow');
            $cookieStore.remove('teamid');
            $cookieStore.remove('contactid');
            $cookieStore.remove('Selected Text');
            $cookieStore.remove('Organization_id');
            $cookieStore.remove('OrgName');
            $cookieStore.remove('Street_1');
            $cookieStore.remove('Street_2');
            $cookieStore.remove('Street_3');
            $cookieStore.remove('City');
            $cookieStore.remove('State');
            $cookieStore.remove('Zip_code');
            $cookieStore.remove('Country');
            $cookieStore.remove('who_am_i');
            $cookieStore.remove('First_Name');
            $cookieStore.remove('Last_Name');
            $cookieStore.remove('Account_Email');
            $cookieStore.remove('Phone');
            $cookieStore.remove('Account_Country');
            $cookieStore.remove('Hash');
            $cookieStore.remove('Subscription2_Name');
            $cookieStore.remove('Subscription2_Price');
            $cookieStore.remove('Subscription1_Name');
            $cookieStore.remove('Subscription1_Price');
            $cookieStore.remove('Subscription3_Name');
            $cookieStore.remove('Subscription3_Price');
            $cookieStore.remove('Subscription4_Name');
            $cookieStore.remove('Subscription4_Price');
            $cookieStore.remove('Sub_Name');
            $cookieStore.remove('Sub_Price');
            $cookieStore.remove('checkedIds');
            $cookieStore.remove('projectid');
            $cookieStore.remove('payment_schedule_id');
            $cookieStore.remove('FloorId');
            $cookieStore.remove('wing_id');
            $cookieStore.remove('tower_id');
            $cookieStore.remove('teamid');
            localStorage.clear();
            console.log("loggedout");
            $location.url('/app/index.html#/login');
        };


        contactUrl = "Contact/GetAllContactCount?Id=" + userID;
        apiService.getWithoutCaching(contactUrl).then(function (response) {
            $scope.tags = response.data;
            var leadcount = 0;
            if ($scope.tags[0].leadsCount != null) {
                leadcount = parseInt($scope.tags[0].leadsCount);
            }
            $scope.lead = leadcount;

            var contactcount = 0;
            if ($scope.tags[0].contactsCount != null) {
                contactcount = parseInt($scope.tags[0].contactsCount);
            }
            $scope.contact = contactcount;

            var clientcount = 0;
            if ($scope.tags[0].clientsCount != null) {
                clientcount = parseInt($scope.tags[0].clientsCount);
            }
            $scope.client = clientcount;




            $scope.total = $scope.lead + $scope.contact + $scope.client;

        },
   function (error) {
       console.log("Error " + error.state);
   }
        );

    }]);