angular.module('campaigns')


.controller('budgetEmailController',
    function ($scope, $state, $cookieStore, apiService, $modal, $rootScope, emailService) {

        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
        projectUrl = "CampaignEvent/GenerateCampaignId";
        apiService.get(projectUrl).then(function (response) {
            $scope.params = response.data;
            $cookieStore.put('campaign_id', $scope.params.campaign_ID);
        },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
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
                $state.go('app.option');
                                   
                $scope.showValid = false;

            }
         }

         //$scope.EmailTagPopup = function () {
         //    var modalInstance = $modal.open({
         //        animation: true,
         //        templateUrl: 'campaigns/emailCampaign/option.tpl.html',
         //        backdrop: 'static',
         //        controller: EmailTagController,
         //        windowClass: 'addUser',
         //        resolve: {
         //            emailService:emailService,
         //            emailData: {
         //                teamId: window.sessionStorage.selectedCustomerID,
         //                orgId: $cookieStore.get('orgID')
         //            }
         //        }
         //    });
         //};


         $scope.cancel = function () {
             $modalInstance.dismiss('cancel');
         };
         
       
    });

