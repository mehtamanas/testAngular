angular.module('campaigns')


.controller('budgetEmailController',
    function ($scope, $state, $cookieStore, apiService, $modal, $rootScope, emailService) {

        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
        $scope.budget = $cookieStore.get('Budget');
        $scope.no_of_leads = $cookieStore.get('No_of_leads');
        $scope.sales = $cookieStore.get('Sales');
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


        projectUrl = "CampaignEvent/GenerateCampaignId";
        apiService.get(projectUrl).then(function (response) {
            $scope.params = response.data;
            $cookieStore.put('campaign_id', $scope.params.campaign_ID);
        },
    function (error) {
        
    }
        );

        $scope.params = {
            budget: $scope.budget,
            no_of_leads: $scope.no_of_leads,
            sales: $scope.sales,
            campaign_ID: $scope.campaign_ID,
            organization_id: $cookieStore.get('orgID'),
            user_id: $cookieStore.get('userId'),
        };
      
        $scope.addNew = function (isValid) {
            $scope.showValid = true;
            if (isValid) {                       
                $cookieStore.put('Budget', $scope.params.budget);
                $cookieStore.put('No_of_leads', $scope.params.no_of_leads);
                $cookieStore.put('Sales', $scope.params.sales);
                AuditCreate();
                $state.go('app.optionEmail');
                                   
                $scope.showValid = false;

            }
        }


        
       
    
         $scope.cancel = function () {
             $state.go('app.campaigns');
         };
         
         $scope.back = function () {
             $state.go('app.addEmailCampaign');
           
         }
    });

