angular.module('call')
.controller('CallController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope) {
        console.log('CallController');

        var userID = $cookieStore.get('userId');

        var orgID = $cookieStore.get('orgID');
       
        $scope.callrecordGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "CallRecords/GetCallsByRole/" + userID

                },
                schema: {
                    model: {
                        fields: {
                            starttime: { type: "date" },
                            Recording: { type: "audio/mpeg" },
                          
                        }
                    }
                },
                pageSize: 20
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
                     field: "Caller_name",
                     title: "Caller Name",
                     width: "120px",
                     attributes:
                    {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }
                 },
                {
                    field: "callfrom",
                    title: "Call From",
                    width: "120px",
                    attributes:
                   {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }
                }, {
                    field: "callto",
                    title: "Call To",
                    width: "120px",
                    attributes:
                   {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }
                }, {
                    field: "Follow_up",
                    title: "Call Type",
                    width: "120px",
                    attributes:
                    {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }
                },
                {
                    template: "<audio controls><source src='horse.mp3' type='audio/mpeg' src='#= recordingurl #'></audio>",
                    title: "Recording",
                    width: "120px",
                    attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                },                 
                {
                    field: "starttime",
                    title: "Date & Time",
                    width: "120px",
                    format: '{0:dd/MM/yyyy hh:mm:ss}',
                    attributes:
                   {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }
                }, {
                    field: "direction",
                    title: "Direction",
                    width: "120px",
                    attributes:
                   {
                        "class": "UseHand",
                        "style": "text-align:center"
                   }
                },]
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





    }
);

