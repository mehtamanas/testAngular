angular.module('campaigns')


.controller('budgetDirectEmailCampaignController',
    function ($scope, $state, $cookieStore, apiService, $modal, $rootScope, emailService) {



        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

        //Audit log start               
        AuditCreate = function () {
            var postdata =
           {
               device_os: $cookieStore.get('Device_os'),
               device_type: $cookieStore.get('Device'),
               //device_mac_id: "34:#$::43:434:34:45",
               module_id: "Contact",
               action_id: "Contact View",
               details: $scope.params.budget + "Budget",
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
                if (error.status === 400)
                    alert(error.data.Message);
                else
                    alert("Network issue");
            });
        };

        //end

        if (!$cookieStore.get('Budget')) {
            projectUrl = "CampaignEvent/GenerateCampaignId";
            apiService.get(projectUrl).then(function (response) {
                $scope.params = response.data;
                $cookieStore.put('campaign_id', $scope.params.campaign_ID);
            },
        function (error) { });
        }

        $scope.params = {
            budget: $scope.budget,
            no_of_leads: $scope.no_of_leads,
            sales: $scope.sales,
            campaign_ID: $scope.campaign_ID,
            organization_id: $cookieStore.get('orgID'),
            user_id: $cookieStore.get('userId'),
        };


        $scope.params.budget = $cookieStore.get('Budget');
        $scope.params.no_of_leads = $cookieStore.get('No_of_leads');
        $scope.params.sales = $cookieStore.get('Sales');

        $scope.addNew = function (isValid) {
            $scope.showValid = true;
            if (isValid) {
                $cookieStore.put('Budget', $scope.params.budget);
                $cookieStore.put('No_of_leads', $scope.params.no_of_leads);
                $cookieStore.put('Sales', $scope.params.sales);
                AuditCreate();
                $state.go('app.contactDirectMailCampaign');

                $scope.showValid = false;
            }
        }

        $scope.cancel = function () {
            $cookieStore.remove('Name');
            $cookieStore.remove('End_Date');
            $cookieStore.remove('Address');
            $cookieStore.remove('Start_Date');
            $cookieStore.remove('project_id');
            $cookieStore.remove('Budget');
            $cookieStore.remove('No_of_leads');
            $cookieStore.remove('Sales');
            $cookieStore.remove('channel_type_id');
            $cookieStore.remove('campaign_ID');
            $state.go('app.addDirectMailCampaign');
        };

        $scope.backdirect = function () {
            $state.go('app.addDirectMailCampaign');
        }

    });

