angular.module('contacts')
.controller('tagpeopleController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope, teamService, $window, $stateParams) {

        $scope.seletedCustomerId = $stateParams.id;
       // window.sessionStorage.selectedCustomerID = $scope.seletedCustomerId;
        console.log('ContactListController');

        var userID = $cookieStore.get('userId');
        //alert($cookieStore.get('userId'));
        $cookieStore.put("people_type", "Lead");

        $rootScope.title = 'Dwellar - Lead Details';
        var loginSession1;
        var orgID = $cookieStore.get('orgID');



        var j = 0;
        $scope.editnew = function (id) {
            $cookieStore.put('contactid', id);
            apiService.get('PersonContactDevice/GetById?ID=' + orgID).then(function (response) {
                $scope.loginSession2 = response.data;
                $state.go('loggedIn.modules.people.add_new');
            },
             function (error) {
                 return deferred.promise;
             });
        };

        $scope.goAddNew = function () {
            $cookieStore.put('contactid', '');
            $state.go('loggedIn.modules.people.add_new');
        };
        $scope.goEdit = function () {
            $state.go('loggedIn.modules.people.update');
        };

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
                newMember.Name = $scope.checkedIds[i];
                newMember.status = $cookieStore.get('Selected Text');
                usersToBeAddedOnServer.push(newMember);
            }

            if (usersToBeAddedOnServer.length == 0) {
                return;
            }
            var Text = $cookieStore.get('Selected Text');
            if ($cookieStore.get('Selected Text') == "ASSIGN TO") {
                $state.go($scope.assignToUpPopup());
            }
            else if ($cookieStore.get('Selected Text') == "ADD TAG") {

                $state.go($scope.tagOptionPopup());
            }

        }

        $scope.delete = function () {

            var contactDelete = [];
            $cookieStore.remove('checkedIds');
            $cookieStore.put('checkedIds', $scope.checkedIds);
            // Add the new users
            for (var i in $scope.checkedIds) {
                var contact = {};
                contact.id = $scope.checkedIds[i];
                contact.organization_id = $cookieStore.get('orgID');

                contactDelete.push(contact);
            }

            if (contactDelete.length == 0) {
                return;
            }
            $cookieStore.put('contactDelete', contactDelete);
            $scope.openConfirmation();
        }

        // Kendo code
        $scope.LeadGrid = {
            dataSource: {
                type: "json",

                transport: {
                    read: function (options) {
                        apiService.get("Contact/GetpeoplebyTags?id=" + orgID + "&type="+$scope.seletedCustomerId).then(function (response) {
                            data = response.data;

                            for (i = 0; i < data.length; i++) {
                                var tag = (data[i].Tags);
                                if (tag !== null) {
                                    tag = JSON.parse(tag);
                                    data[i].Tags = [];
                                    data[i].Tags = tag;
                                }
                                else
                                    data[i].Tags = [];
                            }
                            options.success(data);
                        }, function (error) {
                            options.error(error);
                        })

                    },

                },
                //transport: {
                //    read: apiService.baseUrl + "Contact/GetpeoplebyTags?id=" + orgID + "&type=" + $scope.seletedCustomerId,

                //},
                pageSize: 20
            },
            groupable: true,
            sortable: true,
            selectable: "multiple",
            reorderable: true,
            height: screen.height - 350,
            resizable: true,
            filterable: true,
            columnMenu: {
                messages: {
                    columns: "Choose columns",
                    filter: "Apply filter",
                    sortAscending: "Sort (asc)",
                    sortDescending: "Sort (desc)"
                }
            },
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: [
                  {
                      template: "<input type='checkbox', class='checkbox', data-id='#= Name #',  ng-click='projectSelected($event,dataItem)' />",
                      title: "<input id='checkAll', type='checkbox', class='check-box', ng-click='submit(dataItem)' />",
                      width: "60px",
                      attributes:
                       {
                           "class": "UseHand",
                           "style": "text-align:center"
                       }
                  }, {
                      template: "<img height='40px' width='40px'  class='user-photo' src='#= Contact_Image #'/>" +
                      "<span style='padding-left:10px' class='customer-name'> </span>",
                      width: "120px",
                      title: "Picture",
                      attributes:
                      {
                          "class": "UseHand",
                      }
                  }, {
                      field: "Name",
                      template: '<a ui-sref="app.contactdetail({id:dataItem.Contact_Id})" href="">#=Name#</a>',
                      width: "120px",
                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "Contact_Phone",
                      title: "Phone",
                      width: "120px",
                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "Contact_Email",
                      title: " Email",
                      width: "120px",
                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "City",
                      title: "City",
                      width: "120px",
                      attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "Assigned_To",
                      title: "Assigned To",
                      width: "120px",
                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "Type",
                      title: "Type",
                      width: "120px",
                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  },
             {
                 field: "company",
                 title: "Company",
                 width: "120px",
                 attributes: {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
             },
             {
                 template: "<span ng-repeat='tag in dataItem.Tags' style='background-color:{{tag.background_color}}; display:inline-block; margin-bottom: 5px;' class='properties-close upper tag-name'>{{tag.name}}</span>",
                 title: "TAGS",
                 width: "120px",
                 attributes: {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
             },
              {
                  field: "leadsource",
                  title: "Lead Source",
                  width: "120px",
                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
              },
             {
                 field: "Contact_Created_Date",
                 title: "Updated Date",
                 width: "120px",
                 format: '{0:dd-MM-yyyy }',
                 template: "#= kendo.toString(kendo.parseDate(Contact_Created_Date, 'yyyy-MM-dd'), 'MM/dd/yyyy') #",
                 attributes: {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
             },
             {
                 title: "Action",
                 template: "<a id='followUp'class='btn btn-primary' ng-click='openFollowUp(dataItem)' data-toggle='modal'>Follow up </a> </div>",
                 width: "120px",
                 attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
             }, ]
        };

        $scope.Fruits = [{

            Id: 1,
            Name: 'ADD TAG'
        }, {
            Id: 2,
            Name: 'ASSIGN TO',
            attributes: {
                "class": "UseHand",
                "style": "cursor:pointer"
            }

        }, {

            Id: 3,
            Name: 'DELETE'
        },

        ];


        $scope.checkedIds = [];
        $scope.showCheckboxes = function () {


            for (var i in $scope.checkedIds) {

                // alert($scope.checkedIds[i]);
            }
        };

        $scope.submit = function (e) {

            if ($('.check-box:checked').length > 0)
                $('.checkbox').prop('checked', true);
            else
                $('.checkbox').prop('checked', false);
        }

        $scope.projectSelected = function (e, data) {

            console.log(e);

            var allListElements = $(".checkbox").toArray();
            for (var i in allListElements) {
                if (!allListElements[i].checked) {
                    $('#checkAll').prop('checked', false);
                    break;
                }
                if (i == allListElements.length - 1)
                    $('#checkAll').prop('checked', true);
            }
            var element = $(e.currentTarget);
            var checked = element.is(':checked')
            row = element.closest("tr")
            var id = data.Contact_Id;
            var fnd = 0;
            var allListElements = $(".checkbox");
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
            window.sessionStorage.selectedCustomerID = dataItem.Contact_Id;

            $state.go('app.contactdetail', { id: dataItem.Contact_Id });
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
        $scope.$on('REFRESH2', function (event, args) {
            if (args == 'LeadGrid') {
                $('.k-i-refresh').trigger("click");
            }
            $scope.ddlFruits = "ACTION";
        });
     

        function clearFilters() {
            var gridData = $("#peopleGrid").data("kendoGrid");
            gridData.dataSource.filter({});
        }

    }
);

