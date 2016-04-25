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

        $scope.contact_today = [];
        $scope.contact_tomorrow = [];
        $scope.contact_next7Days = [];
        $scope.contact_dataAll = [];

        $scope.contactData = [];



        var contactGrid = function () {
            $scope.contactTodayGrid = {
                dataSource: {
                    type: "json",
                    transport: {
                        read: function (options) {
                            if ($scope.contactData.length > 0) {
                                options.success($scope.contactData);
                            } else {
                                options.error();
                            }
                        }
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


        $scope.task_overDue = [];
        $scope.task_tomorrow = [];
        $scope.task_next7days = [];
        $scope.task_dataAll = [];

        $scope.taskData = [];

        var taskGrid = function () {
            $scope.taskTodayGrid = {
                dataSource: {
                    type: "json",
                    transport: {
                        read: function (options) {
                            options.success($scope.taskData);
                        }
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

        apiService.get('ToDoItem/GetAllDashboardTask?id=' + userID).then(function (res) {
            data = res.data;
            var tomorrowStart = moment(moment().add(1, 'day')).startOf('day').format('YYYY-MM-DDTHH:mm:ssZD');
            var tomorrowEnd = moment(moment().add(1, 'day')).endOf('day').format('YYYY-MM-DDTHH:mm:ssZD');
            var next7DaysStart = moment(moment().add(7, 'day')).startOf('day').format('YYYY-MM-DDTHH:mm:ssTZD');
            var next7DaysEnd = moment(moment().add(7, 'day')).endOf('day').format('YYYY-MM-DDTHH:mm:ssTZD');



            $scope.task_overDue = _.filter(data, function (o) { return o.status === 'Overdue'; });
            $scope.task_tomorrow = _.filter(data, function (o) { return o.due_date >= tomorrowStart && o.due_date <= tomorrowEnd; });
            $scope.task_next7days = _.filter(data, function (o) { return o.due_date >= next7DaysStart && o.due_date <= next7DaysEnd; });
            $scope.task_dataAll = res.data
            taskGrid();

        }, function (err) {

        })


        apiService.get('Contact/GetPeopleGrid/' + userID).then(function (res) {
            data = res.data;
            var todaysStart = moment().startOf('day').format('YYYY-MM-DDTHH:mm:ssZD');
            var todaysEnd = moment().endOf('day').format('YYYY-MM-DDTHH:mm:ssZD');
            var tomorrowStart = moment(moment().add(1, 'day')).startOf('day').format('YYYY-MM-DDTHH:mm:ssZD');
            var tomorrowEnd = moment(moment().add(1, 'day')).endOf('day').format('YYYY-MM-DDTHH:mm:ssZD');
            var next7DaysStart = moment(moment().add(7, 'day')).startOf('day').format('YYYY-MM-DDTHH:mm:ssZD');
            var next7DaysEnd = moment(moment().add(7, 'day')).endOf('day').format('YYYY-MM-DDTHH:mm:ssZD');



            $scope.contact_Today = _.filter(data, function (o) { return o.due_date >= todaysStart && o.due_date <= todaysEnd; });
            $scope.contact_tomorrow = _.filter(data, function (o) { return o.due_date >= tomorrowStart && o.due_date <= tomorrowEnd; });
            $scope.contact_next7days = _.filter(data, function (o) { return o.due_date >= next7DaysStart && o.due_date <= next7DaysEnd; });
            $scope.contact_dataAll = res.data
            contactGrid();

        }, function (err) {

        })




        eventGrid();


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
                $scope.contactData = $scope.contact_today;
                $('.k-i-refresh').trigger("click");


            }
            else if (taskType === 'tomorrow') {
                $scope.showContactTodayGrid = false;
                $scope.showContactTomorrowGrid = true;
                $scope.showContactNext7Grid = false;
                $scope.contactData = $scope.contact_tomorrow;
                $('.k-i-refresh').trigger("click");
            }
            else if (taskType === 'next7Days') {
                $scope.showContactTodayGrid = false;
                $scope.showContactTomorrowGrid = false;
                $scope.showContactNext7Grid = true;
                $scope.contactData = $scope.contact_next7days;
                $('.k-i-refresh').trigger("click");

            } else {
                $scope.showContactTodayGrid = false;
                $scope.showContactTomorrowGrid = false;
                $scope.showContactAll = false;
                $scope.contactData = $scope.contact_dataAll;
                $('.k-i-refresh').trigger("click");

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

                $scope.taskData = $scope.task_overDue;
                $('.k-i-refresh').trigger("click");
            }
            else if (taskType === 'tomorrow') {
                $scope.showTaskTodayGrid = false;
                $scope.showTaskTomorrowGrid = true;
                $scope.showTaskNext7Grid = false;

                $scope.taskData = $scope.task_tomorrow;
                $('.k-i-refresh').trigger("click");
            }
            else if (taskType === 'next7Days') {
                $scope.showTaskTodayGrid = false;
                $scope.showTaskTomorrowGrid = false;
                $scope.showTaskNext7Grid = true;

                $scope.taskData = $scope.task_next7days;
                $('.k-i-refresh').trigger("click");
            }
            else {
                $scope.showTaskTodayGrid = false;
                $scope.showTaskTomorrowGrid = false;
                $scope.showTaskAll = false;

                $scope.taskData = $scope.task_dataAll;
                $('.k-i-refresh').trigger("click");
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

        $scope.DoWork = function () {
            $scope.callFilter();
        };

        $scope.callFilter = function () {

            var txtdata = $scope.textareaText.toLowerCase();
            var txtdata = txtdata;
            var Firstname = "";
            var ValidFilter = false;

            var filter = [];
            var abc = [];
            var logsplit = "";

            if (txtdata.length > 0) {

                if (txtdata.split(" and ").length > txtdata.split(" or ").length) {

                    filter = { logic: "and", filters: [] };
                    logsplit = txtdata.split(" and ");
                }
                else {
                    filter = { logic: "or", filters: [] };
                    logsplit = txtdata.split(" or ");
                }

                // alert("or split value =  " + logsplit.length);
                if (logsplit.length > 0) {
                    for (var j = 0; j < logsplit.length; j++) {
                        // alert("value for j is " + j);

                        //FOR DATES 
                        var expsplitIsBefore = logsplit[j].split(" isbefore ");
                        var expsplitIsAfter = logsplit[j].split(" isafter ");
                        var expsplitBetween = logsplit[j].split(" between ");

                        var expEQ = logsplit[j].split(" = ");
                        var expIS = logsplit[j].split(" is ");

                        var expsplit = "";
                        if (expEQ.length > 1)
                            expsplit = expEQ;

                        if (expIS.length > 1)
                            expsplit = expIS;

                        var expsplitCONTAINS = logsplit[j].split(" contains ");
                        // var expsplitIN = logsplit[j].split(/in(.*)?/);

                        var expsplitIN = logsplit[j].split(" in ");

                        var expSplitGTE = logsplit[j].split(" >= ");

                        var expSplitLTE = logsplit[j].split(" <= ");

                        var expSplitGT = logsplit[j].split(" > ");

                        var expSplitLT = logsplit[j].split(" < ");




                        // CONTAINS  CHECK   
                        if (expsplitCONTAINS.length > 1) {

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "CALLER NAME" || expsplitCONTAINS[0].toUpperCase().trim() == "CALLER")
                                Firstname = "caller_name";

                            filter.filters.push({ field: Firstname.trim(), operator: "contains", value: expsplitCONTAINS[1].trim() });
                            ValidFilter = true;
                        }

                        // IN CHECK

                        if (expsplitIN.length > 1) {

                            if (expsplitIN[0].toUpperCase().trim() == "CALLER NAME" || expsplitIN[0].toUpperCase().trim() == "CALLER")
                                Firstname = "caller_name";

                            var mystring = expsplitIN[1].trim().replace(/["'\(\)]/g, "");
                            // alert(mystring);

                            var newString = mystring.split(',');
                            if (newString.length >= 1) {
                                for (var k = 0; k < newString.length; k++) {
                                    // newString
                                    filter.filters.push({ field: Firstname.trim(), operator: "contains", value: newString[k].trim() });
                                    ValidFilter = true;
                                }
                            }
                        }


                        // EQUAL TO CHECK 
                        if (expsplit.length > 1) {


                            if (expsplit[0].toUpperCase().trim() == "CALLER NAME" || expsplit[0].toUpperCase().trim() == "CALLER")
                                Firstname = "caller_name";

                            if (expsplit[0].toUpperCase().trim() == "CALLDATE")
                                Firstname = "starttime";

                            if (Firstname == "starttime") {

                                var CurrentDate = moment().startOf('day')._d;
                                var CurrentEndDate = moment().endOf('day')._d;
                                // alert(CurrentEndDate);
                                var TommDate = moment().startOf('day').add(+1, 'days')._d;
                                var YesterDayDate = moment().startOf('day').add(-1, 'days')._d;

                                // For This week 
                                /*
                                I need recent monday dates and current dates 
                                */
                                // var mondayOfCurrentWeek = moment(moment().weekday(1).format('DD/MM/YYYY'))._d;

                                var mondayOfCurrentWeek = moment().startOf('isoweek')._d;

                                // For Last week 
                                /*
                                I need recent monday dates and current dates 
                                */

                                var d = new Date();

                                // set to Monday of this week
                                d.setDate(d.getDate() - (d.getDay() + 6) % 7);

                                // set to previous Monday
                                d.setDate(d.getDate() - 7);

                                // create new date of day before
                                var lastweekmonday = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                                var lastweeksunday = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 6);

                                // Last Financial Current year 

                                var lastFinancialYearFirstDay = new Date(new Date().getFullYear() - 1, 3, 1); // last year first day of financial yr
                                var lastFinancialYearLastDay = new Date(new Date().getFullYear(), 2, 31); // current year march month

                                // Financial Current year 
                                var cfyFirstDay = new Date(new Date().getFullYear(), 3, 1);
                                // Current year 
                                var currentYearFirstDay = new Date(new Date().getFullYear(), 0, 1);
                                // Dates for Current Quarter
                                var dd = new Date();
                                var currQuarter = (dd.getMonth() - 1) / 3 + 1;

                                var firstdayOfcurrQuarter = new Date(dd.getFullYear(), 3 * currQuarter - 2, 1);
                                var lastdayOfcurrQuarter = new Date(dd.getFullYear(), 3 * currQuarter + 1, 1);
                                lastdayOfcurrQuarter.setDate(lastdayOfcurrQuarter.getDate() - 1);
                                // Dates for Current Quarter
                                var ddlast = new Date();
                                var lastQuarter = (dd.getMonth() - 1) / 3 + 4;
                                var firstdayOflastQuarter = new Date(ddlast.getFullYear(), 3 * lastQuarter - 2, 1);
                                var lastdayOflastQuarter = new Date(ddlast.getFullYear(), 3 * lastQuarter + 1, 1);
                                lastdayOflastQuarter.setDate(lastdayOflastQuarter.getDate() - 1);
                                // Current Month First date 
                                var firstDayOfCurrentMonth = new Date(CurrentDate.getFullYear(), CurrentDate.getMonth(), 1);
                                //For Last Month
                                //  First Date 
                                var firstDayPrevMonth = new Date(CurrentDate.getFullYear(), CurrentDate.getMonth() - 1, 1);
                                //Last Date
                                var lastDayPrevMonth = new Date(); // current date
                                lastDayPrevMonth.setDate(1); // going to 1st of the month
                                lastDayPrevMonth.setHours(-1); // going to last hour before this date even started.

                                if (expsplit[1].trim().toUpperCase() == "TODAY") {

                                    abc = { logic: "and", filters: [] };
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: CurrentDate });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: TommDate });
                                    filter.filters.push(abc);
                                }

                                else if (expsplit[1].trim().toUpperCase() == "YESTERDAY") {

                                    abc = { logic: "and", filters: [] };
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: YesterDayDate });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentEndDate });
                                    filter.filters.push(abc);
                                    // filter.filters.push({ field: Firstname.trim(), operator: "eq", value: YesterDayDate.toDateString() });
                                }

                                else if (expsplit[1].trim().toUpperCase() == "THIS WEEK") {

                                    abc = { logic: "and", filters: [] };
                                    if (mondayOfCurrentWeek.getDate() == CurrentDate.getDate()) {

                                        abc.filters.push({ field: Firstname.trim(), operator: "gt", value: CurrentDate });
                                        abc.filters.push({ field: Firstname.trim(), operator: "lt", value: TommDate });
                                    }
                                    else {
                                        abc.filters.push({ field: Firstname.trim(), operator: "gt", value: mondayOfCurrentWeek });
                                        abc.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentEndDate });
                                    }
                                    filter.filters.push(abc);

                                }

                                else if (expsplit[1].trim().toUpperCase() == "LAST WEEK") {

                                    abc = { logic: "and", filters: [] };
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: lastweekmonday });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: lastweeksunday });
                                    filter.filters.push(abc);
                                }

                                else if (expsplit[1].trim().toUpperCase() == "CURRENT MONTH") {

                                    abc = { logic: "and", filters: [] };
                                    //if (firstDayOfCurrentMonth.getDate() == CurrentDate.getDate()) {
                                    //    filter.filters.push({ field: Firstname.trim(), operator: "gt", value: firstDayOfCurrentMonth });
                                    //    filter.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentDate.getDate() + 1 });
                                    //}
                                    //else {
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: firstDayOfCurrentMonth });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentEndDate });
                                    filter.filters.push(abc);
                                    // }
                                }

                                else if (expsplit[1].trim().toUpperCase() == "LAST MONTH") {

                                    abc = { logic: "and", filters: [] };
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: firstDayPrevMonth });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: lastDayPrevMonth });
                                    filter.filters.push(abc);
                                }

                                else if (expsplit[1].trim().toUpperCase() == "THIS QUARTER" || expsplit[1].trim().toUpperCase() == "CURRENT QUARTER") {

                                    abc = { logic: "and", filters: [] };
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: firstdayOfcurrQuarter });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: lastdayOfcurrQuarter });
                                    filter.filters.push(abc);
                                }


                                else if (expsplit[1].trim().toUpperCase() == "LAST QUARTER") {

                                    abc = { logic: "and", filters: [] };
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: firstdayOflastQuarter });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: lastdayOflastQuarter });
                                    filter.filters.push(abc);
                                }

                                else if (expsplit[1].trim().toUpperCase() == "YEAR TO DATE") {

                                    abc = { logic: "and", filters: [] };
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: currentYearFirstDay });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentEndDate });
                                    filter.filters.push(abc);
                                }

                                else if (expsplit[1].trim().toUpperCase() == "THIS FINANCIAL YEAR") {

                                    abc = { logic: "and", filters: [] };
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: cfyFirstDay });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentEndDate });
                                    filter.filters.push(abc);
                                }

                                else if (expsplit[1].trim().toUpperCase() == "LAST FINANCIAL YEAR") {

                                    abc = { logic: "and", filters: [] };
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: lastFinancialYearFirstDay });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: lastFinancialYearLastDay });
                                    filter.filters.push(abc);
                                }

                                else if (expsplit[1].trim().toUpperCase() == "NEVER") {

                                    abc = { logic: "and", filters: [] };
                                    abc.filters.push({ field: Firstname.trim(), operator: "eq", value: undefined });
                                    filter.filters.push(abc);
                                }
                                else {
                                    //new chnage 9-4-16
                                    abc = { logic: "and", filters: [] };

                                    var Date1 = moment(expsplit[1].trim(), 'D/M/YYYY');
                                    var Datex = moment(expsplit[1].trim(), 'D/M/YYYY');
                                    var Date2 = Datex.add('days', 1);

                                    abc.push({ field: Firstname.trim(), operator: "gt", value: Date1 });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: Date2 });
                                    filter.filters.push(abc);
                                }
                            }

                            else {
                                if (expsplit[1].toUpperCase().trim() == "BLANK") {
                                    filter.filters.push({ field: Firstname.trim(), operator: "eq", value: undefined });
                                }
                                else {
                                    filter.filters.push({ field: Firstname.trim(), operator: "eq", value: expsplit[1].trim() });
                                }
                            }
                            ValidFilter = true;

                        }


                        // IS BEFORE CHECK

                        if (expsplitIsBefore.length > 1) {

                            if (expsplitIsBefore[0].toUpperCase().trim() == "CALLDATE")
                                Firstname = "starttime";
                            else {
                                alert(" Invalid Operator cannot be assigned to " + expsplitIsBefore[0]);
                                return;
                            }

                            filter.filters.push({ field: Firstname.trim(), operator: "lt", value: moment(expsplitIsBefore[1].trim(), 'DD-MM-YYYY')._d });
                            ValidFilter = true;
                        }

                        // IS AFTER CHECK

                        if (expsplitIsAfter.length > 1) {

                            if (expsplitIsAfter[0].toUpperCase().trim() == "CALLDATE")
                                Firstname = "starttime";
                            else {
                                alert(" Invalid Operator cannot be assigned to " + expsplitIsAfter[0]);
                                return;
                            }
                            filter.filters.push({ field: Firstname.trim(), operator: "gt", value: moment(expsplitIsAfter[1].trim(), 'DD-MM-YYYY')._d });
                            ValidFilter = true;
                        }

                        // 

                        // BETWEEN OR CHECK 
                        if (expsplitBetween.length > 1) {

                            if (expsplitBetween[0].toUpperCase().trim() == "CALLDATE")
                                Firstname = "starttime";
                            else {
                                alert(" Invalid Operator cannot be assigned to " + expsplitBetween[0]);
                                return;
                            }

                            var InnerBetweenSplit = expsplitBetween[1].split("||");

                            if (InnerBetweenSplit.length > 1) {

                                abc = { logic: "and", filters: [] };

                                abc.filters.push({ field: Firstname.trim(), operator: "gte", value: moment(InnerBetweenSplit[0].trim().toString(), 'DD-MM-YYYY').startOf('day')._d });
                                abc.filters.push({ field: Firstname.trim(), operator: "lte", value: moment(InnerBetweenSplit[1].trim().toString(), 'DD-MM-YYYY').endOf('day')._d });
                                filter.filters.push(abc);

                                ValidFilter = true;
                            }
                        }

                    } //for loop 
                } // if loop
            } //if loop MAIN


            // final code to get execute....
            // 11-04-2016

            if (Firstname == "") {
                alert("Invalid Feild.");
                return;
            }

            if (ValidFilter == true) {
                var ds = $('#project-record-list').getKendoGrid().dataSource;

                ds.filter(filter);
            }
            else {
                alert("Please Check Query ! ");
            }
        }

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
