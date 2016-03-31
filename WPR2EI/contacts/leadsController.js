angular.module('contacts')
.controller('LeadListController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope, teamService, $window) {

        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
        console.log('ContactListController');
        $scope.gridView = 'default';
        $scope.leadAction = 'no_action';

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

        $scope.changeView = function () {
            //filter by grid name
            filterObj = _.filter($scope.views, function (o)
            { return o.view_name === $scope.gridView });

            //get the grid datasource
            var grid = $('#contact_kenomain').getKendoGrid();
            var sortObj = [];
            sortObj.push({ field: filterObj[0].sort_by, dir: filterObj[0].sort_order });
            var col = (filterObj[0].column_names).split(',');
            for (i = 0; i < $('#contact_kenomain').getKendoGrid().columns.length; i++) {
                for (j = 0; j < col.length; j++) {
                    if (col[j]===$('#contact_kenomain').getKendoGrid().columns[i].title) {
                        $('#contact_kenomain').getKendoGrid().showColumn(i);
                        break;
                    }
                    if (j === $('#contact_kenomain').getKendoGrid().columns.length - 1) {

                    }
                }
            }

            $('#contact_kenomain').getKendoGrid().dataSource.sort(sortObj);


        }

        $scope.saveView = function () {
            var grid = $('#contact_kenomain').getKendoGrid();
            var sortObject = grid.dataSource._sort[0];
            var colObject = _.filter(grid.columns, function (o)
            { return !o.hidden });
            colObject = (_.pluck(colObject, 'title')).join(',');


            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/Views/createView.html',
                backdrop: 'static',
                controller: createViewCtrl,
                size: 'md',
                resolve: { viewData: { sort: sortObject, col: colObject, grid: 'lead' } }
            });
        }



        $scope.chooseAction = function () {
            var allGridElements = $(".checkbox").toArray();
            var allCheckedElement = _.filter(allGridElements, function (o)
            { return o.checked });
            allCheckedIds = (_.pluck(allCheckedElement, 'dataset.id'));
            $cookieStore.remove('checkedIds');
            $cookieStore.put('checkedIds', allCheckedIds);
            
            if (allCheckedIds.length>0){

            if ($scope.leadAction === "no_action") {

            }
            else if ($scope.leadAction === "add_tag") {
                $state.go($scope.tagOptionPopup());
            }
            else if ($scope.leadAction === "assign_to") {
                $state.go($scope.assignToUpPopup());
            }
            else if ($scope.leadAction === "delete") {
                var contactDelete = [];
                for (var i in allCheckedIds) {
                    var contact = {};
                    contact.id = allCheckedIds[i];
                    contact.organization_id = $cookieStore.get('orgID');
                    contactDelete.push(contact);
                }
                $cookieStore.put('contactDelete', contactDelete);
                $scope.openConfirmation();
            }
            }
        }

        // Kendo code
        $scope.LeadGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: function (options) {
                        apiService.getWithoutCaching("Contact/GetAllContactDetails?Id=" + userID + "&type=Lead").then(function (response) {
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
                      template: "<input type='checkbox', class='checkbox', data-id='#= Contact_Id #',  ng-click='check($event,dataItem)' />",
                      title: "<input id='checkAll', type='checkbox', class='check-box', ng-click='checkALL(dataItem)' />",
                      width: "60px",
                      attributes:
                       {
                           "class": "UseHand",
                           "style": "text-align:center"
                       }
                  }, {
                      template: "<div class='user-photo_1'><img class='image2' src='#= Contact_Image #'/></div>" +
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
                      width: "200px",
                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "Contact_Phone",
                      title: "Phone",

                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "Contact_Email",
                      title: " Email",

                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "City",
                      title: "City",

                      attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "Assigned_To",
                      title: "Assigned To",

                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "Type",
                      title: "Type",

                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  },
             {
                 field: "company",
                 title: "Company",

                 attributes: {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
             },
             {
                 field:"Tags",
                 template: "<span ng-repeat='tag in dataItem.Tags' style='background-color:{{tag.background_color}}; display:inline-block; margin-bottom: 5px;' class='properties-close upper tag-name'>{{tag.name}}</span>",
                 title: "TAGS",
                 width: "220px",

                 attributes: {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
             },
              {
                  field: "leadsource",
                  title: "Lead Source",

                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
              },
                 {
                     field: "rating",
                     title: "Last Contacted Date",
                     attributes: {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
                 },
             {
                 field: "Contact_Created_Date",
                 title: "Updated Date",
                 //template: "#= kendo.toString(kendo.parseDate(Contact_Created_Date, 'yyyy-MM-dd hh:mmtt'), 'MM/dd/yyyy') #",
                 attributes: {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
             },
             {
                 title: "Action",
                 template: "<a id='followUp'class='btn btn-primary' ng-click='openFollowUp(dataItem)' data-toggle='modal'>Follow up </a> </div>",

                 attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
             }, ]
        };


        $scope.checkALL = function (e) {
            if ($('.check-box:checked').length > 0)
                $('.checkbox').prop('checked', true);
            else
                $('.checkbox').prop('checked', false);
        };


        $scope.check = function (e, data) {
            var allListElements = $(".checkbox").toArray();
            for (var i in allListElements) { // not all checked
                if (!allListElements[i].checked) {
                    $('#checkAll').prop('checked', false);
                    break;
                }
                if (i == allListElements.length - 1) // if all are checked manually
                    $('#checkAll').prop('checked', true);
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
            $scope.leadAction = 'no_action';
            $('#checkAll').prop('checked', false);

         

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

        $scope.assignToUpPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/AssignToContact.tpl.html',
                backdrop: 'static',
                controller: ActionUpController,
                size: 'md'
            });
        };

        $scope.openConfirmation = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/confirm.tpl.html',
                backdrop: 'static',
                controller: confirmationController,
                size: 'md',
                resolve: { items: { title: "Contact" } }

            });

        }

        function clearFilters() {
            var gridData = $("#peopleGrid").data("kendoGrid");
            gridData.dataSource.filter({});
        }
    }
);

