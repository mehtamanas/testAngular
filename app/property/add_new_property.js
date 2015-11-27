var PropertyPopUpController = function ($scope, $state, $cookieStore, apiService, $modalInstance) {
    console.log('PropertyPopUpController');

    //Audit log start
    $scope.params = {

        device_os: "windows10",
        device_type: "mobile",
        device_mac_id: "34:#$::43:434:34:45",
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
    AuditCreate($scope.params);

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
                    deferred.reject(error);
                    alert("not working");
                });
    //alert("hii pop");
    projectUrl = "PropertyListing/CreateProperty";
    ProjectCreate = function (param) {
        //alert(param.name);
        //alert(param.address);
        //alert(param.city);
        //alert(param.state);
        apiService.post(projectUrl, param).then(function (response) {
            var loginSession = response.data;
            alert("Property Created..!!");
            $modalInstance.dismiss();


            //alert(param.name);


        },
   function (error) {
       alert("Error " + error.state);
   });
    };

    Url = "GetCSC/city";

    apiService.get(Url).then(function (response) {
        $scope.cities = response.data;

    },
function (error) {
    alert("Error " + error.state);
});

    Url = "GetCSC/state";

    apiService.get(Url).then(function (response) {
        $scope.states = response.data;

    },
function (error) {
    alert("Error " + error.state);
});

    $scope.selectproject = function () {
        $scope.params.project_id = $scope.project1;
        //alert($scope.project_id);
    };

    $scope.selectstate = function () {
        $scope.params.state = $scope.state1;
        //alert($scope.state);
    };
   

    $scope.selectcity = function () {
        $scope.params.city = $scope.city1;
        //alert($scope.city);
    };

     
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }

    $scope.orgList = ['ABC Real Estate Ltd'];

    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {

            //alert("hi");
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