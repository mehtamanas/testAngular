angular.module('app.modules.team.add_new', [])

.config(function config($stateProvider) {
    $stateProvider.state('loggedIn.modules.team.add_new', {
        url: '/add-new',
        views: {
            'main-content@loggedIn.modules': {
                templateUrl: 'app/modules/team/add_new/add_new.tpl.html',
                controller: 'teamAddNewController'
            }
        },
        data: { pageTitle: 'Add New Team' }
    });
})

.controller('teamAddNewController',
    function ($scope, $state, $cookieStore,apiService) {
        console.log('teamAddNewController');

        $scope.params = {
            name:$scope.name,            
            description: $scope.Description,
            organization_id:$cookieStore.get('orgID'),
            User_ID: $cookieStore.get('userId')
        };

        var emp = {
            id:$cookieStore.get('teamid'),
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
       
        if ($cookieStore.get('teamid') === '') {
            projectUrl = "Team/Create";
            ProjectCreate = function (param) {
                apiService.post(projectUrl, param).then(function (response) {
                    var loginSession = response.data;
                    alert("Team Created..!!");
                },
           function (error) {
               alert("Error " + error.state);
           });
            };
        }
        else
        {
            projectUrl = "Team/Edit";
            ProjectEdit = function (param) {               
                apiService.post(projectUrl, param).then(function (response) {
                    var loginSession = response.data;
                    alert("Team Updated..!!");
                },
           function (error) {
               alert("Error " + error.state);
           });
            };
        }

        $scope.orgList = ['ABC Real Estate Ltd'];

        $scope.addNew = function (isValid) {
            $scope.showValid = true;
            if (isValid) {
                if ($cookieStore.get('teamid') === '') {
                    new ProjectCreate($scope.params).then(function (response) {
                        console.log(response);
                        $scope.showValid = false;
                        $state.go('guest.signup.thanks');
                    }, function (error) {
                        console.log(error);
                    });
                }
                else
                {
                    emp.id = $cookieStore.get('teamid');
                    emp.name = $scope.params.name;
                    emp.description = $scope.params.description;
                    emp.organization_id = $cookieStore.get('orgID');
                    emp.User_ID = $cookieStore.get('userId');
                    new ProjectEdit(emp).then(function (response) {
                        console.log(response);
                        $scope.showValid = false;
                        $state.go('guest.signup.thanks');
                    }, function (error) {
                        console.log(error);
                    });

                }                
                $scope.showValid = false;
                console.log(isValid);
                if (isValid) {
                    $scope.showValid = false;
                } else {
                    $scope.showValid = true;
                }
            }
        };
    }
);