
var UserPopUpController = function ($scope, $state, $modalInstance, COUNTRIES, $cookieStore, apiService, $modal) {
    console.info("UserPopUpController");
        
        $scope.countryList = COUNTRIES;
        $scope.jobTitleList = ['Sr.Manager', 'Sr.Leader'];
        $scope.departmentList = ['Sales', 'CEO'];
        $scope.cityList = ['Kolkata'];
        $scope.stateList = ['West Bengal'];
        $scope.Organization = $cookieStore.get('orgID');
         
        $scope.params = {
            first_name: $scope.first_name,
            last_name: $scope.last_name,
            account_email: $scope.account_email,
            product_type:'dwellar',
            organization_id: $scope.Organization
        };
        $scope.sucess = function (openSucessfullPopup) {
            $state.go('newuser.sucessfull');
        }
        Url = "Register/InviteUser";
        UserInvite = function (param) {          
            apiService.post(Url, param).then(function (response) {
                var loginSession = response.data;
               
                //alert("User Invited..!!");
                $modalInstance.dismiss();
            },
       function (error) {
           alert("Error " + error.state);
         
       });
        };



    //Audit log start															
        $scope.params =
            {
                device_os: $cookieStore.get('Device_os'),
                device_type: $cookieStore.get('Device'),
                device_mac_id: "34:#$::43:434:34:45",
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

        AuditCreate = function (param) {
            apiService.post("AuditLog/Create", param).then(function (response) {
                var loginSession = response.data;
            },
       function (error) {

       });
        };
        AuditCreate($scope.params);

    //end
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.reset = function () {
            $scope.params = {};
        }

        // Add New User
        $scope.addNewUser = function(isValid) {
            $scope.showValid = true;            
            if (isValid) {                
                new UserInvite($scope.params).then(function (response) {
                    console.log(response);

                    $scope.openSucessfullPopup();
                    $modalInstance.dismiss();
                  
                }, function (error) {
                    console.log(error);
                });
              
                //$scope.existingEmail("Himangshumaity@gmail.com");
            }
        };

    // Existing email
    //popup sucessfull user invited
        $scope.openSucessfullPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/sucessfull.tpl.html',
                backdrop: 'static',
                controller: sucessfullController,
                size: 'md'
            });
        };
        
    }
