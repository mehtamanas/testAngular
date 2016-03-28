angular.module('team')


.controller('TeamDetailController',
    function ($scope, $state, security, $cookieStore, apiService, $window, $rootScope, $modal,teamService) {
        console.log('TeamDetailController');
        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
        $rootScope.title = 'Dwellar./TeamDetails';
        var orgID = $cookieStore.get('orgID');

       // //Audit log start
       // $scope.params = {
       //     device_os: "windows10",
       //     device_type: "mobile",
       //     device_mac_id: "34:#$::43:434:34:45",
       //     module_id: "TeamDetail",
       //     action_id: "TeamDetail View",
       //     details: "TeamDetail",
       //     application: "angular",
       //     browser: $cookieStore.get('browser'),
       //     ip_address: $cookieStore.get('IP_Address'),
       //     location: $cookieStore.get('Location'),
       //     organization_id: $cookieStore.get('orgID'),
       //     User_ID: $cookieStore.get('userId')
       // };
       // AuditCreate = function (param) {

       //     apiService.post("AuditLog/Create", param).then(function (response) {
       //         var loginSession = response.data;

       //     },
       //function (error) {
       //});
       // };
       // AuditCreate($scope.params);

        //end

        TeamUrl = "Team/GetById/" + $scope.seletedCustomerId;//f2294ca0-0fee-4c16-86af-0483a5718991";
        apiService.get(TeamUrl).then(function (response) {
            $scope.main = response.data;
            $scope.image = $scope.main[0];

        },
   function (error) {
       console.log("Error " + error.state);
   }
        );

        if ($scope.seletedCustomerId != "undefined") {

            //   GetUrl = "User/GetById/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;
            GetUrl = "Team/GetById/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;
            //alert(GetUrl);

            apiService.getWithoutCaching(GetUrl).then(function (response) {

                $scope.data = response.data;
                // alert($scope.data);
                //   alert($scope.seletedCustomerId);


                $scope.name = $scope.data[0].name;
                $scope.description = $scope.data[0].description;
             
                if ($scope.data.contact_mobile !== '') {
                    $scope.mobile = $scope.data.contact_mobile;
                }
                if ($scope.data.contact_email !== '') {
                    $scope.email = $scope.data.contact_Email;
                }
            },
                        function (error) {
                            deferred.reject(error);
                            alert("not working");
                        });
        }



        //grid functionality start
        $scope.ProjectGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "Team/GetProjectByTeam/" + $scope.seletedCustomerId
                },
                pageSize: 20
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
                title: "Name",
                width: "120px"
            }, {

                field: "description",
                title: "Description",
                width: "120px",
               
            }]
        };

        $scope.UserGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl +"Team/GetUsersByTeam/" + $scope.seletedCustomerId
                },
                pageSize: 20
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
            }, schema: {
                model: {
                    fields: {
                       
                        date: { type: "date" },
                       
                    }
                }
            },
            columns: [{
                template: "<img height='40px' width='40px' src='#= media_url #'/>" +
                "<span style='padding-left:10px' class='property-photo'> </span>",
                title: "Picture",
                width: "120px",
                attributes: {
                    "class": "UseHand",

                }
            }, {
                field: "name",
                title: "Name",
                width: "120px",

            }, {
                field: "account_email",
                title: "Email",
                width: "120px",

            }, {
                field: "account_phone",
                title: "Phone",
                width: "120px",

            },{
                field: "date",
                title: "Date",
                width: "120px",
                format: '{0:dd/MM/yyyy}'
            }]
        };

        $scope.PropertyListGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read:apiService.baseUrl + "Team/GetTeamPropertyList/" + $scope.seletedCustomerId
                },
                pageSize: 20,
                schema: {
                    model: {
                        fields: {
                            listing_date: { type: "date" },
                            last_updated_date: { type: "date" }
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
                title: "Name",
                width: "120px",
            }, {

                field: "listing_date",
                title: "Listing Date",
                width: "120px",
                format: '{0:dd/MM/yyyy}'
            }, {

                field: "last_updated_date",
                title: "Last Updated",
                width: "120px",
                format: '{0:dd/MM/yyyy}'
            }, {

                field: "built_up_area",
                title: "Built Up",
                width: "120px",

            },{
                field: "super_built_up_area",
                title: "Super Built Up ",
                width: "120px",

              }]
        };

        $scope.PeopleGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "Team/GetPeopleByTeam/" + $scope.seletedCustomerId
                },
                pageSize: 20,
                schema: {
                    model: {
                        fields: {
                            date_of_birth: { type: "date" }
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
                field: "first_name",
                title: "First Name",
                width: "50px",

            }, {
                field: "last_name",
                title: "Last Name",
                width: "50px",

            }, {
                field: "people_type",
                title: "People Type",
                width: "50px",

            }, {
                field: "date_of_birth",
                title: "Date Of Birth",
                width: "50px",

                format: '{0:dd/MM/yyyy}'
            }]
        };

        $scope.TaskGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "ToDoItem/GetMultipleTaskByTeamId/" + $scope.seletedCustomerId + "/Team"
                },
                pageSize: 20,


                schema: {
                    model: {
                        fields: {
                            created_date_time: { type: "date" },
                            start_date_time: { type: "date" },
                            end_date_time: { type: "date" }
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
                field: "team_name",
                title: "Name",
                width: "120px",

            }, {
                field: "priority",
                title: "Priority",
                width: "120px",
                format: '{0:dd/MM/yyyy}',

            }, {
                field: "description",
                title: "Description",
                width: "120px",
                format: '{0:dd/MM/yyyy}',

            },
            {
                field: "summary",
                title: "Summary",
                width: "120px",
                format: '{0:dd/MM/yyyy}',

            },
            {
                field: "text",
                title: "Text",
                width: "120px",
                format: '{0:dd/MM/yyyy}',

            },
            {
                template: "<a id='iconEdit' ng-click='openEditTask()' data-toggle='modal' style='cursor:pointer'><span class='edit-icon'></span></a>",
                width: "60px",
                attributes:
                  {
                      "class": "UseHand",
                  }
            }]
        };

        //end
       
        $scope.filterNow = function () {
            if ($scope.lastNameFilter)
                applyFilter('first_name', $scope.lastNameFilter);
            else
                clearFilters();

        };

        function applyFilter(filterField, filterValue) {

            // get the kendoGrid element.
            var gridData = $("#DocumentGrid").data("kendoGrid");

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

        function clearFilters() {
            var gridData = $("#DocumentGrid").data("kendoGrid");
            gridData.dataSource.filter({});
        }

        $scope.filterNow = function () {
            if ($scope.lastNameFilter)
                applyFilter('first_name', $scope.lastNameFilter);
            else
                clearFilters();
        };

        //API functionality start
        if ($scope.seletedCustomerId !== '') {
            GetUrl = "Team/GetById/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;
            apiService.get(GetUrl).then(function (response) {
                $scope.data = response.data;
                $scope.name = $scope.data[0].name;
                $scope.description = $scope.data[0].description;
            },
              function (error) {
                  deferred.reject(error);
                  alert("not working");
              });
        }
        //end

        //popup functionality start
        $scope.openAddPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'team/users/addUsers.html',
                backdrop: 'static',
                controller: AddUsersController,
                windowClass: 'addUser',
                resolve: {
                    teamService: teamService,
                    teamData: {
                        teamId: window.sessionStorage.selectedCustomerID,
                        orgId: $cookieStore.get('orgID')
                    }
                }
            });
        };


        $scope.openProjectPopup = function () {
            //   alert("abc");
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'team/addProject.tpl.html',
                backdrop: 'static',
                controller: AddProjectTeamController,
                size: 'md',
                resolve: {
                    newuserService: teamService,
                    newuserData: {
                        teamId: window.sessionStorage.selectedCustomerID,
                        orgId: $cookieStore.get('orgID')
                    }
                }
            });
        };


        $scope.openAddNewTask = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'team/add_new_task.tpl.html',
                backdrop: 'static',
                controller: AddNewTaskTeam,
                size: 'md'
            });
        };




        $scope.openEditTask = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'team/edit_task.html',
                backdrop: 'static',
                controller: EditTaskTeam,
                size: 'md'
            });
        };


        $scope.$on('REFRESH', function (event, args) {
            if (args == 'UserGrid') {
                $('.k-i-refresh').trigger("click");
            }
        });

        $scope.openTeamPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'team/edit_team.html',
                backdrop: 'static',
                controller: EditTeamPopUpController,
                size: 'md'
            });
        };


        $scope.$on('REFRESH', function (event, args) {

            setTimeout(function () {

                if (args == 'team') {

                    //   GetUrl = "User/GetById/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;
                    GetUrl = "Team/GetById/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;
                    //alert(GetUrl);

                    apiService.getWithoutCaching(GetUrl).then(function (response) {

                        $scope.data = response.data;
                        // alert($scope.data);
                        //   alert($scope.seletedCustomerId);


                        $scope.name = $scope.data[0].name;
                        $scope.description = $scope.data[0].description;

                        if ($scope.data.contact_mobile !== '') {
                            $scope.mobile = $scope.data.contact_mobile;
                        }
                        if ($scope.data.contact_email !== '') {
                            $scope.email = $scope.data.contact_Email;
                        }
                        $state.go('app.teamdetail', {}, { reload: false });
                    },
                                function (error) {
                                    deferred.reject(error);
                                    alert("not working");
                                });


                }

            }, 1000);
        });
        //end
    });