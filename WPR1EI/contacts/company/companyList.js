angular.module('contacts')
.controller('CompanyListController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope, teamService)
    {
        console.log('CompanyListController');


        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
        var orgID = $cookieStore.get('orgID');
        var userID = $cookieStore.get('userId');    
       



        $rootScope.title = 'Dwellar/Contacts';
     
    
        //Audit log start															
        $scope.params =
            {
                device_os: $cookieStore.get('Device_os'),
                device_type: $cookieStore.get('Device'),
                device_mac_id: "34:#$::43:434:34:45",
                module_id: "Contact",
                action_id: "Contact View",
                details: "ContactView",
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

        $scope.GetValue = function (fruit) {
            var fruitId = $scope.ddlFruits;
            var fruitName = $.grep($scope.Fruits, function (fruit) {
                return fruit.Id == fruitId;
            })[0].Name;

            $cookieStore.put('Selected Text', fruitName);
        }

        $scope.addUser = function () {
            var usersToBeAddedOnServer = [];
            $cookieStore.remove('checkedIds');
            $cookieStore.put('checkedIds', $scope.checkedIds);
            // Add the new users
            for (var i in $scope.checkedIds) {
                var newMember = {};
                newMember.account_email = $scope.checkedIds[i];
                newMember.status = $cookieStore.get('Selected Text');
                usersToBeAddedOnServer.push(newMember);
            }

            if (usersToBeAddedOnServer.length == 0) {
                return;
            }
            var Text = $cookieStore.get('Selected Text');
            if ($cookieStore.get('Selected Text') == "ASSIGN TO USER") {
                $state.go($scope.optionPopup());
                $state.go($scope.openSucessfullPopup())
            }
            else if ($cookieStore.get('Selected Text') == "DELETE") {
                $state.go($scope.optionPopup())

            }
            else if ($cookieStore.get('Selected Text') == "ADD TAG") {

                $state.go($scope.openTagPopup())

            }
            else if ($cookieStore.get('Selected Text') == "ADD TO CAMPAIGN") {

                $state.go($scope.openAddLeadPopup())

            }
           
        }
        // Kendo code
        $scope.companyGrid =
        {
            dataSource: {
                type: "json",
                transport: {
                   
                    read: apiService.baseUrl + "Company/GetCompanyList/" + orgID
                    },
                pageSize: 5
            },
            schema: {
                model: {
                    fields: {
                        date_of_birth: { type: "date" }
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
                     template: "<input type='checkbox' class='checkbox' ng-click='onClick($event)' />",
                     title:"<input id='checkAll', type='checkbox', class='check-box' />",
                     width: "60px",
                     attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                 }, {
                     field: "name",
                     title: "Name",
                     width: "120px",
                     attributes: {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
                 },{
                     field: "person_count",
                    title: "People",
                    width: "120px",
                    attributes: {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }
                },{
                    field: "total_task_count",
                    title: "Task",
                    width: "120px",
                    attributes: {
                        "class": "UseHand",
                        "style": "text-align:right"
                    }
                },{
                    field: "total_quote_count",
                    title: "Quote",
                    width: "120px",
                    attributes: {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }
            },{
                field: "last_contacted",
                title: "Last Follow Up",
                width: "120px",
                attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            },
              {
                  field: "rating",
                  title: "Rating",
                  width: "120px",
                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
              }, ]
            
        };



        $scope.Fruits = [{
            Id: 1,
            Name: 'ASSIGN TO USER'
        }, {
            Id: 2,
            Name: 'DELETE'
        }, {
            Id: 3,
            Name: 'ADD TAG'
        },
            {
            Id: 4,
            Name: 'ADD TO CAMPAIGN'
        }
        ];
        $scope.checkedIds = [];
        $scope.showCheckboxes = function () {
            for (var i in $scope.checkedIds) {
                // alert($scope.checkedIds[i]);
            }
        };

        $scope.onClick = function (e) {
            var element = $(e.currentTarget);
            var checked = element.is(':checked')
            row = element.closest("tr")
            var id = $(e.target).data('id');
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
        // Kendo Grid on change
        $scope.myGridChange = function (dataItem) {
            // dataItem will contain the row that was selected
            window.sessionStorage.selectedCustomerID = dataItem.id;
            $scope.companyName = $cookieStore.get('Company_Name');
            $state.go('app.companyDetail');
           

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
        $scope.$on('REFRESH', function (event, args) {
            if (args == 'contactGrid') {
                $('.k-i-refresh').trigger("click");
            }
        });

        function clearFilters() {
            var gridData = $("#peopleGrid").data("kendoGrid");
            gridData.dataSource.filter({});
        }
    }
);

