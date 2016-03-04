var declineController = function ($scope, $state, $cookieStore, apiService, $modal, $modalInstance) {
    console.log('declineController');

    //Audit log start
    $scope.params = {

        device_os: "windows10",
        device_type: "mobile",
        device_mac_id: "34:#$::43:434:34:45",
        module_id: "Addnew TEAM",
        action_id: "Addnew TEAM View",
        details: "Addnew TEAM detail",
        application: "angular",

        browser: $cookieStore.get('browser'),
        ip_address: $cookieStore.get('IP_Address'),
        location: $cookieStore.get('Location'),
        organization_id: $cookieStore.get('orgID'),
        User_ID: $cookieStore.get('userId')
    };


    AuditCreate = function (param) {

        apiService.post("AuditLog/Create", param).then(function (response) {
            var loginSession = response.data;

        },
   function (error) {

   });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }

    AuditCreate($scope.params);

    //end


    $scope.params = {
        status: "Decline",
        organization_id: $cookieStore.get('orgID')
    };

 

   
    projectUrl = "ChannelPartners/statusupdate";
    ProjectCreate = function (param) {
      //  alert(param.name);
        apiService.post(projectUrl, param).then(function (response) {
            var loginSession = response.data;
            //alert("partner Decline successfully..!!");
            $modalInstance.dismiss();
        },
   function (error) {
       console.log("Error " + error.state);
   });
    };




    $scope.orgList = ['ABC Real Estate Ltd'];

    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {


            new ProjectCreate($scope.params).then(function (response) {
                console.log(response);
                $scope.showValid = false;
                $state.go('guest.signup.thanks');
            }, function (error) {
                console.log(error);
            });

            $scope.showValid = false;

        }

    }

};