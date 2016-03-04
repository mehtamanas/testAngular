angular.module('task')



.controller('TaskGridController',
    function ($scope, $state, security, $cookieStore, apiService, $rootScope, $modal) {

        var orgID = $cookieStore.get('orgID');

        $rootScope.title = 'Dwellar./Properties';

        var userId = $cookieStore.get('userId');


        $scope.TaskGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "ToDoItem/GetTaskByRole/" + userId
                },
                pageSize: 20,

                schema: {
                    model: {
                        fields: {
                            due_date: { type: "date" },
                            start_date_time: { type: "date" },
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

            },
           {
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


        //Audit log start															
        $scope.params =
            {
                device_os: $cookieStore.get('Device_os'),
                device_type: $cookieStore.get('Device'),
                device_mac_id: "34:#$::43:434:34:45",
                module_id: "Contact",
                action_id: "Contact View",
                details: "PropertyView",
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


        // Kendo Grid on change
        $scope.myGridChange = function (dataItem) {
            // dataItem will contain the row that was selected


            window.sessionStorage.selectedCustomerID = dataItem.id;
            //$state.go('app.propertydetail');


        };



        $scope.submit = function (e) {

            if ($('.check-box:checked').length > 0)
                $('.checkbox').prop('checked', true);
            else
                $('.checkbox').prop('checked', false);
        }

        $scope.propertySelected = function (e, data) {
            console.log(e);
            var element = $(e.currentTarget);
            var checked = element.is(':checked')
            row = element.closest("tr")
            var id = data.tower_id;
            var fnd = 0;
            for (var i in $scope.checkedIds) {
                if (id == $scope.checkedIds[i]) {
                    $scope.checkedIds.splice(i, 1);
                    fnd = 1;
                }

            }
            if (fnd == 0) {
                $scope.checkedIds.push(id);
            }
            if (checked) {
                row.addClass("k-state-selected");
            } else {
                row.removeClass("k-state-selected");
            }

        }

        $scope.GetValue = function (fruit) {

            var fruitId = $scope.ddlFruits;
            var fruitName = $.grep($scope.Fruits, function (fruit) {
                return fruit.Id == fruitId;
            })[0].Name;

            $cookieStore.put('Selected Text', fruitName);
            // $window.alert("Selected Value: " + fruitId + "\nSelected Text: " + fruitName);
            //    alert("hiii");



        }

        $scope.soldProperty = function () {

            var usersToBeAddedOnServer = [];
            $cookieStore.remove('checkedIds');
            $cookieStore.put('checkedIds', $scope.checkedIds);
            // Add the new users
            for (var i in $scope.checkedIds) {
                var newMember = {};
                newMember.id = $scope.checkedIds[i];
                newMember.organization_id = $cookieStore.get('orgID');
                newMember.available_status = 1;

                usersToBeAddedOnServer.push(newMember);
            }

            if (usersToBeAddedOnServer.length == 0) {
                return;
            }



            apiService.post("Floors/StatusChange", usersToBeAddedOnServer).then(function (response) {
                var loginSession = response.data;

                $scope.openSucessfullPopup();
                //    $modalInstance.dismiss();
                $rootScope.$broadcast('REFRESH', 'TowerListGrid');


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
                    templateUrl: 'property/sold.html',
                    backdrop: 'static',
                    controller: SoldController,
                    size: 'md',
                    resolve: { items: { title: "Property " } }

                });
                $rootScope.$broadcast('REFRESH', 'TowerListGrid');
            }
        }

        $scope.Fruits = [{
            Id: 1,
            Name: 'SOLD'

        }];
        $scope.checkedIds = [];
        $scope.showCheckboxes = function () {


            for (var i in $scope.checkedIds) {

                alert($scope.checkedIds[i]);
            }
        };

        $scope.$on('REFRESH', function (event, args) {
            if (args == 'TowerListGrid') {
                $('.k-i-refresh').trigger("click");
            }
            $scope.ddlFruits = "ACTION";
        });


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

        $scope.openPropertyPopup = function () {
            // alert("hi");
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'property/add_new_property.tpl.html',
                backdrop: 'static',
                controller: PropertyPopUpController,
                size: 'md'
            });
        };
    }

);