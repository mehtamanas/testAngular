angular.module('my_day')
.controller('my_dayController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope, $anchorScroll) {
        //var userID = $cookieStore.get('user_id');
        $scope.showEventTodayGrid = true;
        $scope.showContactTodayGrid = true;
        $scope.showTaskTodayGrid = true;
        var userID = $cookieStore.get('userId');
        console.log('my_dayController');

        var contactGrid = function () {
            $scope.contactTodayGrid = {
                dataSource: {
                    type: "json",
                    transport: {
                        read: apiService.baseUrl + "Notes/GetNotesByUserId/" + userID + "/today"

                    },
                    pageSize: 5,
                },
                groupable: false,
                sortable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
                columns: [{
                    template: "<img height='40px' width='40px' src='#= Contact_image #'/>" +
                    "<span style='padding-left:10px' class='property-photo'> </span>",
                    title: "Picture",
                    width: "120px",
                    attributes:
                      {
                          "class": "UseHand",
                      }
                }, {
                    field: "Contact_name",
                    title: "Contact",
                    width: "85px"
                }, {
                    field: "text",
                    title: "Notes",
                    width: "85px"
                },
                {
                    template: " <span class='pull-right contact-ico'> <a href='javascript:' class='ico-msg'></a></span>",
                    width: "40px",
                    attributes:
                      {
                          "class": "UseHand",
                      }
                },
                 {
                     template: "<span class='pull-right contact-ico'> <a href='javascript:' class='ico-send'></a></span>",
                     width: "40px",
                     attributes:
                       {
                           "class": "UseHand",
                       }
                 },
                  {
                      template: "<span class='pull-right contact-ico'> <a href='javascript:' class='ico-call'></a></span>",
                      width: "40px",
                      attributes:
                        {
                            "class": "UseHand",
                        }
                  }]
            }

            $scope.contactTomorrowGrid = {
                dataSource: {
                    type: "json",
                    transport: {

                        read: apiService.baseUrl + "Notes/GetNotesByUserId/" + userID + "/tomorrow"

                    },
                    pageSize: 5,
                },
                groupable: false,
                sortable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
                columns: [{
                    template: "<img height='40px' width='40px' src='#= Contact_image #'/>" +
                    "<span style='padding-left:10px' class='property-photo'> </span>",
                    title: "Picture",
                    width: "120px",
                    attributes:
                      {
                          "class": "UseHand",
                      }
                }, {
                    field: "Contact_name",
                    title: "Contact",
                    width: "85px"
                }, {
                    field: "text",
                    title: "Notes",
                    width: "85px"
                },
                {
                    template: " <span class='pull-right contact-ico'> <a href='javascript:' class='ico-msg'></a></span>",
                    width: "40px",
                    attributes:
                      {
                          "class": "UseHand",
                      }
                },
                 {
                     template: "<span class='pull-right contact-ico'> <a href='javascript:' class='ico-send'></a></span>",
                     width: "40px",
                     attributes:
                       {
                           "class": "UseHand",
                       }
                 },
                  {
                      template: "<span class='pull-right contact-ico'> <a href='javascript:' class='ico-call'></a></span>",
                      width: "40px",
                      attributes:
                        {
                            "class": "UseHand",
                        }
                  }]
            }

            $scope.contactNext7DayGrid = {
                dataSource: {
                    type: "json",
                    transport: {

                        read: apiService.baseUrl + "Notes/GetNotesByUserId/" + userID + "/7days"

                    },
                    pageSize: 5,
                },
                groupable: false,
                sortable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
                columns: [{
                    template: "<img height='40px' width='40px' src='#= Contact_image #'/>" +
                    "<span style='padding-left:10px' class='property-photo'> </span>",
                    title: "Picture",
                    width: "120px",
                    attributes:
                      {
                          "class": "UseHand",
                      }
                }, {
                    field: "Contact_name",
                    title: "Contact",
                    width: "85px"
                }, {
                    field: "text",
                    title: "Notes",
                    width: "85px"
                },
                {
                    template: " <span class='pull-right contact-ico'> <a href='javascript:' class='ico-msg'></a></span>",
                    width: "40px",
                    attributes:
                      {
                          "class": "UseHand",
                      }
                },
                 {
                     template: "<span class='pull-right contact-ico'> <a href='javascript:' class='ico-send'></a></span>",
                     width: "40px",
                     attributes:
                       {
                           "class": "UseHand",
                       }
                 },
                  {
                      template: "<span class='pull-right contact-ico'> <a href='javascript:' class='ico-call'></a></span>",
                      width: "40px",
                      attributes:
                        {
                            "class": "UseHand",
                        }
                  }]
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
                pageSize: 5,
                groupable: false,
                sortable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },

                columns: [{
                    field: "name",
                    title: "Name",
                    width: 176
                }, {
                    field: "event_date1",
                    title: "Start",
                    width: "85px",
                    format: '{0:dd/MM/yyyy}'

                }, {
                    field: "end_date",
                    title: "End",
                    width: "85px",
                    format: '{0:dd/MM/yyyy}'

                }, {
                    field: "project_name",
                    title: "Project",
                    width: "85px",
                }, {
                    field: "contact_name",
                    title: "Contact",
                    width: "85px",
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
                pageSize: 5,
                groupable: false,
                sortable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },

                columns: [{
                    field: "name",
                    title: "Name",
                    width: 176
                }, {
                    field: "event_date1",
                    title: "Start",
                    width: "85px",
                    format: '{0:dd/MM/yyyy}'

                }, {
                    field: "end_date",
                    title: "End",
                    width: "85px",
                    format: '{0:dd/MM/yyyy}'

                }, {
                    field: "project_name",
                    title: "Project",
                    width: "85px",
                }, {
                    field: "contact_name",
                    title: "Contact",
                    width: "85px",
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
                pageSize: 5,
                groupable: false,
                sortable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },

                columns: [{
                    field: "name",
                    title: "Name",
                    width: 176
                }, {
                    field: "event_date1",
                    title: "Start",
                    width: 85,
                    format: '{0:dd/MM/yyyy}'

                }, {
                    field: "end_date",
                    title: "End",
                    width: 85,
                    format: '{0:dd/MM/yyyy}'

                }, {
                    field: "project_name",
                    title: "Project",
                    width: 85
                }, {
                    field: "contact_name",
                    title: "Contact",
                    width: 85
                }]
            }

        }
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
                pageSize: 5,
                groupable: false,
                sortable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
                columns: [{
                    field: "name",
                    title: "Task Name",
                    width: "85px",
                }, {
                    field: "project_name",
                    title: "Project",
                    width: "85px",
                }, {
                    field: "user_name",
                    title: "Assigned To",
                    width: "85px",
                }, {
                    field: "Contact_name",
                    title: "Contact",
                    width: "85px",
                }, {
                    field: "status",
                    title: "Status",
                    width: "85px",
                }, {
                    field: "due_date",
                    title: "Due Date",
                    width: "85px",
                    format: '{0:dd/MM/yyyy}'
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
                pageSize: 5,
                groupable: false,
                sortable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
                columns: [{
                    field: "name",
                    title: "Task Name",
                    width: 176
                }, {
                    field: "project_name",
                    title: "Project",
                    width: 85
                }, {
                    field: "user_name",
                    title: "Assigned To",
                    width: 85
                }, {
                    field: "Contact_name",
                    title: "Contact",
                    width: 85
                }, {
                    field: "status",
                    title: "Status",
                    width: 85
                }, {
                    field: "due_date",
                    title: "Due Date",
                    width: 85,
                    format: '{0:dd/MM/yyyy}'
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
                pageSize: 5,
                groupable: false,
                sortable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },
                columns: [{
                    field: "name",
                    title: "Task Name",
                    width: 176
                }, {
                    field: "project_name",
                    title: "Project",
                    width: 85
                }, {
                    field: "user_name",
                    title: "Assigned To",
                    width: 85
                }, {
                    field: "Contact_name",
                    title: "Contact",
                    width: 85
                }, {
                    field: "status",
                    title: "Status",
                    width: 85
                }, {
                    field: "due_date",
                    title: "Due Date",
                    width: 85,
                    format: '{0:dd/MM/yyyy}'
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
    });
