
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
