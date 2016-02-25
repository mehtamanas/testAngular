﻿/**
 * Created by dwellarkaruna on 24/10/15.
 */
var AddNewTaskProject = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal, $rootScope, $window) {
    console.log('AddNewTaskProject');
    // var assigned_to_id = $cookieStore.get('assigned_to_id');
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    $scope.reminder_time = "15 min";
    //$scope.due_date = moment().format();
  
    $scope.project1 = $scope.seletedCustomerId;
    $scope.end_date_time;
    $scope.due_date;
    $scope.params = {}

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
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");

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

   


    projectUrl = "ToDoItem/CreateTask";
    ProjectCreate = function (param) {
        //if ($scope.realyesno == 1) {

        //    $scope.remind_me = "1";
        //}
        //else {
        //    $scope.remind_me = "0";
        //}

        //$scope.params.remind_me = $scope.remind_me;

      
        apiService.post(projectUrl, param).then(function (response) {
            var loginSession = response.data;
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();
            $rootScope.$broadcast('REFRESH', 'TaskGrid');
        },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    })
    };


    Url = "ToDoItem/GetPriority" ;
    apiService.get(Url).then(function (response) {
        $scope.priority = response.data;
    },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });
    $scope.priority1 = "be8072b1-6992-466d-a34b-2fc9d31994a6";
    $scope.selectpriority = function () {
        $scope.params.priority = $scope.priority1;
    };


    Url = "project/Get/" + $cookieStore.get('orgID');
    apiService.get(Url).then(function (response) {
        $scope.projects = response.data;
    },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });

    $scope.selectproject = function () {
        $scope.params.project_id = $scope.project1;
       
    };


    Url = "Contact/GetContactByOrg/" + $cookieStore.get('orgID');
    apiService.get(Url).then(function (response) {
        $scope.contacts = response.data;
    },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });

    $scope.selectcontact = function () {
        $scope.params.contact_id = $scope.contact1;
    };



    Url = "ToDoItem/TaskAssignTo/" + $cookieStore.get('orgID');
    apiService.get(Url).then(function (response) {
        $scope.users = response.data;
    },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });

    $scope.selectuser = function () {
        $scope.params.assign_user_id = $scope.user1;
    };



    Url = "TaskType/GetTaskType";
    apiService.get(Url).then(function (response) {
        $scope.events = response.data;
    },
function (error) {
    if (error.status === 400)
        alert(error.data.Message);
    else
        alert("Network issue");
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
            size: 'md',
            resolve: { items: { title: "Task" } }
        });


    }
   

    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {
            if ($scope.remind_me === true) {
                remind_me = "1";
                //$scope.params.reminder_datetime = (($scope.reminder_time).replace('min', '')).trim();
                //$scope.params.reminder_datetime = moment($scope.due_date, 'DD/MM/YYYY HH:mm:ss').subtract($scope.params.reminder_datetime, 'minutes')._d;
                //$scope.due_date = moment($scope.due_date, 'DD/MM/YYYY HH:mm:ss')._d;
                //$scope.params.reminder_datetime = moment($scope.params.reminder_datetime, "MM-DD-YYYY HH:");

               $scope.params.reminder_datetime = (($scope.reminder_time).replace('min', '')).trim();
                $scope.params.reminder_datetime = moment($scope.due_date, "DD/MM/YYYY hh:mm A").subtract($scope.params.reminder_datetime, 'minutes')._d;
                var dDate= moment($scope.due_date, "DD/MM/YYYY hh:mm A")._d;
            }
            else remind_me = "0";

        
            $scope.params = {
                name: $scope.name,
                start_date_time: new Date().toISOString(),
                contact_id: $scope.contact1,
                class_type: "Project",
                due_date: new Date(dDate).toISOString(),
                priority: $scope.priority1,
                project_id: $scope.project1,
                organization_id: $cookieStore.get('orgID'),
                user_id: $cookieStore.get('userId'),
                assign_user_id: $scope.user1, 
                task_type_id: $scope.event1,
                text: $scope.text,
                remind_me: remind_me,
                reminder_time: new Date($scope.params.reminder_datetime).toISOString(),

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




   