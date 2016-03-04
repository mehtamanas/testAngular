var acceptController = function ($scope, $state, $cookieStore, apiService, $modal, $modalInstance, $window) {
    console.log('acceptController');

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

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
       
        status: "Approved",
        id:window.sessionStorage.selectedCustomerID
        //User_ID: $cookieStore.get('userId')
    };
   // alert(window.sessionStorage.selectedCustomerID);
   

    //if ($cookieStore.get('teamid') !== '') {
    //    apiService.get('Team/GetbyID/' + $cookieStore.get('teamid')).then(function (response) {
    //        $scope.data = response.data;
    //        angular.forEach($scope.data, function (value, key) {
    //            $scope.params.status = value.status;
              
    //        });
    //    },
    //            function (error) {
    //                deferred.reject(error);
    //                alert("not working");
    //            });
    //}


    projectUrl = "ChannelPartners/statusupdate";
    ProjectCreate = function (param) {
     //   alert(param.name);
        apiService.post(projectUrl, param).then(function (response) {
            var loginSession = response.data;
            //alert("partner Accept successfully..!!");
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();
        },
   function (error) {
       //alert("Error " + error.state);
   });
    };

    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'md'
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