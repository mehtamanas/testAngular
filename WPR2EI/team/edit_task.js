/**
 * Created by dwellarkaruna on 24/10/15.
 */
var EditTaskTeam = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal, $rootScope, $window) {
    console.log('EditTaskTeam');
    // var assigned_to_id = $cookieStore.get('assigned_to_id');


    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

    contactUrl = "ToDoItem/EditGet/" + $scope.seletedCustomerId;
    apiService.getWithoutCaching(contactUrl).then(function (response) {
        $scope.params = response.data[0];
        $scope.realyesno = response.data[0].remind_me;
        $scope.priority1 = response.data[0].priority_id;
        $scope.project1 = response.data[0].project_id;
        $scope.contact1 = response.data[0].contact_id;
        $scope.event1 = response.data[0].task_type_id;
    },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    }
  );

   // //Audit log start
   // $scope.params = {

   //     device_os: "windows10",
   //     device_type: "mobile",
   //     device_mac_id: "34:#$::43:434:34:45",
   //     module_id: "Addnew TEAM",
   //     action_id: "Addnew TEAM View",
   //     details: "Addnew TEAM detail",
   //     application: "angular",

   //     browser: $cookieStore.get('browser'),
   //     ip_address: $cookieStore.get('IP_Address'),
   //     location: $cookieStore.get('Location'),
   //     organization_id: $cookieStore.get('orgID'),
   //     User_ID: $cookieStore.get('userId')
   // };


   // AuditCreate = function (param) {

   //     apiService.post("AuditLog/Create", param).then(function (response) {
   //         var loginSession = response.data;

   //     },
   //function (error) {

   //});
   // };
    //AuditCreate($scope.params);

    //end
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }

    $scope.params = {
        team_id: window.sessionStorage.selectedCustomerID,
       // description: $scope.description,
        priority: $scope.priority1,
        name: $scope.name,
        text: $scope.text,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),
        assigned_to_id: $scope.contact1,
        project_id: $scope.project1,
        class_type: "Team",
        remind_me: $scope.remind_me,
        task_type_id: $scope.event1,
        start_date_time: $scope.start_date_time,
        id: $scope.seletedCustomerId,
    };
 
    $scope.save = function () {
        var postData =
               {
                   project_id: $scope.project1,
                 //description: $scope.params.description,
                   priority: $scope.priority1,
                   name: $scope.params.name,
                   text: $scope.params.text,
                   organization_id: $cookieStore.get('orgID'),
                   user_id: $cookieStore.get('userId'),
                   assigned_to_id: $scope.contact1,
                   class_type: "Team",
                   remind_me: $scope.realyesno,
                   task_type_id_: $scope.event1,
                   time: $scope.params.time,
                   id: $scope.seletedCustomerId,
               };

        apiService.post("ToDoItem/EditTaskWithNotes", postData).then(function (response) {
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
        });
    }


    Url = "ToDoItem/GetPriority";
    apiService.get(Url).then(function (response) {
        $scope.priority = response.data;
    },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });

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
        $scope.params.assigned_to_id = $scope.contact1;
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
            size: 'lg',
            resolve: { items: { title: "Edit" } }
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
            new save(postData).then(function (response) {
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




