﻿angular.module('project')
        .config(function config($stateProvider) {
            $stateProvider
                .state('towerGrid', {
                    url: '/towerGrid',
                    templateUrl: 'projects/towerGrid.html',
                    controller: 'TowerGridController',
                    data: { pageTitle: 'Review Page' }
                });
        })

.controller('TowerGridController',
    function ($scope, $state, security, $cookieStore, apiService, $window, $modal, $rootScope) {
        console.log('TowerGridController');

        $rootScope.title = 'Dwellar./ProjectDetails';

        //audit log
        AuditCreate = function () {
            var postdata =
           {
               device_os: $cookieStore.get('Device_os'),
               device_type: $cookieStore.get('Device'),
               module_id: "Project",
               action_id: "TowerGird",
               details: "TowerGridView",
               application: "angular",
               browser: $cookieStore.get('browser'),
               ip_address: $cookieStore.get('IP_Address'),
               location: $cookieStore.get('Location'),
               organization_id: $cookieStore.get('orgID'),
               User_ID: $cookieStore.get('userId'),

           };


            apiService.post("AuditLog/Create", postdata).then(function (response) {
                var loginSession = response.data;
            },
        function (error) {
        });
        };


        //end




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
        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
        // alert($scope.seletedCustomerId);
        var orgID = $cookieStore.get('orgID');

        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

        $scope.TowerListGrid = {


            dataSource: {
                type: "json",
                transport: {

                    read: apiService.baseUrl + "Floors/GetTowerDetailsFloors/" + $cookieStore.get('tower_id')
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
                field: "flat_no",
                title: "Flat No",
                width: "120px",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"

        }
            }, {
                field: "tower_name",
                title: "Tower Name",
                width: "120px",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"

                }
            }, {
                field: "floor_num",
                title: "Floor",
                width: "120px",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"

                }
            }, {
                field: "unit_no",
                title: "Unit No",
                width: "120px",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"

                }
            },
              {
                  field: "no_of_units",
                  title: "Type",
                  width: "120px",
                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:center"

                  }
              },
            {
                field: "super_built_up_area",
                title: "Saleable Area",
                width: "120px",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"

                }
            },
            {
                field: "carpet_area",
                title: "Carpet Area",
                width: "120px",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"

                }
            },
              {
                  field: "floor_rise_applicable",
                  title: "Floor Rise Applicable",
                  width: "120px",
                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:center"

                  }
              },

              {
                  field: "floor_rise_rate",
                  title: "Floor Rise Rate",
                  width: "120px",
                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:center"

                  }
              },
               {
                   field: "cp_offered",
                   title: "CP Offered",
                   width: "120px",
                   attributes: {
                       "class": "UseHand",
                       "style": "text-align:center"

                   }
               },
                {
                    field: "cp_post",
                    title: "CP Cost",
                    width: "120px",
                    attributes: {
                        "class": "UseHand",
                        "style": "text-align:center"

                    }
                },
                 {
                     field: "total_consideration",
                     title: "Total Consideration in 20:40:40",
                     width: "120px",
                     attributes: {
                         "class": "UseHand",
                         "style": "text-align:center"

                     }
                 }

            ]

        };

        Url = "Tower/GetByProjectID/" + $scope.seletedCustomerId;

        apiService.get(Url).then(function (response) {
            $scope.towers = response.data;

        },
    function (error)
    {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    });

        $scope.selectTower = function () {

            $scope.params.project_id = $scope.tower1;

            console.log($scope.params.project_id);
            $cookieStore.put('tower_id', $scope.params.project_id);
            var tower_id = $cookieStore.get
            $scope.TowerListGrid();


        };

        projectUrl = "Tower/GetTowerDetailsById/" + $scope.seletedCustomerId;//f2294ca0-0fee-4c16-86af-0483a5718991";

        // alert(param.name);
        apiService.get(projectUrl).then(function (response) {
            $scope.built = response.data;

        },
   function (error)
   {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });

       


       

      

     

      

      
    });