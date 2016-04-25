angular.module('task')

.controller('AddTaskController', function ($scope, $state, $cookieStore, apiService, FileUploader, uploadService, $modal, $rootScope) {
    console.log('AddTaskController');
    $scope.loadingDemo = false;
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    //var day = moment().format();
    var userId = $cookieStore.get('userId');
    //$scope.reminder_time = "15";
    $scope.due_date = moment().add(1, 'days').format('DD/MM/YYYY hh:mm A');
    $scope.activityName = $state.params.activityName == null ? null : $state.params.activityName;
    if ($scope.activityName != null) {
        $scope.task = $cookieStore.get('task');
        $scope.Name = $cookieStore.get('advncActivityName');
        if ($scope.Name != undefined)
        { $scope.name = $scope.Name; }
        else
        {
            $scope.name = $scope.task.name;
        }
        $scope.contact_id = $scope.task.contact_id;
        $scope.class_type = $scope.task.class_type;
        $scope.due_date = $scope.task.due_date;
        $scope.priority1 = $scope.task.priority;
        $scope.project1 = $scope.task.project_id;
        $scope.organization_id = $scope.task.organization_id;
        $scope.user1 = $scope.task.user_id;
        $scope.assign_user_id = $scope.task.assign_user_id;
        $scope.end_date_time = $scope.task.end_date_time;
        $scope.event1 = $scope.task.task_type_id;
        $scope.text = $scope.task.text;
        $scope.remind_me = $scope.task.remind_me;
        $scope.reminder_time = $scope.task.reminder_time;
    }
    var uploader = $scope.uploader = new FileUploader({
        url: apiService.uploadURL,
    });

    uploader.filters.push({
        name: 'attchementFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.name.slice(item.name.lastIndexOf('.') + 1) + '|';
            var im = '|jpg|png|jpeg|bmp|gif|xls|xlsx|pdf|csv|zip|txt|doc|docx|ppt|pptx|'.indexOf(type);
            if (im === -1) {

                alert('You have selected invalid file type');
            }
            if (item.size > 10485760) {

                alert('File size should be less than 10mb');
            }
            return '|jpg|png|jpeg|bmp|gif|xls|xlsx|pdf|csv|zip|txt|doc|docx|ppt|pptx|'.indexOf(type) !== -1 && item.size <= 10485760;
        }
    });

    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        loc = response[0].Location;
        var edit = $('#txt_addNewTask').data("kendoEditor");
        var fileType = response[0].ContentType.slice(response[0].ContentType.lastIndexOf('/') + 1);
        if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg' || fileType === 'bmp' || fileType === 'gif')
            edit.exec('inserthtml', { value: "<img alt=''  src='" + loc + "' />" });
        else {
            edit.exec('inserthtml', { value: "<a href='" + loc + "' >" + loc + "</a>" });
        }

    };

    uploader.onAfterAddingFile = function (fileItem, response, status, headers) {
        uploader.uploadAll();
    }

    $scope.editorOption = {
        messages: {
            insertHtml: "Insert Variable"
        },
        tools: ["bold",
                "italic",
                "underline",
                "strikethrough",
                "justifyLeft",
                "justifyCenter",
                "justifyRight",
                "justifyFull",
                "insertUnorderedList",
                "insertOrderedList",
                "indent",
                "outdent",
                "createLink",
                'pdf',
                "unlink",
                "fontName",
                "fontSize",
                "foreColor",
                "backColor",
                "print",
                'createTable',
                {
                    name: "myTool",
                    tooltip: "Insert Image",
                    exec: function (e) {
                        $('#imageBrowser').trigger("click");
                    }
                },
                  {
                      name: "insertHtml",
                      items: [
                          { text: "Last Name", value: "{{last_name}}" },
                          { text: "First Name", value: "{{first_name}}" },
                          { text: "My First Name", value: "{{my_first_name}}" },
                          { text: "My Last Name", value: "{{my_last_name}}" },
                          { text: "Salutation", value: "{{salutation}}" },
                           { text: "Brochure Url", value: "<a href='{{brochure_url}}'>{{brochure_url}}</a>" },

                      ]
                  },
                  "viewHtml",
        ],
    }

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

    //API functionality start
    $scope.params = {
        name: $scope.name,
        contact_id: $scope.contact1,
        class_type: "Contact",
        due_date: $scope.due_date,
        priority: $scope.priority1,
        project_id: $scope.project1,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),
        assign_user_id: $scope.user1,
        end_date_time: $scope.end_date_time,
        task_type_id: $scope.event1,
        //text: $scope.text,
        text: $scope.htmlcontent,
        remind_me: $scope.remind_me,
        reminder_time: $scope.reminder_time,
    };

    projectUrl = "ToDoItem/CreateTask";
    ProjectCreate = function (param) {

        $scope.params.remind_me = $scope.remind_me;
       
        apiService.post(projectUrl, param).then(function (response) {
            var loginSession = response.data;
            alert("Your Task Code is " + loginSession.task_code);            
            $scope.openSucessfullPopup();
            $rootScope.$broadcast('REFRESH', { name: 'outTaskGrid', data: null, action: 'add' });
            $state.go('app.tasks');
        },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    })
    };


    Url = "ToDoItem/GetReminderTime"
    apiService.get(Url).then(function (response) {
        $scope.reminders = response.data;
    },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });

    $scope.selectReminderTime = function () {
        $scope.params.reminder_time = $scope.reminder_time1;
        $scope.reminderTime = (_.findWhere($scope.reminders, { id: $scope.reminder_time1 })).time_in_minutes;

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

    //$scope.priority1 = "be8072b1-6992-466d-a34b-2fc9d31994a6";
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
        $scope.loadingDemo = false;
        $scope.contact1 = $scope.seletedCustomerId;
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



    //end
    //popup functionality start
    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'sm',
            resolve: { items: { title: "Task" } }
        });
    }

    //end

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }

    $scope.addNew = function (isValid) {
       
        $scope.showValid = true;
        if (isValid) {
            $scope.loadingDemo = true;
            if ($scope.remind_me === true)
                remind_me = "1";
            else
                remind_me = "0";

            $scope.params.reminder_datetime = moment($scope.due_date, "DD/MM/YYYY hh:mm A").subtract($scope.reminderTime, 'minutes')._d;
            var dDate = moment($scope.due_date, "DD/MM/YYYY hh:mm A")._d;


            $scope.params = {
                name: $scope.name,
                start_date_time: new Date().toISOString(),
                contact_id: $scope.contact1,
                class_type: "Contact",
                due_date: new Date(dDate).toISOString(),
                priority: $scope.priority1,
                project_id: $scope.project1,
                organization_id: $cookieStore.get('orgID'),
                user_id: $cookieStore.get('userId'),
                assign_user_id: $scope.user1,
                task_type_id: $scope.event1,
                //text: $scope.text,
                text: $scope.params.htmlcontent,
                remind_me: remind_me,
                reminder_timespan_id: $scope.reminder_time1,
                reminder_time: new Date($scope.params.reminder_datetime).toISOString(),
            };
            $cookieStore.put('task', $scope.params);
            new ProjectCreate($scope.params).then(function (response) {
                console.log(response);
                $scope.showValid = false;
                $scope.isDisabled = false;
                $state.go('guest.signup.thanks');
            }, function (error) {
                console.log(error);
            });

            $scope.showValid = false;

        }

    }

});




   