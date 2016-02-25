/**
 * Created by dwellarkaruna on 24/10/15.
 */
var AddNewNotesController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal, $rootScope, $window) {
    console.log('AddNewNotesController');
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

    $scope.contact1 = $scope.seletedCustomerId;
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
    AuditCreate($scope.params);

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

    $scope.reset = function () {
        $scope.params = {};
    }

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




