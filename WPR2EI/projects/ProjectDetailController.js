angular.module('project')


.controller('ProjectDetailController',
    function ($scope, $state, security, $cookieStore, apiService, $window, $modal, $rootScope, projectService) {
        console.log('ProjectDetailController');

        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
        var orgID = $cookieStore.get('orgID');

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

       
        

        $rootScope.title = 'Dwellar-ProjectDetails';
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



            if ($rootScope.projects.write) {
                event.preventDefault();
                $('#btnSave').show();
                $('#iconEdit').show();
                $('#btnAdd').show();
            }



        });
      
          
       

        callApis();//callall the Apis

     


        $scope.openNewPaymentSchemePopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/addNewPaymentScheme.tpl.html',
                backdrop: 'static',
                controller: AddNewPaymentSchemeController,
                size: 'md'
            });
        };
        $scope.openEditPaymentSchemePopup = function (id) {

            $cookieStore.put('payment_schedule_id', id);
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/editPaymentScheme.tpl.html',
                backdrop: 'static',
                controller: EditPaymentSchemeController,
                size: 'md'
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
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: [{
                field: "first_name",
                title: "First Name",
                width: "120px",
                attributes:
                    {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }

            }, {
                field: "last_name",
                title: "Last Name",
                width: "120px",
                attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }


            }, {
                field: "account_email",
                title: "Email",
                width: "120px",
                attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
            }, {
                field: "account_phone",
                title: "Phone",
                width: "120px",
                attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
            },
            {
                field: "account_country",
                title: "Country",
                width: "120px",
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
                attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
            },
            {
                field: "description",
                title: "Description",
                width: "120px",
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
                attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
            }, {
                field: "built_up_area",
                title: "Area",
                width: "120px",
                attributes:
                  {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }

            }, {
                field: "flat_number",
                title: "Flat No",
                width: "120px",
                attributes:
                  {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
            }, {
                field: "floor_number",
                title: "Floor No",
                width: "120px",
                attributes:
                  {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
            },
                {
                    field: "total_cost",
                    title: "Total Cost",
                    width: "120px",
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
                attributes:
                 {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }

            }, {
                field: "people_type",
                title: "people Type",
                width: "50px",
                attributes:
                 {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
            }, {
                field: "phone",
                title: "Contact Phone",
                width: "50px",
                attributes:
                 {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
            }, {
                field: "email",
                title: "Contact Email",
                width: "50px",
                attributes:
                 {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }

            }]
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

            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: [{
                field: "name",
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
                field: "user_name",
                title: "Assign To",
                width: "120px",
                attributes:
             {
                 "style": "text-align:center"
             }

            }, {
                field: "priority",
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
                field: "text",
                title: "Notes",
                width: "120px",
                attributes:
             {
                 "style": "text-align:center"
             }
            }, {
                field: "status",
                title: "Status",
                width: "120px",
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
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: [{
                field: "name",
                title: "Event Name",
                width: "120px",
                attributes:
               {
                   "style": "text-align:center"
               }
            },
            {
                field: "project_name",
                title: "Project Name",
                width: "120px",
                attributes:
               {
                   "style": "text-align:center"
               }
            },
            {
                field: "location",
                title: "Location",
                width: "120px",
                attributes:
               {
                   "style": "text-align:center"
               }
            },
             {
                 field: "userevent_date",
                 title: "Start Date",
                 width: "120px",
                 format: '{0:dd/MM/yyyy hh:mm:ss}',
                 attributes:
               {
                   "style": "text-align:center"
               }
             },
             {
                 field: "end_date",
                 title: "End Date",
                 width: "120px",
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
                 width: "120px",
                 attributes:
               {
                   "style": "text-align:center"
               }
             }]
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

            //alert($scope.params.project_id);
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
                //$state.go('towerGrid');  

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
                        "style": "text-align:center"

                    }
                },

                {
                template: "<img height='40px' width='40px' src='#= Image_Url_Unit1 #'/>" +
                "<span style='padding-left:10px' class='property-photo'> </span>",
                title: "Photo",
                width: "120px",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"

                }
            }, {
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
                      field: "available_status",
                      title: "Status",
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
                  }]

        };
       
        
      

        $scope.openAddPopup = function () {
            //   alert("abc");
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/addProject.tpl.html',
                backdrop: 'static',
                controller: AddUserProjectController,
                size: 'md',
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
            //   alert("abc");
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/addTeam.html',
                backdrop: 'static',
                controller: AddTeamController,
                size: 'md',
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
                    size: 'md'
                    
                });
           
        };

            // Kendo Grid on change
        $scope.myGridChangePanam = function (dataItem) {
            // dataItem will contain the row that was selected
            window.sessionStorage.selectedCustomerID = dataItem.tower_id;
            //  alert(window.sessionStorage.selectedCustomerID);
            $scope.openNewPanoramicPopup();

        };


        $scope.openNewPanoramicPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/panoramic.tpl.html',
                backdrop: 'static',
                controller: AddNewPanoramicController,
                size: 'md'
            });
        };


        $scope.openEditFloorPopup = function (id) {
            
            $cookieStore.put('FloorId', id);
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/edit_floor.tpl.html',
                backdrop: 'static',
                controller: AddNewEditFloorController,
                size: 'md',

            });
        };

        $scope.openNewTowerPopup = function () {
            
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'projects/add_new/addNewTower.tpl.html',
                    backdrop: 'static',
                    controller: AddNewTowerController,
                    size: 'md'
                    
                });
            
            
           
        };

        $scope.openEditTowerPopup = function (id) {

            $cookieStore.put('tower_id', id);
           
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/edit_tower.tpl.html',
                backdrop: 'static',
                controller: AddEditTowerController,
                size: 'md',

            });
        };

        $scope.openNewUnitPopup = function (unit) {
            if (unit == undefined) {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'projects/add_new/addNewUnit.tpl.html',
                    backdrop: 'static',
                    controller: AddNewUnitController,
                    size: 'md',
                    resolve: { items: { title: "Add New Unit Type" } }
                });
            }
            else {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'projects/add_new/addNewUnit.tpl.html',
                    backdrop: 'static',
                    controller: AddNewUnitController,
                    size: 'md',
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
                    size: 'md'
                  
                });
        
        };

        $scope.openEditWingPopup = function (id) {
           
            $cookieStore.put('wing_id',id);
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/editWing.tpl.html',
                backdrop: 'static',
                controller: EditNewWingController,
                size: 'md'
             
                
            });

        };


        $scope.openEditProjectPopup = function () {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/edit_project.tpl.html',
                backdrop: 'static',
                controller: EditProjectController,
                size: 'md'

            });

        };

        


        $scope.openNewGalleryPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/gallery.html',
                backdrop: 'static',
                controller: AddNewGalleryController,
                size: 'md'
            });
        };

        $scope.openUploadViewPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/uploadview.tpl.html',
                backdrop: 'static',
                controller: UploadViewController,
                size: 'md'
            });
        };

        //for tower drop town
        Url = "Tower/GetByProjectID/" + $scope.seletedCustomerId;

        apiService.getWithoutCaching(Url).then(function (response) {
            $scope.towers = response.data;

        },
    function (error)
    {
        if (error.status === 400)
            alert(error.data.Message);
       
    });




    




        $scope.openNewAmenityPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/amenities.html',
                backdrop: 'static',
                controller: AddNewAmenityController,
                size: 'md'
            });
        };

        $scope.openNewBrochurePopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/brochure.html',
                backdrop: 'static',
                controller: AddNewBrochureController,
                size: 'md'
            });
        };


        $scope.openNewPanoramicViewPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/panoramicView.tpl.html',
                backdrop: 'static',
                controller: AddNewPanoramicViewController,
                size: 'md'
            });
        };

        $scope.openNewVideoPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/videos.tpl.html',
                backdrop: 'static',
                controller: AddNewVideosController,
                size: 'md'
            });
        };

        $scope.removeImage = function (index) {
            var id = $scope.Gallery[index].id;
            $scope.Gallery[index] = undefined;
            var postdata = { id: id }

            apiService.post("MediaElement/Delete", postdata).then(function (response) {
                var loginSession = response.data;
                //$modalInstance.dismiss();
                $scope.openSucessfullPopup();

            },


        function (error) {
            if (error.status === 400)
                alert(error.data.Message);
            else
                alert("Network issue");
        });
            $scope.openSucessfullPopup = function () {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'newuser/delete.html',
                    backdrop: 'static',
                    controller: DeleteController,
                    size: 'md',
                    resolve: { items: { title: "Image" } }
                   
                    
                });
                $rootScope.$broadcast('REFRESH', 'images');
            }

        }


        $scope.openEventCampaignPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/addNewCampaign.tpl.html',
                backdrop: 'static',
                controller: AddNewEventproject,
                size: 'md'
            });
        };

        $scope.openEditEventPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/edit_event.html',
                backdrop: 'static',
                controller: EditEventproject,
                size: 'md'
            });
        };

        $scope.openBudgetPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/budget.html',
                backdrop: 'static',
                controller: AddBudgetproject,
                size: 'md'
            });
        };

        $scope.openAddNewTask = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/add_new_task.html',
                backdrop: 'static',
                controller: AddNewTaskProject,
                size: 'md'

            });

        };

        $scope.openEditTask = function () {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/edit_task.html',
                backdrop: 'static',
                controller: EditTaskProject,
                size: 'md'

            });

        };

        $scope.openCharges = function () {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/addcharges.tpl.html',
                backdrop: 'static',
                controller: ChargesController,
                size: 'md'

            });

        };
            // Kendo Grid on change
        $scope.myGridChange = function (dataItem) {
            // dataItem will contain the row that was selected
            window.sessionStorage.selectedCustomerID = dataItem.task_id;
            //  alert(window.sessionStorage.selectedCustomerID);
            $scope.openEditTask();
        };

        $scope.myGridChangeEvent = function (dataItem) {
            // dataItem will contain the row that was selected
            window.sessionStorage.selectedCustomerID = dataItem.id;
            //  alert(window.sessionStorage.selectedCustomerID);
            $scope.openEditEventPopup();
        };
      
       


        function callApis() {



            //calling Project Main api
            projectUrl = "Project/GetProjectSummary?id=" + $scope.seletedCustomerId;//f2294ca0-0fee-4c16-86af-0483a5718991";
            apiService.getWithoutCaching(projectUrl).then(function (response) {
                $scope.main = response.data;
                $scope.image = $scope.main[0];
                AuditCreate();

            },
       function (error)
       {
          
       } );




            //callingWingApi
            projectUrl = "WingType/GetWingFloorList/" + $scope.seletedCustomerId;//f2294ca0-0fee-4c16-86af-0483a5718991";
            apiService.getWithoutCaching(projectUrl).then(function (response) {
                $scope.builder = response.data;

            },
       function (error)
       {
           
       });


            //calling Tower
            projectUrl = "Tower/GetTowerWingList/" + $scope.seletedCustomerId;//f2294ca0-0fee-4c16-86af-0483a5718991";
            apiService.getWithoutCaching(projectUrl).then(function (response) {
                $scope.built = response.data;
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

            $scope.isVisible = [];
            $scope.isVisible[0] = true;
            $scope.toggleClass = function (id) {
                for (i = 0; i < $scope.isVisible.length; i++) {
                    $scope.isVisible[i] = false;
                }
                $scope.isVisible[id] = $scope.isVisible[id] == true ? false : true;
                $scope.$apply();
            };

            //calling Payment
            projectUrl = "Payment/GetPayment_Schedule_Mile?id=" + $scope.seletedCustomerId;//d028defd-319f-4b89-a51b-55ed9b327200 ";
            apiService.getWithoutCaching(projectUrl).then(function (response) {
                $scope.orgpayment = response.data;

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
          
       }
            );
            Url = "ElementInfo/GetElementInfo?Id=" + $scope.seletedCustomerId + "&&type=Project";

            apiService.getWithoutCaching(Url).then(function (response) {
                data = response.data;
                $scope.facebook = (_.findWhere(data, { element_type: 'project_facebook' })).element_info1;
                $scope.facebook = 'https://' + $scope.facebook;
                $scope.twitter = (_.findWhere(data, { element_type: 'project_twitter' })).element_info1;
                $scope.twitter = 'https://' + $scope.twitter;
                $scope.linkedin = (_.findWhere(data, { element_type: 'project_linkedin' })).element_info1;
                $scope.linkedin = 'https://' + $scope.linkedin;
                //for (i = 0; i < data.length; i++) {
                //    if (data[i].element_type == "project_facebook") {
                //        $scope.facebook = data[i].element_info1;
                //        $scope.class_id = data[i].class_id;
                //    }
                //    if (data[i].element_type == "project_twitter") {
                //        $scope.twitter = data[i].element_info1;
                //        $scope.class_id = data[i].class_id;
                //    }
                //    if (data[i].element_type == "project_linkedin") {
                //        $scope.linkedin = data[i].element_info1;
                //        $scope.class_id = data[i].class_id;
                //    }

                //}

            },
            function (error) {
                if (error.status === 400)
                    alert(error.data.Message);

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
                 //GetUrl = apiService.baseUrl +"Project/GetById/0e31ff89-3236-4626-a3d9-4360ae084e33"
                 GetUrl = "Project/GetById/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f Project/GetById/" ;

                 apiService.getWithoutCaching(GetUrl).then(function (response) {

                     $scope.data = response.data;
                     $scope.media_url = $scope.data[0].media_url;
                     $scope.media_name = $scope.data[0].media_name;
                     $scope.media_url1 = $scope.data[0].media_url1;
                     $scope.media_url2 = $scope.data[0].media_url2;
                     $scope.media_url3 = $scope.data[0].media_url3;
                     $scope.media_url4 = $scope.data[0].media_url4;
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

        };

        //$scope.$on('REFRESH1', function (event, args) {

        //    setTimeout(function () {
        //        if (args == 'projectImage') {
                   
                  
        //                //GetUrl = apiService.baseUrl +"Project/GetById/0e31ff89-3236-4626-a3d9-4360ae084e33"
        //                GetUrl = "Project/GetById/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f Project/GetById/" ;

        //                apiService.getWithoutCaching(GetUrl).then(function (response) {

        //                    $scope.data = response.data;
        //                    $scope.media_url = $scope.data[0].media_url;
        //                    $scope.media_name = $scope.data[0].media_name;
        //                    $scope.media_url1 = $scope.data[0].media_url1;
        //                    $scope.media_url2 = $scope.data[0].media_url2;
        //                    $scope.media_url3 = $scope.data[0].media_url3;
        //                    $scope.media_url4 = $scope.data[0].media_url4;
        //                    if ($scope.data[0].contact_mobile !== '') {
        //                        $scope.mobile = $scope.data[0].contact_mobile;
        //                    }
        //                    if ($scope.data[0].contact_email !== '') {
        //                        $scope.email = $scope.data[0].contact_Email;
        //                    }
        //                },
        //                            function (error) {
        //                                if (error.status === 400)
        //                                    alert(error.data.Message);
        //                                else
        //                                    alert("Network issue");
        //                            });
        //            }

    
        //    }, 1500);

        //});
      


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

        $scope.$on('REFRESH', function (event, args)
        {

          if (args == 'unit')
            {
                projectUrl = "UnitTypes/GetUnitTypeDetails/" + $scope.seletedCustomerId;//8c4128e2-785b-4ad6-85af-58344dd79517";
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
                projectUrl = "WingType/GetWingFloorList/" + $scope.seletedCustomerId;//f2294ca0-0fee-4c16-86af-0483a5718991";
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.builder = response.data;

                },
           function (error)
           {
               
           });

            }

            else if (args == 'tower')
            {

                projectUrl = "Tower/GetTowerWingList/" + $scope.seletedCustomerId;//f2294ca0-0fee-4c16-86af-0483a5718991";
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.built = response.data;
                },
           function (error)
           {
               
           });
            }

            else if (args == 'amenity')
            {
                projectUrl = "Amenities/GetAmenities?id=" + $scope.seletedCustomerId;
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.orgAmenities = response.data;

                },
           function (error)
           {
               
           });
            }

            else if (args == 'images')
            {

                projectUrl = "Project/GetImageByProjectID/" + $scope.seletedCustomerId + "/Gallery_Type_Full_2D";//8c4128e2-785b-4ad6-85af-58344dd79517";
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.Gallery = response.data;

                },
           function (error)
           {
              
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

            else if (args == 'floor')
            {

                projectUrl = "FloorType/GetFloorUnitList/" + $scope.seletedCustomerId;//8c4128e2-785b-4ad6-85af-58344dd79517";
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.builddetail = response.data;
                },
           function (error)
           {
              
           });
            }

            else if (args == 'payment')
            {
                projectUrl = "Payment/GetPayment_Schedule_Mile?id=" + $scope.seletedCustomerId;//d028defd-319f-4b89-a51b-55ed9b327200 ";
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.orgpayment = response.data;

                },
           function (error)
           {
              
           }
                );
            }
            else if (args == 'videos')
            {

                projectUrl = "Project/GetVideoByProjectID/" + $scope.seletedCustomerId;//8c4128e2-785b-4ad6-85af-58344dd79517";
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.Videos = response.data;

                },
           function (error)
           {
               
           });

            }
            else if (args == 'panoramic')
            {
                projectUrl = "Project/GetImageByProjectID/" + $scope.seletedCustomerId + "/Panorma_zip_Full_2D";
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.view = response.data;
                },
           function (error)
           {
              
           });
            }
            else if (args == 'brochure')
            {
                projectUrl = "Project/GetImageByProjectID/" + $scope.seletedCustomerId + "/Pdf_start"//8c4128e2-785b-4ad6-85af-58344dd79517";
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.Gallery2 = response.data;
                },
           function (error)
           {
               
           });
                //calling brochure pdf end
                projectUrl = "Project/GetImageByProjectID/" + $scope.seletedCustomerId + "/Pdf_End"//8c4128e2-785b-4ad6-85af-58344dd79517";
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.Gallery1 = response.data;
                },
           function (error)
           {
              
           });
            }else if(args == "ElementInfo"){

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
           function (error)
           {
               
           });

            }
            $state.go('app.projectdetail', {}, { reload: false });
            $scope.$apply();

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


    });