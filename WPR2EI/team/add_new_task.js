/**
 * Created by dwellarkaruna on 24/10/15.
 */
var AddNewTaskTeam = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal, $rootScope, $window) {
    console.log('AddNewTaskController');
    // var assigned_to_id = $cookieStore.get('assigned_to_id');


    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
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
    AuditCreate($scope.params);

    //end
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }

    $scope.params = {
        team_id: window.sessionStorage.selectedCustomerID,
        description: $scope.description,
        priority: $scope.priority1,
        summary: $scope.summary,
        text: $scope.text,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),
        assigned_to_id: $scope.contact1,
        project_id: $scope.project1,
        class_type: "Team",
        remind_me: $scope.remind_me,
        task_type_id: $scope.event1,
        start_date_time: $scope.start_date_time,
    };


    projectUrl = "ToDoItem/CreateTask";
    ProjectCreate = function (param) {
        $scope.params.remind_me = $scope.remind_me;
        apiService.post(projectUrl, param).then(function (response) {
            var loginSession = response.data;
            $scope.openSucessfullPopup();
            $modalInstance.dismiss();
        },
    function (error) {
        alert("Error " + error.state);
    })
    };


    Url = "ToDoItem/GetPriority" ;
    apiService.get(Url).then(function (response) {
        $scope.priority = response.data;
    },
   function (error) {
       alert("Error " + error.state);
   });

    $scope.selectpriority = function () {
        $scope.params.priority = $scope.priority1;
    };


    Url = "project/Get/" + $cookieStore.get('orgID');
    apiService.get(Url).then(function (response) {
        $scope.projects = response.data;
    },
   function (error) {
       alert("Error " + error.state);
   });

    $scope.selectproject = function () {
        $scope.params.project_id = $scope.project1;
    };


    Url = "Contact/GetContactByOrg/" + $cookieStore.get('orgID');
    apiService.get(Url).then(function (response) {
        $scope.contacts = response.data;
    },
   function (error) {
       alert("Error " + error.state);
   });

    $scope.selectcontact = function () {
        $scope.params.assigned_to_id = $scope.contact1;
    };

    Url = "TaskType/GetTaskType";
    apiService.get(Url).then(function (response) {
        $scope.events = response.data;
    },
function (error) {
    alert("Error " + error.event);
});

    $scope.selectevent = function () {
        $scope.params.task_type_id = $scope.event1;
    };


    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'lg'
        });


    }

    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {

            if ($scope.realyesno == 1) {

                $scope.remind_me = "1";
            }
            else {
                $scope.remind_me = "0";
            };
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




   