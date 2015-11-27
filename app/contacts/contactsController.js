angular.module('contacts')
.controller('ContactListController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope) {
        console.log('ContactListController');

        $rootScope.title = 'Dwellar/Contact';
        var loginSession1;
        var orgID = $cookieStore.get('orgID');
        $scope.delete1 = function (id) {
            apiService.remove('Contact/Delete/' + id).then(function (response) {
                $scope.loginSession2 = response.data;
                $state.go('loggedIn.modules.people');
            },
                  function (error) {
                      // deferred.reject(error);                      
                      return deferred.promise;
                  });

        };

        var j = 0;
        $scope.editnew = function (id) {
            $cookieStore.put('contactid', id);
            apiService.get('PersonContactDevice/GetById?ID=' + orgID).then(function (response) {
                $scope.loginSession2 = response.data;
                //alert('Login Session : ' + loginSession.user_id);
                $state.go('loggedIn.modules.people.add_new');
            },
             function (error) {
                 //     alert("Hi1");
                 // deferred.reject(error);
                 return deferred.promise;
             });
        };
        apiService.get('PersonContactDevice/GetById?ID=' + orgID).then(function (response) {
            $scope.loginSession1 = response.data;
            //alert('Login Session : ' + loginSession.user_id);
        },
    function (error) {
        //  alert("Hi3");
        // deferred.reject(error);
        return deferred.promise;
    });

        $scope.goAddNew = function () {
            $cookieStore.put('contactid', '');
            $state.go('loggedIn.modules.people.add_new');
        };
        $scope.goEdit = function () {
            $state.go('loggedIn.modules.people.update');
        };

        //Audit log start
        $scope.params = {

            device_os: "windows10",
            device_type: "mobile",
            device_mac_id: "34:#$::43:434:34:45",
            module_id: "Contact",
            action_id: "Contact View",
            details: "Contact detail",
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


        
         // alert(orgID);
        // Kendo code
        $scope.mainGridOptions = {
            dataSource: {
                type: "json",
                transport: {
                   // read: "http://dw-webservices-dev.azurewebsites.net/Contact/GetById/" + orgID
                    read: "http://dw-webservices-dev.azurewebsites.net/PersonContactDevice/GetById?ID=" + orgID
                },
                pageSize: 5

                //group: {
                //    field: 'sport'
                //}
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
                    template: "<img height='40px' width='40px'  class='user-photo' src='#= Contact_image #'/>" +
                    "<span style='padding-left:10px' class='customer-name'> </span>",

                    
                    width: "120px",
                    attributes: {
                        "class": "UseHand",

                    }
                },
                 {
                     field: "first_name",
                     title: "First Name",
                     width: "120px",
                     attributes: {
                         "class": "UseHand",

                     }
                 },
                {
                    field: "last_name",
                    title: "Last Name",
                    width: "120px",
                    attributes: {
                        "class": "UseHand",

                    }
                },

                {
                    field: "people_type",
                    title: "People Type",
                    width: "120px",
                    attributes: {
                        "class": "UseHand",

                    }
                },
            {
                field: "date_of_birth",
                title: "Date of Birth",
                width: "120px",
                format: '{0:dd/MM/yyyy}',

              
            },

            {
                field: "contact_mobile",
                title: "Primary Phone",
                width: "120px",
                attributes: {
                    "class": "UseHand",
                }

            },


             {
                 field: "contact_Email",
                 title: "Primary Email",
                 width: "120px",
                 attributes: {
                     "class": "UseHand",
                 }

             },


                 {
                     field: "viewed_properties",
                     title: "Viewed Properties",
                     width: "120px",
                     attributes: {
                         "class": "UseHand",

                     }
                 },
            {
                field: "purchased_properties",
                title: "Purchased Properties",
                width: "120px",
                attributes: {
                    "class": "UseHand",

                }
            },
            ]
        };

        // Kendo Grid on change
        $scope.myGridChange = function (dataItem) {
            // dataItem will contain the row that was selected
            window.sessionStorage.selectedCustomerID = dataItem.id;
            $state.go('app.contactdetail');

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

        $scope.openContactPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/add_new_contact.tpl.html',
                backdrop: 'static',

                controller: ContactPopUpController,
                size: 'md'
            });
        };


        function clearFilters() {
            var gridData = $("#peopleGrid").data("kendoGrid");
            gridData.dataSource.filter({});
        }
    }
);

