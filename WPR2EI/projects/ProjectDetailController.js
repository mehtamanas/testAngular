﻿
angular.module('project')

.controller('ProjectDetailController',
    function ($scope, $state, security, $cookieStore, apiService, $window, $modal, $rootScope, projectService) {
       console.log('ProjectDetailController');
       var selectedPayment = [];
        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
        var orgID = $cookieStore.get('orgID');

        //if (!$rootScope.projects.write) {
        //    $('#btnSave').hide();
        //    $('#iconEdit').hide();
        //    $('#btnAdd').hide();
        //}
        

        $scope.editnote = function (image) {
            $scope.openNotesEditPopUp(image);
        }

        $scope.chargeAction = 'no_action';
        $scope.serviceAction = 'no_action';

      //  Audit log start     
         AuditCreate = function () {
             var postdata =
            {
                device_os: $cookieStore.get('Device_os'),
                device_type: $cookieStore.get('Device'),
                module_id: "ProjectDetail",
                action_id: "ProjectDetail View",
                details:  $scope.image.name + "ProjectDetailView",
                application: "angular",
                browser: $cookieStore.get('browser'),
                ip_address: $cookieStore.get('IP_Address'),
                location: $cookieStore.get('Location'),
                organization_id: $cookieStore.get('orgID'),
                User_ID: $cookieStore.get('userId')
            };

             apiService.post("AuditLog/Create", postdata).then(function (response) {
                 var loginSession = response.data;
             },
        function (error) {
        });
         };
        
         //end
         $scope.serviceAction = 'no_action';
       
        $rootScope.title = 'Dwellar-ProjectDetails';

        $scope.openNotesEditPopUp = function (image) {
            //alert(editnotes);
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/editGallery.html',
                backdrop: 'static',
                controller: EditGallery,
                size: 'lg',
                resolve: {
                    imageData: {
                        data: image
                    }
                }
            });
        };
      
        $scope.openNewPaymentSchemePopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/addNewPaymentScheme.tpl.html',
                backdrop: 'static',
                controller: AddNewPaymentSchemeController,
                size: 'lg'
            });
        };
        $scope.openEditPaymentSchemePopup = function (id) {

            $cookieStore.put('payment_schedule_id', id);
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/editPaymentScheme.tpl.html',
                backdrop: 'static',
                controller: EditPaymentSchemeController,
                size: 'lg'
            });

        };

        if ($scope.seletedCustomerId !== '') {
            //GetUrl = apiService.baseUrl +"Project/GetById/0e31ff89-3236-4626-a3d9-4360ae084e33"
           
        $scope.goToDocument = function () {
            $state.go('loggedIn.modules.project.document');
        };

        $scope.goToUpload = function () {
            $state.go('loggedIn.modules.contact.upload');
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
                    read: apiService.baseUrl + "Project/GetUsersInProject/" + $scope.seletedCustomerId

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
                field: "first_name",
                title: "First Name",
               
                attributes:
                    {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }

            }, {
                field: "last_name",
                title: "Last Name",
               
                attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }


            }, {
                field: "account_email",
                title: "Email",
              
                attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
            }, {
                field: "account_phone",
                title: "Phone",
                
                attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
            },
            {
                field: "account_country",
                title: "Country",
               
                attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
            }]
        };

        $scope.TeamsGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "Project/GetProjectTeamList/" + $scope.seletedCustomerId

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
               
                attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
            },
            {
                field: "description",
                title: "Description",
               
                attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
            }]
        };

        $scope.PropertyListGrid = {
            dataSource: {
                type: "json",
                transport: {

                    read: apiService.baseUrl + "Project/GetProjectPropertyList/" + $scope.seletedCustomerId
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
              
                attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
            }, {
                field: "built_up_area",
                title: "Area",
               
                attributes:
                  {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }

            }, {
                field: "flat_number",
                title: "Flat No",
              
                attributes:
                  {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
            }, {
                field: "floor_number",
                title: "Floor No",
              
                attributes:
                  {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
            },
                {
                    field: "total_cost",
                    title: "Total Cost",
                 
                    attributes:
                  {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
                }]

        };

        $scope.PeopleGrid = {
            dataSource: {
                type: "json",
                transport: {

                    read: apiService.baseUrl + "Project/GetContactInProject/" + $scope.seletedCustomerId
                },
                pageSize: 20

            },
            groupable: true,
            sortable: true,
            selectable: "multiple",
            reorderable: true,
            resizable: true,
            height: screen.height - 370,
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
                field: "Contact_First_Name",
                title: "First Name",
              
                attributes:
                 {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }

            }, {
                field: "people_type",
                title: "people Type",
             
                attributes:
                 {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
            }, {
                field: "Contact_Phone",
                title: "Contact Phone",
              
                attributes:
                 {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
            }, {
                field: "Contact_Email",
                title: "Contact Email",
              
                attributes:
                 {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }

            }, {
                title: "Action",
                template: "<a id='followUp' class='btn btn-primary' ng-click='openFollowUp(dataItem)' data-toggle='modal'>Follow up </a> </div>",
                width: "120px",
                attributes:
                {
                  "class": "UseHand",
                  "style": "text-align:center"
                }
            },]
        };

        $scope.TaskGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "ToDoItem/GetMultipleTaskByProjectId/" + $scope.seletedCustomerId
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
                field: "name",
                //template: '<a ng-click="openEditTask(dataItem.task_id)" href="">#=name#</a>',
                template: '#if (status!="Completed") {# <a ng-click="openEditTask(dataItem.task_id)" href="">#=name#</a> #} else {#<a ng-click="taskComplete()" href="">#=name#</a>#}#',
                title: "Task Name",
              
                attributes:
             {
                 "style": "text-align:center"
             }

            }, {
                field: "project_name",
                title: "Project",
              
                attributes:
             {
                 "style": "text-align:center"
             }

            }, {
                field: "user_name",
                title: "Assign To",
                attributes:
             {
                 "style": "text-align:center"
             }

            },{
                field: "company_name",
                title: "Company",
                attributes:
                 {
                     "style": "text-align:center"
                 }

            },{
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
                        field: "created_by",
                        title: "Created By",
                        attributes:
                    {
                        "style": "text-align:center"
                    }

                },
            {
                field: "task_code",
                title: "Task Code",
                attributes:
                 {
                     "style": "text-align:center"
                 }

            },{
                field: "priority",
                template: '<span id="#= priority #">#= priority #</span>',
                title: "Priority",
              
                attributes:
             {
                 "style": "text-align:center"
             }

            }, {
                field: "start_date_timeFormatted",
                title: "Start Date",
             
                format: '{0:dd/MM/yyyy hh:mm:ss}',
                attributes:
             {
                 "style": "text-align:center"
             }

            }, {
                field: "due_date_timeFormatted",
                title: "Due Date",
               
                format: '{0:dd/MM/yyyy hh:mm:ss}',
                attributes:
             {
                 "style": "text-align:center"
             }

            },
             {
                 field: "reminder_date_timeFormatted",
                 title: "Reminder Date",
               
                 format: '{0:dd/MM/yyyy hh:mm:ss}',
                 attributes:
               {
                   "style": "text-align:center"
               }

             },
            {
                field: "text",
                title: "Notes",
               
                attributes:
             {
                 "style": "text-align:center"
             }
            }, {
                field:"status",
                template: '<span id="#= status #"></span>',
                title: "Status",
               
                attributes:
             {
                 "style": "text-align:center"
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

        $scope.EventGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "Event/GetEventCampaign/" + $scope.seletedCustomerId + "/Project"  //eea9b986-8561-4970-851b-7cfb38bb2b87"

                },
                pageSize: 20,
                refresh: true,
                schema: {
                    model: {
                        fields: {

                            userevent_date: { type: "date" },
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
                title: "Event Name",
              
                attributes:
               {
                   "style": "text-align:center"
               }
            },
            {
                field: "project_name",
                title: "Project Name",
               
                attributes:
               {
                   "style": "text-align:center"
               }
            },
            {
                field: "location",
                title: "Location",
              
                attributes:
               {
                   "style": "text-align:center"
               }
            },
             {
                 field: "userevent_date",
                 title: "Start Date",
                
                 format: '{0:dd/MM/yyyy hh:mm:ss}',
                 attributes:
               {
                   "style": "text-align:center"
               }
             },
             {
                 field: "end_date",
                 title: "End Date",
              
                 format: '{0:dd/MM/yyyy hh:mm:ss}',
                 attributes:
               {
                   "style": "text-align:center"
               }
             },
             //{
             //    field: "start_date_time",
             //    title: "Start Time",
             //    width: "120px"
             //},
             //{
             //    field: "end_date_time",
             //    title: "End Time",
             //    width: "120px"
             //},
             {
                 field: " text",
                 title: "Note",
               
                 attributes:
               {
                   "style": "text-align:center"
               }
             }]
        };

        $scope.serviceGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "Services/GetServicesGrid/" + $scope.seletedCustomerId

                },
                pageSize: 20,
                refresh: true,
                schema: {
                    model: {
                        fields: {

                            userevent_date: { type: "date" },
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
            columns: [
                {
                    template: "<input type='checkbox', class='checkbox', data-id='#= project_service_id #',  ng-click='check($event,dataItem)' />",
                    title: "<input id='checkAll', type='checkbox', class='check-box', ng-click='checkALL(serviceGrid)' />",
                    width: "50px",
                    attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
                }, {

                    field: "name",
                    title: " Service Name",
                
                    attributes:
                   {
                       "style": "text-align:center"
                   }
                },
            {
                field: "description",
                title: "Description",
              
                encoded: false,
                attributes:
               {
                   "style": "text-align:center"
               }
            },
            {
                field: "price",
                title: "Unit Price",
               
                attributes:
               {
                   "style": "text-align:center"
               }
            },
            {
                field: "tax_value",
                title: "Taxes",
             
                attributes:
               {
                   "style": "text-align:center"
               }
            },
            {
                field: "final_amount",
                title: "Total",
              
                attributes:
               {
                   "style": "text-align:center"
               }
            }, {
                field: "status",
                title: "Status",

                attributes:
               {
                   "style": "text-align:center"
               }
            },

            {
                title: "Action",

                template: "<a id='followUp'class='btn btn-primary' ng-click='openFollowUp(dataItem)' data-toggle='modal'>Create Quote </a> </div>",
               
                attributes:
                  {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
            },

            ]
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

        $scope.$on('inventoryLoaded', function (event, args) {
            if (args == 0) {
                $scope.width = 100;
                //setTimeout(function () { $scope.width = 0 }, 3000);
                $scope.width = 0;
            }
        });

        $scope.$on('inventoryLoading', function (event, args) {
            if (args == 1) {
                $scope.width = 100;
                //setInterval($scope.width + 2, 2000);
            }
        });
        
        $scope.selectTower = function () {
            $scope.params.project_id = $scope.tower1;
            $cookieStore.put('tower_id', $scope.params.project_id);
            //var grid = document.getElementById('gridInventory');
            //grid.data('kendoGrid').refresh();
            $('.k-i-refresh').trigger("click");
            
        };
       
        $scope.towerGrid = function () {
            Url = "Floors/GenerateTowerGrid"
            var postData = {
                tower_id: $scope.tower1
            }
            apiService.post(Url, postData).then(function (response) {

                $('.k-i-refresh').trigger("click");
               
            },
        function (error) {
            alert("Error " + error.tower);
        });
        }

        $scope.TowerListGrid = {
            dataSource: {
                type: "json",
                transport: {

                    read: apiService.baseUrl + "UnitTypes/GetTowerunitproperties/" + $cookieStore.get('projectId')
                },
                pageSize: 20

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
            columns: [
                {
                    //template: "<img height='40px' width='40px' src='#= Project_image #'/>" +
                    //"<span style='padding-left:10px' class='property-photo'> </span>",
                    //template: "<input type='checkbox' class='checkbox' ng-click='onClick($event)' />",
                    //title: "",
                    template: "<input type='checkbox' class='checkbox'  data-id='#= tower_id #', ng-click='check($event,dataItem)' />",
                    title: "<input id='checkAll', type='checkbox', class='check-box' data-id='#= tower_id #',  ng-click='checkALL(TowerListGrid)' />",
                    width: "60px",
                    attributes: {
                        "class": "UseHand",
                        "style": "text-align:center"

                    }
                },

                {
                    template: "<img height='40px' width='40px' src='#= Image_Url_NSEW #'/>" +
                   "<span style='padding-left:10px' class='property-photo'> </span>",
                    title: "Photo", 
                    attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"

                }
                },
            {
                  field: "tower_name",
                  title: "Name",
              
                  attributes:
                  {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
              },
              {
                  field: "num_bedrooms",
                  title: "Bedrooms",
               
                  attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
              },
            {
                field: "num_bathrooms",
                title: "Bathrooms",
              
                attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            },
            {
                field: "super_built_up_area",
                title: "Slb. Area",
             
                attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            },
              {
                  field: "carpet_area",
                  title: "Crp Area",
             
                  attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
              },
               {
                     field: "total_consideration",
                     title: "Price",
               
                     attributes:
                  {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
               },
            {
                      field: "available_status",
                      title: "Status",
                      attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
            },
              {
                  field: "floorno",
                  title: "Floor No",
                
                  attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
              },
                {
                    field: "unitno",
                    title: "Unit No",
                  
                    attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
                },
                  {
                      field: "carpark",
                      title: "Car Park",
                 
                      attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
                  }, {
                      field: "box_price",
                      title: "Box Price",

                      attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
                  }]

        };
              
        $scope.OfferGrid = {
            dataSource: {
                type: "json",
                transport: {

                    read: apiService.baseUrl + "Offers/GetOfferProject?orgID=" + orgID
                },
                pageSize: 20

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
                field: "offer_name",
                title: "Offer Name",
              
                attributes:
                 {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }

            }, {
                field: "description",
                title: "Description",
                width: "200px",
                attributes:
                 {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
            }, {
                field: "offer_type_name",
                title: "Offer Type",
               
                attributes:
                 {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
            }, {
                field: "offer_value",
                title: "Offer Value",
               
                attributes:
                 {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }

            }, {
                field: "project_name",
                title: "Project Name",
              
                attributes:
                 {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }

            }, {
                field: "SKUoffer",
                title: "SKU",
             
                attributes:
                 {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }

            }, {
                field:"status",
                template: '<span id="#= status #"></span>',
                title: "Status",
              
                attributes:
                 {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }

            }, ]
        };

        $scope.ChargesGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "Services/GetCharges?id=" + $scope.seletedCustomerId  

                },
                pageSize: 20,
                refresh: true,
                schema: {
                    model: {
                        fields: {

                            userevent_date: { type: "date" },
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
            columns: [
                {
                    template: "<input type='checkbox', class='checkbox', data-id='#= charge_name_type_id #',  ng-click='check($event,dataItem)' />",
                    title: "<input id='checkAll', type='checkbox', class='check-box', ng-click='checkALL(ChargesGrid)' />",
                    width: "50px",
                    attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
                },

                {
                field: "charge_type",
                title: "Charge Name",
             
                attributes:
               {
                   "style": "text-align:center"
               }
            },
            {
                field: "category_type_name",
                title: "Category Type Name",
            
                attributes:
               {
                   "style": "text-align:center"
               }
            }, {
                field: "charge",
                title: "Charge Type Name",
             
                attributes:
              {
                  "style": "text-align:center"
              }
            }, {
                field: "no_of_months",
                title: "No of Months",
             
                attributes:
               {
                   "style": "text-align:center"
               }
            },
             {
                 field: "charge_percentage",
                 title: "Charge Percentage",
              
                 attributes:
               {
                   "style": "text-align:center"
               }
             }]
        };


        $scope.chooseActionForCharge = function () {
            var allGridElements = $("#selectCharges .checkbox").toArray();
            var allCheckedElement = _.filter(allGridElements, function (o)
            { return o.checked });
            allCheckedIds = (_.pluck(allCheckedElement, 'dataset.id'));
            $cookieStore.remove('checkedIds');
            $cookieStore.put('checkedIds', allCheckedIds);

            if (allCheckedIds.length > 0) {

                if ($scope.chargeAction === "no_action") {

                }
                else if ($scope.chargeAction === "delete") {
                    var chargeDelete = [];
                    for (var i in allCheckedIds) {
                        var charge = {};
                        charge.charge_name_type_id = allCheckedIds[i];
                        charge.organization_id = $cookieStore.get('orgID');
                        chargeDelete.push(charge);
                    }
                    $cookieStore.put('chargeDelete', chargeDelete);
                    $scope.openConfirmationCharge();
                }
            }
        }

        $scope.checkALL = function (e) {
            if ($('.check-box:checked').length > 0)
                $('.checkbox').prop('checked', true);
            else
                $('.checkbox').prop('checked', false);
        };


        $scope.check = function (e, data) {
            var allListElements = $(".checkbox").toArray();
            for (var i in allListElements) { // not all checked
                if (!allListElements[i].checked) {
                    $('#checkAll').prop('checked', false);
                    break;
                }
                if (i == allListElements.length - 1) // if all are checked manually
                    $('#checkAll').prop('checked', true);
            }
        }

        $scope.selectBoxPrice=function()
        {
            var allGridElements = $("#gridInventory .checkbox").toArray();
            var allCheckedElement = _.filter(allGridElements, function (o)
            { return o.checked });
            allCheckedIds = (_.pluck(allCheckedElement, 'dataset.id'));
            $cookieStore.remove('checkedIds');
            $cookieStore.put('checkedIds', allCheckedIds);

            if (allCheckedIds.length > 0) {

                if ($scope.boxAction === "no_action") {

                }
                else if ($scope.boxAction === "box_price") {
                    var boxPrice = [];
                    for (var i in allCheckedIds) {
                        var Box = {};
                        Box.project_service_id = allCheckedIds[i];
                        Box.organization_id = $cookieStore.get('orgID');
                        boxPrice.push(Box);
                    }
                    $cookieStore.put('boxPrice', boxPrice);
                    $scope.openBoxPrice();
                }
            }
        }

        $scope.openBoxPrice = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/boxPrice.html',
                backdrop: 'static',
                controller: AddBoxPriceController,
                size: 'lg'
            });
        };


        $scope.chooseActionForService = function () {
            var allGridElements = $("#selectServices .checkbox").toArray();
            var allCheckedElement = _.filter(allGridElements, function (o)
            { return o.checked });
            allCheckedIds = (_.pluck(allCheckedElement, 'dataset.id'));
            $cookieStore.remove('checkedIds');
            $cookieStore.put('checkedIds', allCheckedIds);

            if (allCheckedIds.length > 0) {

                if ($scope.serviceAction === "no_action") {

                }
                else if ($scope.serviceAction === "delete") {
                    var serviceDelete = [];
                    for (var i in allCheckedIds) {
                        var service = {};
                        service.project_service_id = allCheckedIds[i];
                        service.organization_id = $cookieStore.get('orgID');
                        serviceDelete.push(service);
                    }
                    $cookieStore.put('serviceDelete', serviceDelete);
                    $scope.openConfirmation();
                }
            }
        }
      

        $scope.checkALL = function (t) {

            if (t == $scope.serviceGrid) {
                if ($('.check-box:checked').length > 0)
                    $('#selectServices .checkbox').prop('checked', true);
                else
                    $('#selectServices .checkbox').prop('checked', false);
            }
            else if (t == $scope.ChargesGrid) {
                if ($('.check-box:checked').length > 0)
                    $('#selectCharges .checkbox').prop('checked', true);
                else
                    $('#selectCharges .checkbox').prop('checked', false);
            }


        };


        $scope.check = function (e, data) {
            var allListElements = $(".checkbox").toArray();
            for (var i in allListElements) { // not all checked
                if (!allListElements[i].checked) {
                    $('#checkAll').prop('checked', false);
                    break;
                }
                if (i == allListElements.length - 1) // if all are checked manually
                    $('#checkAll').prop('checked', true);
            }
        }


        $scope.$on('REFRESH', function (event, args) {
            if (args == 'projectGrid') {
                $('.k-i-refresh').trigger("click");
            }
            $scope.serviceAction = 'no_action';
        });

        $scope.openOffers = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/offers.tpl.html',
                backdrop: 'static',
                controller: OfferController,
                size: 'lg'
            });
        };

        $scope.openAddPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/addProject.tpl.html',
                backdrop: 'static',
                controller: AddUserProjectController,
                size: 'sm',
                resolve: {
                    projectService: projectService,
                    projectData: {
                        userId: window.sessionStorage.selectedCustomerID,
                        orgId: $cookieStore.get('orgID')
                    }
                }
            });
        };

        $scope.openTeamPopup = function () {          
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/addTeam.html',
                backdrop: 'static',
                controller: AddTeamController,
                size: 'sm',
                resolve: {
                    projectService: projectService,
                    projectData: {
                        userId: window.sessionStorage.selectedCustomerID,
                        orgId: $cookieStore.get('orgID')
                    }
                }
            });
        };

        $scope.openNewFloorPopup = function () {          
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'projects/add_new/addNewFloor.tpl.html',
                    backdrop: 'static',
                    controller: AddNewFloorController,
                    size: 'lg'
                    
                });          
        };

            // Kendo Grid on change
        $scope.myGridChangePanam = function (dataItem) {          
            window.sessionStorage.selectedCustomerID = dataItem.tower_id;        
            $scope.openNewPanoramicPopup(dataItem);
        };

        $scope.openNewPanoramicPopup = function (dataItem) {
            if (dataItem.tower_id == undefined) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'projects/panoramic.tpl.html',
                    backdrop: 'static',
                    controller: AddNewPanoramicController,
                    size: 'lg',
                    resolve: { items: { title: "Add New Panaromic View" } }
                });
            }
            else {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'projects/panoramic.tpl.html',
                    backdrop: 'static',
                    controller: AddNewPanoramicController,
                    size: 'lg',
                    resolve: { items: dataItem }
                });
            }
        };

        $scope.openEditFloorPopup = function (id) {           
            $cookieStore.put('FloorId', id);
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/edit_floor.tpl.html',
                backdrop: 'static',
                controller: AddNewEditFloorController,
                size: 'lg',
            });
        };

        $scope.openNewTowerPopup = function () {          
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'projects/add_new/addNewTower.tpl.html',
                    backdrop: 'static',
                    controller: AddNewTowerController,
                    size: 'lg'                   
                });         
        };

        $scope.openEditTowerPopup = function (id) {
            $cookieStore.put('tower_id', id);          
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/edit_tower.tpl.html',
                backdrop: 'static',
                controller: AddEditTowerController,
                size: 'lg',
            });
        };

        $scope.openNewUnitPopup = function (unit) {
            if (unit == undefined) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'projects/add_new/addNewUnit.tpl.html',
                    backdrop: 'static',
                    controller: AddNewUnitController,
                    size: 'lg',
                    resolve: { items: { title: "Add New Unit Type" } }
                });
            }
            else {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'projects/add_new/addNewUnit.tpl.html',
                    backdrop: 'static',
                    controller: AddNewUnitController,
                    size: 'lg',
                    resolve: { items: unit }
                });
            }
        };

        $scope.openNewWingPopup = function () {         
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'projects/add_new/addNewWing.tpl.html',
                    backdrop: 'static',
                    controller: AddNewWingController,
                    size: 'lg'               
                });     
        };

        $scope.openEditWingPopup = function (id) {        
            $cookieStore.put('wing_id',id);
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/editWing.tpl.html',
                backdrop: 'static',
                controller: EditNewWingController,
                size: 'lg'                  
           });
        };

        $scope.openEditProjectPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/edit_project.tpl.html',
                backdrop: 'static',
                controller: EditProjectController,
                size: 'lg'
            });
        };

        $scope.openNewGalleryPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/gallery.html',
                backdrop: 'static',
                controller: AddNewGalleryController,
                size: 'lg'
            });
        };

        $scope.openUploadViewPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/uploadview.tpl.html',
                backdrop: 'static',
                controller: UploadViewController,
                size: 'lg'
            });
        };

        $scope.openAddService = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/addNewService.tpl.html',
                backdrop: 'static',
                controller: addNewServiceController,
                size: 'lg'
            });
        };
       
        $scope.openFollowUp = function (d) {
            var id = d.id;
            window.sessionStorage.selectedCustomerID = id;
            $cookieStore.put('company_name', d.company);
            $cookieStore.put('lead_name', d.Name);
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/company/followUp.html',
                backdrop: 'static',
                controller: FollowUpController,
                size: 'lg'
            });
        };

        $scope.openNewAmenityPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/amenities.html',
                backdrop: 'static',
                controller: AddNewAmenityController,
                size: 'lg'
            });
        };

        $scope.openNewBrochurePopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/brochure.html',
                backdrop: 'static',
                controller: AddNewBrochureController,
                size: 'lg'
            });
        };

        $scope.openNewPanoramicViewPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/panoramicView.tpl.html',
                backdrop: 'static',
                controller: AddNewPanoramicViewController,
                size: 'lg'
            });
        };

        $scope.openNewVideoPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/videos.tpl.html',
                backdrop: 'static',
                controller: AddNewVideosController,
                size: 'lg'
            });
        };

        $scope.removeImage = function (index) {
            var id = $scope.Gallery[index].id;
            $scope.Gallery[index] = undefined;
            var postdata = { id: id }
            $cookieStore.put('imagepostdata', postdata);
            $scope.openImageConfirmation();
          

        }

        $scope.openImageConfirmation = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/removeimageconfirm.html',
                backdrop: 'static',
                controller: confirmProjectImageController,
                size: 'lg',
                resolve: { items: { title: "Image" } }
            });
        };


        $scope.openEventCampaignPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/addNewCampaign.tpl.html',
                backdrop: 'static',
                controller: AddNewEventproject,
                size: 'lg'
            });
        };

        $scope.openEditEventPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/edit_event.html',
                backdrop: 'static',
                controller: EditEventproject,
                size: 'lg'
            });
        };

        $scope.openBudgetPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/budget.html',
                backdrop: 'static',
                controller: AddBudgetproject,
                size: 'lg'
            });
        };

        $scope.openAddNewTask = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/add_new_task.html',
                backdrop: 'static',
                controller: AddNewTaskProject,
                size: 'lg'

            });

        };

        $scope.openEditTask = function (d) {
            window.sessionStorage.selectedTaskID = d;
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/edit_task.html',
                backdrop: 'static',
                controller: EditTaskProject,
                size: 'lg'
            });
        };

        $scope.openCharges = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/addcharges.tpl.html',
                backdrop: 'static',
                controller: ChargesController,
                size: 'lg'
            });
        };

        $scope.openConfirmation = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/confirmService.tpl.html',
                backdrop: 'static',
                controller: ServiceconfirmationController,
                size: 'sm',
                resolve: { items: { title: "Project" } }
            });
        }

        $scope.openConfirmationCharge = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/confirmCharges.tpl.html',
                backdrop: 'static',
                controller: ChargeconfirmationController,
                size: 'sm',
                resolve: { items: { title: "Project" } }
            });
        }

        $scope.editCharges = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/editcharges.tpl.html',
                backdrop: 'static',
                controller: EditChargesController,
                size: 'lg'
            });
        };

        $scope.editService = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/editService.tpl.html',
                backdrop: 'static',
                controller: editServiceController,
                size: 'lg'
            });
        };

        //var vid = document.getElementById("playVideo");
        //vid.onplaying = function () {
        //    alert("The video is now playing");
        //};
            // Kendo Grid on change
        //$scope.myGridChange = function (dataItem) {        
        //    window.sessionStorage.selectedTaskID = dataItem.task_id;           
        //    $scope.openEditTask();
        //};

        $scope.myGridChangeEvent = function (dataItem) {            
            window.sessionStorage.selectedEventID = dataItem.id;          
            $scope.openEditEventPopup();
        };

        $scope.myGridChangeService = function (dataItem) {           
            window.sessionStorage.selectedServiceID = dataItem.project_service_id;           
            $scope.editService();
        };
       
        $scope.myGridChangeCharges = function (dataItem) {          
            window.sessionStorage.chargeId = dataItem.charge_name_type_id;         
            $scope.editCharges();
        };

            //calling Project Main api
            projectUrl = "Project/GetProjectSummary?id=" + $scope.seletedCustomerId;
            apiService.getWithoutCaching(projectUrl).then(function (response) {
                $scope.main = response.data;
                $scope.image = $scope.main[0];
                AuditCreate();

            },
       function (error)
       {
          
       } );

            //callingWingApi
            projectUrl = "WingType/GetWingFloorList/" + $scope.seletedCustomerId;
            apiService.getWithoutCaching(projectUrl).then(function (response) {
                $scope.builder = response.data;
            },
           function (error)
           {           
           });

            //calling Tower
            projectUrl = "Tower/GetTowerWingList/" + $scope.seletedCustomerId;
            apiService.getWithoutCaching(projectUrl).then(function (response) {
                $scope.built = response.data;
            },
           function (error) {
          
           });

            //for tower drop town
            Url = "Tower/GetByProjectID/" + $scope.seletedCustomerId;
            apiService.getWithoutCaching(Url).then(function (response) {
                $scope.towers = response.data;
            },
            function (error) {            
            });

            //calling brochure  pdf start
            projectUrl = "Project/GetImageByProjectID/" + $scope.seletedCustomerId + "/Pdf_start"//8c4128e2-785b-4ad6-85af-58344dd79517";
            apiService.getWithoutCaching(projectUrl).then(function (response) {
                $scope.Gallery2 = response.data;
            },
           function (error) {
        
           });

            //calling brochure pdf end
            projectUrl = "Project/GetImageByProjectID/" + $scope.seletedCustomerId + "/Pdf_End"//8c4128e2-785b-4ad6-85af-58344dd79517";
            apiService.getWithoutCaching(projectUrl).then(function (response) {
                $scope.Gallery1 = response.data;
            },
           function (error)
           {
          
           });

            // calling panoramic views api
            projectUrl = "Project/GetImageByProjectID/" + $scope.seletedCustomerId + "/Panorma_zip_Full_2D";
            apiService.getWithoutCaching(projectUrl).then(function (response) {
                $scope.view = response.data;
            },
           function (error)
           {
          
           });

            //calling Amenities
            projectUrl = "Amenities/GetAmenities?id=" + $scope.seletedCustomerId;
            apiService.getWithoutCaching(projectUrl).then(function (response) {
                $scope.orgAmenities = response.data;
            },
           function (error)
           {
           
           });

            //calling Floors
            projectUrl = "FloorType/GetFloorUnitList/" + $scope.seletedCustomerId;//f2294ca0-0fee-4c16-86af-0483a5718991";
            apiService.getWithoutCaching(projectUrl).then(function (response) {
                $scope.builddetail = response.data;
            },
           function (error)
           {
        
           });

            //calling Payment
            projectUrl = "Payment/GetPayment_Schedule_Mile?id=" + $scope.seletedCustomerId;//d028defd-319f-4b89-a51b-55ed9b327200 ";
            apiService.getWithoutCaching(projectUrl).then(function (response) {
                $scope.orgpayment = response.data;
                var paymentArr = [];
                for (i = 0; i < $scope.orgpayment.length; i++) {
                    paymentArr.push(_.pluck(($scope.orgpayment)[i].PaymentScheduleDetailsList, 'Payment_Schedule_Detail_id'));
                    $cookieStore.put('payment_schedule_id', paymentArr[i]);
                }

                //var uniqPayment = _.uniq(paymentArr[0]);
                
            },
           function (error)
           {
          
           });

            //calling  unittype
            projectUrl = "UnitTypes/GetUnitTypeDetails/" + $scope.seletedCustomerId;//f2294ca0-0fee-4c16-86af-0483a5718991";
            apiService.getWithoutCaching(projectUrl).then(function (response) {
                $scope.orgUsers = response.data;
            },
               function (error)
               {
      
               });

            //calling getImage
            projectUrl = "Project/GetImageByProjectID/" + $scope.seletedCustomerId +"/Gallery_Type_Full_2D";
            apiService.getWithoutCaching(projectUrl).then(function (response) {
                $scope.Gallery = response.data;
            },
           function (error)
           {
         
           });
            //calling uploadview
            projectUrl = "Project/GetImageByProjectID/" + $scope.seletedCustomerId + "/Upload_View";
            apiService.getWithoutCaching(projectUrl).then(function (response) {
                $scope.UploadView = response.data;
            },
           function (error) {
          
           });
            //Calling get video
            projectUrl = "Project/GetVideoByProjectID/" + $scope.seletedCustomerId;
            apiService.getWithoutCaching(projectUrl).then(function (response) {
                $scope.Videos = response.data;
            },
       function (error) {
       });

            Url = "ElementInfo/GetElementInfo?Id=" + $scope.seletedCustomerId + "&&type=Project";
            apiService.getWithoutCaching(Url).then(function (response) {
                data = response.data;
                $scope.facebook = (_.findWhere(data, { element_type: 'project_facebook' })).element_info1;
                $scope.facebook = 'https://' + $scope.facebook;
                $scope.twitter = (_.findWhere(data, { element_type: 'project_twitter' })).element_info1;
                $scope.twitter = 'https://' + $scope.twitter;
                $scope.linkedin = (_.findWhere(data, { element_type: 'project_linkedin' })).element_info1;
                $scope.linkedin = 'https://' + $scope.linkedin;            
            },
            function (error) {             

            });

            GetUrl = "Tower/GetTowerSummary?id=" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f Project/GetById/" ;
            apiService.getWithoutCaching(GetUrl).then(function (response) {
                 $scope.buildsummary = response.data;
                     },
                        function (error)
                        {
                        });


            //calling essential
             if ($scope.seletedCustomerId !== '') {               
                 GetUrl = "Project/GetById/" + $scope.seletedCustomerId;
                 apiService.getWithoutCaching(GetUrl).then(function (response) {

                     $scope.data = response.data;
                     $scope.media_url = $scope.data[0].media_url;
                     $scope.media_name = $scope.data[0].media_name;
                     $scope.media_url1 = $scope.data[0].media_url1;
                     $scope.media_url2 = $scope.data[0].media_url2;
                     $scope.media_url3 = $scope.data[0].media_url3;
                     $scope.media_url4 = $scope.data[0].media_url4;
                     $scope.media_url_video = $scope.data[0].media_url_video;
                     $scope.media_url_home_page_background = $scope.data[0].media_url_home_page_background;
                     if ($scope.data[0].contact_mobile !== '') {
                         $scope.mobile = $scope.data[0].contact_mobile;
                     }
                     if ($scope.data[0].contact_email !== '') {
                         $scope.email = $scope.data[0].contact_Email;
                     }
                 },
                             function (error)
                             {
                                
                             });
             }

        }

        $scope.paymentGridOptions = {
            dataSource: {
                type: 'json',
                transport: {
                    read: function (options) {
                        options.success(selectedPayment);
                    }
                },
                pageSize: 20
            },
            reorderable: true,
            height: window.innerHeight - 400,
            resizable: true,
            pageable: {
                refresh: true,
            },
            columns: [{
                title: 'PAYMENT TERMS',
                template: '<span>#=description#</span><span> #=percentage#%</span>',
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            }, {
                title: 'STATUS',
                template: '<span>Complete</span>',
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            }, {
                title: 'Action',
                template: '<div class="uib-dropdown drop_lead" uib-dropdown ><button class="btn drop_lead_btn uib-dropdown-toggle" uib-dropdown-toggle type="button" data-toggle="uib-dropdown"><span class="caret caret_lead"></span></button><ul class="uib-dropdown-menu dropdown_lead" uib-dropdown-menu >' +
               '<li><a  class="follow_lead" ng-click="deletePayment(dataItem.payment_schedule_id)" data-toggle="modal">Delete </a></li>' +
               '<li><a href="" ng-click="sendDemandLetter(dataItem.payment_schedule_id)">Send Demand Letter</a></li>' +
               '<li><a href="" ng-click="completePayment(dataItem.payment_schedule_id)">Complete</a></li>' +
               '<li><a href="" ng-click="editPayment(dataItem.payment_schedule_id)">Edit</a></li>' +
               '</ul></div>',
                width: "120px",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            }]
        }

        $scope.selectPaymentScheme = function (dataItem) {
            selectedPayment = (_.find($scope.orgpayment, function (o) { return o.p_sch_id == $scope.paymentSchemeType })).PaymentScheduleDetailsList;
            $('.k-i-refresh').trigger("click");
        }

        $scope.deletePayment = function (id) {

        }

        $scope.sendDemandLetter = function (id) {
            $state.go('app.demandLetter', { id: id });
        }
        $scope.completePayment = function (id) {

        }
        $scope.editPayment = function (id) {

        }
       
        $scope.$on('REFRESH', function (event, args) {
            if (args == 'UserGrid') {
                $('.k-i-refresh').trigger("click");
            }
        });

        $scope.$on('REFRESH', function (event, args) {
            if (args == 'TeamsGrid') {
                $('.k-i-refresh').trigger("click");
            }
        });
        $scope.$on('REFRESHProperty', function (event, args) {
            if (args == 'PropertyListGrid') {
                $('.k-i-refresh').trigger("click");
            }
        });


        $scope.$on('REFRESH', function (event, args)
        {

          if (args == 'unit')
            {
                projectUrl = "UnitTypes/GetUnitTypeDetails/" + $scope.seletedCustomerId;
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.orgUsers = response.data;
                },
                    function (error)
                    {
                    }
                );
            }

            else if (args == 'wing')
            {
                projectUrl = "WingType/GetWingFloorList/" + $scope.seletedCustomerId;
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.builder = response.data;

                },
           function (error)
           {              
           });

            }
            else if (args == 'tower')
            {
                projectUrl = "Tower/GetTowerWingList/" + $scope.seletedCustomerId;
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.built = response.data;
                },
           function (error)
           {
               
           });
            }
            else if (args == 'Inventory') {

                Url = "Tower/GetByProjectID/" + $scope.seletedCustomerId;

                apiService.get(Url).then(function (response) {
                    $scope.towers = response.data;

                },
            function (error) {
                if (error.status === 400)
                    alert(error.data.Message);
                else
                    alert("Network issue");
            });

            }
            else if (args == 'amenity') {
                projectUrl = "Amenities/GetAmenities?id=" + $scope.seletedCustomerId;
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.orgAmenities = response.data;

                },
           function (error) {

           });
            }

            else if (args == 'images') {
                projectUrl = "Project/GetImageByProjectID/" + $scope.seletedCustomerId + "/Gallery_Type_Full_2D";
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.Gallery = response.data;
                },
           function (error) {

           });

            }

            else if (args == 'uploadview') {
                projectUrl = "Project/GetImageByProjectID/" + $scope.seletedCustomerId + "/Upload_View";
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.UploadView = response.data;
                },
           function (error) {

           }
                );

            }

            else if (args == 'floor') {

                projectUrl = "FloorType/GetFloorUnitList/" + $scope.seletedCustomerId;
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.builddetail = response.data;
                },
           function (error) {

           });
            }

            else if (args == 'payment') {
                projectUrl = "Payment/GetPayment_Schedule_Mile?id=" + $scope.seletedCustomerId;
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.orgpayment = response.data;

                },
           function (error) {

           }
                );
            }
            else if (args == 'videos') {
                projectUrl = "Project/GetVideoByProjectID/" + $scope.seletedCustomerId;
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.Videos = response.data;
                },
           function (error) {
           });

            }
            else if (args == 'panoramic') {
                projectUrl = "Project/GetImageByProjectID/" + $scope.seletedCustomerId + "/Panorma_zip_Full_2D";
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.view = response.data;
                },
           function (error) {

           });
            }
            else if (args == 'brochure') {
                projectUrl = "Project/GetImageByProjectID/" + $scope.seletedCustomerId + "/Pdf_start"
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.Gallery2 = response.data;
                },
           function (error) {

           });
                //calling brochure pdf end
                projectUrl = "Project/GetImageByProjectID/" + $scope.seletedCustomerId + "/Pdf_End"
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.Gallery1 = response.data;
                },
           function (error) {

           });
            } else if (args == "ElementInfo") {

                Url = "ElementInfo/GetElementInfo?Id=" + $scope.seletedCustomerId + "&&type=Project";

                apiService.getWithoutCaching(Url).then(function (response) {
                    data = response.data;
                    for (i = 0; i < data.length; i++) {
                        if (data[i].element_type == "project_facebook") {
                            $scope.facebook = data[i].element_info1;
                            $scope.class_id = data[i].class_id;
                        }
                        if (data[i].element_type == "project_twitter") {
                            $scope.twitter = data[i].element_info1;
                            $scope.class_id = data[i].class_id;
                        }
                        if (data[i].element_type == "project_linkedin") {
                            $scope.linkedin = data[i].element_info1;
                            $scope.class_id = data[i].class_id;
                        }
                    }
                },
                function (error) {

                });
            }
            else if (args == 'summery') {
                projectUrl = "Project/GetProjectSummary?id=" + $scope.seletedCustomerId;//f2294ca0-0fee-4c16-86af-0483a5718991";
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.main = response.data;
                    $scope.image = $scope.main[0];

                },
           function (error) {

           });

            }
            $state.go('app.projectdetail', {}, { reload: false });
            $scope.$apply();

        });

        $scope.$on('REFRESH', function (event, args) {
            if (args == 'serviceGrid') {
                $('.k-i-refresh').trigger("click");
            }
            $scope.serviceAction = 'no_action';
            $('#checkAll').prop('checked', false);
           
        });     

        $scope.$on('REFRESH', function (event, args) {
            if (args == 'TaskGrid') {
                $('.k-i-refresh').trigger("click");
            }
        });

        $scope.$on('REFRESH', function (event, args) {
            if (args == 'EventGrid') {
                $('.k-i-refresh').trigger("click");
            }
        });

        $scope.$on('REFRESH', function (event, args) {
            if (args == 'ChargesGrid') {
                $('.k-i-refresh').trigger("click");
            }
            $scope.chargeAction = 'no_action';
            
        });
        $scope.$on('REFRESHOFFER', function (event, args) {
            if (args == 'OfferGrid') {
                $('.k-i-refresh').trigger("click");
            }
            

        });



    });

angular.module('project').filter('trusted', ['$sce', function ($sce) {
    return function(url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);