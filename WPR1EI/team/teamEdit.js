
var TeamEditPopUpController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal, $rootScope, $window) {
    console.log('TeamEditPopUpController');

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

    //Audit log start               

    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
          // device_mac_id: "34:#$::43:434:34:45",
           module_id: "Contact",
           action_id: "Contact View",
           details: "AddNewUser",
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
       AuditCreate();

    //end

    var id = $scope.seletedCustomerId;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    projectUrl = "Team/GetbyID/" + id;

    apiService.getWithoutCaching(projectUrl).then(function (response) {
        $scope.params = response.data[0];

    },
function (error) {
  
}
    );

    $scope.params = {

        name: $scope.name,
        description: $scope.description,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),

    };

    $scope.save = function () {
        var postData =
               {
                   id: $scope.seletedCustomerId,
                   name: $scope.params.name,
                   description: $scope.params.description,
                   organization_id: $cookieStore.get('orgID'),
                   user_id: $cookieStore.get('userId'),
               };

        apiService.post("team/Edit", postData).then(function (response) {
            var loginSession = response.data;
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();


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
            size: 'md',
            resolve: { items: { title: "Edit" } }
        });

        $rootScope.$broadcast('REFRESH', 'team');
    }

    $scope.editTeam = function (isValid) {
        $scope.showValid = true;
        if (isValid) {


            $scope.save();
            $scope.showValid = false;

        }


    }


};




