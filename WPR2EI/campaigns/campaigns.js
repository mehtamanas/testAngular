
    var campaignsController = function ($scope, $state, $cookieStore, apiService, $modal, $rootScope, $modalInstance) {
        console.log('campaignsController');

        //Audit log start               
        AuditCreate = function () {
            var postdata =
           {
               device_os: $cookieStore.get('Device_os'),
               device_type: $cookieStore.get('Device'),
               //device_mac_id: "34:#$::43:434:34:45",
               module_id: "Contact",
               action_id: "Contact View",
               details: "Campaign",
               application: "angular",
               browser: $cookieStore.get('browser'),
               ip_address: $cookieStore.get('IP_Address'),
               location: $cookieStore.get('Location'),
               organization_id: $cookieStore.get('orgID'),
               User_ID: $cookieStore.get('userId')
           };


            apiService.post("AuditLog/Create", postdata).then(function (response) {
                var loginSession = response.data;
            },
            function (error) {
                if (error.status  === 400)
                    alert(error.data.Message);
                else
                    alert("Network issue");
            });
        };
        AuditCreate();

        //end

        var callApi = function () {
            projectUrl = "ChannelType/GetChannelTypeAll";
            apiService.get(projectUrl).then(function (response) {
                $scope.events = response.data;
                channelFilter($scope.events);
            },
        function (error) {
       
        }
            );
        }

        var channelFilter = function (channelList) {
            var socialMedia = _.filter(channelList, { 'campaign_type_name': 'Social Media' });
            var onlineAds = _.filter(channelList, { 'campaign_type_name': 'Online Ads' });
            var others = _.filter(channelList, { 'campaign_type_name': 'Others' });

            $scope.facebookId = (_.findWhere(socialMedia, { channel_type: 'Facebook' })).channel_type_id;
            $scope.twitterId = (_.findWhere(socialMedia, { channel_type: "Twitter" })).channel_type_id;
            $scope.linkedInId = (_.findWhere(socialMedia, { channel_type: "Linkedin" })).channel_type_id;

            $scope.googleAdsId = (_.findWhere(onlineAds, { channel_type: "Google Adsense" })).channel_type_id;
            $scope.facebookAdsId = (_.findWhere(onlineAds, { channel_type: "Facebook Ads" })).channel_type_id;
            $scope.twitterAdsId = (_.findWhere(onlineAds, { channel_type: "Twitter Ads" })).channel_type_id;
            $scope.linkedInAdsId = (_.findWhere(onlineAds, { channel_type: "Linkedin Ads" })).channel_type_id;
            $scope.utubeAdsId = (_.findWhere(onlineAds, { channel_type: "Ypoutube video Ads" })).channel_type_id;

            $scope.smsId = (_.findWhere(others, { channel_type: "SMS" })).channel_type_id;
            $scope.emailId = (_.findWhere(others, { channel_type: "Email" })).channel_type_id;
            $scope.tvAdsId = (_.findWhere(others, { channel_type: "Tv Ads" })).channel_type_id;
            $scope.outdoorId = (_.findWhere(others, { channel_type: "Outdoor" })).channel_type_id;
            $scope.newspaperId = (_.findWhere(others, { channel_type: "Newspaper" })).channel_type_id;
            $scope.eventsId = (_.findWhere(others, { channel_type: "Events" })).channel_type_id;
       
        }

        callApi();

    

        $scope.EventFunClick = function (id) {
            $rootScope.selectedEvent = id;
            $state.go('app.addNewCampaign');
            $modalInstance.dismiss();
        }

        $scope.EmailFunClick = function (id) {
            $rootScope.selectedEvent = id;
            $state.go('app.addEmailCampaign');
            $modalInstance.dismiss();
        }

        $scope.addNew = function (isValid) {
            $scope.showValid = true;
            if (isValid) {

                $scope.showValid = false;
            }
        }
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.reset = function () {
            $scope.params = {};
        }

        $scope.openSucessfullPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/sucessfull.tpl.html',
                backdrop: 'static',
                controller: sucessfullController,
                size: 'md'
            });
        }
    };