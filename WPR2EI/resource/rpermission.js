angular.module('resourcepermission')
    .controller('ResourcePermissionController',
    function ($scope, $state, security, $cookieStore, apiService) {

        var orgID = $cookieStore.get('orgID');
        var resource_id = $cookieStore.get('resource_id');
        var role_id = $cookieStore.get('role_id');
        Url = "Role/Get";

        apiService.get(Url).then(function (response) {
            $scope.roles = response.data;

        },
    function (error) {
        console.log("Error " + error.state);
    });


        $scope.selectrole = function () {
            $scope.params.name = $scope.name1;
           
        };
        $scope.params = {
            name: $scope.name,
            organization_id: $cookieStore.get('orgID')
            
        };
        Url = "Resource/GetResource";

        apiService.get(Url).then(function (response) {
            $scope.resources = response.data;
            $scope.isChecked = [];
            for (var a in $scope.resources) {
                if ($scope.resources[a].checkedd == "1") {
                    $scope.isChecked[a] = true;
                    $scope.checkedIds.push($scope.resources[a].id);
                }
            }

        },
        
    function (error) {
        console.log("Error " + error.state);
    });


        


        $scope.onClick = function (e) {

            var element = $(e.currentTarget);
            var checked = element.is(':checked');
            var fnd = 1;
            var id = $(e.target).data('id');
            for (k = 0; k < $scope.checkedIds.length; k++) {
                if ($scope.checkedIds[k] == id) {
                    fnd = 0;
                    break;
                }

            }
            if (fnd == 0) {
                $scope.checkedIds.splice(k, 1);

            }
            else {
                $scope.checkedIds.push(id);
            }
        } // Used For Clicking on the checkboxes

        $scope.toggleClass = function (id) {
            $scope.isChecked[id] = $scope.isChecked[id] == true ? false : true;
            $scope.$apply();
        }; // Used for toggle between the class

        $scope.addresource = function () {
            $cookieStore.put('checkedIds', $scope.checkedIds);
            $cookieStore.get('checkedIds');

            // Add the new users
            // alert(id);


            apiService.post("Permission/CreateRolePermission", usersToBeAddedOnServer).then(function (response) {
                var loginSession = response.data;

                //alert(" Done...");
                $modalInstance.dismiss();
                $scope.openSucessfullPopup();
            },


        function (error) {

        });
            attributes: {
                "class"; "UseHand"

            }
        }

        //Audit log start															
        $scope.params =
            {
                device_os: $cookieStore.get('Device_os'),
                device_type: $cookieStore.get('Device'),
                device_mac_id: "34:#$::43:434:34:45",
                module_id: "Contact",
                action_id: "Contact View",
                details: "ResourcePermissionView",
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

        $scope.selectrole = function () {
            $scope.params.resource_feature = $scope.name1;

        };
        $scope.params = {

            resource_feature: $scope.resource_feature
        };
    });
