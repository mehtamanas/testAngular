angular.module('newuser')




.controller('newuserController',
      function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope) {
          console.log('TeamListController');
          $rootScope.title = 'Dwellar./Teams';


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

          $scope.optionPopup = function () {
              var modalInstance = $modal.open({
                  animation: true,
                  templateUrl: 'newuser/option.html',
                  backdrop: 'static',
                  controller: OptionPopUpController,
                  size: 'md'
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

              var Text = $cookieStore.get('Selected Text');
              if ($cookieStore.get('Selected Text') == "Assign to project") {
                  $state.go($scope.optionPopup());
              }
              else if ($cookieStore.get('Selected Text') == "Assign Roles") {
                  $state.go($scope.optionPopup())

              }
              else if ($cookieStore.get('Selected Text') == "Add To Team") {

                  $state.go($scope.optionPopup())

              }
              else if ($cookieStore.get('Selected Text') == "Block") {
                  apiService.post("User/StatusChange", usersToBeAddedOnServer).then(function (response) {
                      var loginSession = response.data;
                      alert(" Done...");
                  },
      function (error) {

      });
              }
          }



          var orgID = $cookieStore.get('orgID');
     //     alert(orgID);
          $scope.mainGridOptions = {
              dataSource: {
                  type: "json",
                  transport: {
                      read: "http://dw-webservices-dev2.azurewebsites.net/User/GetCount/" + orgID
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
                  buttonCount: 10
              },


              columns: [{

                  //template: "<input type='checkbox' class='checkbox' ng-click='onClick($event)' />"
                  template: "<input type='checkbox' data-id='#= account_email #'  class='checkbox' ng-click='onClick($event)' />",
                  width:"60px"
              },

                    {
                        field: "first_name",
                        title: "Name",

                        width: "100px",
                        attributes: {
                            "class": "UseHand",

                        }
                    },
      {
          field: "account_email",
          title: "Email",
          width: "100px",

          attributes: {
              "class": "UseHand",

          }

      },

               {
                   field: "Role_name",
                   title: "Role",
                   width: "80px",

                   attributes: {
                       "class": "UseHand",

                   }

               },

              {
                  field: "Project_count",
                  title: "Projects",
                  width: "100px",

                  attributes: {
                      "class": "UseHand",

                  }

              },
              {
                  field: "Team_count",
                  title: "Teams",
                  width: "100px",
                  attributes: {
                      "class": "UseHand",

                  }

              },
              {
                  field: "Property_count",
                  title: "Property Listings",
                  width: "100px",
                  attributes: {
                      "class": "UseHand",

                  }

              },
             {
                 field: "People_count",
                 title: "People",
                 width: "100px",
                 attributes: {
                     "class": "UseHand",

                 }

             },
              {
                  field: "Task_count",
                  title: "Tasks",
                  width: "100px",
                  attributes: {
                      "class": "UseHand",
                  }

              }]
          };
          $scope.Fruits = [{
              Id: 1,
              Name: 'Block'
          }, {
              Id: 2,
              Name: 'Inactivate'
          }, {
              Id: 3,
              Name: 'Add To Team'
          }, {
              Id: 4,
              Name: 'Assign to project'
          }, {
              Id: 5,
              Name: 'Assign Roles'
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
                  if(id== $scope.checkedIds[i])
                  {
                      $scope.checkedIds.splice(i,1);
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



          // Kendo code
          //$scope.mainGridOptions = {
          //    dataSource: {
          //        type: "json",
          //        transport: {
          //            read: "https://dw-webservices-dev2.azurewebsites.net/Team/GetTeamDetails/" + orgID
          //        },
          //        pageSize: 5

          //        //group: {
          //        //    field: 'sport'
          //        //}
          //    },
          //    groupable: true,
          //    sortable: true,
          //    selectable: "multiple",
          //    reorderable: true,
          //    resizable: true,
          //    filterable: true,
          //    pageable: {
          //        refresh: true,
          //        pageSizes: true,
          //        buttonCount: 5
          //    },
          //    columns: [
          //                   {
          //                       //template: "<img height='40px' width='40px' src='assets/images/image-2.jpg' />" +
          //                       //"<span style='padding-left:10px' class='customer-name'>#: first_name #</span>",
          //                       field: "Name",
          //                       title: " Name",
          //                       width: "120px",
          //                       attributes: {
          //                           "class": "UseHand",

          //                       }
          //                   }, {
          //                       field: "User_Count",
          //                       title: "Users",
          //                       width: "120px",
          //                       attributes: {
          //                           "class": "UseHand",

          //                       }

          //                   }, {
          //                       field: "Project_Count",
          //                       title: "Projects",
          //                       width: "120px",
          //                       attributes: {
          //                           "class": "UseHand",

          //                       }

          //                   }, {
          //                       field: "Property_Count",
          //                       title: "Property Listings",
          //                       width: "120px",
          //                       attributes: {
          //                           "class": "UseHand",

          //                       }

          //                   }, {
          //                       field: "People_Count",
          //                       title: "People",
          //                       width: "120px",
          //                       attributes: {
          //                           "class": "UseHand",

          //                       }

          //                   }, {
          //                       field: "Task_Count",
          //                       title: "Tasks",
          //                       width: "120px",
          //                       attributes: {
          //                           "class": "UseHand",

          //                       }

          //                   }]
          //};

          // Kendo Grid on change
          $scope.myGridChange = function (dataItem) {
              // dataItem will contain the row that was selected
              window.sessionStorage.selectedCustomerID = dataItem.Id;
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
                  size: 'md'
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

                  size: 'md'
                  //resolve: {
                  //    uploadService: uploadService
                  //}
              });
          };


          function clearFilters() {
              var gridData = $("#peopleGrid").data("kendoGrid");
              gridData.dataSource.filter({});
          }
      }
);