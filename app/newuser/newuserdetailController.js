angular.module('newuser')

.controller('newuserdetailController',
    function ($scope, $state, security, $cookieStore, apiService, $window, $rootScope) {
        console.log('newuserdetailController');
        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

        $rootScope.title = 'Dwellar./UserDetails';
       // alert($scope.seletedCustomerId);

        //Audit log start
        $scope.params = {

            device_os: "windows10",
            device_type: "mobile",
            device_mac_id: "34:#$::43:434:34:45",
            module_id: "UserDetail",
            action_id: "UserDetail View",
            details: "Userdetail",
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

         //   GetUrl = "User/GetById/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;
            GetUrl = "User/Get?ID=" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;


            apiService.get(GetUrl).then(function (response) {

                $scope.data = response.data;
           //     alert($scope.seletedCustomerId);
              

                $scope.first_name = $scope.data.first_name;
                $scope.last_name = $scope.data.last_name;
                $scope.account_email = $scope.data.account_email;
                $scope.account_phone = $scope.data.account_phone;
                $scope.account_country = $scope.data.account_country;
      
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

        $scope.goToDocument = function () {
            $state.go('loggedIn.modules.team.document');
        };

        $scope.goToUpload = function(){
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
                   // read: "http://dw-webservices-dev.azurewebsites.net/User/GetProjectsByUser/7fbfbdfd-0b46-4a99-bda0-2322e67e9f49"//402fe846-3873-4964-a8cc-92557bcf63ab
                    read: "http://dw-webservices-dev.azurewebsites.net/User/GetProjectsByUser/" + $scope.seletedCustomerId

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
                width: "120px",
                
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
        

        $scope.TeamGrid = {
            dataSource: {

                type: "json",
                transport: {
                    read: "http://dw-webservices-dev.azurewebsites.net/User/GetTeamByUser/" + $scope.seletedCustomerId

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
                width: "120px",
               
            }, {
                field: "description",
                title: "Description",
                width: "120px",
              
            }]
        };

      


        $scope.PropertyListGrid = {
            dataSource: {
                type: "json",
                transport: {

                    //read: "http://dw-webservices-dev.azurewebsites.net/PersonContactDevice/GetById?ID=" + orgID

                    read: "http://dw-webservices-dev.azurewebsites.net/User/GetPropertyUserList/" + $scope.seletedCustomerId
                },
                pageSize: 5,
                schema: {
                     model: {
                         fields: {
                           
                             listing_date: { type: "date" },
                             last_updated_date:{type:"date"}

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
                width: "120px"
            }, {
                field: "listing_date",
                title: "Listing Date",
                width: "120px",
              
                format: '{0:dd/MM/yyyy}'
                //template: '#= kendo.toString(listing_date, "dd/MM/yyyy") #'
            }, {
                field: "last_updated_date",
                title: "Last Updated",
                width: "120px",
                format: '{0:dd/MM/yyyy}',
               
                //template: '#= kendo.toString(last_updated_date, "dd/MM/yyyy") #'
            }, {
                field: "num_bedrooms",
                title: "Bedrooms",
                width: "120px",
               
            },
                {
                    field: "listing_source",
                    title: "Source",
                    width: "120px",
                   
                },
                {
                    field: "description",
                    title: "Description",
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
                    read: "http://dw-webservices-dev.azurewebsites.net/User/GetContactInUser/" + $scope.seletedCustomerId
                },
                pageSize: 5,
                refresh:true,
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
                
            },  {
                field: "last_name",
                title: "Last Name",
                width: "50px",
               
            }, {
                field: "people_type",
                title: "People Type",
                width: "50px",
               
            }, {
                field: "date_of_birth",
                title: "Date of Birth",
                width: "50px",
                format: '{0:dd/MM/yyyy}',
               
             
            }, {
                field: "description",
                title: "Description",
                width: "50px",
              

            }, {
                field: "company",
                title: "Company",
                width: "50px",
                

            }]
        };

        $scope.TaskGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: "http://dw-webservices-dev.azurewebsites.net/User/GetTaskByUser/" + $scope.seletedCustomerId

                },
                pageSize: 5,
                refresh:true,
                schema: {
                    model: {
                        fields: {

                            start_date_time: { type: "date" },
                            end_date_time: { type: "date" },

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
                width: "120px"
            }, {
                field: "description",
                title: "Description",
                width: "120px"
            },{
                 field: "status",
                 title: "Status",
                 width: "120px"
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
            }, {
                field: "priority",
                title: "Priority",
                width: "120px"
            }, {
                field: "add_reminder",
                title: "Reminder",
                width: "120px"
            }]
        };

        $scope.filterNow = function () {
            if ($scope.lastNameFilter)
                applyFilter('first_name', $scope.lastNameFilter);
            else
                clearFilters();

        };

        $scope.openUserPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/edituser.tpl.html',
                backdrop: 'static',
                controller: EditUserPopUpController,
                size: 'md'
            });
        };
      


    });