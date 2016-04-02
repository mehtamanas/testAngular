angular.module('newuser')
.controller('newuserController',
      function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope) {
          console.log('TeamListController');
          $rootScope.title = 'Dwellar./Users';

          var userID = $cookieStore.get('userId');

          //alert($cookieStore.get('userId'));


          $('#btnSave').hide();
          $('#iconEdit').hide();
          $('#btnAdd').hide();



          security.isAuthorized().then(function (response) {
              nav = response;
              console.log(nav);
              if (nav.length > 0) {

                  for (i = 0; i < nav.length; i++) {
                      if (nav[i].resource === "Projects") {
                          $rootScope.projects = nav[i];

                      }
                      if (nav[i].resource === "Users") $rootScope.users = nav[i];
                      if (nav[i].resource === "Teams") $rootScope.teams = nav[i];

                      if (nav[i].resource === "Billing") $rootScope.billing = nav[i];
                      if (nav[i].resource === "Contacts") $rootScope.contacts = nav[i];
                      if (nav[i].resource === "Organization") $rootScope.organization = nav[i];
                      if (nav[i].resource === "Channel Partners") $rootScope.channelPartners = nav[i];
                      if (nav[i].resource === "Audit Trail") $rootScope.auditTrail = nav[i];
                      if (nav[i].resource === "Reports") $rootScope.reports = nav[i];
                      if (nav[i].resource === "Builders") $rootScope.support = nav[i];
                      if (nav[i].resource === "Notifications") $rootScope.notifications = nav[i];
                      if (nav[i].resource === "Support") $rootScope.support = nav[i];
                      if (nav[i].resource === "Property") $rootScope.property = nav[i];
                      if (nav[i].resource === "Shared Listings") $rootScope.sharedListings = nav[i];
                      if (nav[i].resource === "Campaigns") $rootScope.campaigns = nav[i];
                      if (nav[i].resource === "Tasks") $rootScope.tasks = nav[i];

                  }
              }



              if ($rootScope.users.write) {
                  event.preventDefault();
                  $('#btnSave').show();
                  $('#iconEdit').show();
                  $('#btnAdd').show();
              }



          });



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






          $scope.GetValue = function (fruit) {

              var fruitId = $scope.ddlFruits;
              var fruitName = $.grep($scope.Fruits, function (fruit) {
                  return fruit.Id == fruitId;
              })[0].Name;

              $cookieStore.put('Selected Text', fruitName);
              // $window.alert("Selected Value: " + fruitId + "\nSelected Text: " + fruitName);




          }

          $scope.addUser = function ()
          {

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

              if (usersToBeAddedOnServer.length == 0)
              {
                  return;
              }
              var Text = $cookieStore.get('Selected Text');
              if ($cookieStore.get('Selected Text') == "ASSIGN TO PROJECT") {
                  $state.go($scope.optionPopup());
                  $state.go($scope.openSucessfullPopup())
              }
              else if ($cookieStore.get('Selected Text') == "ASSIGN ROLES") {
                  $state.go($scope.optionPopup())

              }
              else if ($cookieStore.get('Selected Text') == "ADD TO TEAM") {

                  $state.go($scope.optionPopup())

              }
              else if ($cookieStore.get('Selected Text') == "INACTIVE") {
                  apiService.post("User/StatusChange", usersToBeAddedOnServer).then(function (response) {
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
              height: screen.height - 370,
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
                  template: "<input type='checkbox', class='checkbox', data-id='#= account_email #',  ng-click='onClick($event)' />",
                  title: "<input id='checkAll', type='checkbox', class='check-box', ng-click='submit(dataItem)' />",
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
              }]
          };

          $scope.Fruits = [ {
              Id: 2,
              Name: 'INACTIVE',
             
          //}, {
          //    Id: 3,
          //    Name: 'ADD TO TEAM'
          //}, {
          //    Id: 4,
          //    Name: 'ASSIGN TO PROJECT'
              //
          }, {
              Id: 3,
              Name: 'ASSIGN ROLES',
             
          }
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

          $scope.onClick = function (e) {
              var allListElements = $(".checkbox").toArray();
              for (var i in allListElements) {
                  if (!allListElements[i].checked){
                      $('#checkAll').prop('checked', false);
                      break;
                  }
                  if (i == allListElements.length-1)
                      $('#checkAll').prop('checked', true);
              }
              var element = $(e.currentTarget);
              var checked = element.is(':checked')
              row = element.closest("tr")
              var id = $(e.target).data('id');
              var fnd = 0;
              var allListElements = $(".checkbox");
              for (var i in $scope.checkedIds) {
                  if(id== $scope.checkedIds[i])
                  {
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

          function RefreshGrid() {
              setInterval(function () {
                  $('peopleGrid').data("kendoGrid").dataSource.transport.read();
              }, refreshInterval);


          }
          $scope.$on('REFRESH', function (event, args) {
              if (args == 'mainGridOptions') {
                  $('.k-i-refresh').trigger("click");
              }
              $scope.ddlFruits = "ACTION";
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

          $scope.openBlockPopup = function () {
              var modalInstance = $modal.open({
                  animation: true,
                  templateUrl: 'newuser/block.tpl.html',
                  backdrop: 'static',
                  controller: BlockController,
                  size: 'lg',


              });
          };

          //$scope.openInactivePopup = function () {
          //    var modalInstance = $modal.open({
          //        animation: true,
          //        templateUrl: 'newuser/inactive.html',
          //        backdrop: 'static',
          //        controller: InactiveController,
          //        size: 'md',


          //    });
          //};


          function clearFilters() {
              var gridData = $("#peopleGrid").data("kendoGrid");
              gridData.dataSource.filter({});
          }
      }
);