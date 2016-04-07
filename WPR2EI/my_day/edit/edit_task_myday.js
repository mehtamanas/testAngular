angular.module('my_day')

 .controller('MyDayEditTask', function ($scope, $state, $cookieStore, apiService, $modal, $rootScope, $window, $stateParams) {
     console.log(' MyDayEditTask');
    var userId = $cookieStore.get('userId');
    // var assigned_to_id = $cookieStore.get('assigned_to_id');


    $scope.selectedTaskID = window.sessionStorage.selectedTaskID;
    $scope.selectedTaskID = $stateParams.id;
    $scope.project1 = $scope.seletedCustomerId;


    contactUrl = "ToDoItem/EditGet/" + $scope.selectedTaskID;
    apiService.getWithoutCaching(contactUrl).then(function (response) {
        $scope.params = response.data[0];

        remindTime = moment.duration(moment.utc(moment(response.data[0].due_date).diff(moment(response.data[0].reminder_time))).format("HH:mm:ss")).asMinutes();
        $scope.reminder_time = remindTime.toString();
        $scope.due_date = moment(moment.utc(response.data[0].due_date).toDate()).format("DD/MM/YYYY HH:mm A");
        //  $scope.params.end_date = moment(moment.utc(response.data[0].end_date).toDate()).format("DD/MM/YYYY HH:mm A");
        if (response.data[0].remind_me==="1")
            $scope.remind_me = true;
        else
            $scope.remind_me = false;
        $scope.priority1 = response.data[0].priority_id;
        $scope.project1 = response.data[0].project_id;
        $scope.contact1 = response.data[0].contact_id;
        $scope.event1 = response.data[0].task_type_id;
        $scope.user1 = response.data[0].assign_user_id;
        // $scope.reminder_time = response.data[0].reminder_time
    },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    }
  );

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
           $state.go('app.my_day');
        };

        $scope.reset = function () {
            $scope.params = {};
        }

        $scope.params = {
            project_id: $scope.project1,
            priority: $scope.priority1,
            name: $scope.params.name,
            text: $scope.params.text,
            due_date: $scope.params.due_date,
            organization_id: $cookieStore.get('orgID'),
            user_id: $cookieStore.get('userId'),
            assigned_to_id: $scope.contact1,
            class_type: "Contact",
            reminder_time: $scope.params.reminder_time,
            task_type_id_: $scope.event1,
            time: $scope.params.time,
            id: $scope.selectedTaskID,
        };


        $scope.save = function (postData) {
            apiService.post("ToDoItem/EditTaskWithNotes", postData).then(function (response) {
                var loginSession = response.data;
                //$modalInstance.dismiss();
                $scope.openSucessfullPopup();
                $state.go('app.my_day');
                $rootScope.$broadcast('REFRESH', 'taskTodayGrid');
                $rootScope.$broadcast('REFRESH', 'taskTomorrowGrid');
                $rootScope.$broadcast('REFRESH', 'taskNext7Grid');

            },
            function (error) {
                if (error.status === 400)
                    alert(error.data.Message);
                else
                    alert("Network issue");
            });
        }


        $scope.completeFun = function () {
            console.log($scope.rate);
            var postData1 = {
                user_id: $cookieStore.get('userId'),
                organization_id: $cookieStore.get('orgID'),            
                id:$scope.selectedTaskID,
            }
            apiService.post("ToDoItem/EditStatus", postData1).then(function (response) {
                var loginSession = response.data;
                //$modalInstance.dismiss();
                $state.go('app.my_day');
                $rootScope.$broadcast('REFRESH', 'taskTodayGrid');
                $rootScope.$broadcast('REFRESH', 'taskTomorrowGrid');
                $rootScope.$broadcast('REFRESH', 'taskNext7Grid');
            },
        function (error) {
            if (error.status === 400)
                alert(error.data.Message);
            else
                alert("Network issue");
        })
        };


        Url = "ToDoItem/GetPriority";
        apiService.get(Url).then(function (response) {
            $scope.priority = response.data;
        },
       function (error) {
          
       });

        $scope.selectpriority = function () {
            $scope.params.priority = $scope.priority1;
        };


        Url = "project/Get/" + $cookieStore.get('orgID');
        apiService.get(Url).then(function (response) {
            $scope.projects = response.data;
        },
       function (error) {
           
       });

        $scope.selectproject = function () {
            $scope.params.project_id = $scope.project1;

        };


        Url = "Contact/GetContactByOrg/" + $cookieStore.get('orgID');
        apiService.get(Url).then(function (response) {
            $scope.contacts = response.data;
        },
       function (error) {
           
       });

        $scope.selectcontact = function () {
            $scope.params.assigned_to_id = $scope.contact1;
        };


        Url = "TaskType/GetTaskType";
        apiService.get(Url).then(function (response) {
            $scope.events = response.data;
        },
        function (error) {
           
        });

        $scope.selectevent = function () {
            $scope.params.task_type_id = $scope.event1;
        };

        Url = "ToDoItem/TaskAssignTo/" + $cookieStore.get('orgID');
        apiService.get(Url).then(function (response) {
            $scope.users = response.data;
        },
       function (error) {
          
       });

        $scope.selectuser = function () {
            $scope.params.assign_user_id = $scope.user1;
        };


        $scope.addNew = function (isValid) {
            $scope.showValid = true;
            if (isValid) {
                if ($scope.remind_me === true) {
                    remind_me = "1";
                    //$scope.params.reminder_datetime = (($scope.reminder_time).replace('min', '')).trim();
                    //$scope.params.reminder_datetime = moment($scope.due_date, 'DD/MM/YYYY HH:mm:ss').subtract($scope.params.reminder_datetime, 'minutes')._d;
                    //$scope.due_date = moment($scope.due_date, 'DD/MM/YYYY HH:mm:ss')._d;

 			$scope.params.reminder_datetime = (($scope.reminder_time).replace('min', '')).trim();
                    $scope.params.reminder_datetime = moment($scope.due_date, "DD/MM/YYYY hh:mm A").subtract($scope.params.reminder_datetime, 'minutes')._d;
                    var dDate = moment($scope.due_date, "DD/MM/YYYY hh:mm A")._d;
                }
                else remind_me = "0";
                $scope.showValid = false;
                $scope.params = {
                    name: $scope.params.name,
                    assigned_to_id: $scope.contact1,
                    class_type: "Contact",
                    //due_date: $scope.due_date,
                    priority: $scope.priority1,
                    project_id: $scope.project1,
                    organization_id: $cookieStore.get('orgID'),
                    user_id: $cookieStore.get('userId'),
                    assign_user_id: $scope.user1,
                    task_type_id: $scope.event1,
                    text: $scope.params.text,
                    remind_me: remind_me,
                    //reminder_time: $scope.params.reminder_datetime,
 		    due_date: new Date(dDate).toISOString(),
 	            reminder_time: new Date($scope.params.reminder_datetime).toISOString(),
 	            id: $scope.selectedTaskID,
                };

                $scope.save($scope.params);

            }

        }

        $scope.openSucessfullPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/Edited.tpl.html',
                backdrop: 'static',
                controller: EditsucessfullController,
                size: 'sm',
                resolve: { items: { title: "Task" } }
            });


        }
    });




