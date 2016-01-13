﻿angular.module('newuser')


.controller('newuserdetailController',
    function ($scope, $state, security, $cookieStore,$modal, apiService, $window, $rootScope) {
        console.log('newuserdetailController');
        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
        //alert($cookieStore.get('userId'));

        $('#btnSave').hide();
        $('#iconEdit').hide();
        $('#btnAdd').hide();



        security.isAuthorized().then(function (response) {
            nav = response;
            console.log(nav);
            if (nav.length > 0) {

                for (i = 0; i < nav.length; i++) {
                    if (nav[i].resource === "Projects") {
                        $rootScope.projects = nav[i];

                    }
                    if (nav[i].resource === "Users") $rootScope.users = nav[i];
                    if (nav[i].resource === "Teams") $rootScope.teams = nav[i];

                    if (nav[i].resource === "Billing") $rootScope.billing = nav[i];
                    if (nav[i].resource === "Contacts") $rootScope.contacts = nav[i];
                    if (nav[i].resource === "Organization") $rootScope.organization = nav[i];
                    if (nav[i].resource === "Channel Partners") $rootScope.channelPartners = nav[i];
                    if (nav[i].resource === "Audit Trail") $rootScope.auditTrail = nav[i];
                    if (nav[i].resource === "Reports") $rootScope.reports = nav[i];
                    if (nav[i].resource === "Builders") $rootScope.support = nav[i];
                    if (nav[i].resource === "Notifications") $rootScope.notifications = nav[i];
                    if (nav[i].resource === "Support") $rootScope.support = nav[i];
                    if (nav[i].resource === "Property") $rootScope.property = nav[i];
                    if (nav[i].resource === "Shared Listings") $rootScope.sharedListings = nav[i];
                    if (nav[i].resource === "Campaigns") $rootScope.campaigns = nav[i];
                    if (nav[i].resource === "Tasks") $rootScope.tasks = nav[i];




                }
            }



            if ($rootScope.users.write) {
                event.preventDefault();
                $('#btnSave').show();
                $('#iconEdit').hide();
                $('#btnAdd').hide();
            }



        });
        $rootScope.title = 'Dwellar./UserDetails';
        //Audit log start															
        $scope.params =
            {
                device_os: $cookieStore.get('Device_os'),
                device_type: $cookieStore.get('Device'),
                device_mac_id: "34:#$::43:434:34:45",
                module_id: "Contact",
                action_id: "Contact View",
                details: "UserDetailView",
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
        if ($scope.seletedCustomerId != "undefined")
        {

            //   GetUrl = "User/GetById/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;
            GetUrl = "User/GetUserDetails/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;
            //alert(GetUrl);

            apiService.get(GetUrl).then(function (response) {

                $scope.data = response.data;
                // alert($scope.data);
                //   alert($scope.seletedCustomerId);
              
                
                $scope.first_name = $scope.data[0].first_name;
                $scope.last_name = $scope.data[0].last_name;
                $scope.status = $scope.data[0].status;
                $scope.account_email = $scope.data[0].account_email;
                $scope.account_phone = $scope.data[0].account_phone;
                $scope.account_country = $scope.data[0].account_country;
                $scope.street_1 = $scope.data[0].street_1;
                $scope.role_name = $scope.data[0].role_name;
                $scope.zip_code = $scope.data[0].zip_code;
                $scope.state = $scope.data[0].state;
                $scope.city = $scope.data[0].city;
                $scope.media_url = $scope.data[0].media_url;
                // alert($scope.media_url);
      
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
                    // read: "http://dw-webservices-uat.azurewebsites.net/User/GetProjectsByUser/7fbfbdfd-0b46-4a99-bda0-2322e67e9f49"//402fe846-3873-4964-a8cc-92557bcf63ab
                    read: "http://dw-webservices-uat.azurewebsites.net/User/GetProjectsByUser/" + $scope.seletedCustomerId

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
                    read: "http://dw-webservices-uat.azurewebsites.net/USER/GetTeamsbyUserid/" + $scope.seletedCustomerId

                },
                pageSize: 5,
                refresh: true,
                schema: {
                    model: {
                        fields: {

                            Join_Date: { type: "date" },
                            // end_date_time: { type: "date" },

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
                field: "No_Of_Member",
                title: "No.of Member",
                width: "120px"
            }, {
                field: "Location",
                title: "Locations",
                width: "120px"
            },
            {
                field: "Join_Date",
                title: "Join Date",
                width: "120px",
                format: '{0:dd/MM/yyyy}'
            },
            {
                field: "creator_first_name",
                title: "Creator",
                width: "120px",
               
            }]
        };


        $scope.DeviceGrid = {
            dataSource: {

                type: "json",
                transport: {
                    // read: "http://dw-webservices-uat.azurewebsites.net/User/GetTeamByUser/" + $scope.seletedCustomerId
                    read: "http://dw-webservices-uat.azurewebsites.net/User/GetDetailDevices/" + $scope.seletedCustomerId
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
                field: "device_name",
                title: "Device Name",
                width: "120px",

            }, {
                field: "operating_system",
                title: "Operating System",
                width: "120px",

            },
            {
                field: "mac_id",
                title: "Mac Id",
                width: "120px",

            },
            {
                field: "last_login",
                title: "Last Login",
                width: "120px",

            }
            ]
        };

        $scope.ProjectsGrid = {
            dataSource: {
                type: "json",
                transport: {

                    //read: "http://dw-webservices-uat.azurewebsites.net/PersonContactDevice/GetById?ID=" + orgID

                    read: "http://dw-webservices-uat.azurewebsites.net/User/GetProjectsByUser/" + $scope.seletedCustomerId
                },
                pageSize: 5,
                schema: {
                    model: {
                        fields: {
                           
                            possession_date: { type: "date" },
                            assigned_date: { type: "date" },

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
                field: "Possession_Month",
                title: "Possession Month",
                width: "120px",
              
            }, {
                field: "assigned_date",
                title: "Assigned Date",
                width: "120px",
                format: '{0:dd/MM/yyyy}'
            }, {
                field: "Year",
                title: "year",
                width: "120px",

            }, {
                field: "assigned_by",
                title: "Assigned By",
                width: "120px",

            }, {
                field: "total_project_area",
                title: "Project Area",
                width: "120px",

            }, {
                field: "project_website",
                title: "Project Website",
                width: "120px",

            }, {
                field: "builder_website",
                title: "Builder Website",
                width: "120px",

            }, {
                field: "possession_date",
                title: "Possession Date",
                width: "120px",
                format: '{0:dd/MM/yyyy}'
            }]

        };

        $scope.PeopleGrid = {
            dataSource: {
                type: "json",
                transport: {
                    ////  read: "http://dw-webservices-uat.azurewebsites.net/PersonContactDevice/GetById?ID=" + orgID
                    //  // read:" https://dw-webservices-uat.azurewebsites.net/Contact/GetQuote/4a0ef2c4-09cc-46ba-abc3-8970f5eb6ee8"
                    //  read: " https://dw-webservices-uat.azurewebsites.net/Contact/GetQuote/4a0ef2c4-09cc-46ba-abc3-8970f5eb6ee8"
                    read: "http://dw-webservices-uat.azurewebsites.net/User/GetContactInUser/" + $scope.seletedCustomerId
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
                field: "name",
                title: "Name",
                width: "120px",

            }, {
                field: "description",
                title: "No.of Member",
                width: "120px",

            }, {
                field: "description",
                title: "Locations",
                width: "120px",

            }, {
                field: "description",
                title: "Join Date",
                width: "120px",

            }, {
                field: "description",
                title: "Creator",
                width: "120px",

            },
            ]
        };

        $scope.TaskGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: "http://dw-webservices-uat.azurewebsites.net/User/GetTaskByUser/" + $scope.seletedCustomerId

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
        $scope.ContactsGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: "http://dw-webservices-uat.azurewebsites.net/User/GetContactInUser/" + $scope.seletedCustomerId

                },
                pageSize: 5,
                refresh: true,
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

            columns: [  {
                field: "first_name",
                title: "Name",
                width: "120px"
            }, {
                field: "designation",
                title: "Title",
                width: "120px"
            },
            {
                field: "email",
                title: "Email",
                width: "120px"
            },
            {
                field: "phone",
                title: "Phone",
                width: "120px",
               
            },
            {
                field: "city",
                title: "City",
                width: "120px",
               
            },{
                field: "people_type",
                title: "Type",
                width: "120px"
            }]
        };

        $scope.TowerListGrid = {
            // $scope.mainGridOptions = {


            dataSource: {
                type: "json",
                transport: {

                    //read: "https://dw-webservices-uat.azurewebsites.net/UnitTypes/GetTowerunitpropertiesall/bcd0a0ad-68c2-4a96-9498-c1a19e429f53"
                    read: "https://dw-webservices-uat.azurewebsites.net/UnitTypes/GetTowerunitpropertiesall/" + $scope.seletedCustomerId
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
            columns: [
                {
                    //template: "<img height='40px' width='40px' src='#= Project_image #'/>" +
                    //"<span style='padding-left:10px' class='property-photo'> </span>",
                    template: "<input type='checkbox' class='checkbox' ng-click='onClick($event)' />",
                    title: "",
                    width: "60px",
                    attributes: {
                        "class": "UseHand",

                    }
                },

                {
                    template: "<img height='40px' width='40px' src='#= Image_Url_Unit1 #'/>" +
                    "<span style='padding-left:10px' class='property-photo'> </span>",
                    title: "Photo",
                    width: "120px",
                    attributes:
                      {
                          "class": "UseHand",
                      }
                },

                {
                    field: "tower_name",
                    title: "Name",
                    width: "120px"
                },
             {
                 field: "floorno",
                 title: "Floor No",
                 width: "120px"
             },
              {
                  field: "unitno",
                  title: "Unit No",
                  width: "120px"
              },
              {
                  field: "carpark",
                  title: "Car Park",
                  width: "120px"
              },
              {
                  field: "num_bedrooms",
                  title: "Bedrooms",
                  width: "120px"
              },
            {
                field: "num_bathrooms",
                title: "Bathrooms",
                width: "120px"
            },
            {
                field: "super_built_up_area",
                type: "number",
                title: "Slb. Area",
                width: "120px"
            },
              {
                  field: "carpet_area",
                  type: "number",
                  title: "Crp Area",
                  width: "120px"
              },
               {
                   field: "total_consideration",
                   title: "Price",
                   width: "120px"
               },
                {
                    field: "project_name",
                    title: "Project",
                    width: "120px"
                },
            {
                field: "available_status",
                title: "Status",
                width: "120px"
            }]

        };

        $scope.RoleGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: "http://dw-webservices-uat.azurewebsites.net/Role/GetRoleByUser/" + $scope.seletedCustomerId

                },
                pageSize: 5,
                refresh: true,
                schema: {
                    model: {
                        fields: {

                            assigned_date: { type: "date" },
                           

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
                field: "assigned_date",
                title: "Assigned Date",
                width: "120px",
                format: '{0:dd/MM/yyyy}'
            }, {
                field: "assigned_by",
                title: "Assigned By",
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