﻿/**
 * Created by dwellarkaruna on 24/10/15.
 */
var EditTaskUser = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal, $rootScope, $window, FileUploader) {
    console.log('EditTaskUser ');
    var userId = $cookieStore.get('userId');
    // var assigned_to_id = $cookieStore.get('assigned_to_id');
    $scope.selectedTaskID = window.sessionStorage.selectedTaskID;
    $scope.project1 = $scope.seletedCustomerId;

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
        var edit = $('#editEmailDescription').data("kendoEditor");
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


   


    contactUrl = "ToDoItem/EditGet/" + $scope.selectedTaskID;
    apiService.getWithoutCaching(contactUrl).then(function (response) {
        $scope.params = response.data[0];

        var remindTime = moment.duration(moment.utc(moment(response.data[0].due_date).diff(moment(response.data[0].reminder_time))).format("HH:mm:ss")).asMinutes();
        $scope.reminder_time1 = (_.findWhere($scope.reminders, { key_name: remindTime.toString() + ' minutes' })).id;
        $scope.due_date = moment(moment.utc(response.data[0].due_date).toDate()).format("DD/MM/YYYY HH:mm A");
        //  $scope.params.end_date = moment(moment.utc(response.data[0].end_date).toDate()).format("DD/MM/YYYY HH:mm A");
        if (response.data[0].remind_me === "1")
            $scope.remind_me = true;
        else
            $scope.remind_me = false;

        //$scope.remind_me = response.data[0].remind_me;
        $scope.priority1 = response.data[0].priority_id;
        $scope.project1 = response.data[0].project_id;
        $scope.contact1 = response.data[0].contact_id;
        $scope.event1 = response.data[0].task_type_id;
        $scope.user1 = response.data[0].assign_user_id;
        $scope.params.htmlcontent = response.data[0].text;
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
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }

    $scope.params = {
        project_id: $scope.project1,
        priority: $scope.priority1,
        name: $scope.params.name,
       // text: $scope.params.text,
        text: $scope.params.htmlcontent,
        due_date: $scope.params.due_date,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),
        contact_id: $scope.contact1,
        assign_user_id: $scope.user1,
        class_type: "User",
        reminder_time: $scope.params.reminder_time,
        task_type_id_: $scope.event1,
        time: $scope.params.time,
        id: $scope.selectedTaskID,
       
    };


    $scope.save = function () {
        var postData =
               {
                   project_id: $scope.project1,
                   priority: $scope.priority1,
                   name: $scope.params.name,
                   //text: $scope.params.text,
                   text:$scope.params.htmlcontent,
                   due_date: $scope.params.due_date,
                   organization_id: $cookieStore.get('orgID'),
                   user_id: $cookieStore.get('userId'),
                  // assigned_to_id: $scope.params.assigned_to_id,
                   assign_user_id: $scope.params.assign_user_id,
                   contact_id: $scope.params.contact_id,
                   class_type: "User",
                   reminder_time: $scope.params.reminder_time,
                   task_type_id_: $scope.event1,
                   time: $scope.params.time,
                   id: $scope.selectedTaskID,
                  
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

    $scope.completeFun = function () {
        console.log($scope.rate);
        var postData1 = {
            user_id: $cookieStore.get('userId'),
            organization_id: $cookieStore.get('orgID'),
            id: $scope.selectedTaskID,
        }
        apiService.post("ToDoItem/EditStatus", postData1).then(function (response) {
            var loginSession = response.data;
            $modalInstance.dismiss();
            $scope.openSucessfullyPopup();
            $rootScope.$broadcast('REFRESH', 'TaskGrid');
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

    //$scope.selectReminderTime = function () {
    //    $scope.params.reminder_time = $scope.reminder_time1;
    //    $scope.reminderTime = (_.findWhere($scope.reminders, { id: $scope.reminder_time1 })).time_in_minutes;

    //};

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

    $scope.selectcontact = function ()
    {
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

    $scope.openSucessfullyPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'login/successfully.html',
            backdrop: 'static',
            controller: sucessfullyController,
            size: 'sm',
            resolve: { items: { title: "Task Completed" } }
        });
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

    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {
            if ($scope.remind_me === true) {
                remind_me = "1";
                //$scope.params.reminder_datetime = (($scope.reminder_time).replace('min', '')).trim();
                //$scope.params.reminder_datetime = moment($scope.due_date, 'DD/MM/YYYY HH:mm:ss').subtract($scope.params.reminder_datetime, 'minutes')._d;
                //$scope.due_date = moment($scope.due_date, 'DD/MM/YYYY HH:mm:ss')._d;

                //$scope.params.reminder_datetime = (($scope.reminder_time).replace('min', '')).trim();
                $scope.params.reminder_datetime = moment($scope.due_date, "DD/MM/YYYY hh:mm A").subtract($scope.params.reminder_datetime, 'minutes')._d;
                var dDate = moment($scope.due_date, "DD/MM/YYYY hh:mm A")._d;
            }
            else remind_me = "0";
            $scope.showValid = false;
            $scope.params = {
                name: $scope.params.name,
                assigned_to_id: $scope.contact1,
                contact_id: $scope.contact1,

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


};




