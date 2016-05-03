angular.module('newuser')
.controller('newuserController',
      function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope) {
          console.log('TeamListController');
          $rootScope.title = 'Dwellar-Users';
          $scope.userAction = 'no_action';
          var userID = $cookieStore.get('userId');

         // alert($cookieStore.get('userId'));

          if (!$rootScope.users.write) {
              $('#btnSave').hide();
              $('#iconEdit').hide();
              $('#addNewUser').hide();
          }
          var authRights = ($cookieStore.get('UserRole'));

          $scope.isEnterpriseUser = (_.find(authRights, function (o) { return o == 'Enterprise User'; }))

          if ($scope.isEnterpriseUser == 'Enterprise User') {
              $('#addNewUser').hide();
              $('#user_action').hide();
              $('#userRefresh').hide();
              
             
          }
         


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
          $scope.params =
              {
                  device_os: $cookieStore.get('Device_os'),
                  device_type: $cookieStore.get('Device'),
                  device_mac_id: "34:#$::43:434:34:45",
                  module_id: "Contact",
                  action_id: "Contact View",
                  details: "UserView",
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

          $scope.openSucessfullPopup = function () {
              var modalInstance = $modal.open({
                  animation: true,
                  templateUrl: 'newuser/sucessfull.tpl.html',
                  backdrop: 'static',
                  controller: sucessfullController,
                  size: 'sm',
                  resolve: { items: { title: "User" } }
              });

          }

          $scope.inactive = function () {
              var modalInstance = $modal.open({
                  animation: true,
                  templateUrl: 'newuser/inactive.html',
                  backdrop: 'static',
                  controller: InactiveController,
                  size: 'sm',
                 resolve: { items: { title: "User" } }
              });

          }


          $scope.optionPopup = function () {
              var modalInstance = $modal.open({
                  animation: true,
                  templateUrl: 'newuser/option.html',
                  backdrop: 'static',
                  controller: OptionPopUpController,
                  size: 'sm'
              });
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

          $scope.chooseAction = function () {
              var allGridElements = $(".checkbox").toArray();
              var allCheckedElement = _.filter(allGridElements, function (o)
              { return o.checked });
              allCheckedIds = (_.pluck(allCheckedElement, 'dataset.id'));
              $cookieStore.remove('checkedIds');
              $cookieStore.put('checkedIds', allCheckedIds);

              if (allCheckedIds.length > 0) {

                  if ($scope.userAction === "no_action") {

                  }                 
                  else if ($scope.userAction === "assign_roles") {
                      $state.go($scope.optionPopup());
                  }
                  else if ($scope.userAction === "delete") {
                      var UserDelete = [];
                      for (var i in allCheckedIds) {
                          var user = {};
                          user.id = allCheckedIds[i];
                          user.organization_id = $cookieStore.get('orgID');
                          UserDelete.push(user);
                      }
                      $cookieStore.put('UserDelete', UserDelete);
                      $scope.openConfirmation();
                  }
                  else if ($scope.userAction === "Inactive")
                  {
                      var userinactive = [];
                      for (var i in allCheckedIds) {
                          var user = {};
                          user.id = allCheckedIds[i]
                          user.organization_id = $cookieStore.get('orgID');
                          userinactive.push(user);
                      }
                      $cookieStore.put('userinactive', userinactive);
                      apiService.post("User/StatusChange", userinactive).then(function (response) {
                          var loginSession = response.data;
                          $state.go($scope.inactive())
                      },
                     function (error) {
                         if (error.status === 400)
                             alert(error.data.Message);
                         else
                             alert("Network issue");
                     });
                  }
              }
          }


          var orgID = $cookieStore.get('orgID');
          //     alert(orgID);
          $scope.mainGridOptions = {
              dataSource: {
                  type: "json",
                  transport: {
                      read: apiService.baseUrl + "User/GetCount?id=" + userID
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
              height: window.innerHeight - 180,
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
              columns: [{
                  template: "<input type='checkbox', class='checkbox', data-id='#= id #',  ng-click='check($event,dataItem)' />",
                  title: "<input id='checkAll', type='checkbox', class='check-box', ng-click='checkALL(dataItem)' />",
                  width: "60px",
                  attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
              }, {
                  field: "first_name",
                  title: "First Name",

                  width: "100px",
                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
              }, {
                  field: "last_name",
                  title: "Last Name",
                  width: "100px",

                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:center"

                  }

              }, {
                  field: "account_email",
                  title: "Email",
                  width: "100px",
                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:center"

                  }

              }, {
                  field:"status",
                  template: '<span id="#= status #"></span>',
                  width: "100px",
                  title: "Status",
                  attributes:
                  {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
              }, {
                  field: "rolename",
                  title: "Role",
                  width: "80px",

                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
              }, {
                  field: "Project_count",
                  title: "Projects",
                  width: "100px",

                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:center"

                  }
              }, {
                  field: "Team_Count",
                  title: "Teams",
                  width: "100px",
                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
              }, {
                  field: "Property_count",
                  title: "Property Listings",
                  width: "100px",
                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
              }, {
                  field: "People_Count",
                  title: "People",
                  width: "100px",
                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
              },{
                  field: "Action",
                  title: "Action",
                  template: '<div class="uib-dropdown drop_user" uib-dropdown ><button class="btn drop_lead_btn uib-dropdown-toggle" uib-dropdown-toggle type="button" data-toggle="dropdown"><span class="caret caret_lead"></span></button><ul class="uib-dropdown-menu dropdown_lead" uib-dropdown-menu ><li>' +
                              '<a   class=" "  data-toggle="">Assign Role </a>' +
                              '</li><li><a href="" >Edit</a></li>' + '<li><a href="" >Delete</a></li> </ul></div>',
                  width: "100px",
                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
              }]
          };



          function RefreshGrid() {
              setInterval(function () {
                  $('peopleGrid').data("kendoGrid").dataSource.transport.read();
              }, refreshInterval);


          }
          $scope.$on('REFRESH', function (event, args) {
              if (args == 'mainGridOptions') {
                  $('.k-i-refresh').trigger("click");
              }
              $scope.userAction = 'no_action';
          });


          // Kendo Grid on change
          $scope.myGridChange = function (dataItem) {
              // dataItem will contain the row that was selected
              window.sessionStorage.selectedCustomerID = dataItem.id;
              $state.go('app.newuserdetail');

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
          $scope.openUserPopup = function () {
              var modalInstance = $modal.open({
                  animation: true,
                  templateUrl: 'newuser/add_new_user.tpl.html',
                  backdrop: 'static',
                  controller: UserPopUpController,
                  size: 'lg'
              });
          };

          $scope.openImportUserPopup = function () {
              var modalInstance = $modal.open({
                  animation: true,
                  //templateUrl: 'newuser/import_users.tpl.html',
                  templateUrl: 'newuser/upload.html',
                  backdrop: 'static',
                  //controller: import_usersController,
                  controller: uploadController,

                  size: 'lg'
                  //resolve: {
                  //    uploadService: uploadService
                  //}
              });
          };

          $scope.openConfirmation = function () {
              var modalInstance = $modal.open({
                  animation: true,
                  templateUrl: 'newuser/deleteuserconfirm.html',
                  backdrop: 'static',
                  controller: deleteUserController,
                  size: 'sm',
                  resolve: { items: { title: "User" } }

              });

          }

          $scope.openBlockPopup = function () {
              var modalInstance = $modal.open({
                  animation: true,
                  templateUrl: 'newuser/block.tpl.html',
                  backdrop: 'static',
                  controller: BlockController,
                  size: 'lg',


              });
          };

          function clearFilters() {
              var gridData = $("#peopleGrid").data("kendoGrid");
              gridData.dataSource.filter({});
          }
      }
);