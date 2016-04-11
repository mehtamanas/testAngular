var AssignToController = function ($scope, $state, $cookieStore, apiService, $modalInstance, items) {
    console.log('AssignToController');

    $scope.title = items.title;
    //Audit log start
    $scope.params = {
        device_os: $cookieStore.get('Device_os'),
        device_type: $cookieStore.get('Device'),
        module_id: "Addnew Project",
        action_id: "Addnew Project View",
        details: "Addnew Project detail",
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

};