/// <reference path="../team/add_new_team.js" />

var emialLaunchController = function ($scope, $state, $modalInstance,$cookieStore, apiService, $modal, $rootScope) {
    console.log("emialLaunchController");
    $scope.showcontent = true;
    

    Url = "CampaignEmailTemplate/GetPeoplelistInCampaign/" + $cookieStore.get('campaign_ID');

    apiService.get(Url).then(function (response) {

        $scope.data1 = response.data;
        $scope.peoeplecount = $scope.data1.PeopleCount;
       


    },
function (error) {
    if (error.status === 400)
        alert(error.data.Message);
    else
        alert("Network issue");
});


    $scope.params={        
        start_date : $scope.start_date,
        whom_to_send: $scope.whom_to_send,
        status: $scope.status
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.selectcheckbox = function ()
    {
        if ($scope.showcontent == true) {
            $scope.params.whom_to_send = "NewpeopleAdded";
        }
        else {
            $scope.params.whom_to_send = "ALL";
        }
    }
    if ($scope.params.whom_to_send == undefined)
    {
        $scope.params.whom_to_send = "NewpeopleAdded";
    }
    
    $scope.launchCampaign = function ()
    {
        
        var postData = {
            id: $cookieStore.get('campaign_ID'),
            user_id:$cookieStore.get('userId'),
            organization_id: $cookieStore.get('orgID'),
            start_date : $scope.params.start_date,
            whom_to_send: $scope.params.whom_to_send,
            
        }
    apiService.post("CampaignEvent/Edit", postData).then(function (response) {
        var loginSession = response.data;
        $scope.cancel();
        $scope.openSucessfullPopup();
        $modalInstance.dismiss();
        $rootScope.$broadcast('REFRESH', 'projectGrid');
        },
          function (error) {
              if (error.status === 400)
                  alert(error.data.Message);
              else
                  alert("Network issue");

          });
    }
   
    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'sm',
            resolve: { items: { title: "Email Relaunced" } }
        });
    }
}
