
var TeamPopUpController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal, $rootScope) {
    console.log('TeamPopUpController');
    //Audit log start               

    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
          // device_mac_id: "34:#$::43:434:34:45",
           module_id: "Contact",
           action_id: "Contact View",
           details: $scope.params.name + "AddNewTeam",
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
   

    //end

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'md',
            resolve: { items: { title: "Team" } }
        });
    }

            $scope.params = {
                name: $scope.name,
                description: $scope.Description,
                organization_id: $cookieStore.get('orgID'),
                User_ID: $cookieStore.get('userId')
            };

            var emp = {
                id: $cookieStore.get('teamid'),
                name: $scope.name,
                description: $scope.Description,
                organization_id: $cookieStore.get('orgID'),
                User_ID: $cookieStore.get('userId')
            };

            if ($cookieStore.get('teamid') !== '') {
                apiService.get('Team/GetbyID/' + $cookieStore.get('teamid')).then(function (response) {
                    $scope.data = response.data;
                    angular.forEach($scope.data, function (value, key) {
                        $scope.params.name = value.name;
                        $scope.params.description = value.description;
                    });
                },
                        function (error) {
                            deferred.reject(error);
                            alert("not working");
                        });
            }

            
                projectUrl = "Team/Create";
                ProjectCreate = function (param) {
                   
                    apiService.post(projectUrl, param).then(function (response) {
                        var loginSession = response.data;
                        $scope.openSucessfullPopup();
                        $modalInstance.dismiss();
                        AuditCreate();
                        $rootScope.$broadcast('REFRESH', 'teamGrid');
                    },
               function (error) {
                   alert("Error " + error.state);
               });
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