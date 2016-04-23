/**
 * Created by dwellarkaruna on 24/10/15.
 */
var AddNewTaskProject = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal, $rootScope, $window, FileUploader) {
    console.log('AddNewTaskProject');
    // var assigned_to_id = $cookieStore.get('assigned_to_id');
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
   // $scope.reminder_time = "0";
    //$scope.due_date = moment().format();
  
    $scope.project1 = $scope.seletedCustomerId;
    $scope.end_date_time;
    $scope.due_date;
    $scope.params = {}

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
        var edit = $('#txt_addNewTaskNotes').data("kendoEditor");
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
    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
           module_id: "Project",
           action_id: "ProjectTaskView",
           details: $scope.name + "AddTask",
           application: "angular",
           browser: $cookieStore.get('browser'),
           ip_address: $cookieStore.get('IP_Address'),
           location: $cookieStore.get('Location'),
           organization_id: $cookieStore.get('orgID'),
           User_ID: $cookieStore.get('userId'),

       };


        apiService.post("AuditLog/Create", postdata).then(function (response) {
            var loginSession = response.data;
        },
    function (error) {
    });
    };


    //end
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }

   
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


    projectUrl = "ToDoItem/CreateTask";
    ProjectCreate = function (param) {
       
      
        apiService.post(projectUrl, param).then(function (response) {
            var loginSession = response.data;
            alert("Your Task Code is " + loginSession.task_code);
            $modalInstance.dismiss();
            AuditCreate();
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
      
   });

    $scope.selectproject = function () {
        $scope.params.project_id = $scope.project1;
       
    };

    $scope.contactsDataSource = {
        type: "odata",
        serverFiltering: true,
        transport: {
            read: function (options) {
                $scope.getAllContacts(options.data.filter != null ? options.data.filter.filters[0].value : null, options);
            }
        },
        schema: {
            data: function (data) {
                return data;
            },
            total: function (data) {
                return data['odata.count'];
            },
            model: {
                fields: {
                    Contact_Name: { type: "string" },
                    Contact_id: { type: "string" }
                }
            }
        }
    }

    function isStringNullOrEmpty(value) {
        return value == null || value == "";
    }

    $scope.getAllContacts = function (searchString, options) {

        searchString = isStringNullOrEmpty(searchString) ? "a" : searchString;
        Url = "Contact/GetFilteredContactsByOrg/";
        apiService.get(Url, { orgId: $cookieStore.get('orgID'), searchString: searchString }).then(function (response) {
            options.success(response.data);
        },
        function (error) {
            options.error(error.state);
        });
    }

   // Url = "Contact/GetContactByOrg/" + $cookieStore.get('orgID');
   // apiService.get(Url).then(function (response) {
   //     $scope.contacts = response.data;
   // },
   //function (error) {
      
   //});

    $scope.selectcontact = function () {
        $scope.params.contact_id = $scope.contact1;
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



    Url = "TaskType/GetTaskType";
    apiService.get(Url).then(function (response) {
        $scope.events = response.data;
    },
function (error) {
    
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
            resolve: { items: { title: "Task" } }
        });
    }
   

    $scope.addNew = function (isValid) {
        
        $scope.showValid = true;
        if (isValid) {
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
                class_type: "Project",
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


};




   