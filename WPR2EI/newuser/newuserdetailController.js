angular.module('newuser')

.controller('newuserdetailController',
    function ($scope, $state, security, $cookieStore, $modal, $rootScope, apiService, $window, $rootScope, newuserService) {
        console.log('newuserdetailController');
        $rootScope.title = 'Dwellar-User Details';
        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
        //alert($cookieStore.get('userId'));

        // ROLE PERMISSION CHECKING
        var authRights = ($cookieStore.get('UserRole'));

        $scope.isEnterpriseUser = (_.find(authRights, function (o) { return o == 'Enterprise User'; }))
        $scope.isTeamLead = (_.find(authRights, function (o) { return o == 'Team Lead'; }));

        //END
      
       

        var logUserEmail = $cookieStore.get('Email');


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
           if (error.status === 400)
               alert(error.data.Message);
           else
               alert("Network issue");
       });
        };
        AuditCreate($scope.params);

        //end
        if ($scope.seletedCustomerId != "undefined") {

            //   GetUrl = "User/GetById/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;
            GetUrl = "User/GetUserDetails/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;
            //alert(GetUrl);

            apiService.getWithoutCaching(GetUrl).then(function (response) {

                $scope.data = response.data;
                // alert($scope.data);
                //   alert($scope.seletedCustomerId);


                $scope.first_name = $scope.data[0].first_name;
                $scope.area = $scope.data[0].area;
                $scope.last_name = $scope.data[0].last_name;
                $scope.status = $scope.data[0].status;
                $scope.account_email = $scope.data[0].account_email;
                $scope.account_phone = $scope.data[0].account_phone;
                $scope.choices1[0].account_email = response.data[0].account_email;
                $scope.choices[0].account_phone = response.data[0].account_phone;
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

                // for team lead rol permission check.

                if (logUserEmail != $scope.account_email && $scope.isTeamLead == 'Team Lead') {
                    $('#userEdit').hide();
                }

                //End
            },


                        function (error) {
                            if (error.status === 400)
                                alert(error.data.Message);
                            else
                                alert("Network issue");
                        });
        }

        Url = "ElementInfo/GetElementInfo?Id=" + $scope.seletedCustomerId + "&&type=User";

        apiService.getWithoutCaching(Url).then(function (response) {
            data = response.data;
            a = 0, b = 0, c = 0;
            for (i = 0; i < data.length; i++) {
                if (data[i].element_type == "email_user") {
                    if (a > 0) { $scope.choices1.push({ 'id': 'choice' + (a + 1) }); }
                    $scope.choices1[a].account_email = data[i].element_info1;
                    $scope.choices1[a].class_id = data[i].class_id;
                    a++;
                }
                if (data[i].element_type == "phone_user") {
                    if (b > 0) { $scope.choices.push({ 'id': 'choice' + (b + 1) }); }
                    $scope.choices[b].account_phone = data[i].element_info1;
                    $scope.choices[b].class_id = data[i].class_id;
                    b++;
                }

            }

        },


       function (error) {
           if (error.status === 400)
               alert(error.data.Message);
           else
               alert("Network issue");
       });


      

        $scope.choices = [{ id: 'choice1' }];





        $scope.choices = [{ id: 'choice1' }];
        $scope.addNewChoice = function (e) {
            var classname = e.currentTarget.className;
            if (classname == 'remove-field') {

            }
            else if ($scope.choices.length) {
                var newItemNo = $scope.choices.length + 1;
                $scope.choices.push({ 'id': 'choice' + newItemNo });
            }

        };

        $scope.choices1 = [{ id: 'choice1' }];
        $scope.addNewChoice1 = function (e) {
            var classname = e.currentTarget.className;
            if (classname == 'remove-field') {

            }
            else if ($scope.choices1.length) {
                var newItemNo = $scope.choices1.length + 1;
                $scope.choices1.push({ 'id': 'choice' + newItemNo });
            }

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

  $scope.$on('REFRESH', function (event, args) {
            if (args == 'TaskGrid') {
                $('.k-i-refresh').trigger("click");
            }
        });
 
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
                    read: apiService.baseUrl + "USER/GetTeamsbyUserid/" + $scope.seletedCustomerId

                },
                pageSize: 20,
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
                attributes:
                    {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }
            }, {
                field: "No_Of_Member",
                title: "No.of Member",
                width: "120px",
                attributes:
                    {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }
            }, {
                field: "Location",
                title: "Locations",
                width: "120px",
                attributes:
                    {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }
            },
            {
                field: "Join_Date",
                title: "Join Date",
                width: "120px",
                format: '{0:dd/MM/yyyy}',
                attributes:
                    {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }
            },
            {
                field: "creator_first_name",
                title: "Creator",
                width: "120px",
                attributes:
    {
        "class": "UseHand",
        "style": "text-align:center"
    }

            }]
        };


        $scope.DeviceGrid = {
            dataSource: {

                type: "json",
                transport: {

                    read: apiService.baseUrl + "User/GetDetailDevices/" + $scope.seletedCustomerId
                },

                pageSize: 20

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
                field: "device_name",
                title: "Device Name",
                width: "120px",
                attributes:
  {
      "class": "UseHand",
      "style": "text-align:center"
  }

            }, {
                field: "operating_system",
                title: "Operating System",
                width: "120px",
                attributes:
  {
      "class": "UseHand",
      "style": "text-align:center"
  }

            },
            {
                field: "mac_id",
                title: "Mac Id",
                width: "120px",
                attributes:
  {
      "class": "UseHand",
      "style": "text-align:center"
  }

            },
            {
                field: "last_login",
                title: "Last Login",
                width: "120px",
                attributes:
  {
      "class": "UseHand",
      "style": "text-align:center"
  }

            }
            ]
        };

        $scope.ProjectsGrid = {
            dataSource: {
                type: "json",
                transport: {



                    read: apiService.baseUrl + "User/GetProjectsByUser/" + $scope.seletedCustomerId
                },
                pageSize: 20,
                schema: {
                    model: {
                        fields: {

                            possesion_date: { type: "date" },
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
            columns: [

                 {
		    template: "<img height='40px' width='40px' src='#= media_url #' style='margin-left:44%'/>" +
                     "<span style='padding-left:10px' class='property-photo'> </span>",
                     title: "PROJECT LOGO",
                     width: "120px",
                     attributes:
                       {
                           "class": "UseHand",
                       }
                 },
                {
                    field: "name",
                    title: "Name",
                    width: "120px",
                    attributes:
     {
         "class": "UseHand",
         "style": "text-align:center"
     }
                }, {
                    field: "Possession_Month",
                    title: "Possession Month",
                    width: "120px",
                    attributes:
       {
           "class": "UseHand",
           "style": "text-align:center"
       }
                }, {
                    field: "assigned_date",
                    title: "Assigned Date",
                    width: "120px",
                    format: '{0:dd/MM/yyyy}',
                    attributes:
     {
         "class": "UseHand",
         "style": "text-align:center"
     }
                }, {
                    field: "year",
                    title: "year",
                    width: "120px",
                    attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
                }, {
                    field: "assigned_by",
                    title: "Assigned By",
                    width: "120px",
                    attributes:
     {
         "class": "UseHand",
         "style": "text-align:center"
     }
                },
             {
                 field: "project_website",
                 title: "Project Website",
                 width: "120px",
                 attributes:
  {
      "class": "UseHand",
      "style": "text-align:center"
  }
             }, {
                 field: "builder_website",
                 title: "Builder Website",
                 width: "120px",
                 attributes:
  {
      "class": "UseHand",
      "style": "text-align:center"
  }
                 //           }, {
                 //               field: "possesion_date",


                 //               title: "Possession Date",
                 //               width: "120px",
                 //               format: '{0:dd/MM/yyyy}',
                 //               attributes:
                 //{
                 //    "class": "UseHand",
                 //    "style": "text-align:center"
                 //}
             }]

        };

        $scope.PeopleGrid = {
            dataSource: {
                type: "json",
                transport: {

                    read: apiService.baseUrl + "User/GetContactInUser/" + $scope.seletedCustomerId
                },
                pageSize: 20,
                refresh: true,
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
                attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
            }, {
                field: "description",
                title: "No.of Member",
                width: "120px",
                attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
            }, {
                field: "description",
                title: "Locations",
                width: "120px",
                attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
            }, {
                field: "description",
                title: "Join Date",
                width: "120px",
                attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
            }, {
                field: "description",
                title: "Creator",
                width: "120px",
                attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
            },
            ]
        };

        $scope.TaskGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "ToDoItem/GetMultipleTaskByUserId/" + $scope.seletedCustomerId
                },
                pageSize: 20,

                schema: {
                    model: {
                        fields: {

                            due_date: { type: "date" },
                            start_date_time: { type: "date" },
                            reminder_time: { type: "date" },
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
                template: " <input type='checkbox' , class='checkbox', data-id='#= name #', ng-click='taskSelected($event,dataItem)' style='margin-left:44%'  />",
                title: "<input id='checkAll', type='checkbox', class='check-box' ng-click='submit(dataItem)'  />",
                width: "60px",

            },{
                field: "name",
                template: '#if (status!="Completed") {# <a ng-click="openEditTask(dataItem.task_id)" href="">#=name#</a> #} else {#<a ng-click="taskComplete()" href="">#=name#</a>#}#',
                title: "Task Name",
                width: "120px",
                attributes:
             {
                 "style": "text-align:center"
             }

            }, {
                field: "project_name",
                title: "Project",
                width: "120px",
                attributes:
             {
                 "style": "text-align:center"
             }

            }, {
                field: "Contact_name",
                title: "Contact",
                width: "120px",
                attributes:
             {
                 "style": "text-align:center"
             }

            }, {
                field: "user_name",
                title: "Assign To",
                width: "120px",
                attributes:
             {
                 "style": "text-align:center"
             }

            },{
                field: "company_name",
                title: "Company",
                width: "120px",
                attributes:
                 {
                     "style": "text-align:center"
                 }

            }, {
                field: "created_by",
                title: "Created By",
                width: "120px",
                attributes:
                 {
                     "style": "text-align:center"
                 }

            }, {
                field: "task_code",
                title: "Task Code",
                width: "120px",
                attributes:
                 {
                     "style": "text-align:center"
                 }

            },
             {
                 field: "priority",
                 template: '<span id="#= priority #">#= priority #</span>',
                 title: "Priority",
                 width: "120px",
                 attributes:
             {
                 "style": "text-align:center"
             }

             }, {
                 field: "start_date_time",
                 title: "Start Date",
                 width: "120px",
                 format: '{0:dd/MM/yyyy hh:mm:ss}',
                 attributes:
             {
                 "style": "text-align:center"
             }

             }, {
                 field: "due_date",
                 title: "Due Date",
                 width: "120px",
                 format: '{0:dd/MM/yyyy hh:mm:ss}',
                 attributes:
             {
                 "style": "text-align:center"
             }

             },

             {
                 field: "reminder_time",
                 title: "Reminder Date",
                 width: "120px",
                 format: '{0:dd/MM/yyyy hh:mm:ss}',
                 attributes:
               {
                   "style": "text-align:center"
               }

             },

             {
                 field: "updated_date",
                 title: "Updated Date",
                 width: "120px",
                 format: '{0:dd/MM/yyyy hh:mm:ss}',
                 attributes:
               {
                   "style": "text-align:center"
               }

             },
             {
                 field: "text",
                 title: "Notes",
                 width: "120px",
                 attributes:
             {
                 "style": "text-align:center"
             }


             }, {
                 field:"status",
                 template: '<span id="#= status #"></span>',
                 title: "Status",
                 width: "120px",
                 attributes:
             {
                 "style": "text-align:center"
             }
             }, {
                 title: "postpone",
                 template: '#if (status!="Completed") {# <a class="btn btn-primary" id="postpone_now" ng-click="openPostpone(dataItem)">Postpone</a> #}#',
                 width: "120px",
                 attributes:
               {
                   "style": "text-align:center"
               }

             },]
        };

        $scope.ContactsGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "User/GetContactInUser/" + $scope.seletedCustomerId

                },
                pageSize: 20,
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
                title: "Name",
                width: "120px",
                attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
            }, {
                field: "designation",
                title: "Title",
                width: "120px",
                attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
            },
            {
                field: "email",
                title: "Email",
                width: "120px",
                attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
            },
            {
                field: "phone",
                title: "Phone",
                width: "120px",
                attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}

            },
            {
                field: "city",
                title: "City",
                width: "120px",
                attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}

            }, {
                field: "people_type",
                title: "Type",
                width: "120px",
                attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
            }]
        };

        $scope.TowerListGrid = {
            // $scope.mainGridOptions = {


            dataSource: {
                type: "json",
                transport: {


                    read: apiService.baseUrl + "UnitTypes/GetTowerunitpropertiesall/" + $scope.seletedCustomerId
                },
                pageSize: 20

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

            //    {
		    //template: "<img height='40px' width='40px' src='#= Image_Url_Unit1 #'/>" +
            //        "<span style='padding-left:10px' class='property-photo'> </span>",
            //        title: "Photo",
            //        width: "120px",
            //        attributes:
            //          {
            //              "class": "UseHand",
            //          }
            //    },

                {
                    field: "tower_name",
                    title: "Name",
                    width: "120px",
                    attributes:
    {
        "class": "UseHand",
        "style": "text-align:center"
    }
                },
             {
                 field: "floorno",
                 title: "Floor No",
                 width: "120px",
                 attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
             },
              {
                  field: "unitno",
                  title: "Unit No",
                  width: "120px",
                  attributes:
  {
      "class": "UseHand",
      "style": "text-align:center"
  }
              },
              {
                  field: "carpark",
                  title: "Car Park",
                  width: "120px",
                  attributes:
  {
      "class": "UseHand",
      "style": "text-align:center"
  }
              },
              {
                  field: "num_bedrooms",
                  title: "Bedrooms",
                  width: "120px",
                  attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
              },
            {
                field: "num_bathrooms",
                title: "Bathrooms",
                width: "120px",
                attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
            },
            {
                field: "super_built_up_area",
                type: "number",
                title: "Slb. Area",
                width: "120px",
                attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
            },
              {
                  field: "carpet_area",
                  type: "number",
                  title: "Crp Area",
                  width: "120px",
                  attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
              },
               {
                   field: "total_consideration",
                   title: "Price",
                   width: "120px",
                   attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
               },
                {
                    field: "project_name",
                    title: "Project",
                    width: "120px",
                    attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
                },
            {
                field: "available_status",
                template: '<span id="#= available_status#"></span>',
                title: "Status",
                width: "120px",
                attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
            }]

        };

        $scope.RoleGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "Role/GetRoleByUser/" + $scope.seletedCustomerId

                },
                pageSize: 20,
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
                attributes:
              {
                  "class": "UseHand",
                  "style": "text-align:center"
              }
            }, {
                field: "assigned_date",
                title: "Assigned Date",
                width: "120px",
                format: '{0:dd/MM/yyyy}',
                attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            }, {
                field: "assigned_by",
                title: "Assigned By",
                width: "120px",
                attributes:
            {
                "class": "UseHand",
                "style": "text-align:center"
            }
            }]
        };

        $scope.AuditGrid = {
            dataSource: {

                type: "json",
                transport: {

                    read: apiService.baseUrl + "AuditLog/GetAuditByUserID/" + $scope.seletedCustomerId


                },

                pageSize: 20

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
                field: "user_email",
                title: "user_email",
                width: "120px",
                attributes:
  {
      "class": "UseHand",
      "style": "text-align:center"
  }

            }, {
                field: "device_os",
                title: "device_os",
                width: "120px",
                attributes:
  {
      "class": "UseHand",
      "style": "text-align:center"
  }

            },
            {
                field: "application",
                title: "application",
                width: "120px",
                attributes:
  {
      "class": "UseHand",
      "style": "text-align:center"
  }

            },
            {
                field: "device_type",
                title: "device_type",
                width: "120px",
                attributes:
  {
      "class": "UseHand",
      "style": "text-align:center"
  }

            },
            {
                field: "device_mac_id",
                title: "device_mac_id",
                width: "120px",
                attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:center"
                }

            },
     {
         field: "ip_address",
         title: "ip_address",
         width: "120px",
         attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}

     },
     {
         field: "timestamp",
         title: "timestamp",
         width: "120px",
         attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}

     },
     {
         field: "location",
         title: "location",
         width: "120px",
         attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}

     },



            ]
        };

        $scope.EngagementGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "Engagement/GetEngagement?id=" + $scope.seletedCustomerId + "&&class_type=User"  //eea9b986-8561-4970-851b-7cfb38bb2b87"

                },
                pageSize: 5,
                refresh: true,
                schema: {
                    model: {
                        fields: {

                            start_date: { type: "date" },
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
            },
            {
                field: "type",
                title: "Type",
                width: "120px"
            }, {
                field: "assignedBy_name",
                title: "Contact",
                width: "120px"
            }, {
                field: "start_date",
                title: "Start Date",
                width: "120px",
                format: '{0:dd/MM/yyyy}'
            },
             {
                 field: "end_date",
                 title: "End Date",
                 width: "120px",
                 format: '{0:dd/MM/yyyy}'
             }]
        };

        $scope.taskComplete = function () {
            alert("Task is Complete..You Can't Edit")
        }

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


        $scope.filterNow = function () {
            if ($scope.lastNameFilter)
                applyFilter('first_name', $scope.lastNameFilter);
            else
                clearFilters();

        };



        $scope.openAddPopup = function () {
            //   alert("abc");
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/Projects/addProject.tpl.html',
                backdrop: 'static',
                controller: AddProjectController,
                size: 'lg',
                resolve: {
                    newuserService: newuserService,
                    newuserData: {
                        userId: window.sessionStorage.selectedCustomerID,
                        orgId: $cookieStore.get('orgID')
                    }
                }
            });
        };

        $scope.$on('REFRESH', function (event, args) {
            if (args == 'ProjectsGrid') {
                $('.k-i-refresh').trigger("click");
            }
        });


        $scope.openUserPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/edituser.tpl.html',
                backdrop: 'static',
                controller: EditUserPopUpController,
                size: 'lg'
            });
        };


        $scope.openAddNewTask = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/add_new_task.tpl.html',
                backdrop: 'static',
                controller: AddNewTaskUserController,
                size: 'lg'

            });

        };

        $scope.openEditTask = function (d) {
            window.sessionStorage.selectedTaskID = d;
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/edit_task.html',
                backdrop: 'static',
                controller: EditTaskUser,
                size: 'lg'

            });

        };
        // Kendo Grid on change
        $scope.myGridChange = function (dataItem) {
            // dataItem will contain the row that was selected
            window.sessionStorage.selectedTaskID = dataItem.task_id;
            //  alert(window.sessionStorage.selectedCustomerID);
            $scope.openEditTask();
        };

        $scope.$on('REFRESH', function (event, args) {

            setTimeout(function () {

                if (args == 'newuser') {


                    //   GetUrl = "User/GetById/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;
                    GetUrl = "User/GetUserDetails/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;
                    //alert(GetUrl);

                    apiService.getWithoutCaching(GetUrl).then(function (response) {

                        $scope.data = response.data;
                        // alert($scope.data);
                        //   alert($scope.seletedCustomerId);


                        $scope.first_name = $scope.data[0].first_name;
                        $scope.last_name = $scope.data[0].last_name;
                        $scope.status = $scope.data[0].status;
                        $scope.account_email = $scope.data[0].account_email;
                        $scope.account_phone = $scope.data[0].account_phone;
                        $scope.choices1[0].account_email = response.data[0].account_email;
                        $scope.choices[0].account_phone = response.data[0].account_phone;
                        $scope.account_country = $scope.data[0].account_country;
                        $scope.street_1 = $scope.data[0].street_1;
                        $scope.role_name = $scope.data[0].role_name;
                        $scope.zip_code = $scope.data[0].zip_code;
                        $scope.state = $scope.data[0].state;
                        $scope.city = $scope.data[0].city;
                        $scope.media_url = $scope.data[0].media_url;
                        $scope.area = $scope.data[0].area;
                        // alert($scope.media_url);

                        if ($scope.data.contact_mobile !== '') {
                            $scope.mobile = $scope.data.contact_mobile;
                        }
                        if ($scope.data.contact_email !== '') {
                            $scope.email = $scope.data.contact_Email;
                        }
                        $state.go('app.newuserdetail', {}, { reload: false });
                    },
                                function (error) {
                                    if (error.status === 400)
                                        alert(error.data.Message);
                                    else
                                        alert("Network issue");
                                });

                    Url = "ElementInfo/GetElementInfo?Id=" + $scope.seletedCustomerId + "&&type=User";

                    apiService.getWithoutCaching(Url).then(function (response) {
                        data = response.data;
                        a = 0, b = 0, c = 0;
                        for (i = 0; i < data.length; i++) {
                            if (data[i].element_type == "email_user") {
                                if (a > 0) { $scope.choices1.push({ 'id': 'choice' + (a + 1) }); }
                                $scope.choices1[a].account_email = data[i].element_info1;
                                $scope.choices1[a].class_id = data[i].class_id;
                                a++;
                            }
                            if (data[i].element_type == "phone_user") {
                                if (b > 0) { $scope.choices.push({ 'id': 'choice' + (b + 1) }); }
                                $scope.choices[b].account_phone = data[i].element_info1;
                                $scope.choices[b].class_id = data[i].class_id;
                                b++;
                            }

                        }

                    },
                   function (error) {
                       if (error.status === 400)
                           alert(error.data.Message);
                       else
                           alert("Network issue");
                   });

                    $scope.choices = [{ id: 'choice1' }];





                    $scope.choices = [{ id: 'choice1' }];
                    $scope.addNewChoice = function (e) {
                        var classname = e.currentTarget.className;
                        if (classname == 'remove-field') {

                        }
                        else if ($scope.choices.length) {
                            var newItemNo = $scope.choices.length + 1;
                            $scope.choices.push({ 'id': 'choice' + newItemNo });
                        }

                    };

                    $scope.choices1 = [{ id: 'choice1' }];
                    $scope.addNewChoice1 = function (e) {
                        var classname = e.currentTarget.className;
                        if (classname == 'remove-field') {

                        }
                        else if ($scope.choices1.length) {
                            var newItemNo = $scope.choices1.length + 1;
                            $scope.choices1.push({ 'id': 'choice' + newItemNo });
                        }

                    };


                }

            }, 1000);



          
          
        });

    });