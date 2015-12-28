/**
 * Created by dwellarkaruna on 24/10/15.
 */
var AddNewTaskController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal, $rootScope) {
    console.log('AddNewTaskController');
   // var assigned_to_id = $cookieStore.get('assigned_to_id');
    //Audit log start
    $scope.params = {

        device_os: "windows10",
        device_type: "mobile",
        device_mac_id: "34:#$::43:434:34:45",
        module_id: "Addnew TEAM",
        action_id: "Addnew TEAM View",
        details: "Addnew TEAM detail",
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


    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'md'
        });


    }

    $scope.priority = [{ id: 1, value: 'High' }, { id: 2, value: 'Medium' }, { id: 3, value: 'Low' }];

    $scope.params = {
        description: $scope.description,
        priority: $scope.priority,
        summary: $scope.summary,
        text: $scope.text,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),
        assigned_to_id: $scope.user1,
        contact_id: window.sessionStorage.selectedCustomerID,

    };

    var emp = {
        id: $cookieStore.get('teamid'),
        name: $scope.name,
        description: $scope.Description,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId')
    };


    projectUrl = "ToDoItem/CreateTask";
    ProjectCreate = function (param) {

        apiService.post(projectUrl, param).then(function (response) {
            var loginSession = response.data;
            $scope.openSucessfullPopup();
            $modalInstance.dismiss();
        },
    function (error) {
        alert("Error " + error.state);
    })
    };


    Url = "user/Get/" + $cookieStore.get('orgID');
    apiService.get(Url).then(function (response) {
        $scope.users = response.data;
    },
   function (error) {
       alert("Error " + error.state);
   });

    $scope.selectuser = function () {
        $scope.params.assigned_to_id = $scope.user1;
        //alert($scope.params.user_id);
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




   