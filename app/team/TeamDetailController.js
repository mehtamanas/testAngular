angular.module('team')


.controller('TeamDetailController',
    function ($scope, $state, security, $cookieStore, apiService, $window, $rootScope, $modal,teamService) {
        console.log('TeamDetailController');
        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
        $rootScope.title = 'Dwellar./TeamDetails';

        //Audit log start
        $scope.params = {

            device_os: "windows10",
            device_type: "mobile",
            device_mac_id: "34:#$::43:434:34:45",
            module_id: "TeamDetail",
            action_id: "TeamDetail View",
            details: "TeamDetail",
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

       });
        };
        AuditCreate($scope.params);

        //end





        if ($scope.seletedCustomerId !== '') {

            GetUrl = "Team/GetById/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;

            apiService.get(GetUrl).then(function (response) {
                $scope.data = response.data;
                // alert($scope.data[0].name);
                $scope.name = $scope.data[0].name;
                $scope.description = $scope.data[0].description;

                //$scope.data = response.data;
                //alert($scope.data[0].first_name);
                //$scope.first_name = $scope.data[0].first_name;
                //$scope.last_name = $scope.data[0].last_name;
                //$scope.people_type = $scope.data[0].people_type;
                //$scope.date_of_birth = $scope.data[0].date_of_birth;
                //$scope.who_am_i = $scope.data[0].who_am_i;
                if ($scope.data[0].contact_mobile !== '') {
                    $scope.mobile = $scope.data[0].contact_mobile;
                }
                if ($scope.data[0].contact_email !== '') {
                    $scope.email = $scope.data[0].contact_Email;
                }
            },

                        function (error) {
                            deferred.reject(error);
                            alert("not working");
                        });
        }

       
        $scope.openAddPopup = function () {
         //   alert("abc");
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


        $scope.goToDocument = function () {
            $state.go('loggedIn.modules.team.document');
        };

        $scope.goToUpload = function () {
            $state.go('loggedIn.modules.contact.upload');
        };

        //$scope.goAddNew = function () {
        //    //alert(selected_tab);
        //    $scope.selected_tab = $window.selected_tab;
        //    if (selected_tab == "PAYMENT") {
        //        $state.go('loggedIn.modules.people.add_new_payment');
        //    } else if (selected_tab == "ENGAGEMENT") {
        //       $state.go('loggedIn.modules.people.add_new_engagement');
        //    } else if (selected_tab == "TASK") {
        //        $state.go('loggedIn.modules.people.add_new_task');
        //    } else if (selected_tab == "PROPERTYLIST") {
        //        $state.go('loggedIn.modules.people.add_new_propertylist');
        //    } else if (selected_tab == "DOCUMENT") {
        //        $state.go('loggedIn.modules.people.add_new_document');
        //    } else if (selected_tab == "QUOTES") {
        //        $state.go('loggedIn.modules.people.add_new_quotes');
        //    }
        //    else if (selected_tab == "ASSIGNMENT_TO") {
        //        $state.go('loggedIn.modules.people.add_new_assign');
        //    } else if (selected_tab == "NOTES") {
        //        $state.go('loggedIn.modules.people.add_new_notes');
        //    }

        //};

        var orgID = $cookieStore.get('orgID');
        $scope.ProjectGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: "http://dw-webservices-dev.azurewebsites.net/Team/GetProjectByTeam/" + $scope.seletedCustomerId
                },
                pageSize: 5

                //group: {
                //    field: 'sport'
                //}
            },
            groupable: true,
            sortable: true,
            selectable: "multiple",
            reorderable: true,
            resizable: true,
            filterable: true,
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

        $scope.UserGrid = {
            dataSource: {

                type: "json",
                transport: {
                    read: "http://dw-webservices-dev.azurewebsites.net/Team/GetUsersByTeam/" + $scope.seletedCustomerId

                },

                pageSize: 5

                //group: {
                //    field: 'sport'
                //}
            },

            groupable: true,
            sortable: true,
            selectable: "multiple",
            reorderable: true,
            resizable: true,
            filterable: true,
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: [{
                field: "first_name",
                title: "First Name",
                width: "120px",
               
            }, {
                field: "last_name",
                title: "Last Name",
                width: "120px",
               
            }, {
                field: "account_email",
                title: "Email",
                width: "120px",
               
            }, {
                field: "account_phone",
                title: "Phone",
                width: "120px",
              
            },
            {
                field: "account_country",
                title: "Country",
                width: "120px",
               
            }, {
                field: "status",
                title: "Status",
                width: "120px",
              
            }]
        };




        $scope.PropertyListGrid = {
            dataSource: {
                type: "json",
                transport: {

                    //read: "http://dw-webservices-dev.azurewebsites.net/PersonContactDevice/GetById?ID=" + orgID

                    read: "http://dw-webservices-dev.azurewebsites.net/Team/GetTeamPropertyList/" + $scope.seletedCustomerId
                },
                pageSize: 5,
                schema: {
                    model: {
                        fields: {

                            listing_date: { type: "date" },
                            last_updated_date: { type: "date" }


                        }
                    }
                }

                //group: {
                //    field: 'sport'
                //}
            },
            groupable: true,
            sortable: true,
            selectable: "multiple",
            reorderable: true,
            resizable: true,
            filterable: true,
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
               
            },
                {
                    field: "super_built_up_area",
                    title: "Super Built Up ",
                    width: "120px",
                   
                }]

        };

        $scope.PeopleGrid = {
            dataSource: {
                type: "json",
                transport: {
                    ////  read: "http://dw-webservices-dev.azurewebsites.net/PersonContactDevice/GetById?ID=" + orgID
                    //  // read:" https://dw-webservices-dev.azurewebsites.net/Contact/GetQuote/4a0ef2c4-09cc-46ba-abc3-8970f5eb6ee8"
                    //  read: " https://dw-webservices-dev.azurewebsites.net/Contact/GetQuote/4a0ef2c4-09cc-46ba-abc3-8970f5eb6ee8"
                    read: "http://dw-webservices-dev.azurewebsites.net/Team/GetPeopleByTeam/" + $scope.seletedCustomerId
                },
                pageSize: 5,
                schema: {
                    model: {
                        fields: {

                            date_of_birth: { type: "date" }
                           }
                    }
                }

                //group: {
                //    field: 'sport'
                //}
            },
            groupable: true,
            sortable: true,
            selectable: "multiple",
            reorderable: true,
            resizable: true,
            filterable: true,
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
                    read: "http://dw-webservices-dev.azurewebsites.net/Team/GetTaskByTeam/" + $scope.seletedCustomerId

                },
                pageSize: 5,
                schema: {
                    model: {
                        fields: {

                            created_date_time: { type: "date" },
                            start_date_time: { type: "date" },
                            end_date_time: { type: "date" }

                        }
                    }
                }

                //group: {
                //    field: 'sport'
                //}
            },
            groupable: true,
            sortable: true,
            selectable: "multiple",
            reorderable: true,
            resizable: true,
            filterable: true,
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
                field: "description",
                title: "Description",
                width: "120px",
               
            }, {
                field: "status",
                title: "Status",
                width: "120px",
               
            },
            {
                field: "priority",
                title: "Priority",
                width: "120px",
               
            },
            {
                field: "created_date_time",
                title: "Created Date",
                width: "120px",
               
                format: '{0:dd/MM/yyyy}'
            },
             {
                 field: "start_date_time",
                 title: "Start Date",
                 width: "120px",
                
                 format: '{0:dd/MM/yyyy}'
             },
             {
                 field: "end_date_time",
                 title: "End Date",
                 width: "120px",
                 
                 format: '{0:dd/MM/yyyy}'
             },
             {
                 field: "add_reminder",
                 title: "Reminder",
                 width: "120px",
                 
             }]
        };

        $scope.filterNow = function () {
            if ($scope.lastNameFilter)
                applyFilter('first_name', $scope.lastNameFilter);
            else
                clearFilters();

        };




    });