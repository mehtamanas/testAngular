/**
 * Created by dwellarkaruna on 24/10/15.
 */
var EditTaskProject = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal, $rootScope, $window, FileUploader) {
    console.log('EditTaskProject');
    var userId = $cookieStore.get('userId');
    // var assigned_to_id = $cookieStore.get('assigned_to_id');

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
        var edit = $('#txt_editTaskAddNotes').data("kendoEditor");
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


    $scope.selectedTaskID = window.sessionStorage.selectedTaskID;
    $scope.project1 = $scope.seletedCustomerId;

    $scope.contactsDataSource = new kendo.data.DataSource({
        type: "odata",
        serverFiltering: true,
        transport: {
            read: function (options) {
                $scope.getAllContacts(options.data.filter != null && options.data.filter.filters != null ? options.data.filter.filters[0].value : null, options);
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
    });

    function isStringNullOrEmpty(value) {
        return value == null || value == "";
    }

    $scope.getAllContacts = function (searchString, options) {

        Url = "Contact/GetFilteredContactsByOrg/";
        searchString = isStringNullOrEmpty(searchString) ? "a" : searchString;
        apiService.get(Url, { orgId: $cookieStore.get('orgID'), searchString: searchString, contactId: $scope.contactId }).then(function (response) {
            options.success(response.data);
           
        },
        function (error) {
            options.error(error.state);
        });
    }


    contactUrl = "ToDoItem/EditGet/" + $scope.selectedTaskID;
    apiService.getWithoutCaching(contactUrl).then(function (response) {
        $scope.params = response.data[0];

        var remindTime = moment.duration(moment.utc(moment(response.data[0].due_date).diff(moment(response.data[0].reminder_time))).format("HH:mm:ss")).asMinutes();
        $scope.reminder_time1 = (_.findWhere($scope.reminders, { key_name: remindTime.toString() + ' minutes' })).id;
        $scope.due_date = moment(moment.utc(response.data[0].due_date).toDate()).format("DD/MM/YYYY hh:mm A");
      // $scope.params.end_date = moment(moment.utc(response.data[0].end_date).toDate()).format("DD/MM/YYYY HH:mm A");
        if (response.data[0].remind_me === "1")
            $scope.remind_me = true;
        else
            $scope.remind_me = false;
        
        $scope.priority1 = response.data[0].priority_id;
        $scope.project1 = response.data[0].project_id;
        $scope.contact1 = response.data[0].contact_id;
        $scope.contact1Name = response.data[0].Contact_name;
        $scope.event1 = response.data[0].task_type_id;
        $scope.user1 = response.data[0].assign_user_id;
        $scope.params.htmlcontent=response.data[0].text;
        // $scope.reminder_time = response.data[0].reminder_time
        $("#editTaskPerson").data("kendoComboBox").value($scope.contact1Name);
    },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    }
  );
    //audit log
    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
           module_id: "Project",
           action_id: "Edittask",
           details: $scope.params.name + "EditTask",
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

    $scope.params = {
        project_id: $scope.project1,
        priority: $scope.priority1,
        name: $scope.name,
        //text: $scope.text,
        text: $scope.htmlcontent,
        due_date: $scope.due_date,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),
        assigned_to_id: $scope.contact1,
        class_type: "Project",
        reminder_time: $scope.reminder_time,
        task_type_id_: $scope.event1,
        time: $scope.time,
        id: $scope.selectedTaskID,

    };

    //$scope.save = function () {
    //    var postData =
    //           {
    //               project_id: $scope.project1,
    //               priority: $scope.priority1,
    //               name: $scope.params.name,
    //               text: $scope.params.text,
    //               due_date: $scope.params.due_date,
    //               organization_id: $cookieStore.get('orgID'),
    //               user_id: $cookieStore.get('userId'),
    //               assigned_to_id: $scope.contact1,
    //               class_type: "Project",
    //               reminder_time: $scope.params.reminder_time,
    //               task_type_id_: $scope.event1,
    //              // time: $scope.params.time,
    //               id: $scope.seletedCustomerId,
    //           };

    //    apiService.post("ToDoItem/EditTaskWithNotes", postData).then(function (response) {
    //        var loginSession = response.data;
    //        $modalInstance.dismiss();
    //        $scope.openSucessfullPopup();
    //        $rootScope.$broadcast('REFRESH', 'TaskGrid');

    //    },
    //    function (error) {
    //        if (error.status === 400)
    //            alert(error.data.Message);
    //        else
    //            alert("Network issue");
    //    });
    //}
   
   
    $scope.save = function (postData) {
        apiService.post("ToDoItem/EditTaskWithNotes", postData).then(function (response) {
            var loginSession = response.data;
            AuditCreate();
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();
            $rootScope.$broadcast('REFRESH', 'TaskGrid');

        },
        function (error) {
            alert("not working ");
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
        $scope.params.project_id = $scope.seletedCustomerI;

    };


   // Url = "Contact/GetContactByOrg/" + $cookieStore.get('orgID');
   // apiService.get(Url).then(function (response) {
   //     $scope.contacts = response.data;
   // },
   //function (error) {
   //    if (error.status === 400)
   //        alert(error.data.Message);
   //    else
   //        alert("Network issue");
   //});

    $scope.selectcontact = function () {
        $scope.params.assigned_to_id = $scope.contact1;
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
            templateUrl: 'newuser/Edited.tpl.html',
            backdrop: 'static',
            controller: EditsucessfullController,
            size: 'lg',
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
                //  $scope.params.reminder_datetime = (($scope.reminderTime).replace('min', '')).trim();
                $scope.params.reminder_datetime = moment($scope.due_date, "DD/MM/YYYY hh:mm A").subtract($scope.reminderTime, 'minutes')._d;
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
                //text: $scope.params.text,
                text: $scope.params.htmlcontent,
                remind_me: remind_me,
                reminder_timespan_id: $scope.reminder_time1,
  		        due_date: new Date(dDate).toISOString(),
 	            reminder_time: new Date($scope.params.reminder_datetime).toISOString(),
 	            id: $scope.selectedTaskID,
            };

            $scope.save($scope.params);

        }

    }


};




