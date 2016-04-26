angular.module('task')

.controller('TaskGridController',
    function ($scope, $state, security, $cookieStore, apiService, $rootScope, $modal, $window, $localStorage) {

        var orgID = $cookieStore.get('orgID');

        $rootScope.title = 'Dwellar./Task';
        $scope.gridView = 'default';
        var userId = $cookieStore.get('userId');
        $scope.task = $cookieStore.get('task');
        $scope.selectedTaskID = window.sessionStorage.selectedTaskID;

        $scope.getTaskFromDb = function () {
            apiService.getWithoutCaching("ToDoItem/GetTaskByRole?id=" + userId).then(function (res) {
                data = res.data;
                delete $localStorage.common_taskDataSource;
                $localStorage.common_taskDataSource = data;
                $('.k-i-refresh').trigger("click");
            }, function (err) {
            })
        }

        $scope.addActivityTask = function () {

            if ($scope.task == undefined) {
                alert("You must first create a task");
            }
            else {
                $scope.postData =
           {
               name: $scope.name,
               contact_id: $scope.task.contact_id,
               class_type: $scope.task.class_type,
               due_date: $scope.task.due_date,
               priority: $scope.task.priority,
               project_id: $scope.task.project_id,
               organization_id: $scope.task.organization_id,
               user_id: $scope.task.user_id,
               assign_user_id: $scope.task.assign_user_id,
               end_date_time: $scope.task.end_date_time,
               task_type_id: $scope.task.task_type_id,
               text: $scope.task.text,
               remind_me: $scope.task.remind_me,
               reminder_time: $scope.task.reminder_time,
           }
                projectUrl = "ToDoItem/CreateTask";
                apiService.post(projectUrl, $scope.postData).then(function (response) {
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
            }

        }

        $scope.advanceAcvtivityTask = function () {
            $cookieStore.put('advncActivityName', $scope.name);
            $scope.openAddtaskPopup();
        }

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
                                $localStorage.common_taskDataSource = data;
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
            filterable: false,
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
                template: "<input type='checkbox', class='checkbox' data-id='#= task_id #',  ng-click='check($event,dataItem)' />",
                title: "<input id='checkAll', type='checkbox', class='check-box' data-id='#= task_id #', ng-click='checkALL(dataItem)' />",
                // template: "<div class='checkbox c-checkbox needsclick'><label class='needsclick'><input type='checkbox' required='' name='checkbox' ng-model='checkbox' class='checkbox needsclick ng-dirty ng-valid-parse ng-touched ng-not-empty ng-valid ng-valid-required',  ng-click='check($event,dataItem)' style=''><span class='fa fa-check'></span></label></div>",
                //title: "<div class='checkbox c-checkbox needsclick'><label class='needsclick'><input id='checkAll' type='checkbox' required='' name='checkbox' ng-model='checkbox' class='check-box needsclick ng-dirty ng-valid-parse ng-touched ng-not-empty ng-valid ng-valid-required',  ng-click='checkALL(dataItem)' style=''><span class='fa fa-check'></span></label></div>",
                width: "60px",
                attributes:
                  {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
            }, {
                field: "name",
                //template: '<a ui-sref="app.edit_task({id:dataItem.task_id})" href="" class="contact_name">#=name#</a>',
                template: '#if (status!="Completed") {# <a ui-sref="app.edit_task({id:dataItem.task_id})" href="" class="contact_name">#=name#</a> #} else {#<a ng-click="taskComplete()" href="">#=name#</a>#}#',
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
            },

            {
                field: "start_date_timeFormatted",
                title: "Start Date",
                width: "120px",
                type: 'string',
                filterable: {
                    ui: "datepicker"
                },
                format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                attributes:
              {
                  "style": "text-align:center;cursor:pointer"
              }

            },
            {
                field: "start_date_time",
                title: "Start Date",
                width: "120px",
                hidden: true,
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
           }

           ,
            {
                field: "task_code",
                title: "TASK CODE",
                hidden: false,
                width: "120px",
                attributes:
               {
                   "style": "text-align:center;cursor:pointer"
               }
            }

           , {
               title: "postpone",
               template: '#if (status!="Completed") {# <a class="btn btn-primary" id="postpone_now" ng-click="openPostpone(dataItem)">Postpone</a> #}#',
               attributes:
             {
                 "style": "text-align:center"
             }

           }, ]
        };

        $scope.checkALL = function (e) {
            if ($('.check-box:checked').length > 0)
                $('.checkbox').prop('checked', true);
            else
                $('.checkbox').prop('checked', false);
        };

        $scope.chooseAction = function () {
            var allGridElements = $(".checkbox").toArray();
            var allCheckedElement = _.filter(allGridElements, function (o)
            { return o.checked });
            allCheckedIds = (_.pluck(allCheckedElement, 'dataset.id'));
            $cookieStore.remove('checkedIds');
            $cookieStore.put('checkedIds', allCheckedIds);

            if (allCheckedIds.length > 0) {

                if ($scope.activityAction === "no_action") {

                }
                else if ($scope.activityAction === "bulk_assign") {
                    $state.go($scope.openAssignTo());
                }
                else if ($scope.activityAction === "delete") {
                    var contactDelete = [];
                    for (var i in allCheckedIds) {
                        var contact = {};
                        contact.id = allCheckedIds[i];
                        contact.organization_id = $cookieStore.get('orgID');
                        contactDelete.push(contact);
                    }
                    $cookieStore.put('contactDelete', contactDelete);
                    $scope.openConfirmation();
                }
            }
        }


        $scope.taskComplete = function () {
            alert("Task is Complete..You Can't Edit")
        }

        $scope.openAssignTo = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'task/Activity_assignto.html',
                backdrop: 'static',
                controller: ActivityBulkController,
                size: 'lg'

            });
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
            $state.go('app.add_new_task', { activityName: $scope.name });
        };// add new contact page


        //Audit log start															
        // $scope.params =
        //     {
        //         device_os: $cookieStore.get('Device_os'),
        //         device_type: $cookieStore.get('Device'),
        //         device_mac_id: "34:#$::43:434:34:45",
        //         module_id: "Contact",
        //         action_id: "Contact View",
        //         details: "PropertyView",
        //         application: "angular",
        //         browser: $cookieStore.get('browser'),
        //         ip_address: $cookieStore.get('IP_Address'),
        //         location: $cookieStore.get('Location'),
        //         organization_id: $cookieStore.get('orgID'),
        //         User_ID: $cookieStore.get('userId')
        //     };

        // AuditCreate = function (param) {
        //     apiService.post("AuditLog/Create", param).then(function (response) {
        //         var loginSession = response.data;
        //     },
        //function (error) {
        //    if (error.status === 400)
        //        alert(error.data.Message);
        //    else
        //        alert("Network issue");
        //});
        // };
        // AuditCreate($scope.params);

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


        var outTaskGridRefresh = function () {
            apiService.getWithoutCaching("ToDoItem/GetTaskByRole?id=" + userId).then(function (response) {
                data = response.data;
                $localStorage.common_taskDataSource = data;
                $('.k-i-refresh').trigger("click");
            })
        }


        $rootScope.$on('REFRESH', function (event, args) {

            if (args.name == 'outTaskGrid') {
                if (args.action === 'add') {
                    $localStorage.common_taskDataSource = [];
                    outTaskGridRefresh();
                    $('.k-i-refresh').trigger("click");
                }
                else if (args.action === 'edit') {
                    $localStorage.common_taskDataSource = [];
                    outTaskGridRefresh();
                    $('.k-i-refresh').trigger("click");
                }
                else if (args.action == 'postpone') {
                    $localStorage.common_taskDataSource = [];
                    outTaskGridRefresh();
                    $('.k-i-refresh').trigger("click");
                }
                else if (args.action === 'complete') {
                    $localStorage.common_taskDataSource = [];
                    outTaskGridRefresh();
                    $('.k-i-refresh').trigger("click");
                }
                else if (args.action === 'assign_to') {
                    $localStorage.common_taskDataSource = [];
                    outTaskGridRefresh();
                    $('.k-i-refresh').trigger("click");
                }

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
                            $('#project-record-list').getKendoGrid().dataSource.sort({});
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
            if (txtdata != '')
                $scope.callFilter();
        };

        $scope.callFilter = function () {


            var txtdata = $scope.textareaText.toLowerCase();
            var txtdata = txtdata;
            var Firstname = "";
            var ValidFilter = false;
            var ValidClause = false;
            var filter = [];
            var abc = [];
            var logsplit = "";

            if (txtdata.length > 0) {

                var pos = txtdata.indexOf("order by");
                var aryClause = txtdata.split(" order by ");
                var feild1 = "";
                var dir1 = "";
                var fValue = "";

                if (pos >= 0) {
                    var arydir = "";
                    if (pos == 0) {
                        if (aryClause[0].split(" asc").length > aryClause[0].split(" desc").length) {
                            arydir = aryClause[0].split(" asc");
                            dir1 = "asc";
                            var arynewClause = arydir[0].split("order by ");
                            fValue = arynewClause[1].toUpperCase().trim();
                            ValidClause = true;
                        }
                        else if (aryClause[0].split(" desc").length >= 2) {
                            arydir = aryClause[0].split(" desc");
                            dir1 = "desc";
                            var arynewClause = arydir[0].split("order by ");
                            fValue = arynewClause[1].toUpperCase().trim();
                            ValidClause = true;
                        }
                        else {
                            ValidClause = false;
                            alert("Invalid Query.");
                            return;
                        }
                    }
                    else {
                        if (aryClause[1].split(" asc").length > aryClause[1].split(" desc").length) {
                            arydir = aryClause[1].split(" asc");
                            dir1 = "asc";
                            fValue = arydir[0].toUpperCase().trim();
                            ValidClause = true;
                        }
                        else if (aryClause[1].split(" desc").length >= 2) {
                            arydir = aryClause[1].split(" desc");
                            dir1 = "desc";
                            fValue = arydir[0].toUpperCase().trim();
                            ValidClause = true;
                        }
                        else {
                            ValidClause = false;
                            alert("Invalid Query.");
                            return;
                        }
                    }

                    if (ValidClause == true) {
                        if (fValue == "TASK NAME")
                            feild1 = "name";
                        else if (fValue == "TASK TYPE")
                            feild1 = "task_type";
                        else if (fValue == "PROJECT")
                            feild1 = "Project_Name";
                        else if (fValue == "CONTACT")
                            feild1 = "Contact_Name";
                        else if (fValue == "ASSIGN TO")
                            feild1 = "user_name";
                        else if (fValue == "COMPANY")
                            feild1 = "company";
                        else if (fValue == "PRIORITY")
                            feild1 = "priority";
                        else if (fValue == "START DATE")
                            feild1 = "start_date_time";
                        else if (fValue == "Due Date")
                            feild1 = "due_date";
                        else if (fValue == "CREATED DATE")
                            feild1 = "created_date";
                        else if (fValue == "NOTES")
                            feild1 = "text";
                        else if (fValue == "STATUS")
                            feild1 = "status";
                        else if (fValue == "TASK CODE")
                            feild1 = "task_code";

                    }

                }

                if (aryClause[0].split(" and ").length > aryClause[0].split(" or ").length) {

                    filter = { logic: "and", filters: [] };
                    logsplit = aryClause[0].split(" and ");
                }
                else {
                    filter = { logic: "or", filters: [] };
                    logsplit = aryClause[0].split(" or ");
                }


                //if (txtdata.split(" and ").length > txtdata.split(" or ").length) {

                //    filter = { logic: "and", filters: [] };
                //    logsplit = txtdata.split(" and ");
                //}
                //else {
                //    filter = { logic: "or", filters: [] };
                //    logsplit = txtdata.split(" or ");
                //}


                var spiltOK = false;
                // alert("or split value =  " + logsplit.length);
                if (logsplit.length > 0) {
                    for (var j = 0; j < logsplit.length; j++) {
                        // alert("value for j is " + j);

                        var expsplitIsBefore = [];
                        var expsplitIsAfter = [];
                        var expsplitBetween = [];

                        var expsplitCONTAINS = [];
                        var expsplitDOESNOTCONTAINS = [];
                        var expsplitIN = [];
                        var expsplitNOTIN = [];
                        var expSplitGTE = [];
                        var expSplitLTE = [];
                        var expSplitGT = [];
                        var expSplitLT = [];
                        var expsplit = [];
                        var expsplitNOT = [];

                        if (spiltOK == false) {

                            var oplen = (" is before ").length;
                            var startpos = logsplit[j].indexOf(" is before ");
                            if (startpos >= 0) {
                                expsplitIsBefore[0] = logsplit[j].substr(0, startpos);
                                expsplitIsBefore[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }

                            //expsplitIsBefore = logsplit[j].split(" is before ");
                            //if (expsplitIsBefore.length > 2)
                        }

                        if (spiltOK == false) {

                            var oplen = (" is after ").length;
                            var startpos = logsplit[j].indexOf(" is after ");
                            if (startpos >= 0) {
                                expsplitIsAfter[0] = logsplit[j].substr(0, startpos);
                                expsplitIsAfter[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }
                        }

                        if (spiltOK == false) {

                            var oplen = (" between ").length;
                            var startpos = logsplit[j].indexOf(" between ");
                            if (startpos >= 0) {
                                expsplitBetween[0] = logsplit[j].substr(0, startpos);
                                expsplitBetween[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }

                        }

                        if (spiltOK == false) {

                            var oplen = (" contains ").length;
                            var startpos = logsplit[j].indexOf(" contains ");
                            if (startpos >= 0) {
                                expsplitCONTAINS[0] = logsplit[j].substr(0, startpos);
                                expsplitCONTAINS[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }
                        }

                        if (spiltOK == false) {

                            var oplen = (" does not contain ").length;
                            var startpos = logsplit[j].indexOf(" does not contain ");
                            if (startpos >= 0) {
                                expsplitDOESNOTCONTAINS[0] = logsplit[j].substr(0, startpos);
                                expsplitDOESNOTCONTAINS[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }
                        }

                        if (spiltOK == false) {
                            var oplen = (" not in ").length;
                            var startpos = logsplit[j].indexOf(" not in ");
                            if (startpos >= 0) {
                                expsplitNOTIN[0] = logsplit[j].substr(0, startpos);
                                expsplitNOTIN[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }
                        }

                        if (spiltOK == false) {
                            var oplen = (" in ").length;
                            var startpos = logsplit[j].indexOf(" in ");
                            if (startpos >= 0) {
                                expsplitIN[0] = logsplit[j].substr(0, startpos);
                                expsplitIN[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }
                        }

                        if (spiltOK == false) {

                            var oplen = (" >= ").length;
                            var startpos = logsplit[j].indexOf(" >= ");
                            if (startpos >= 0) {
                                expSplitGTE[0] = logsplit[j].substr(0, startpos);
                                expSplitGTE[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }
                        }

                        if (spiltOK == false) {

                            var oplen = (" <= ").length;
                            var startpos = logsplit[j].indexOf(" <= ");
                            if (startpos >= 0) {
                                expSplitLTE[0] = logsplit[j].substr(0, startpos);
                                expSplitLTE[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }
                        }

                        if (spiltOK == false) {

                            var oplen = (" > ").length;
                            var startpos = logsplit[j].indexOf(" > ");
                            if (startpos >= 0) {
                                expSplitGT[0] = logsplit[j].substr(0, startpos);
                                expSplitGT[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }
                        }

                        if (spiltOK == false) {

                            var oplen = (" < ").length;
                            var startpos = logsplit[j].indexOf(" < ");
                            if (startpos >= 0) {
                                expSplitLT[0] = logsplit[j].substr(0, startpos);
                                expSplitLT[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }
                        }

                        if (spiltOK == false) {

                            var oplen = (" != ").length;
                            var startpos = logsplit[j].indexOf(" != ");
                            if (startpos >= 0) {
                                expsplitNOT[0] = logsplit[j].substr(0, startpos);
                                expsplitNOT[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }
                        }

                        if (spiltOK == false) {

                            var oplen = (" = ").length;
                            var startpos = logsplit[j].indexOf(" = ");
                            if (startpos >= 0) {
                                expsplit[0] = logsplit[j].substr(0, startpos);
                                expsplit[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }
                        }

                        if (spiltOK == false) {

                            var oplen = (" is ").length;
                            var startpos = logsplit[j].indexOf(" is ");
                            if (startpos >= 0) {
                                expsplit[0] = logsplit[j].substr(0, startpos);
                                expsplit[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }
                        }


                        // CONTAINS  CHECK   
                        if (expsplitCONTAINS.length > 1) {

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "TASK NAME")
                                Firstname = "name";

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "TASK TYPE")
                                Firstname = "task_type";

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "PROJECT")
                                Firstname = "Project_Name";

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "CONTACT")
                                Firstname = "Contact_Name";

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "ASSIGN TO")
                                Firstname = "user_name";

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "COMPANY")
                                Firstname = "company";

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "PRIORITY")
                                Firstname = "priority";

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "NOTES")
                                Firstname = "text";

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "STATUS")
                                Firstname = "status";

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "TASK CODE")
                                Firstname = "task_code";



                            // by saroj on 18-04-2016

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            if (Firstname == "status" && expsplitCONTAINS[1].trim().toUpperCase() == "IN PROGRESS") {
                                expsplitCONTAINS[1] = expsplitCONTAINS[1].replace(/\s/g, '');
                            }
                            expsplitCONTAINS[1] = expsplitCONTAINS[1].replace(/"/g, "");

                            filter.filters.push({ field: Firstname.trim(), operator: "contains", value: expsplitCONTAINS[1].trim() });
                            ValidFilter = true;
                            spiltOK = false;
                        }


                        // DOES NOT CONTAINS  CHECK   
                        if (expsplitDOESNOTCONTAINS.length > 1) {

                            if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "TASK NAME")
                                Firstname = "name";

                            if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "TASK TYPE")
                                Firstname = "task_type";

                            if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "PROJECT")
                                Firstname = "Project_Name";

                            if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "CONTACT")
                                Firstname = "Contact_Name";

                            if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "ASSIGN TO")
                                Firstname = "user_name";

                            if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "COMPANY")
                                Firstname = "company";

                            if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "PRIORITY")
                                Firstname = "priority";

                            if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "NOTES")
                                Firstname = "text";

                            if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "STATUS")
                                Firstname = "status";

                            if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "TASK CODE")
                                Firstname = "task_code";

                            // by saroj on 18-04-2016

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            if (Firstname == "status" && expsplitDOESNOTCONTAINS[1].trim().toUpperCase() == "IN PROGRESS") {
                                //removing space between in progress
                                expsplitDOESNOTCONTAINS[1] = expsplitDOESNOTCONTAINS[1].replace(/\s/g, '');
                            }

                            //removing inverted commas
                            expsplitDOESNOTCONTAINS[1] = expsplitDOESNOTCONTAINS[1].replace(/"/g, "");

                            filter.filters.push({ field: Firstname.trim(), operator: "doesnotcontain", value: expsplitDOESNOTCONTAINS[1].trim() });
                            ValidFilter = true;
                            spiltOK = false;
                        }



                        // IN CHECK

                        if (expsplitIN.length > 1) {


                            if (expsplitIN[0].toUpperCase().trim() == "TASK NAME")
                                Firstname = "name";

                            if (expsplitIN[0].toUpperCase().trim() == "TASK TYPE")
                                Firstname = "task_type";

                            if (expsplitIN[0].toUpperCase().trim() == "PROJECT")
                                Firstname = "Project_Name";

                            if (expsplitIN[0].toUpperCase().trim() == "CONTACT")
                                Firstname = "Contact_Name";

                            if (expsplitIN[0].toUpperCase().trim() == "ASSIGN TO")
                                Firstname = "user_name";

                            if (expsplitIN[0].toUpperCase().trim() == "COMPANY")
                                Firstname = "company";

                            if (expsplitIN[0].toUpperCase().trim() == "PRIORITY")
                                Firstname = "priority";

                            if (expsplitIN[0].toUpperCase().trim() == "NOTES")
                                Firstname = "text";

                            if (expsplitIN[0].toUpperCase().trim() == "STATUS")
                                Firstname = "status";

                            if (expsplitIN[0].toUpperCase().trim() == "TASK CODE")
                                Firstname = "task_code";

                            // by saroj on 18-04-2016

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            var mystring = expsplitIN[1].trim().replace(/["'\(\)]/g, "");
                            // alert(mystring);

                            var newString = mystring.split(',');

                            abc = { logic: "or", filters: [] };

                            if (newString.length >= 1) {
                                for (var k = 0; k < newString.length; k++) {
                                    if (Firstname == "status" && newString[k].trim().toUpperCase() == "IN PROGRESS") {
                                        //removing space between in progress
                                        newString[k] = newString[k].replace(/\s/g, '');
                                    }
                                    //removing inverted commas
                                    newString[k] = newString[k].replace(/"/g, "");

                                    abc.filters.push({ field: Firstname.trim(), operator: "contains", value: newString[k].trim() });
                                }
                                filter.filters.push(abc);
                                ValidFilter = true;
                                spiltOK = false;
                            }
                        }


                        // NOT IN CHECK

                        if (expsplitNOTIN.length > 1) {

                            if (expsplitNOTIN[0].toUpperCase().trim() == "TASK NAME")
                                Firstname = "name";

                            if (expsplitNOTIN[0].toUpperCase().trim() == "TASK TYPE")
                                Firstname = "task_type";

                            if (expsplitNOTIN[0].toUpperCase().trim() == "PROJECT")
                                Firstname = "Project_Name";

                            if (expsplitNOTIN[0].toUpperCase().trim() == "CONTACT")
                                Firstname = "Contact_Name";

                            if (expsplitNOTIN[0].toUpperCase().trim() == "ASSIGN TO")
                                Firstname = "user_name";

                            if (expsplitNOTIN[0].toUpperCase().trim() == "COMPANY")
                                Firstname = "company";

                            if (expsplitNOTIN[0].toUpperCase().trim() == "PRIORITY")
                                Firstname = "priority";

                            if (expsplitNOTIN[0].toUpperCase().trim() == "NOTES")
                                Firstname = "text";

                            if (expsplitNOTIN[0].toUpperCase().trim() == "STATUS")
                                Firstname = "status";

                            if (expsplitNOTIN[0].toUpperCase().trim() == "TASK CODE")
                                Firstname = "task_code";

                            // by saroj on 18-04-2016

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            var mystring = expsplitNOTIN[1].trim().replace(/["'\(\)]/g, "");
                            // alert(mystring);

                            var newString = mystring.split(',');
                            abc = { logic: "and", filters: [] };

                            if (newString.length >= 1) {
                                for (var k = 0; k < newString.length; k++) {
                                    if (Firstname == "status" && newString[k].trim().toUpperCase() == "IN PROGRESS") {
                                        // removing space between in progress
                                        newString[k] = newString[k].replace(/\s/g, '');
                                    }
                                    //removing inverted commas
                                    newString[k] = newString[k].replace(/"/g, "");
                                    abc.filters.push({ field: Firstname.trim(), operator: "doesnotcontain", value: newString[k].trim() });
                                }
                                filter.filters.push(abc);
                                ValidFilter = true;
                                spiltOK = false;
                            }

                        }


                        // EQUAL TO CHECK 
                        if (expsplit.length > 1) {

                            if (expsplit[0].toUpperCase().trim() == "TASK NAME")
                                Firstname = "name";

                            if (expsplit[0].toUpperCase().trim() == "TASK TYPE")
                                Firstname = "task_type";

                            if (expsplit[0].toUpperCase().trim() == "PROJECT")
                                Firstname = "Project_Name";

                            if (expsplit[0].toUpperCase().trim() == "CONTACT")
                                Firstname = "Contact_Name";

                            if (expsplit[0].toUpperCase().trim() == "ASSIGN TO")
                                Firstname = "user_name";

                            if (expsplit[0].toUpperCase().trim() == "COMPANY")
                                Firstname = "company";

                            if (expsplit[0].toUpperCase().trim() == "PRIORITY")
                                Firstname = "priority";

                            if (expsplit[0].toUpperCase().trim() == "NOTES")
                                Firstname = "text";

                            if (expsplit[0].toUpperCase().trim() == "STATUS")
                                Firstname = "status";

                            if (expsplit[0].toUpperCase().trim() == "DUE DATE")
                                Firstname = "due_date";

                            if (expsplit[0].toUpperCase().trim() == "CREATED DATE")
                                Firstname = "created_date";

                            if (expsplit[0].toUpperCase().trim() == "START DATE")
                                Firstname = "start_date_time";

                            if (expsplit[0].toUpperCase().trim() == "TASK CODE")
                                Firstname = "task_code";


                            // by saroj on 18-04-2016

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            if (Firstname == "due_date" || Firstname == "created_date" || Firstname == "start_date_time") {

                                var prevQuarterStartDay = moment(moment().startOf('quarter')).add('quarter', -1)._d;
                                var prevQuarterEndDay = moment(moment().endOf('quarter')).add('quarter', -1)._d;

                                var CurrentDate = moment().startOf('day')._d;
                                var CurrentEndDate = moment().endOf('day')._d;
                                var TommDate = moment().startOf('day').add(+1, 'days')._d;
                                var TommEndDate = moment().endOf('day').add(+1, 'days')._d;
                                var next7Day = moment().endOf('day').add(+8, 'days')._d;
                                var YesterDayDate = moment().startOf('day').add(-1, 'days')._d;
                                var mondayOfCurrentWeek = moment().startOf('isoweek')._d;

                                var d = new Date();
                                // set to Monday of this week
                                d.setDate(d.getDate() - (d.getDay() + 6) % 7);
                                // set to previous Monday
                                d.setDate(d.getDate() - 7);

                                //last week
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

                                //removing inverted commas
                                expsplit[1] = expsplit[1].replace(/"/g, "");
                                // alert(expsplit[1]);

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
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: firstDayOfCurrentMonth });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentEndDate });
                                    filter.filters.push(abc);
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
                                    if (Firstname == "status" && expsplit[1].trim().toUpperCase() == "IN PROGRESS") {
                                        expsplit[1] = expsplit[1].replace(/\s/g, '');
                                    }
                                    //removing inverted commas
                                    expsplit[1] = expsplit[1].replace(/"/g, "");
                                    filter.filters.push({ field: Firstname.trim(), operator: "eq", value: expsplit[1].trim() });
                                }
                            }


                            ValidFilter = true;
                            spiltOK = false;
                        }

                        // NOT EQUAL TO CHECK 
                        if (expsplitNOT.length > 1) {

                            if (expsplitNOT[0].toUpperCase().trim() == "TASK NAME")
                                Firstname = "name";

                            if (expsplitNOT[0].toUpperCase().trim() == "TASK TYPE")
                                Firstname = "task_type";

                            if (expsplitNOT[0].toUpperCase().trim() == "PROJECT")
                                Firstname = "Project_Name";

                            if (expsplitNOT[0].toUpperCase().trim() == "CONTACT")
                                Firstname = "Contact_Name";

                            if (expsplitNOT[0].toUpperCase().trim() == "ASSIGN TO")
                                Firstname = "user_name";

                            if (expsplitNOT[0].toUpperCase().trim() == "COMPANY")
                                Firstname = "company";

                            if (expsplitNOT[0].toUpperCase().trim() == "PRIORITY")
                                Firstname = "priority";

                            if (expsplitNOT[0].toUpperCase().trim() == "NOTES")
                                Firstname = "text";

                            if (expsplitNOT[0].toUpperCase().trim() == "STATUS")
                                Firstname = "status";

                            if (expsplitNOT[0].toUpperCase().trim() == "DUE DATE")
                                Firstname = "due_date";

                            if (expsplitNOT[0].toUpperCase().trim() == "CREATED DATE")
                                Firstname = "created_date";

                            if (expsplitNOT[0].toUpperCase().trim() == "START DATE")
                                Firstname = "start_date_time";


                            if (expsplitNOT[0].toUpperCase().trim() == "TASK CODE")
                                Firstname = "task_code";

                            if (Firstname == "") {
                                // 18-04-2016
                                //saroj
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            if (expsplitNOT[1].toUpperCase().trim() == "BLANK") {
                                filter.filters.push({ field: Firstname.trim(), operator: "neq", value: undefined });
                            }
                            else {
                                //removing inverted commas
                                expsplitNOT[1] = expsplitNOT[1].replace(/"/g, "");

                                filter.filters.push({ field: Firstname.trim(), operator: "neq", value: expsplitNOT[1].trim() });
                            }

                            ValidFilter = true;
                            spiltOK = false;
                        }


                        // IS BEFORE CHECK

                        if (expsplitIsBefore.length > 1) {

                            if (expsplitIsBefore[0].toUpperCase().trim() == "DUE DATE")
                                Firstname = "due_date";

                            else if (expsplitIsBefore[0].toUpperCase().trim() == "CREATED DATE")
                                Firstname = "created_date";

                            else if (expsplitIsBefore[0].toUpperCase().trim() == "START DATE")
                                Firstname = "start_date_time";

                            // by saroj on 18-04-2016


                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            var CurrentDate = moment().endOf('day')._d;;
                            var YesterDayDate = moment().endOf('day').add(-1, 'days')._d;
                            var beforeYesterDayDate = moment().endOf('day').add(-2, 'days')._d;


                            if (expsplitIsBefore[1].trim().toUpperCase() == "TODAY") {

                                //abc = { logic: "and", filters: [] };
                                filter.filters.push({ field: Firstname.trim(), operator: "lt", value: YesterDayDate });
                                //abc.filters.push({ field: Firstname.trim(), operator: "lt", value: TommDate });
                                // filter.filters.push(abc);
                                ValidFilter = true;
                                spiltOK = false;
                            }

                            else if (expsplitIsBefore[1].trim().toUpperCase() == "TOMORROW") {

                                // abc = { logic: "and", filters: [] };
                                filter.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentDate });
                                // abc.filters.push({ field: Firstname.trim(), operator: "lt", value: TommEndDate });
                                // filter.filters.push(abc);
                                ValidFilter = true;
                                spiltOK = false;
                            }

                            else if (expsplitIsBefore[1].trim().toUpperCase() == "YESTERDAY") {

                                //   abc = { logic: "and", filters: [] };
                                filter.filters.push({ field: Firstname.trim(), operator: "lt", value: beforeYesterDayDate });
                                //abc.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentDate });
                                //filter.filters.push(abc);
                                ValidFilter = true;
                                spiltOK = false;
                            }

                            else {

                                //removing inverted commas
                                expsplitIsBefore[1] = expsplitIsBefore[1].replace(/"/g, "");

                                filter.filters.push({ field: Firstname.trim(), operator: "lt", value: moment(expsplitIsBefore[1].trim(), 'DD-MM-YYYY')._d });
                                ValidFilter = true;
                                spiltOK = false;
                            }


                        }

                        // IS AFTER CHECK

                        if (expsplitIsAfter.length > 1) {

                            if (expsplitIsAfter[0].toUpperCase().trim() == "DUE DATE")
                                Firstname = "due_date";

                            else if (expsplitIsAfter[0].toUpperCase().trim() == "CREATED DATE")
                                Firstname = "created_date";

                            else if (expsplitIsAfter[0].toUpperCase().trim() == "START DATE")
                                Firstname = "start_date_time";

                            // by saroj on 18-04-2016

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }



                            var CurrentDate = moment().endOf('day')._d;;
                            var YesterDayDate = moment().endOf('day').add(-1, 'days')._d;
                            var TommDate = moment().endOf('day').add(+1, 'days')._d;


                            if (expsplitIsAfter[1].trim().toUpperCase() == "TODAY") {

                                //abc = { logic: "and", filters: [] };
                                filter.filters.push({ field: Firstname.trim(), operator: "gt", value: CurrentDate });
                                //abc.filters.push({ field: Firstname.trim(), operator: "lt", value: TommDate });
                                // filter.filters.push(abc);
                                ValidFilter = true;
                                spiltOK = false;
                            }

                            else if (expsplitIsAfter[1].trim().toUpperCase() == "TOMORROW") {

                                // abc = { logic: "and", filters: [] };
                                filter.filters.push({ field: Firstname.trim(), operator: "gt", value: TommDate });
                                // abc.filters.push({ field: Firstname.trim(), operator: "lt", value: TommEndDate });
                                // filter.filters.push(abc);
                                ValidFilter = true;
                                spiltOK = false;
                            }

                            else if (expsplitIsAfter[1].trim().toUpperCase() == "YESTERDAY") {

                                //   abc = { logic: "and", filters: [] };
                                filter.filters.push({ field: Firstname.trim(), operator: "gt", value: YesterDayDate });
                                //abc.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentDate });
                                //filter.filters.push(abc);
                                ValidFilter = true;
                                spiltOK = false;
                            }
                            else {
                                
                                //removing inverted commas

                                expsplitIsAfter[1] = expsplitIsAfter[1].replace(/"/g, "");
                                filter.filters.push({ field: Firstname.trim(), operator: "gt", value: moment(expsplitIsAfter[1], "DD-MM-YYYY").add('day', 1)._d });
                                ValidFilter = true;
                                spiltOK = false;
                            }

                        }

                        // BETWEEN OR CHECK 
                        if (expsplitBetween.length > 1) {

                            if (expsplitBetween[0].toUpperCase().trim() == "DUE DATE")
                                Firstname = "due_date";

                            else if (expsplitBetween[0].toUpperCase().trim() == "CREATED DATE")
                                Firstname = "created_date";

                            else if (expsplitBetween[0].toUpperCase().trim() == "START DATE")
                                Firstname = "start_date_time";

                            // by saroj on 18-04-2016

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            var InnerBetweenSplit = expsplitBetween[1].split("&&");

                            if (InnerBetweenSplit.length > 1) {

                                abc = { logic: "and", filters: [] };

                                //removing inverted commas
                                InnerBetweenSplit[0] = InnerBetweenSplit[0].replace(/"/g, "");

                                //removing inverted commas
                                InnerBetweenSplit[1] = InnerBetweenSplit[1].replace(/"/g, "");

                                abc.filters.push({ field: Firstname.trim(), operator: "gte", value: moment(InnerBetweenSplit[0].trim().toString(), 'DD-MM-YYYY').startOf('day')._d });
                                abc.filters.push({ field: Firstname.trim(), operator: "lte", value: moment(InnerBetweenSplit[1].trim().toString(), 'DD-MM-YYYY').endOf('day')._d });
                                filter.filters.push(abc);
                                ValidFilter = true;
                                spiltOK = false;
                            }
                        }

                    } //for loop 
                } // if loop
            } //if loop MAIN


            // final code to get execute....


            if (Firstname == "" && ValidClause == false) {
                alert("Invalid Query.");
                return;
            }

            if (ValidFilter == true && ValidClause == false) {
                var ds = $('#project-record-list').getKendoGrid().dataSource;
                ds.filter(filter);
                // alert('Query Executed Successfully.');
            }
            else if (ValidFilter == false && ValidClause == true) {
                var dsSort = [];
                dsSort.push({ field: feild1, dir: dir1 });
                var ds = $('#project-record-list').getKendoGrid().dataSource;
                ds.sort(dsSort);
                //  alert('Query Executed Successfully.');
            }
            else if (ValidFilter == true && ValidClause == true) {
                var dsSort = [];
                dsSort.push({ field: feild1, dir: dir1 });
                var ds = $('#project-record-list').getKendoGrid().dataSource;
                ds.filter(filter);
                ds.sort(dsSort);
                // alert('Query Executed Successfully.');
            }
            else {
                alert("Please Check Query.");
            }

        }



        $scope.clearFilter = function () {
            $('#project-record-list').getKendoGrid().dataSource.filter({});
            $('#project-record-list').getKendoGrid().dataSource.sort({});
            $scope.textareaText = ''
            $scope.gridView = 'default';
        }
    }

);