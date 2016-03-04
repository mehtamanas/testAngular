angular.module('campaigns')
.controller('campaignsDetailController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope, $window) {
        console.log('campaignsDetailController');
        var orgID = $cookieStore.get('orgID');
        var userID = $cookieStore.get('userId');
        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

        //Audit log start               
        AuditCreate = function () {
            var postdata =
           {
               device_os: $cookieStore.get('Device_os'),
               device_type: $cookieStore.get('Device'),
               //device_mac_id: "34:#$::43:434:34:45",
               module_id: "Contact",
               action_id: "Contact View",
               details: "Campaign Grid",
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
                if (error.status === 400)
                    alert(error.data.Message);
                else
                    alert("Network issue");
            });
        };
        AuditCreate();

        //end


        //grid fuctionality start
        $scope.projectGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "CampaignEvent/GetCampaignGrid/" + orgID

                },
                pageSize: 20,
                schema:
                     {
                 model: {
                    fields: {

                        start_date1: { type: "date" },
                        created_date: { type: "date" }


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
            columns: [
               {
                   field: "name",
                   title: "NAME",
                   width: "120px",
                   attributes:
                    {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }
               }, {
                   field: "channel_type_name",
                   title: "CHANNEL",
                   width: "120px",
                   attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
               }, {
                   field: "budget",
                   title: "Budget",
                   width: "120px",
                   attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
               }, {
                    field: "spent",
                    title: "SPENT",
                    width: "120px",
                    attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
                }, {
                    field: "clicks",
                    title: "CLICKS",
                    width: "120px",
                    attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                }, {
                    field: "conversion_rate",
                    title: "CON.RATE",
                    width: "120px",
                    attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                },{
                   field: "no_of_leads",
                   title: "LEAD",
                   width: "120px",
                   attributes: {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
                },{
                    field: "created_date",
                    title: "Created Date",
                    width: "120px",
                    format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                   attributes: {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
                }, {
                    field: "start_date1",
                    title: "Start Date",
                    width: "120px",
                    format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                    attributes: {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }
                }, {
                   template: '<span id="#= status #">#= status #</span>',
                   title: "STATUS",
                   width: "120px",
                   attributes: {
                       "class": "UseHand",
                       "style": "text-align:center"
                   },

               }]
        };


        $scope.changeGridChange = function (dataItem) {
            window.sessionStorage.selectedCustomerID = dataItem.campaign_ID;
            $state.go('app.campaign_statistics');


        };

        $scope.filterNow = function () {
            if ($scope.lastNameFilter)
                applyFilter('first_name', $scope.lastNameFilter);
            else
                clearFilters();

        };

        function applyFilter(filterField, filterValue) {

            // get the kendoGrid element.
            var gridData = $("#peopleGrid").data("kendoGrid");

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
            var gridData = $("#peopleGrid").data("kendoGrid");
            gridData.dataSource.filter({});
        }

        $scope.$on('REFRESH', function (event, args) {
            if (args == 'projectGrid') {
                $('.k-i-refresh').trigger("click");
            }
        });


        $scope.openCampaignsPopUp = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'campaigns/campaigns.tpl.html',
                backdrop: 'static',
                controller: campaignsController,
                size: 'md'
            });
        };
    
    });

