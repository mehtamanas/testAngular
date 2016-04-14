angular.module('task')

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
                        if ($localStorage.common_taskDataSource)
                        { options.success($localStorage.common_taskDataSource); }
                        else {
                            apiService.getWithoutCaching("ToDoItem/GetTaskByRole?id=" + userId).then(function (response) {
                                data = response.data;
                                $localStorage.common_taskDataSource = data;
                                options.success(data);
                            }, function (error) {
                                options.error(error);
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
            height: screen.height - 370,
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
               format: '{0:dd/MM/yyyy hh:mm:ss tt}',
               attributes:
             {
                 "style": "text-align:center;cursor:pointer"
             }

           }, {
               field: "due_date",
               title: "Due Date",
               width: "120px",
               format: '{0:dd/MM/yyyy hh:mm:ss tt}',
               attributes:
             {
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


           }, {
               field:"status",
               template: '<span id="#= status #"></span>',
               title: "Status",
               width: "120px",
               attributes:
             {
                 "style": "text-align:center;cursor:pointer"
             }

           }, ]
        };


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
                    $state.go('app.edit_task', { id: dataItem.task_id });
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
    }

);