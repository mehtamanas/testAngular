/**
 * Created by dwellarkaruna on 24/10/15.
 */
var AddAgentPopUpController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal, $rootScope, $window) {
    console.log('AddAgentPopUpController');

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

    //Audit log start
    $scope.params = {

        device_os: "windows10",
        device_type: "mobile",
        module_id: "Add New Tag",
        action_id: "Add New Tag View",
        details: "tag aadded",
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
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");

   });
    };
    AuditCreate($scope.params);

    //end
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    //$scope.save = function () {
    //    var postData = {
    //        user_id: $cookieStore.get('userId'),
    //        organization_id: $cookieStore.get('orgID'),
    //        name: $scope.params.name,
    //        phone_no: $scope.params.phone_no,
    //        email: $scope.params.email,
    //    };

    //    apiService.post("Broker/CreateAgent", postData).then(function (response) {
    //        var loginSession = response.data;
    //        $scope.openSucessfullPopup();
    //        $modalInstance.dismiss();
    //        $rootScope.$broadcast('REFRESH', 'agentGrid');

    //    },

    // function (error) {

    // });
    //}

    projectUrl = "Broker/CreateAgent";
    ProjectCreate = function (param) {

        apiService.post(projectUrl, param).then(function (response) {
            var loginSession = response.data;
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();
            $rootScope.$broadcast('REFRESH', 'agentGrid');
        },
    function (error) {
        if (error.status === 400) {  //alert(error.data.Message);
            $scope.errorMessage = error.data.Message;
        }
        else
            alert("Network issue");
    })
    };


    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'sm',
            resolve: { items: { title: "Agent" } }
        });


    }


    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {

            $scope.params = {
                name: $scope.params.name,
                phone_no: $scope.params.phone_no,
                email: $scope.params.email,
                organization_id: $cookieStore.get('orgID'),
                user_id: $cookieStore.get('userId'),               
            };

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




