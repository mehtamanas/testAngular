angular.module('project')


.controller('ProjectDetailController',
    function ($scope, $state, security, $cookieStore, apiService, $window, $modal, $rootScope) {
        console.log('ProjectDetailController');

        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
        var orgID = $cookieStore.get('orgID');

        $rootScope.title = 'Dwellar./ProjectDetails';
        $scope.params = {

            device_os: "windows10",
            device_type: "mobile",
            device_mac_id: "34:#$::43:434:34:45",
            module_id: "ProjectDetail",
            action_id: "ProjectDetail View",
            details: "ProjectDetail",
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

        if ($scope.seletedCustomerId !== '') {
            //GetUrl = "http://dw-webservices-dev.azurewebsites.net/Project/GetById/0e31ff89-3236-4626-a3d9-4360ae084e33"
           
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
                    read: "http://dw-webservices-dev.azurewebsites.net/Project/GetUsersInProject/" + $scope.seletedCustomerId

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
                width: "120px"
            }, {
                field: "last_name",
                title: "Last Name",
                width: "120px"
            }, {
                field: "account_email",
                title: "Email",
                width: "120px"
            }, {
                field: "account_phone",
                title: "Phone",
                width: "120px"
            },
            {
                field: "account_country",
                title: "Country",
                width: "120px"
            }]
        };

        $scope.TeamsGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: "http://dw-webservices-dev.azurewebsites.net/Project/GetProjectTeamList/" + $scope.seletedCustomerId

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
            },
            {
                field: "description",
                title: "Description",
                width: "120px"
            }]
        };

        $scope.PropertyListGrid = {
            dataSource: {
                type: "json",
                transport: {

                    read: "http://dw-webservices-dev.azurewebsites.net/Project/GetProjectPropertyList/" + $scope.seletedCustomerId
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
                field: "built_up_area",
                title: "Area",
                width: "120px"
            }, {
                field: "flat_number",
                title: "Flat No",
                width: "120px"
            }, {
                field: "floor_number",
                title: "Floor No",
                width: "120px"
            },
                {
                    field: "total_cost",
                    title: "Total Cost",
                    width: "120px"
                }]

        };

        $scope.PeopleGrid = {
            dataSource: {
                type: "json",
                transport: {

                    read: "http://dw-webservices-dev.azurewebsites.net/Project/GetContactInProject/" + $scope.seletedCustomerId
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
                width: "50px"
            }, {
                field: "people_type",
                title: "people Type",
                width: "50px"
            }, {
                field: "who_am_i",
                title: "who am i",
                width: "50px"
            }, {
                field: "contact_mobile",
                title: "Contact Mobile",
                width: "50px"
            }, {
                field: "contact_Email",
                title: "Contact Email",
                width: "50px"

            }]
        };

        $scope.TaskGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: "http://dw-webservices-dev.azurewebsites.net/Project/GetTasksInProject/" + $scope.seletedCustomerId

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
                width: "120px"
            }, {
                field: "status",
                title: "Status",
                width: "120px"
            },
            {
                field: "priority",
                title: "priority",
                width: "120px"
            },
            {
                field: "status",
                title: "status",
                width: "120px"
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



        };
       
        $scope.towerGrid = function () {

            Url = "Floors/GenerateTowerGrid"


            var postData = {
                tower_id: $cookieStore.get('tower_id')
            }
            apiService.post(Url, postData).then(function (response) {

                $scope.towerGrid = response.data;
                $state.go('towerGrid');
            },
        function (error) {
            alert("Error " + error.tower);
        });


        }
        $scope.showTowergrid = function () {
            $state.go('towerGrid');

        }
        
        $scope.openNewFloorPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/addNewFloor.tpl.html',
                backdrop: 'static',
                controller: AddNewFloorController,
                size: 'md'
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

        $scope.openNewUnitPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new/addNewUnit.tpl.html',
                backdrop: 'static',
                controller: AddNewUnitController,
                size: 'md'
            });
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

        function callApis() {



            //calling Project Main api
            projectUrl = "Project/GetProjectSummary?id=" + $scope.seletedCustomerId;//f2294ca0-0fee-4c16-86af-0483a5718991";
            apiService.get(projectUrl).then(function (response) {
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

            //calling Payment
            projectUrl = "Payment/GetPayment_Schedule?id="+ $scope.seletedCustomerId;//a271ec67-642a-48a4-8552-84199c432962 ";
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
            projectUrl = "Project/GetImageByProjectID/" + $scope.seletedCustomerId;//8c4128e2-785b-4ad6-85af-58344dd79517";
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
        }

        };

        $scope.$on('REFRESH', function (event, args) {

            if (args == 'unit') {
                projectUrl = "UnitTypes/GetUnitTypeDetails/" + $scope.seletedCustomerId;//8c4128e2-785b-4ad6-85af-58344dd79517";
                apiService.get(projectUrl).then(function (response) {
                    $scope.orgUsers = response.data;
                },
                    function (error) {
                        console.log("Error " + error.state);
                    }
                );
            }

            else if (args == 'wing') {
                projectUrl = "WingType/GetWingFloorList/" + $scope.seletedCustomerId;//f2294ca0-0fee-4c16-86af-0483a5718991";
                apiService.get(projectUrl).then(function (response) {
                    $scope.builder = response.data;

                },
           function (error) {
               console.log("Error " + error.state);
           }
                );

            }

            else if (args == 'tower') {

                projectUrl = "Tower/GetTowerWingList/" + $scope.seletedCustomerId;//f2294ca0-0fee-4c16-86af-0483a5718991";
                apiService.get(projectUrl).then(function (response) {
                    $scope.built = response.data;
                },
           function (error) {
               console.log("Error " + error.state);
           });
            }

            else if (args == 'amenity') {
                projectUrl = "Amenities/GetAmenities?id=" + $scope.seletedCustomerId;
                apiService.get(projectUrl).then(function (response) {
                    $scope.orgAmenities = response.data;

                },
           function (error) {
               console.log("Error " + error.state);
           });
            }

            else if (args == 'images') {

                projectUrl = "Project/GetImageByProjectID/" + $scope.seletedCustomerId;//8c4128e2-785b-4ad6-85af-58344dd79517";
                apiService.get(projectUrl).then(function (response) {
                    $scope.Gallery = response.data;

                },
           function (error) {
               console.log("Error " + error.state);
           });

            }

            else if (args == 'floor') {

                projectUrl = "FloorType/GetFloorUnitList/" + $scope.seletedCustomerId;//8c4128e2-785b-4ad6-85af-58344dd79517";
                apiService.get(projectUrl).then(function (response) {
                    $scope.builddetail = response.data;
                },
           function (error) {
               console.log("Error " + error.state);
           });
            }

            else if (args == 'payment') {
                projectUrl = "Payment/GetPayment_Schedule?id=" + $scope.seletedCustomerId;//a271ec67-642a-48a4-8552-84199c432962 ";
                apiService.get(projectUrl).then(function (response) {
                    $scope.orgpayment = response.data;
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