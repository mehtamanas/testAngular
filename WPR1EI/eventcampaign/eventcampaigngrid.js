angular.module('eventcampaign')
.controller('EventCampaignGridController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope) {
        console.log('EventCampaignGridController');
        $rootScope.title = 'Dwellar./EventCampaignGrid';

        var userID = $cookieStore.get('userId');
        var orgID = $cookieStore.get('orgID');
     
        //Audit log start															
        AuditCreate = function () {
            var postdata =
           {
               device_os: $cookieStore.get('Device_os'),
               device_type: $cookieStore.get('Device'),

               module_id: "Promo Campaign",
               action_id: "Promo Campaign View",
               details:  "Promo campaign grid",
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
        AuditCreate();
       //end
   


        // Kendo code
        $scope.mainGridOptions = {
            dataSource: {
                type: "json",
                transport: {
                    //read: apiService.baseUrl +"Team/GetTeamDetails/" + orgID
                    read: apiService.baseUrl + "CampaignEvent/GetCampaign/" + orgID

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
                             
                               field: "token",
                               title: " Token",
                               width: "120px",
                               attributes: {
                                   "class": "UseHand",
                                   "style": "text-align:center"
                               }
                           }, {
                               field: "expiry_datetime",
                               title: "Expiry DateTime",
                               width: "120px",
                               attributes: {
                                   "class": "UseHand",
                                   "style": "text-align:center"
                               }

                           }

                           ]
        };
        $scope.$on('REFRESH', function (event, args) {
            if (args == 'campaigngrid') {
                $('.k-i-refresh').trigger("click");
            }
        });
        // Kendo Grid on change
        $scope.myGridChange = function (dataItem) {
            // dataItem will contain the row that was selected
            window.sessionStorage.selectedCustomerID = dataItem.id;
            $state.go('app.eventcampaign');

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

        $scope.openEventCampaignPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'eventcampaign/eventcampaign.tpl.html',
                backdrop: 'static',
                controller: EventCampaignController,
                size: 'md'
            });
        };


        function clearFilters() {
            var gridData = $("#peopleGrid").data("kendoGrid");
            gridData.dataSource.filter({});
        }
    }
);

