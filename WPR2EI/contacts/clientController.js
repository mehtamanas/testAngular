angular.module('contacts')
.controller('ClientListController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope, teamService, $window)
    {

        if (!$rootScope.contacts.write) {
            $('#btnSave').hide();
            $('#iconEdit').hide();
            $('#btnAdd').hide();
        }

        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
        console.log('ContactListController');

        var userID = $cookieStore.get('userId');
        //alert($cookieStore.get('userId'));
 
        $cookieStore.put("people_type", "Client"); 
        
$rootScope.title = 'Dwellar/Client';
        var loginSession1;
        var orgID = $cookieStore.get('orgID');

        $scope.delete1 = function (id)
        {
            apiService.remove('Contact/Delete/' + id).then(function (response)
            {
                $scope.loginSession2 = response.data;
                $state.go('loggedIn.modules.people');
            },
                  function (error)
                  {
                      return deferred.promise;
                  });

        };

        var j = 0;
        $scope.editnew = function (id)
        {
            $cookieStore.put('contactid', id);
            apiService.get('PersonContactDevice/GetById?ID=' + orgID).then(function (response)
            {
                $scope.loginSession2 = response.data;
                $state.go('loggedIn.modules.people.add_new');
            },
             function (error)
             {
                return deferred.promise;
             });
        };
     

        $scope.goAddNew = function ()
        {
            $cookieStore.put('contactid', '');
            $state.go('loggedIn.modules.people.add_new');
        };
        $scope.goEdit = function ()
        {
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

            //$cookieStore.put('Selected Text', fruitName);
            $scope.tagOptionPopup();

        }

        $scope.addUser = function () {
            var usersToBeAddedOnServer = [];
            $cookieStore.remove('checkedIds');
            $cookieStore.put('checkedIds', $scope.checkedIds);
            // Add the new users
            for (var i in $scope.checkedIds) {
                var newMember = {};
                newMember.Contact_Id = $scope.checkedIds[i];
                newMember.status = $cookieStore.get('Selected Text');
                usersToBeAddedOnServer.push(newMember);
            }

            if (usersToBeAddedOnServer.length == 0) {
                return;
            }
            var Text = $cookieStore.get('Selected Text');
           
            
            if ($cookieStore.get('Selected Text') == "ADD TAG") {

                $state.go($scope.tagOptionPopup())

            }
           
           
        }
        // Kendo code
            $scope.contactGrid =
         {
             dataSource: {
                 type: "json",
                 transport: {

                     read: apiService.baseUrl + "Contact/GetAllContactDetails?Id=" + userID + "&type=Client",
	             cache: true

                 },
                 pageSize: 20
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
                      title: "<input id='checkAll', type='checkbox', class='check-box' />",
                      width: "60px",
                      attributes:
                       {
                           "class": "UseHand",
                           "style": "text-align:center"
                       }
                  }, {
                      template: "<img height='40px' width='40px'  class='user-photo' src='#= Contact_Image #'/>" +
                      "<span style='padding-left:10px' class='customer-name'> </span>",
                      width: "60px",
                      title: "Picture",
                      attributes:
                      {
                          "class": "UseHand",
                      }
                  }, {
                      field: "Name",
                      title: "Name",
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
                      title: "Email",
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
                 title: "Action",
                 template: "<a id='followUp' class='btn btn-primary' ng-click='openFollowUp(dataItem)' data-toggle='modal'>Follow up </a> </div>",
                 width: "120px",
                 attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:center;"
                   }
             }, ]

         };


        $scope.Fruits = [{
           
            Id: 1,
            Name: 'ADD TAG'
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
            window.sessionStorage.selectedCustomerID = dataItem.Contact_Id;

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
        $scope.$on('REFRESH', function (event, args) {
            if (args == 'contactGrid') {
                $('.k-i-refresh').trigger("click");
            }
        });

        $scope.openFollowUp = function (d) {
            var id = d.Contact_Id;
            window.sessionStorage.selectedCustomerID = id;
            $cookieStore.put('company_name', d.company);
            $cookieStore.put('lead_name', d.Name);
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/company/followUp.html',
                backdrop: 'static',
                controller: FollowUpController,
                size: 'md'

            });

        };


        $scope.openContactPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/add_new_contact.tpl.html',
                backdrop: 'static',

                controller: ContactPopUpController,
                size: 'md'
            });
        };

        $scope.openUploadContactPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/UploadContact.html',
                backdrop: 'static',

                controller: ContactUploadPopUpController,
                size: 'md'
            });
        };

        $scope.openUploadNotesPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/UploadNotes.html',
                backdrop: 'static',

                controller: ContactNotesUploadPopUpController,
                size: 'md'
            });
        };

        $scope.openAddLeadPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/optionLead.html',
                backdrop: 'static',
                controller: OptionLeadController,
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


        $scope.tagOptionPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/option.html',
                backdrop: 'static',
                controller: TagPopUpController,
                size: 'md'
            });
        };


        function clearFilters() {
            var gridData = $("#peopleGrid").data("kendoGrid");
            gridData.dataSource.filter({});
        }
    }
);

