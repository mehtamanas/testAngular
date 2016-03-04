angular.module('app.guest.login')
    .config( function ($stateProvider) {
        $stateProvider
            .state('resourcepermission', {
                url: '/ResourcePermission',
                templateUrl: 'login/rpermission.tpl.html',
                controller: 'ResourcePermissionController',
                title: 'ResourcePermission'
            });

    })
    .controller('ResourcePermissionController',
    function ($scope, $state, security, $cookieStore, apiService) {

        var orgID = $cookieStore.get('orgID');
   //     var resource_id = $cookieStore.get('resource_id');
      //  var role_id = $cookieStore.get('role_id');

        Url = "Role/Get/442aa5f4-4298-4740-9e43-36ee021df1e7";

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
       

        $scope.addresource = function () {
            var postData = [];
            for (var j in $scope.resources) {
                var newUnit = {};
                newUnit.role_id = $scope.name1,
                newUnit.resource_id = $scope.resources[j].resource_id;
                newUnit.read = $scope.resources[j].read;
                newUnit.write = $scope.resources[j].write;
                newUnit.delete = $scope.resources[j].delete;
                newUnit.user_id = $cookieStore.get('userId');
                newUnit.organization_id = $cookieStore.get('orgID');
                postData.push(newUnit);
            }

            apiService.post("Permission/CreateRolePermission", postData).then(function (response) {
                var loginSession = response.data;
                alert("DONE");
            },
               function (error) {

               });
         
         
        }//roll_id=b5610bec-6e15-4aa6-9655-88cf98678d93&&user_id=d0a2389d-af19-47c3-9f93-7a2c9145f41c

        $scope.selectrole = function () {
            $scope.params.resource_feature = $scope.name1;
            Url = "Resource/GetResource/" + $scope.params.resource_feature + "/"+ $cookieStore.get('userId');

            apiService.get(Url).then(function (response) {
                $scope.resources = response.data;
               // $scope.$apply();
            },

        function (error) {
            console.log("Error " + error.state);
        });

        };

        $scope.params = {

            resource_feature: $scope.resource_feature
        };
    });
