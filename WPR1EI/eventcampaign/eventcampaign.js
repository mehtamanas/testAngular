angular.module('eventcampaign')


.controller('EventCampaignController',
    function ($scope, $state, security, $cookieStore, apiService, $window, $rootScope, $modal, teamService) {
        console.log('EventCampaignController');
        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
        $rootScope.title = 'Dwellar./EventCampaign';
        var orgID = $cookieStore.get('orgID');
        var userId = $cookieStore.get('userId');
        $scope.params = {};





        $scope.save = function ()
        {
            var expDate = moment($scope.params.expiry_datetime, 'DD/MM/YYYY hh:mm A')._d;
            var postdata =
                {
                    expiry_datetime: new Date(expDate).toISOString(),
                    token: $scope.params.token,
                    permission_level_id: $scope.params.permission_level_id,
                    project_id: $scope.params.project_id,
                    organization_id: $cookieStore.get('orgID'),
                    user_id: $cookieStore.get('userId'),
                    
                }
            
            projectUrl = "EventCampaign/CreateCampaign";
            apiService.post(projectUrl, postdata).then(function (response) {
                var loginSession = response.data;
                alert(loginSession.token);
                    alert("Event Campaign Created");
                },
            function (error) {
                if (error.status === 400)
                    alert(error.data.Message);
                else
                    alert("Network issue");
            })
           
        }


       
        $scope.params = {

            expiry_datetime: $scope.expiry_datetime,
            token: $scope.token,
            permission_level_id: $scope.permission_level_id,
            project_id: $scope.project_id,
            organization_id: $cookieStore.get('orgID'),
            user_id: $cookieStore.get('userId'),
        };



        Url = "project/Get/" + $cookieStore.get('orgID');
        apiService.get(Url).then(function (response) {
            $scope.projects = response.data;
        },
       function (error) {
           alert("Error " + error.state);
       });

        $scope.selectproject = function () {
            $scope.params.project_id = $scope.project1;
            //alert($scope.params.project_id);
        };
        //end

        Url = "CampaignEvent/GetPermissionLevel"
        apiService.get(Url).then(function (response) {
            $scope.levels = response.data;
        },
       function (error) {
           alert("Error " + error.state);
       });

        $scope.selectlevel = function () {
            $scope.params.permission_level_id = $scope.level1;
            //alert($scope.params.project_id);
        };


    });