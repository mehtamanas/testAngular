var InviteController = function ($scope, $state, $cookieStore, apiService, $modalInstance) {
    console.log('InviteController');

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }

    AuditCreate($scope.params);

    //end


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
        alert(param.name);
        apiService.post(projectUrl, param).then(function (response) {
            var loginSession = response.data;
            alert("Team Created..!!");
            $modalInstance.dismiss();
        },
   function (error) {
       alert("Error " + error.state);
   });
    };


    $scope.orgList = ['ABC Real Estate Ltd'];

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
    $scope.user = function () {
        $modalInstance.dismiss();
        $state.go('newuser');

    }
};