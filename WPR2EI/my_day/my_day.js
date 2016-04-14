angular.module('my_day')
.controller('my_dayController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope, $anchorScroll, $window, $stateParams) {
        //var userID = $cookieStore.get('user_id');
        $scope.selectedTaskID = window.sessionStorage.selectedTaskID;
        $scope.selectedTaskID = $stateParams.id;
        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
        $scope.seletedCustomerId = $stateParams.id;
        $scope.showEventTodayGrid = true;
        $scope.showContactTodayGrid = true;
        $scope.showTaskTomorrowGrid = true;
        var userID = $cookieStore.get('userId');
        $scope.gridView = 'default';
       
        console.log('my_dayController');

        var contactGrid = function () {
            $scope.contactTodayGrid = {
                dataSource: {
                    type: "json",
                    transport: {
                        read: apiService.baseUrl + "Contact/GetPeopleGrid/" + userID + "/today"
                    },
                    pageSize: 5,
                    schema: {
                        model: {
                            fields: {
                                due_date: { type: "date" },
                                
                            }
                        }
                    }
                },
                groupable: true,
                sortable: true,
                selectable: "multiple",
                reorderable: true,
                resizable: true,
                height:500,
                filterable: true,
                columnMenu: {
                    messages: {
                        columns: "Choose columns",
                        filter: "Apply filter",
                        sortAscending: "Sort (asc)",
                        sortDescending: "Sort (desc)"
                    }
                },
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
                columns: [{
                    template: "<img height='40px' width='40px' src='#= media_url #'/>" +
                    "<span style='padding-left:10px' class='property-photo'> </span>",
                    title: "Picture",
                   
                    attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                }, {
                    field: "Contact_name",
                    template: '<a ui-sref="app.contactdetail({id:dataItem.id})" href="" class="contact_name">#=Contact_name#</a>',
                    title: "Contact",
                    width: "200px",
                    attributes:
                     {
                         "style": "text-align:center"
                     }
                }, {
                    field: "company_name",
                    title: "Company",
                    width: "200px",
                    attributes:
                     {
                         "style": "text-align:center"
                     }
                },{
                    field: "task_type",
                    title: "Task Type",
                
                    attributes:
                     {
                         "style": "text-align:center"
                     }
                },{
                    field: "text",
                    title: "Notes",
                    width: "250px",
                    attributes:
                     {
                         "style": "text-align:center"
                     }
                },
                {
                    field: "due_date",
                    title: "Due Date",
                 
                    format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                    attributes:
                  {
                      "style": "text-align:center"
                  }

                },
               ]
            }

            $scope.contactTomorrowGrid = {
                dataSource: {
                    type: "json",
                    transport: {
                        read: apiService.baseUrl + "Contact/GetPeopleGrid/" + userID + "/tomorrow"
                    },
                    pageSize: 5,
                    schema: {
                        model: {
                            fields: {
                                due_date: { type: "date" },
                               
                            }
                        }
                    }
                },
                groupable: true,
                sortable: true,
                selectable: "multiple",
                reorderable: true,
                resizable: true,
                height: 500,
                filterable: true,

                columnMenu: {
                    messages: {
                        columns: "Choose columns",
                        filter: "Apply filter",
                        sortAscending: "Sort (asc)",
                        sortDescending: "Sort (desc)"
                    }
                },
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
                columns: [{
                    template: "<img height='40px' width='40px' src='#= media_url #'/>" +
                    "<span style='padding-left:10px' class='property-photo'> </span>",
                    title: "Picture",
                 
                    attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                }, {
                    field: "Contact_name",
                    template: '<a ui-sref="app.contactdetail({id:dataItem.id})" href="">#=Contact_name#</a>',
                    title: "Contact",
                    width: "200px",
                    attributes:
                    {
                        "style": "text-align:center"
                    }
                }, {
                    field: "company_name",
                    title: "Company",
                    width: "200px",
                    attributes:
                     {
                         "style": "text-align:center"
                     }
                }, {
                    field: "task_type",
                    title: "Task Type",
                  
                    attributes:
                    {
                        "style": "text-align:center"
                    }
                },{
                    field: "text",
                    title: "Notes",
                    width: "250px",
                    attributes:
                    {
                        "style": "text-align:center"
                    }
                },
                {
                    field: "due_date",
                    title: "Due Date",
                  
                    format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                    attributes:
                      {
                          "style": "text-align:center"
                      }

                },]
            }

            $scope.contactNext7DayGrid = {
                dataSource: {
                    type: "json",
                    transport: {
                        read: apiService.baseUrl + "Contact/GetPeopleGrid/" + userID + "/7days"
                    },
                    pageSize: 5,
                    schema: {
                        model: {
                            fields: {
                                due_date: { type: "date" },
                               
                            }
                        }
                    }
                },
                groupable: true,
                sortable: true,
                selectable: "multiple",
                reorderable: true,
                resizable: true,
                filterable: true,
                columnMenu: {
                    messages: {
                        columns: "Choose columns",
                        filter: "Apply filter",
                        sortAscending: "Sort (asc)",
                        sortDescending: "Sort (desc)"
                    }
                },
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
                columns: [{
                    template: "<img height='40px' width='40px' src='#= media_url #'/>" +
                    "<span style='padding-left:10px' class='property-photo'> </span>",
                    title: "Picture",
                  
                    attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                }, {
                    field: "Contact_name",
                    template: '<a ui-sref="app.contactdetail({id:dataItem.id})" href="">#=Contact_name#</a>',
                    title: "Contact",
                    width: "200px",
                    attributes:
                     {
                         "style": "text-align:center"
                     }
                }, {
                    field: "company_name",
                    title: "Company",
                    width: "200px",
                    attributes:
                     {
                         "style": "text-align:center"
                     }
                }, {
                    field: "task_type",
                    title: "Task Type",
                 
                    attributes:
                     {
                         "style": "text-align:center"
                     }
                }, {
                    field: "text",
                    title: "Notes",
                    width: "250px",
                    attributes:
                     {
                         "style": "text-align:center"
                     }
                }, {
                    field: "due_date",
                    title: "Due Date",
                
                    format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                    attributes:
                      {
                          "style": "text-align:center"
                      }

                },]
            }
        }

        var eventGrid = function () {
            $scope.eventTodayGrid = {
                dataSource: {
                    type: "json",
                    transport: {

                        read: apiService.baseUrl + "Event/GetEventByUserId/" + userID + "/today"

                    },
                    pageSize: 5,

                    schema: {
                        model: {
                            fields: {
                                event_date1: { type: "date" },
                                end_date: { type: "date" },
                            }
                        }
                    }
                },
                groupable: true,
                sortable: true,
                selectable: "multiple",
                reorderable: true,
                resizable: true,
                filterable: true,
                columnMenu: {
                    messages: {
                        columns: "Choose columns",
                        filter: "Apply filter",
                        sortAscending: "Sort (asc)",
                        sortDescending: "Sort (desc)"
                    }
                },
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },

                columns: [{
                    field: "name",
                    title: "Name",
                  
                }, {
                    field: "event_date1",
                    title: "Start",
                   
                    format: '{0:dd/MM/yyyy hh:mm:ss tt}',

                }, {
                    field: "end_date",
                    title: "End",
                   
                    format: '{0:dd/MM/yyyy hh:mm:ss tt}',

                }, {
                    field: "project_name",
                    title: "Project",
                    width: "85px",
                }, {
                    field: "contact_name",
                    title: "Contact",
                    width: "200px",
                }]
            }
            $scope.eventTomorrowGrid = {
                dataSource: {
                    type: "json",
                    transport: {

                        read: apiService.baseUrl + "Event/GetEventByUserId/" + userID + "/tomorrow"

                    },
                    pageSize: 5,

                    schema: {
                        model: {
                            fields: {
                                event_date1: { type: "date" },
                                end_date: { type: "date" },
                            }
                        }
                    }
                },
                groupable: true,
                sortable: true,
                selectable: "multiple",
                reorderable: true,
                resizable: true,
                filterable: true,
                columnMenu: {
                    messages: {
                        columns: "Choose columns",
                        filter: "Apply filter",
                        sortAscending: "Sort (asc)",
                        sortDescending: "Sort (desc)"
                    }
                },
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },

                columns: [{
                    field: "name",
                    title: "Name",
                  
                }, {
                    field: "event_date1",
                    title: "Start",
                  
                    format: '{0:dd/MM/yyyy hh:mm:ss tt}',

                }, {
                    field: "end_date",
                    title: "End",
                   
                    format: '{0:dd/MM/yyyy hh:mm:ss tt}',

                }, {
                    field: "project_name",
                    title: "Project",
                    width: "85px",
                }, {
                    field: "contact_name",
                    title: "Contact",
                    width: "200px",
                }]
            }
            $scope.eventNext7Grid = {
                dataSource: {
                    type: "json",
                    transport: {

                        read: apiService.baseUrl + "Event/GetEventByUserId/" + userID + "/7days"

                    },
                    pageSize: 5,

                    schema: {
                        model: {
                            fields: {
                                event_date1: { type: "date" },
                                end_date: { type: "date" },
                            }
                        }
                    }
                },
                groupable: true,
                sortable: true,
                selectable: "multiple",
                reorderable: true,
                resizable: true,
                filterable: true,
                columnMenu: {
                    messages: {
                        columns: "Choose columns",
                        filter: "Apply filter",
                        sortAscending: "Sort (asc)",
                        sortDescending: "Sort (desc)"
                    }
                },
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },

                columns: [{
                    field: "name",
                    title: "Name",
                 
                }, {
                    field: "event_date1",
                    title: "Start",                  
                    format: '{0:dd/MM/yyyy hh:mm:ss tt}',

                }, {
                    field: "end_date",
                    title: "End",                 
                    format: '{0:dd/MM/yyyy hh:mm:ss tt}',

                }, {
                    field: "project_name",
                    title: "Project",
                   
                }, {
                    field: "contact_name",
                    title: "Contact",
                    width: 200,
                }]
            }

        }

    //    var taskAPI = function () {

    //    apiService.get("ToDoItem/GetTaskByUserId/" + userID + "/overdue").then(function (res) {
    //        $scope.taskToday = res.data;
    //    }, function (err) {

    //    })

    //    apiService.get("ToDoItem/GetTaskByUserId/" + userID + "/today").then(function (res) {
    //        $scope.taskTomorrow = res.data;
    //    }, function (err) {

    //    })

    //    apiService.get("ToDoItem/GetTaskByUserId/" + userID + "/7days").then(function (res) {
    //        $scope.taskNext7 = res.data;
    //    }, function (err) {

    //    })
    //}

        var taskGrid = function () {
            $scope.taskTodayGrid = {
                dataSource: {
                    type: "json",
                    transport: {

                        read: apiService.baseUrl + "ToDoItem/GetTaskByUserId/" + userID + "/overdue"

                    },
                    pageSize: 5,

                    schema: {
                        model: {
                            fields: {
                                due_date: { type: "date" },
                            }
                        }
                    }
                },
                groupable: true,
                sortable: true,
                selectable: "multiple",
                reorderable: true,
                resizable: true,
                filterable: true,
                columnMenu: {
                    messages: {
                        columns: "Choose columns",
                        filter: "Apply filter",
                        sortAscending: "Sort (asc)",
                        sortDescending: "Sort (desc)"
                    }
                },
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
                columns: [{
                    field: "name",
                    template: '<a ui-sref="app.edit_task_myday({id:dataItem.task_id})" href="" class="contact_name">#=name#</a>',
                    title: "Task Name",
                    attributes:
                     {
                         "style": "text-align:center"
                     }
                }, {
                    field: "Project_Name",
                    title: "Project",
                    attributes:
                     {
                         "style": "text-align:center"
                     }
                }, {
                    field: "user_name",
                    title: "Assigned To",
                    attributes:
                     {
                         "style": "text-align:center"
                     }
                }, {
                    field: "Contact_Name",
                    title: "Contact",
                    width: "200px",
                    attributes:
                     {
                         "style": "text-align:center"
                     }
                }, {
                    field: "company",
                    title: "Company",
                    width: "200px",
                    attributes:
                     {
                         "style": "text-align:center"
                     }
                }, {
                    field: "remind_me",
                    title: "Remind Me",
                    width: "200px",
                    attributes:
                     {
                         "style": "text-align:center"
                     }
                }, {
                    field: "status",
                    template: '<span id="#= status #"></span>',
                    title: "Status",
                    attributes:
                     {
                         "style": "text-align:center"
                     }
                }, {
                    field: "due_date",
                    title: "Due Date",
                    format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                    attributes:
                     {
                         "style": "text-align:center"
                     }
                }, ]

            }
            $scope.taskTomorrowGrid = {
                dataSource: {
                    type: "json",
                    transport: {

                        read: apiService.baseUrl + "ToDoItem/GetTaskByUserId/" + userID + "/today"

                    },
                    pageSize: 5,

                    schema: {
                        model: {
                            fields: {
                                due_date: { type: "date" },
                            }
                        }
                    }
                },
                groupable: true,
                sortable: true,
                selectable: "multiple",
                reorderable: true,
                resizable: true,
                filterable: true,
                columnMenu: {
                    messages: {
                        columns: "Choose columns",
                        filter: "Apply filter",
                        sortAscending: "Sort (asc)",
                        sortDescending: "Sort (desc)"
                    }
                },
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
                columns: [{
                    field: "name",
                    template: '<a ui-sref="app.edit_task_myday({id:dataItem.task_id})" href="">#=name#</a>',
                    title: "Task Name",

                    attributes:
                    {
                        "style": "text-align:center"
                    }
                }, {
                    field: "project_name",
                    title: "Project",

                    attributes:
                    {
                        "style": "text-align:center"
                    }
                }, {
                    field: "user_name",
                    title: "Assigned To",

                    attributes:
                    {
                        "style": "text-align:center"
                    }
                }, {
                    field: "Contact_name",
                    title: "Contact",
                    width: 200,
                    attributes:
                    {
                        "style": "text-align:center"
                    }
                }, {
                    field: "company_name",
                    title: "Company",
                    width: "200px",
                    attributes:
                     {
                         "style": "text-align:center"
                     }
                }, {
                    field: "remind_me",
                    title: "Remind Me",
                    width: "200px",
                    attributes:
                     {
                         "style": "text-align:center"
                     }
                }, {
                    field: "status",
                    template: '<span id="#= status #"></span>',
                    title: "Status",
                    attributes:
                    {
                        "style": "text-align:center"
                    }
                }, {
                    field: "due_date",
                    title: "Due Date",
                    format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                    attributes:
                    {
                        "style": "text-align:center"
                    }
                }, ]


            }
            $scope.taskNext7Grid = {
                dataSource: {
                    type: "json",
                    transport: {

                        read: apiService.baseUrl + "ToDoItem/GetTaskByUserId/" + userID + "/7days"

                    },
                    pageSize: 5,

                    schema: {
                        model: {
                            fields: {
                                due_date: { type: "date" },
                            }
                        }
                    }
                },
                groupable: true,
                sortable: true,
                selectable: "multiple",
                reorderable: true,
                resizable: true,
                filterable: true,
                columnMenu: {
                    messages: {
                        columns: "Choose columns",
                        filter: "Apply filter",
                        sortAscending: "Sort (asc)",
                        sortDescending: "Sort (desc)"
                    }
                },
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
                columns: [{
                    field: "name",
                    template: '<a ui-sref="app.edit_task_myday({id:dataItem.task_id})" href="">#=name#</a>',
                    title: "Task Name",
                    attributes:
                    {
                        "style": "text-align:center"
                    }
                }, {
                    field: "project_name",
                    title: "Project",
                    attributes:
                    {
                        "style": "text-align:center"
                    }
                }, {
                    field: "user_name",
                    title: "Assigned To",
                    attributes:
                    {
                        "style": "text-align:center"
                    }
                }, {
                    field: "Contact_name",
                    title: "Contact",
                    width: 200,
                    attributes:
                    {
                        "style": "text-align:center"
                    }
                }, {
                    field: "company_name",
                    title: "Company",
                    width: "200px",
                    attributes:
                     {
                         "style": "text-align:center"
                     }
                }, {
                    field: "remind_me",
                    title: "Remind Me",
                    width: "200px",
                    attributes:
                     {
                         "style": "text-align:center"
                     }
                }, {
                    field: "status",
                    template: '<span id="#= status #"></span>',
                    title: "Status",
                    attributes:
                    {
                        "style": "text-align:center"
                    }
                }, {
                    field: "due_date",
                    title: "Due Date",
                    format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                    attributes:
                    {
                        "style": "text-align:center"
                    }
                }, ]


            }

        }


        $scope.schedulerOptions = {
            date: new Date("2013/6/13"),
            startTime: new Date("2013/6/13 07:00 AM"),
            height: 600,
            views: [
                "day",
                { type: "workWeek", selected: true },
                "week",
                "month",
            ],
            timezone: "Etc/UTC",
            dataSource: {
                batch: true,
                transport: {
                    read: {
                        url: "demos.telerik.com/kendo-ui/service/tasks",
                        dataType: "jsonp"
                    },
                    update: {
                        url: "demos.telerik.com/kendo-ui/service/tasks/update",
                        dataType: "jsonp"
                    },
                    create: {
                        url: "demos.telerik.com/kendo-ui/service/tasks/create",
                        dataType: "jsonp"
                    },
                    destroy: {
                        url: "demos.telerik.com/kendo-ui/service/tasks/destroy",
                        dataType: "jsonp"
                    },
                    parameterMap: function (options, operation) {
                        if (operation !== "read" && options.models) {
                            return { models: kendo.stringify(options.models) };
                        }
                    }
                },
                schema: {
                    model: {
                        id: "taskId",
                        fields: {
                            taskId: { from: "TaskID", type: "number" },
                            title: { from: "Title", defaultValue: "No title", validation: { required: true } },
                            start: { type: "date", from: "Start" },
                            end: { type: "date", from: "End" },
                            startTimezone: { from: "StartTimezone" },
                            endTimezone: { from: "EndTimezone" },
                            description: { from: "Description" },
                            recurrenceId: { from: "RecurrenceID" },
                            recurrenceRule: { from: "RecurrenceRule" },
                            recurrenceException: { from: "RecurrenceException" },
                            ownerId: { from: "OwnerID", defaultValue: 1 },
                            isAllDay: { type: "boolean", from: "IsAllDay" }
                        }
                    }
                },
                filter: {
                    logic: "or",
                    filters: [
                        { field: "ownerId", operator: "eq", value: 1 },
                        { field: "ownerId", operator: "eq", value: 2 }
                    ]
                }
            },
            resources: [
                {
                    field: "ownerId",
                    title: "Owner",
                    dataSource: [
                        { text: "Alex", value: 1, color: "#f8a398" },
                        { text: "Bob", value: 2, color: "#51a0ed" },
                        { text: "Charlie", value: 3, color: "#56ca85" }
                    ]
                }
            ]
        };

        contactGrid();
        eventGrid();
        taskGrid();

        $scope.mailInboxGrid = {
            dataSource: {
                type: "json",
                transport: {

                    read: apiService.baseUrl + "MailInbox/GetInbox/" + userID
                },
                schema: {
                    model: {
                        fields: {
                            date: { type: "date" },

                        }
                    }
                }
            },
            pageSize: 5,
            groupable: false,
            sortable: true,
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },

            columns: [{
                template: "<img height='40px' width='40px' src='#= media_url #'/>" +
                "<span style='padding-left:10px' class='property-photo'> </span>",
                title: "Picture",
                width: "120px",
                attributes:
                  {
                      "class": "UseHand",
                  }
            }, {
                field: "subject",
                title: "Subject",
                width: "85px",
            }, {
                field: "date",
                title: "Date",
                width: "85px",
                format: '{0:dd/MM/yyyy}'

            }, {
                field: "from_email",
                title: "From",
                width: "85px",
            }, {
                field: "to_email",
                title: "To",
                width: "85px",
            }]
        }


        $scope.contactShowHideGrid = function (taskType) {
            if (taskType === 'today') {
                $scope.showContactTodayGrid = true;
                $scope.showContactTomorrowGrid = false;
                $scope.showContactNext7Grid = false;
            }
            else if (taskType === 'tomorrow') {
                $scope.showContactTodayGrid = false;
                $scope.showContactTomorrowGrid = true;
                $scope.showContactNext7Grid = false;
            }
            else if (taskType === 'next7Days') {
                $scope.showContactTodayGrid = false;
                $scope.showContactTomorrowGrid = false;
                $scope.showContactNext7Grid = true;
            }

        }

        $scope.eventShowHideGrid = function (taskType) {
            if (taskType === 'today') {
                $scope.showEventTodayGrid = true;
                $scope.showEventTomorrowGrid = false;
                $scope.showEventNext7Grid = false;
            }
            else if (taskType === 'tomorrow') {
                $scope.showEventTodayGrid = false;
                $scope.showEventTomorrowGrid = true;
                $scope.showEventNext7Grid = false;
            }
            else if (taskType === 'next7Days') {
                $scope.showEventTodayGrid = false;
                $scope.showEventTomorrowGrid = false;
                $scope.showEventNext7Grid = true;
            }

        }
        $scope.taskShowHideGrid = function (taskType) {
            if (taskType === 'today') {
                $scope.showTaskTodayGrid = true;
                $scope.showTaskTomorrowGrid = false;
                $scope.showTaskNext7Grid = false;
            }
            else if (taskType === 'tomorrow') {
                $scope.showTaskTodayGrid = false;
                $scope.showTaskTomorrowGrid = true;
                $scope.showTaskNext7Grid = false;
            }
            else if (taskType === 'next7Days') {
                $scope.showTaskTodayGrid = false;
                $scope.showTaskTomorrowGrid = false;
                $scope.showTaskNext7Grid = true;
            }

        }


        // Kendo Grid on change
        $scope.myTodayGridChange = function (dataItem) {        
            window.sessionStorage.selectedCustomerID = dataItem.id;
            $state.go('app.contactdetail', { id: dataItem.id });
        };
        // Kendo Grid on change
        $scope.myTomorrowGridChange = function (dataItem) {           
            window.sessionStorage.selectedCustomerID = dataItem.id;
            $state.go('app.contactdetail', { id: dataItem.id });
        };

        // Kendo Grid on change
        $scope.myNext7GridChange = function (dataItem) {          
            window.sessionStorage.selectedCustomerID = dataItem.id;
            $state.go('app.contactdetail', { id: dataItem.id });
        };

        var callViewApi = function () {

            apiService.getWithoutCaching('Notes/GetByOrgid/' + $cookieStore.get('orgID')).then(function (res) {
                $scope.views = _.filter(res.data, function (o)
                { return o.query_type === 'View' && o.grid_name === 'myday' });
            }, function (err) {

            });
        }
        
        callViewApi();

        $scope.changeView = function () {
            if ($scope.gridView !== 'default') {
                //filter by grid name
                viewObj = _.filter($scope.views, function (o)
                { return o.id === $scope.gridView });

                //get the grid datasource
                var grid = $('#contact_kenomain').getKendoGrid();

                if (viewObj.sort_by) {//sort
                    var sort = [];
                    sort.push({ field: viewObj[0].sort_by, dir: viewObj[0].sort_order });
                    grid.dataSource.sort(sort);
                }


                var col = JSON.parse(viewObj[0].column_names);
                for (i = 0; i < grid.columns.length; i++) {
                    var colFlag = false;
                    for (j = 0; j < col.length; j++) {
                        if (col[j].field === grid.columns[i].field) {
                            if (!col[j].hidden) {
                                grid.showColumn(i);
                                colFlag = true;
                                break;
                            }
                        }
                        if (j === col.length - 1 && colFlag == false) {
                            grid.hideColumn(i);
                        }
                    }
                }

                $scope.textareaText = viewObj[0].query_string;
                grid.dataSource.filter(JSON.parse(viewObj[0].filters));
            }
            else {
                $('#contact_kenomain').getKendoGrid().dataSource.sort({});
                $('#contact_kenomain').getKendoGrid().dataSource.filter({});
                $scope.textareaText = null;
                for (i = 0; i < $('#contact_kenomain').getKendoGrid().columns.length; i++) {
                    $('#contact_kenomain').getKendoGrid().showColumn(i);

                }

            }

        }

        $scope.saveView = function () {
            var grid = $('#contact_kenomain').getKendoGrid();

            if (grid.dataSource._sort) {
                var sortObject = grid.dataSource._sort[0];
            }

            if ($scope.textareaText) {
                var Querydata = $scope.textareaText.toLowerCase();
            }
            //var colObject = _.filter(grid.columns, function (o)
            //{ return !o.hidden });
            //colObject = (_.pluck(colObject, 'field')).join(',');

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/Views/createView.html',
                backdrop: 'static',
                controller: createViewCtrl,
                size: 'sm',
                resolve: { viewData: { sort: sortObject, col: grid.columns, grid: 'myday', type: 'View', filterQuery: Querydata, filterObj: grid.dataSource._filter } }
            });
        }


        $scope.editView = function () {
            if ($scope.gridView !== 'default') {
                var viewName = _.filter($scope.views, function (o)
                { return o.id == $scope.gridView });

                var grid = $('#contact_kenomain').getKendoGrid();

                if (grid.dataSource._sort) {
                    var sortObject = grid.dataSource._sort[0];
                }

                if ($scope.textareaText) {
                    var Querydata = $scope.textareaText.toLowerCase();
                }
                //var colObject = _.filter(grid.columns, function (o)
                //{ return !o.hidden });
                //colObject = (_.pluck(colObject, 'field')).join(',');

                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'contacts/Views/editView.html',
                    backdrop: 'static',
                    controller: editViewCtrl,
                    size: 'sm',
                    resolve: { viewData: { sort: sortObject, col: grid.columns, grid: 'myday', type: 'View', filterQuery: Querydata, filterObj: grid.dataSource._filter, viewName: viewName[0].view_name, viewId: $scope.gridView, isViewDefault: viewName[0].default_view } }
                });
            }
            else {
                alert('Cannot edit this view');
            }
        }

        $scope.deleteView = function () {
            if ($scope.gridView !== 'default') {
                swal({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!',
                    closeOnConfirm: false
                }).then(function (isConfirm) {
                    if (isConfirm) {
                        postData = { id: $scope.gridView, organization_id: $cookieStore.get('orgID') };
                        apiService.post('Notes/DeleteGridView', postData).then(function (res) {
                            swal(
                          'Deleted!',
                          'Your file has been deleted.',
                          'success'
                        );
                        }, function (err) {
                            swal(
                        'Not Deleted!',
                        'Something went wrong. Try again later.',
                        'error'
                      );
                        })
                    }
                })
            }
            else {
                alert('cannot delete this view')
            }
        }
    });
