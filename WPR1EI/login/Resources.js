angular.module('app.guest.login')

     .config(function config($stateProvider) {
         $stateProvider
             .state('Resources', {
                 url: '/Resources',
                 templateUrl: 'login/Resources.tpl.html',
                 controller: 'ResourcesLimitController',
                 data: { pageTitle: 'Subscription Limit' }
             });
     })

.controller('ResourcesLimitController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $http) {

        var orgID = $cookieStore.get('orgID');
        var userId = $cookieStore.get('userId');
     
        $scope.params = {
           
           // resource_platform_id: "89d563ab-5486-4dba-a8a3-9c98c37ebf77",
            resource_feature: $scope.resource_feature,
            Heading: $scope.Heading,
            organization_id: $cookieStore.get('orgID'),
            user_id: $cookieStore.get('userId')
        };

        var emp = {
           
           
            //resource_platform_id: "89d563ab-5486-4dba-a8a3-9c98c37ebf77",
            resource_feature: $scope.resource_feature,
            Heading: $scope.Heading,
            organization_id: $cookieStore.get('orgID'),
            user_id: $cookieStore.get('userId')

        };

        
        ProjectCreate = function (param) {
            apiService.post("Resource/CreateResource", param).then(function (response) {
                var loginSession = response.data;
                alert("Resources Added..!!");
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
                   
                }, function (error) {
                    console.log(error);
                });


                $scope.showValid = false;

            }

        }

    });

