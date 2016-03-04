angular.module('app.guest.login')

     .config(function config($stateProvider) {
         $stateProvider
             .state('role', {
                 url: '/role',
                 templateUrl: 'login/role.tpl.html',
                 controller: 'roleController',
                 data: { pageTitle: 'Subscription Limit' }
             });
     })

.controller('roleController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $http) {

        var orgID = $cookieStore.get('orgID');
        var user_id = $cookieStore.get('userId');

        $scope.params = {


            name: $scope.name,
            description: $scope.description,
            organization_id: $cookieStore.get('orgID'),
            user_id: $cookieStore.get('userId')
        };

        var emp = {

            name: $scope.name,
            description: $scope.description,
            organization_id: $cookieStore.get('orgID'),
            user_id: $cookieStore.get('userId')

        };


        ProjectCreate = function (param) {
            apiService.post("Role/Create", param).then(function (response) {
                var loginSession = response.data;
                alert("Role Added..!!");
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

