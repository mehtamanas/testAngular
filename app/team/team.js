angular.module('team')
.controller('TeamListController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope) {
        console.log('TeamListController');
        $rootScope.title = 'Dwellar./Teams';


        var loginSession1;
        var orgID = $cookieStore.get('orgID');
        $scope.delete1 = function (id) {
            apiService.remove('team/Delete/' + id).then(function (response) {
                $scope.loginSession2 = response.data;
                //alert('Login Session : ' + loginSession.user_id);
                $state.go('loggedIn.modules.team');

            },
                  function (error) {
                      alert('Hi1');
                      // deferred.reject(error);
                      return deferred.promise;
                  });

        };

        var j = 0;
        $scope.editnew = function (id) {
            $cookieStore.put('teamid', id);
            apiService.get('team/Get?orgid=' + orgID).then(function (response) {
                $scope.loginSession2 = response.data;
                //alert('Login Session : ' + loginSession.user_id);
                $state.go('loggedIn.modules.team.add_new');

            },
             function (error) {
                 alert('Hi5');
                 // deferred.reject(error);
                 return deferred.promise;
             });
        };
        apiService.get('team/Get?orgid=' + orgID).then(function (response) {
            $scope.loginSession1 = response.data;
            //alert('Login Session : ' + loginSession.user_id);
        },

    


    function (error) {
       // alert('Hi3');
        // deferred.reject(error);
        return deferred.promise;
    });

        $scope.goAddNew = function () {
            $cookieStore.put('teamid', '');
            $state.go('loggedIn.modules.team.add_new');
        };
        $scope.goEdit = function () {
            $state.go('loggedIn.modules.team.update');
        };


        //Audit log start
        $scope.params = {

            device_os: "windows10",
            device_type: "mobile",
            device_mac_id: "34:#$::43:434:34:45",
            module_id: "team",
            action_id: "team View",
            details: "team detail",
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

        // Kendo code
        $scope.mainGridOptions = {
            dataSource: {
                type: "json",
                transport: {
                    read: "https://dw-webservices-dev.azurewebsites.net/Team/GetTeamDetails/" + orgID
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
                               //template: "<img height='40px' width='40px' src='assets/images/image-2.jpg' />" +
                               //"<span style='padding-left:10px' class='customer-name'>#: first_name #</span>",
                               field: "Name",
                               title: " Name",
                               width: "120px",
                               attributes: {
                                   "class": "UseHand",
                                   
                               }
                           }, {
                               field: "User_Count",
                               title: "Users",
                               width: "120px",
                               attributes: {
                                   "class": "UseHand",

                               }

                           }, {
                               field: "Project_Count",
                               title: "Projects",
                               width: "120px",
                               attributes: {
                                   "class": "UseHand",

                               }

                           }, {
                               field: "Property_Count",
                               title: "Property Listings",
                               width: "120px",
                               attributes: {
                                   "class": "UseHand",

                               }

                           }, {
                               field: "People_Count",
                               title: "People",
                               width: "120px",
                               attributes: {
                                   "class": "UseHand",

                               }

                           }, {
                               field: "Task_Count",
                               title: "Tasks",
                               width: "120px",
                               attributes: {
                                   "class": "UseHand",

                               }

                           }]
        };

        // Kendo Grid on change
        $scope.myGridChange = function (dataItem) {
            // dataItem will contain the row that was selected
            window.sessionStorage.selectedCustomerID = dataItem.id;
            $state.go('app.teamdetail');

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

        $scope.openTeamPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'team/add_new_team.tpl.html',
                backdrop: 'static',
                controller: TeamPopUpController,
                size: 'md'
            });
        };


        function clearFilters() {
            var gridData = $("#peopleGrid").data("kendoGrid");
            gridData.dataSource.filter({});
        }
    }
);

