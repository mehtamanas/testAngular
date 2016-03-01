

var OptionPopUpController = function ($scope, $state, $cookieStore, apiService, $rootScope, $modalInstance, $modal) {
    console.log('OptionPopUpController');

    //Audit log start               

   
    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
           module_id: "User",
           action_id: "User View",
           details: $scope.params.city + "role assigned",
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
     
   });
    };
    //end

            $scope.params = {
                name: $scope.name,
                project_id: $scope.Select_Project,
                address: $scope.address,
                city: $scope.city,
                state: $scope.state,
                country: "India",
                organization_id: $cookieStore.get('orgID'),
                userid: $cookieStore.get('userId')

            };

            Url = "project/Get/" + $cookieStore.get('orgID');
            apiService.get(Url).then(function (response) {
                $scope.projects = response.data;

            },
                function (error) {
                   
                });

        projectUrl = "PropertyListing/CreateProperty";
        ProjectCreate = function (param) {
            apiService.post(projectUrl, param).then(function (response) {
                var loginSession = response.data;
                $modalInstance.dismiss();
            },
               function (error) {
                
               });
        };

        Url = "GetCSC/city";
        apiService.get(Url).then(function (response) {
            $scope.cities = response.data;
        },
        function (error) {
           
        });

        if ($cookieStore.get('Selected Text') == "ASSIGN TO PROJECT") {

            Url = "Project/Get/" + $cookieStore.get('orgID');
        
        }
        else if ($cookieStore.get('Selected Text') == "ASSIGN ROLES") {
            Url = "Role/Get/442aa5f4-4298-4740-9e43-36ee021df1e7";

        }
        else if ($cookieStore.get('Selected Text') == "ADD TO TEAM") {
            Url = "Team/Get/" + $cookieStore.get('orgID');
        }
        apiService.get(Url).then(function (response) {
            $scope.states = response.data;
        },
        function (error)
        {
           
        });

        $scope.selectproject = function () {
            $scope.params.project_id = $scope.project1;       
        };

        $scope.selectstate = function () {
            $scope.params.state = $scope.state1;
        };

        $scope.selectcity = function () {
            $scope.params.city = $scope.city1;
        };

        $scope.orgList = ['ABC Real Estate Ltd'];
        $scope.addNew = function () {
            $scope.checkedIds = null;
            $scope.checkedIds = $cookieStore.get('checkedIds');
            var usersToBeAddedOnServer = [];

            var Url;
            if ($cookieStore.get('Selected Text') == "ASSIGN TO PROJECT") {
                for (var i in $scope.checkedIds) {
                    var newMember = {};
                    newMember.project_id = $scope.params.city;
                    newMember.mapping_id = $scope.checkedIds[i];
                    newMember.user_id = $cookieStore.get('userId');
                    newMember.organization_id = $cookieStore.get('orgID');
                    newMember.isteam = "0";
                    usersToBeAddedOnServer.push(newMember);
                }
            
                Url = "Mapping/UserToProject";          
            }
            else if ($cookieStore.get('Selected Text') == "ASSIGN ROLES") {
                for (var i in $scope.checkedIds) {
                    var newMember = {};
                    newMember.role_user_id = $scope.checkedIds[i];
                    newMember.role_id = $scope.params.city;
                    newMember.user_id = $cookieStore.get('userId');
                    newMember.organization_id = $cookieStore.get('orgID');
                    usersToBeAddedOnServer.push(newMember);
                }
                Url = "Mapping/UserToRole";
            }
                else if ($cookieStore.get('Selected Text') == "ADD TO TEAM") {
                    // Add the new users
                    for (var i in $scope.checkedIds) {
                        var newMember = {};
                        newMember.team_user_id = $scope.checkedIds[i];
                        newMember.team_id =  $scope.params.city;
                        newMember.user_id = $cookieStore.get('userId');
                        newMember.organization_id = $cookieStore.get('orgID');
                        usersToBeAddedOnServer.push(newMember);
                    }
                    Url = "Mapping/UserToTeam";
                }

            apiService.post(Url, usersToBeAddedOnServer).then(function (response) {
                var loginSession = response.data;
                AuditCreate();
                $modalInstance.dismiss();
                $scope.openSucessfullPopup();
                $rootScope.$broadcast('REFRESH', 'mainGridOptions');
            },
           function (error) {
               if (error.status === 400)
                   alert(error.data.Message);
               else
                   alert("Network issue");
           });
        }

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };

            $scope.reset = function () {
                $scope.params = {};
            }

            $scope.openSucessfullPopup = function () {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'newuser/sucessfull.tpl.html',
                    backdrop: 'static',
                    controller: sucessfullController,
                    size: 'md',
                    resolve: { items: { title: "Role" } }

                });
            }
        };