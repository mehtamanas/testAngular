
var AddNewNotes = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal, $rootScope, $window) {
    console.log('AddNewNotes');
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

    $scope.contact1 = $scope.seletedCustomerId;
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

    //API functionality start
    $scope.params = {
        project_id: $scope.project1,
        text: $scope.text,
        class_id:$scope.contact1,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),
        class_type: "Person",
        
    };

    projectUrl = "/Notes/Create";
    ProjectCreate = function (param) {
      
        apiService.post(projectUrl, param).then(function (response) {
            var loginSession = response.data;
            $scope.openSucessfullPopup();
            $modalInstance.dismiss();
        },
    function (error) {
        alert("Error " + error.state);
    })
    };

    //end
    //popup functionality start
    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'md'
        });
    }

    //end

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

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




