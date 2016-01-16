angular.module('project')


.controller('ProjectDetailController',
    function ($scope, $state, security, $cookieStore, apiService, $window, $modal, $rootScope) {
        console.log('ProjectDetailController');

        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
        var orgID = $cookieStore.get('orgID');

        

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
      
        $rootScope.title = 'Dwellar./ProjectDetails';
        //Audit log start															
        $scope.params =
            {
                device_os: $cookieStore.get('Device_os'),
                device_type: $cookieStore.get('Device'),
                device_mac_id: "34:#$::43:434:34:45",
                module_id: "Contact",
                action_id: "Contact View",
                details: "ProjectDetailsView",
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

        $scope.openAddPopup = function () {
            //   alert("abc");
            var modalInstance = $modal.open({

                animation: true,
                templateUrl: 'projects/users/addTeam.html',
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

        $scope.UserGrid = {
            dataSource: {

                type: "json",
                transport: {
                    read: apiService.baseUrl + "Project/GetUsersInProject/" + $scope.seletedCustomerId

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
                       "style": "text-align:right"
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
                      "style": "text-align:right"
                  }

            }, {
                field: "flat_number",
                title: "Flat No",
                width: "120px",
                attributes:
                  {
                      "class": "UseHand",
                      "style": "text-align:right"
                  }
            }, {
                field: "floor_number",
                title: "Floor No",
                width: "120px",
                attributes:
                  {
                      "class": "UseHand",
                      "style": "text-align:right"
                  }
            },
                {
                    field: "total_cost",
                    title: "Total Cost",
                    width: "120px",
                    attributes:
                  {
                      "class": "UseHand",
                      "style": "text-align:right"
                  }
                }]

        };

        $scope.PeopleGrid = {
            dataSource: {
                type: "json",
                transport: {

                    read: apiService.baseUrl + "Project/GetContactInProject/" + $scope.seletedCustomerId
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
                     "style": "text-align:right"
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
                    read: apiService.baseUrl + "Project/GetTasksInProject/" + $scope.seletedCustomerId

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
                attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            }, {
                field: "description",
                title: "Description",
                width: "120px",
                attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            }, {
                field: "status",
                title: "Status",
                width: "120px",
                attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            },
            {
                field: "priority",
                title: "priority",
                width: "120px",
                attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            },
            {
                field: "status",
                title: "status",
                width: "120px",
                attributes:
                {
                    "class": "UseHand",
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
        
        $scope.selectTower = function () {

            $scope.params.project_id = $scope.tower1;

            //alert($scope.params.project_id);
            $cookieStore.put('tower_id', $scope.params.project_id);
            //var grid = document.getElementById('gridInventory');
            //grid.data('kendoGrid').refresh();
            $scope.TowerListGrid.dataSource.transport.read();

           

        };
       
        $scope.towerGrid = function () {

            Url = "Floors/GenerateTowerGrid"

            var postData = {
                tower_id: $cookieStore.get('tower_id')
            }
            apiService.post(Url, postData).then(function (response) {

                $scope.towerGrid = response.data;
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

                    read: apiService.baseUrl + "UnitTypes/GetTowerunitproperties/" + $cookieStore.get('tower_id')
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
                attributes: {
                    "class": "UseHand",

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
                    "style": "text-align:right"
                }
              },
            {
                field: "num_bathrooms",
                title: "Bathrooms",
                width: "120px",
                attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:right"
                }
            },
            {
                field: "super_built_up_area",
                title: "Slb. Area",
                width: "120px",
                attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:right"
                }
            },
              {
                  field: "carpet_area",
                  title: "Crp Area",
                  width: "120px",
                  attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:right"
                }
              },
               {
                     field: "total_consideration",
                     title: "Price",
                     width: "120px",
                     attributes:
                  {
                      "class": "UseHand",
                      "style": "text-align:right"
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
                    "style": "text-align:right"
                }
              },
                {
                    field: "unitno",
                    title: "Unit No",
                    width: "120px",
                    attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:right"
                }
                },
                  {
                      field: "carpark",
                      title: "Car Park",
                      width: "120px",
                      attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:right"
                }
                  }]

        };
        //$scope.showTowergrid = function () {
            
        //    $scope.TowerListGrid = {


        //        dataSource: {
        //            type: "json",
        //            transport: {

        //                read: apiService.baseUrl +"Floors/GetTowerDetailsFloors/" + $cookieStore.get('tower_id')
        //            },
        //            pageSize: 5

        //            //group: {
        //            //    field: 'sport'
        //            //}
        //        },
        //        groupable: true,
        //        sortable: true,
        //        selectable: "multiple",
        //        reorderable: true,
        //        resizable: true,
        //        filterable: true,
        //        pageable: {
        //            refresh: true,
        //            pageSizes: true,
        //            buttonCount: 5
        //        },
        //        columns: [{
        //            field: "flat_no",
        //            title: "Flat No",
        //            width: "120px"
        //        }, {
        //            field: "tower_name",
        //            title: "Tower Name",
        //            width: "120px"
        //        }, {
        //            field: "floor_num",
        //            title: "Floor",
        //            width: "120px"
        //        }, {
        //            field: "unit_no",
        //            title: "Unit No",
        //            width: "120px"
        //        },
        //          {
        //              field: "no_of_units",
        //              title: "Type",
        //              width: "120px"
        //          },
        //        {
        //            field: "super_built_up_area",
        //            title: "Saleable Area",
        //            width: "120px"
        //        },
        //        {
        //            field: "carpet_area",
        //            title: "Carpet Area",
        //            width: "120px"
        //        },
        //          {
        //              field: "floor_rise_applicable",
        //              title: "Floor Rise Applicable",
        //              width: "120px"
        //          },

        //          {
        //              field: "floor_rise_rate",
        //              title: "Floor Rise Rate",
        //              width: "120px"
        //          },
        //           {
        //               field: "cp_offered",
        //               title: "CP Offered",
        //               width: "120px"
        //           },
        //            {
        //                field: "cp_post",
        //                title: "CP Cost",
        //                width: "120px"
        //            },
        //             {
        //                 field: "total_consideration",
        //                 title: "Total Consideration in 20:40:40",
        //                 width: "120px"
        //             }

        //        ]

        //    };
           
        //}
        
      


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
        $scope.myGridChange = function (dataItem) {
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

        //for tower drop town
        Url = "Tower/GetByProjectID/" + $scope.seletedCustomerId;

        apiService.get(Url).then(function (response) {
            $scope.towers = response.data;

        },
    function (error) {
        alert("Error " + error.tower);
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


      

        function callApis() {



            //calling Project Main api
            projectUrl = "Project/GetProjectSummary?id=" + $scope.seletedCustomerId;//f2294ca0-0fee-4c16-86af-0483a5718991";
            apiService.getWithoutCaching(projectUrl).then(function (response) {
                $scope.main = response.data;
                $scope.image = $scope.main[0];

            },
       function (error) {
           console.log("Error " + error.state);
       }
            );




            //callingWingApi
            projectUrl = "WingType/GetWingFloorList/" + $scope.seletedCustomerId;//f2294ca0-0fee-4c16-86af-0483a5718991";
            apiService.get(projectUrl).then(function (response) {
                $scope.builder = response.data;

            },
       function (error) {
           console.log("Error " + error.state);
       }
            );


            //calling Tower
            projectUrl = "Tower/GetTowerWingList/" + $scope.seletedCustomerId;//f2294ca0-0fee-4c16-86af-0483a5718991";
            apiService.get(projectUrl).then(function (response) {
                $scope.built = response.data;
            },
       function (error) {
           console.log("Error " + error.state);
       }
            );

            //calling brochure  pdf start
            projectUrl = "Project/GetImageByProjectID/" + $scope.seletedCustomerId + "/Pdf_start"//8c4128e2-785b-4ad6-85af-58344dd79517";
            apiService.get(projectUrl).then(function (response) {
                $scope.Gallery2 = response.data;
            },
       function (error) {
           console.log("Error " + error.state);
       }
            );
            //calling brochure pdf end
            projectUrl = "Project/GetImageByProjectID/" + $scope.seletedCustomerId + "/Pdf_End"//8c4128e2-785b-4ad6-85af-58344dd79517";
            apiService.get(projectUrl).then(function (response) {
                $scope.Gallery1 = response.data;
            },
       function (error) {
           console.log("Error " + error.state);
       }
            );
            // calling panoramic views api
            projectUrl = "Project/GetImageByProjectID/" + $scope.seletedCustomerId + "/View_Type_Full_2D";
            apiService.get(projectUrl).then(function (response) {
                $scope.view = response.data;
            },
       function (error) {
           console.log("Error " + error.state);
       }
            );


            //calling Amenities
            projectUrl = "Amenities/GetAmenities?id=" + $scope.seletedCustomerId;
            apiService.get(projectUrl).then(function (response) {
                $scope.orgAmenities = response.data;
            },
       function (error) {
           console.log("Error " + error.state);
       }
            );

            //calling Floors
            projectUrl = "FloorType/GetFloorUnitList/" + $scope.seletedCustomerId;//f2294ca0-0fee-4c16-86af-0483a5718991";
            apiService.get(projectUrl).then(function (response) {
                $scope.builddetail = response.data;
            },
       function (error) {
           console.log("Error " + error.state);
       }
            );

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
            apiService.get(projectUrl).then(function (response) {
                $scope.orgpayment = response.data;

            },
       function (error) {
           console.log("Error " + error.state);
       }
            );
            //calling  unittype
            projectUrl = "UnitTypes/GetUnitTypeDetails/" + $scope.seletedCustomerId;//f2294ca0-0fee-4c16-86af-0483a5718991";
            apiService.get(projectUrl).then(function (response) {
                $scope.orgUsers = response.data;
            },
   function (error) {
       console.log("Error " + error.state);
   }
        );

            //calling getImage
            projectUrl = "Project/GetImageByProjectID/" + $scope.seletedCustomerId +"/Gallery_Type_Full_2D";
            apiService.get(projectUrl).then(function (response) {
                $scope.Gallery = response.data;
            },
       function (error) {
           console.log("Error " + error.state);
       }
            );

            GetUrl = "Tower/GetTowerSummary?id=" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f Project/GetById/" ;
             apiService.get(GetUrl).then(function (response) {
                 $scope.buildsummary = response.data;
                     },
                        function (error) {
                            console.log("Error " + error.state);

                        });


            //calling essential
             if ($scope.seletedCustomerId !== '') {
                 //GetUrl = apiService.baseUrl +"Project/GetById/0e31ff89-3236-4626-a3d9-4360ae084e33"
                 GetUrl = "Project/GetById/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f Project/GetById/" ;

                 apiService.get(GetUrl).then(function (response) {

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
                             function (error) {
                                 deferred.reject(error);

                             });
             }

        }

        };

        $scope.$on('REFRESH', function (event, args)
        {

            if (args == 'unit')
            {
                projectUrl = "UnitTypes/GetUnitTypeDetails/" + $scope.seletedCustomerId;//8c4128e2-785b-4ad6-85af-58344dd79517";
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.orgUsers = response.data;
                },
                    function (error) {
                        console.log("Error " + error.state);
                    }
                );
            }

            else if (args == 'wing')
            {
                projectUrl = "WingType/GetWingFloorList/" + $scope.seletedCustomerId;//f2294ca0-0fee-4c16-86af-0483a5718991";
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.builder = response.data;

                },
           function (error) {
               console.log("Error " + error.state);
           }
                );

            }

            else if (args == 'tower')
            {

                projectUrl = "Tower/GetTowerWingList/" + $scope.seletedCustomerId;//f2294ca0-0fee-4c16-86af-0483a5718991";
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.built = response.data;
                },
           function (error) {
               console.log("Error " + error.state);
           });
            }

            else if (args == 'amenity')
            {
                projectUrl = "Amenities/GetAmenities?id=" + $scope.seletedCustomerId;
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.orgAmenities = response.data;

                },
           function (error) {
               console.log("Error " + error.state);
           });
            }

            else if (args == 'images')
            {

                projectUrl = "Project/GetImageByProjectID/" + $scope.seletedCustomerId + "/Gallery_Type_Full_2D";//8c4128e2-785b-4ad6-85af-58344dd79517";
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.Gallery = response.data;

                },
           function (error) {
               console.log("Error " + error.state);
           });

            }

            else if (args == 'floor')
            {

                projectUrl = "FloorType/GetFloorUnitList/" + $scope.seletedCustomerId;//8c4128e2-785b-4ad6-85af-58344dd79517";
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.builddetail = response.data;
                },
           function (error) {
               console.log("Error " + error.state);
           });
            }

            else if (args == 'payment')
            {
                projectUrl = "Payment/GetPayment_Schedule_Mile?id=" + $scope.seletedCustomerId;//d028defd-319f-4b89-a51b-55ed9b327200 ";
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.orgpayment = response.data;

                },
           function (error) {
               console.log("Error " + error.state);
           }
                );
            }
            else if (args == 'videos')
            {

                projectUrl = "Project/GetVideoByProjectID/" + $scope.seletedCustomerId;//8c4128e2-785b-4ad6-85af-58344dd79517";
                apiService.get(projectUrl).then(function (response) {
                    $scope.Videos = response.data;

                },
           function (error) {
               console.log("Error " + error.state);
           });

            }
            else if (args == 'panoramic')
            {
                projectUrl = "Project/GetImageByProjectID/" + $scope.seletedCustomerId + "/View_Type_Full_2D";
                apiService.get(projectUrl).then(function (response) {
                    $scope.view = response.data;
                },
           function (error) {
               console.log("Error " + error.state);
           });
            }
            else if (args == 'brochure')
            {
                projectUrl = "Project/GetImageByProjectID/" + $scope.seletedCustomerId + "/Pdf_start"//8c4128e2-785b-4ad6-85af-58344dd79517";
                apiService.get(projectUrl).then(function (response) {
                    $scope.Gallery = response.data;
                },
           function (error) {
               console.log("Error " + error.state);
           });
                //calling brochure pdf end
                projectUrl = "Project/GetImageByProjectID/" + $scope.seletedCustomerId + "/Pdf_End"//8c4128e2-785b-4ad6-85af-58344dd79517";
                apiService.get(projectUrl).then(function (response) {
                    $scope.Gallery1 = response.data;
                },
           function (error) {
               console.log("Error " + error.state);
           });
            }
            else if (args == 'summery') {
                projectUrl = "Project/GetProjectSummary?id=" + $scope.seletedCustomerId;//f2294ca0-0fee-4c16-86af-0483a5718991";
                apiService.getWithoutCaching(projectUrl).then(function (response) {
                    $scope.main = response.data;
                    $scope.image = $scope.main[0];

                },
           function (error) {
               console.log("Error " + error.state);
           }
                );

            }
            $state.go('app.projectdetail', {}, { reload: false });
            $scope.$apply();

        });

    });