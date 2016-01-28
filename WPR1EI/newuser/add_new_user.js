
var UserPopUpController = function ($scope, $state, $modalInstance, COUNTRIES, $cookieStore, apiService, $modal,$rootScope) {
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
        $scope.sucess = function (opendonePopup) {
            $state.go('newuser.invite');
        }
        $scope.newuse = function () {
            var schemeupdate = [];
            email = $scope.params.account_email;
            var emails = email.split(",");
            for (i = 0; i < emails.length; i++) {
                var userscheme = {};
                userscheme.first_name = $scope.first_name,
                userscheme.last_name = $scope.last_name,
                userscheme.account_email = emails[i],
                userscheme.product_type = 'dwellar',
                userscheme.organization_id = $scope.Organization,

                schemeupdate.push(userscheme);
            }
            Url = "Register/InviteUser";
            apiService.post(Url, schemeupdate).then(function (response) {
                var loginSession = response.data;
                $scope.opendonePopup();
                $modalInstance.dismiss();
                $rootScope.$broadcast('REFRESH', 'mainGridOptions');
            },
       function (error) {
           alert("User Already Exists ");

       });
        }

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
       function (error)
       {
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

        $scope.reset = function () {
            $scope.params = {};
        }

        // Add New User
        $scope.addNewUser = function(isValid) {
            $scope.showValid = true;            
            if (isValid) {                
                new UserInvite($scope.params).then(function (response) {
                    console.log(response);

                   
                    $rootScope.$broadcast('REFRESH', 'userGrid');
                  
                }, function (error)
                {
                    if (error.status === 400)
                        alert(error.data.Message);
                    else
                        alert("Network issue");
                });
              
                //$scope.existingEmail("Himangshumaity@gmail.com");
            }
        };

        $scope.opendonePopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/invite.tpl.html',
                backdrop: 'static',
                controller: InviteController,
                size: 'md',


            });
        };

    }
