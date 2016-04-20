﻿angular.module('task')

.controller('TaskGridController',
    function ($scope, $state, security, $cookieStore, apiService, $rootScope, $modal, $window, $localStorage) {

        var orgID = $cookieStore.get('orgID');

        $rootScope.title = 'Dwellar./Task';

        var userId = $cookieStore.get('userId');

        $scope.selectedTaskID = window.sessionStorage.selectedTaskID;

        $scope.TaskGrid = {
            dataSource: {
                type: "json",
                transport: {
                    //read: apiService.baseUrl + "ToDoItem/GetTaskByRole?id=" + userId
                    read: function (options) {
                        if ($localStorage.common_taskDataSource) {
                            options.success($localStorage.common_taskDataSource);
                        } else {
                            apiService.getWithoutCaching("ToDoItem/GetTaskByRole?id=" + userId).then(function (res) {
                                data = res.data;
                                $localStorage.common_taskDataSource = [];
                                $localStorage.common_taskDataSource=data;
                                options.success(data);
                            }, function (err) {
                                options.error();
                            })
                        }
                    }
                },
                pageSize: 20,

                schema: {
                    model: {
                        fields: {
                            due_date: { type: "date" },
                            start_date_time: { type: "date" },
                            created_date: { type: "date" },
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
            height: window.innerHeight - 180,
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
                //template: "<input type='checkbox', class='checkbox',  ng-click='check($event,dataItem)' />",
                //title: "<input id='checkAll', type='checkbox', class='check-box', ng-click='checkALL(dataItem)' />",
                template: "<div class='checkbox c-checkbox needsclick'><label class='needsclick'><input type='checkbox' required='' name='checkbox' ng-model='checkbox' class='checkbox needsclick ng-dirty ng-valid-parse ng-touched ng-not-empty ng-valid ng-valid-required',  ng-click='check($event,dataItem)' style=''><span class='fa fa-check'></span></label></div>",
                title: "<div class='checkbox c-checkbox needsclick'><label class='needsclick'><input id='checkAll' type='checkbox' required='' name='checkbox' ng-model='checkbox' class='check-box needsclick ng-dirty ng-valid-parse ng-touched ng-not-empty ng-valid ng-valid-required',  ng-click='checkALL(dataItem)' style=''><span class='fa fa-check'></span></label></div>",
                width: "60px",
                attributes:
                  {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
            }, {
                field: "name",
                template: '<a ui-sref="app.edit_task({id:dataItem.task_id})" href="" class="contact_name">#=name#</a>',
                title: "Task Name",
                width: "120px",
                attributes:
             {
                 "style": "text-align:center;cursor:pointer"

             }

            }, {
                field: "task_type",
                title: "Task Type",
                attributes:
                 {
                     "style": "text-align:center"
                 }
            }, {
                field: "Project_Name",
                title: "Project",
                width: "120px",
                attributes:
             {
                 "style": "text-align:center;cursor:pointer"
             }

            }, {
                field: "Contact_Name",
                title: "Contact",
                width: "120px",
                attributes:
             {
                 "style": "text-align:center;cursor:pointer"
             }

            }, {
                field: "user_name",
                title: "Assign To",
                width: "120px",
                attributes:
             {
                 "style": "text-align:center;cursor:pointer"
             }

            }, {
                field: "company",
                title: "Company",
                width: "120px",
                attributes:
             {
                 "style": "text-align:center;cursor:pointer"
             }
            }, {
                field: "priority",
                title: "Priority",
                width: "120px",
                attributes:
              {
                  "style": "text-align:center;cursor:pointer"
              }
            }, {
                field: "start_date_time",
                title: "Start Date",
                width: "120px",
                type: 'date',
                filterable: {
                    ui: "datepicker"
                },
                format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                attributes:
              {
                  "style": "text-align:center;cursor:pointer"
              }

            }, {
                field: "due_date",
                title: "Due Date",
                width: "120px",
                type: 'date',
                filterable: {
                    ui: "datepicker"
                },
                format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                attributes:
              {
                  "style": "text-align:center;cursor:pointer"
              }

            },

             //saroj on 15-04-2016
           {
               field: "created_date",
               hidden: true,
               title: "Created Date",
               width: "120px",
               type: 'date',
               filterable: {
                   ui: "datepicker"
               },
               format: '{0:dd/MM/yyyy hh:mm:ss tt}',
               attributes: {
                  
                   "style": "text-align:center;cursor:pointer"
               }
           },
           {
               field: "text",
               title: "Notes",
               width: "120px",
               attributes:
             {
                 "style": "text-align:center;cursor:pointer"
             }

           },
           {
               field: "status",
               template: '<span id="#= status #"></span>',
               title: "Status",
               width: "120px",
               attributes:
             {
                 "style": "text-align:center;cursor:pointer"
             }

           }, {
               title: "postpone",
               template: '#if (status!="Completed") {# <a class="btn btn-primary" id="postpone_now" ng-click="openPostpone(dataItem)">Postpone</a> #}#',
               attributes:
             {
                 "style": "text-align:center"
             }

           }, ]
        };


        $scope.openPostpone = function (d) {
            $scope.taskID = d.task_id;
            window.sessionStorage.selectedCustomerID = $scope.taskID;
            $cookieStore.put('company_name', d.company_name);
            $cookieStore.put('contactID', d.contact_id);
            $cookieStore.put('lead_name', d.Contact_name);
            $cookieStore.put('task_name', d.name);
            $cookieStore.put('taskID', $scope.taskID);
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/postponed/taskpostponed.html',
                backdrop: 'static',
                controller: postponedController,
                size: 'lg'

            });

        };

        //$scope.openAddtaskPopup = function () {
        //    var modalInstance = $modal.open({
        //        animation: true,
        //        templateUrl: 'task/add_new_task.tpl.html',
        //        backdrop: 'static',
        //        controller: AddTaskController,
        //        size: 'lg'

        //    });
        //    $rootScope.$broadcast('REFRESH', 'TaskGrid');
        //};

        $scope.openAddtaskPopup = function () {
            $state.go('app.add_new_task');
        };// add new contact page


        //Audit log start															
        $scope.params =
            {
                device_os: $cookieStore.get('Device_os'),
                device_type: $cookieStore.get('Device'),
                device_mac_id: "34:#$::43:434:34:45",
                module_id: "Contact",
                action_id: "Contact View",
                details: "PropertyView",
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


        // Kendo Grid on change

        $scope.myGridChange = function (dataItem) {
            contactUrl = "ToDoItem/EditGet/" + dataItem.task_id;
            apiService.getWithoutCaching(contactUrl).then(function (response) {
                $scope.params = response.data[0];

                var stat = $scope.params.status;
                if (stat == "Completed") {
                    alert(" Completed task can not be edited...");
                }
                else {
                    window.sessionStorage.selectedTaskID = dataItem.task_id;
                   // $state.go('app.edit_task', { id: dataItem.task_id });
                    //$scope.openEditTask();
                };
            },
             function (error) {

             });
        };


        $scope.filterNow = function () {
            if ($scope.lastNameFilter)
                applyFilter('first_name', $scope.lastNameFilter);
            else
                clearFilters();

        };

        function applyFilter(filterField, filterValue) {

            // get the kendoGrid element.
            var gridData = $("#peopleGrid").data("kendoGrid");

            // get currently applied filters from the Grid.
            var currFilterObj = gridData.dataSource.filter();

            // get current set of filters, which is supposed to be array.
            // if the oject we obtained above is null/undefined, set this to an empty array
            var currentFilters = currFilterObj ? currFilterObj.filters : [];

            // iterate over current filters array. if a filter for "filterField" is already
            // defined, remove it from the array
            // once an entry is removed, we stop looking at the rest of the array.
            if (currentFilters && currentFilters.length > 0) {
                for (var i = 0; i < currentFilters.length; i++) {
                    if (currentFilters[i].field == filterField) {
                        currentFilters.splice(i, 1);
                        break;
                    }
                }
            }

            // if "filterValue" is "0", meaning "-- select --" option is selected, we don't
            // do any further processing. That will be equivalent of removing the filter.
            // if a filterValue is selected, we add a new object to the currentFilters array.
            if (filterValue != "0") {
                currentFilters.push({
                    field: filterField,
                    operator: "eq",
                    value: filterValue
                });
            }

            // finally, the currentFilters array is applied back to the Grid, using "and" logic.
            gridData.dataSource.filter({
                logic: "and",
                filters: currentFilters
            });

        }

        $scope.$on('REFRESH', function (event, args) {
            if (args == 'TaskGrid') {
                $('.k-i-refresh').trigger("click");
            }
        });

        function clearFilters() {
            var gridData = $("#peopleGrid").data("kendoGrid");
            gridData.dataSource.filter({});
        }


        $scope.openEditTask = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'task/edit_task.html',
                backdrop: 'static',
                controller: EditTaskGridController,
                size: 'lg'

            });
            $rootScope.$broadcast('REFRESH', 'TaskGrid');
        };

        $scope.openPropertyPopup = function () {
            // alert("hi");
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'property/add_new_property.tpl.html',
                backdrop: 'static',
                controller: PropertyPopUpController,
                size: 'lg'
            });
        };




        // JQL code on 15-04-2016 
        //saroj

        var callViewApi = function () {

            apiService.getWithoutCaching('Notes/GetByOrgid/' + $cookieStore.get('orgID')).then(function (res) {
                $scope.views = _.filter(res.data, function (o)
                { return o.query_type === 'View' && o.grid_name === 'task' });
            }, function (err) {

            });
        }

        callViewApi();

        // for help 
        $scope.helpjqlpopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'task/Grammar_Task.html',
                backdrop: 'static',
                controller: helpjqlController,
                size: 'lg'
            });
        };


        $scope.changeView = function () {
            if ($scope.gridView !== 'default') {
                //filter by grid name
                viewObj = _.filter($scope.views, function (o)
                { return o.id === $scope.gridView });

                //get the grid datasource
                var grid = $('#project-record-list').getKendoGrid();

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
                // saroj on 14-04-2016
                // removing " " from string otherwise JQL will not work
                var str = viewObj[0].query_string;
                str = str.replace(/"/g, "");

                $scope.textareaText = str;
                grid.dataSource.filter(JSON.parse(viewObj[0].filters));
            }
            else {
                $('#project-record-list').getKendoGrid().dataSource.sort({});
                $('#project-record-list').getKendoGrid().dataSource.filter({});
                $scope.textareaText = null;
                for (i = 0; i < $('#project-record-list').getKendoGrid().columns.length; i++) {
                    $('#project-record-list').getKendoGrid().showColumn(i);

                }

            }

        }
        
        $scope.saveView = function () {
            var grid = $('#project-record-list').getKendoGrid();

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
                resolve: { viewData: { sort: sortObject, col: grid.columns, grid: 'task', type: 'View', filterQuery: Querydata, filterObj: grid.dataSource._filter } }
            });
        }

        $scope.editView = function () {
            if ($scope.gridView !== 'default') {
                var viewName = _.filter($scope.views, function (o)
                { return o.id == $scope.gridView });

                var grid = $('#project-record-list').getKendoGrid();

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
                    resolve: { viewData: { sort: sortObject, col: grid.columns, grid: 'task', type: 'View', filterQuery: Querydata, filterObj: grid.dataSource._filter, viewName: viewName[0].view_name, viewId: $scope.gridView, isViewDefault: viewName[0].default_view } }
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
                            $('#project-record-list').getKendoGrid().dataSource.filter({});
                            $scope.textareaText = ''
                            $scope.gridView = 'default';

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


        $scope.DoWork = function () {
            var txtdata = $scope.textareaText.toLowerCase();
            if (txtdata.text != '')
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

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "TASK NAME" || expsplitCONTAINS[0].toUpperCase().trim() == "TASK")
                                Firstname = "name";

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "ASSIGNEE" || expsplitCONTAINS[0].toUpperCase().trim() == "ASSIGN TO")
                                Firstname = "user_name";

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "STATUS")
                                Firstname = "status";

                            // by saroj on 18-04-2016

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            filter.filters.push({ field: Firstname.trim(), operator: "contains", value: expsplitCONTAINS[1].trim() });
                            ValidFilter = true;
                        }

                        // IN CHECK

                        if (expsplitIN.length > 1) {


                            if (expsplitIN[0].toUpperCase().trim() == "TASK NAME" || expsplitCONTAINS[0].toUpperCase().trim() == "TASK")
                                Firstname = "name";

                            if (expsplitIN[0].toUpperCase().trim() == "ASSIGNEE" || expsplitCONTAINS[0].toUpperCase().trim() == "ASSIGN TO")
                                Firstname = "user_name";

                            if (expsplitIN[0].toUpperCase().trim() == "STATUS")
                                Firstname = "status";

                            // by saroj on 18-04-2016

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

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

                            if (expsplit[0].toUpperCase().trim() == "TASK NAME" || expsplitCONTAINS[0].toUpperCase().trim() == "TASK")
                                Firstname = "name";

                            if (expsplit[0].toUpperCase().trim() == "ASSIGNEE" || expsplitCONTAINS[0].toUpperCase().trim() == "ASSIGN TO")
                                Firstname = "user_name";

                            if (expsplit[0].toUpperCase().trim() == "STATUS")
                                Firstname = "status";

                            if (expsplit[0].toUpperCase().trim() == "DUE DATE")
                                Firstname = "due_date";

                            if (expsplit[0].toUpperCase().trim() == "CREATED DATE")
                                Firstname = "created_date";

                           
                            // by saroj on 18-04-2016

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            if (Firstname == "due_date" || Firstname == "created_date") {


                                var prevQuarterStartDay = moment(moment().startOf('quarter')).add('quarter', -1)._d;
                                var prevQuarterEndDay = moment(moment().endOf('quarter')).add('quarter', -1)._d;


                                var CurrentDate = moment().startOf('day')._d;
                                var CurrentEndDate = moment().endOf('day')._d;
                                // alert(CurrentEndDate);

                                var TommDate = moment().startOf('day').add(+1, 'days')._d;
                                var TommEndDate = moment().endOf('day').add(+1, 'days')._d;

                                var next7Day = moment().endOf('day').add(+8, 'days')._d;
                                // alert(next7Day);

                                // alert(TommDate);
                                //  alert(TommEndDate);

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

                                else if (expsplit[1].trim().toUpperCase() == "TOMORROW") {

                                    abc = { logic: "and", filters: [] };
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: CurrentEndDate });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: TommEndDate });
                                    filter.filters.push(abc);
                                }

                                else if (expsplit[1].trim().toUpperCase() == "NEXT 7 DAYS") {

                                    abc = { logic: "and", filters: [] };
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: TommDate });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: next7Day });
                                    filter.filters.push(abc);
                                }

                                else if (expsplit[1].trim().toUpperCase() == "YESTERDAY") {

                                    abc = { logic: "and", filters: [] };
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: YesterDayDate });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentDate });
                                    filter.filters.push(abc);
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

                                else if (expsplit[1].trim().toUpperCase() == "THIS MONTH") {

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
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: prevQuarterStartDay });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: prevQuarterEndDay });
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

                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: Date1 });
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

                            if (expsplitIsBefore[0].toUpperCase().trim() == "DUE DATE")
                                Firstname = "due_date";

                            else if (expsplitIsBefore[0].toUpperCase().trim() == "CREATED DATE")
                                Firstname = "created_date";

                            // by saroj on 18-04-2016

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            filter.filters.push({ field: Firstname.trim(), operator: "lt", value: moment(expsplitIsBefore[1].trim(), 'DD-MM-YYYY')._d });
                            ValidFilter = true;
                        }

                        // IS AFTER CHECK

                        if (expsplitIsAfter.length > 1) {

                            if (expsplitIsAfter[0].toUpperCase().trim() == "DUE DATE")
                                Firstname = "due_date";

                            else if (expsplitIsAfter[0].toUpperCase().trim() == "CREATED DATE")
                                Firstname = "created_date";

                            // by saroj on 18-04-2016

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            filter.filters.push({ field: Firstname.trim(), operator: "gt", value: moment(expsplitIsAfter[1].trim(), 'DD-MM-YYYY')._d });
                            ValidFilter = true;
                        }

                 
                        // BETWEEN OR CHECK 
                        if (expsplitBetween.length > 1) {

                            if (expsplitBetween[0].toUpperCase().trim() == "DUE DATE")
                                Firstname = "due_date";

                            else if (expsplitBetween[0].toUpperCase().trim() == "CREATED DATE")
                                Firstname = "created_date";

                            // by saroj on 18-04-2016

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
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

            if (Firstname == "") {
                alert("Invalid Query.");
                return;
            }

            if (ValidFilter == true) {
                var ds = $('#project-record-list').getKendoGrid().dataSource;
                ds.filter(filter);
            }
            else {
                alert("Please Check Query.");
            }
        }

        $scope.clearFilter = function () {
            $('#project-record-list').getKendoGrid().dataSource.filter({});
            $scope.textareaText = ''
            $scope.gridView = 'default';
        }
    }

);