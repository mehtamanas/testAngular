
/**
 * Created by dwellarkaruna on 27/10/15.
 */
angular.module('project')
    .controller('projectListController' ,
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope)
    {
          $rootScope.title = 'Dwellar-Projects';
          var userID = $cookieStore.get('userId');
          var organization_id = $cookieStore.get('orgID');
          //alert($cookieStore.get('userId'));


        //code for login permissions
          if (!$rootScope.projects.write) {
              $('#btnSave').hide();
              $('#iconEdit').hide();
              $('#btnAdd').hide();
          }
           

                    var orgID = $cookieStore.get('orgID');
                    $scope.goAddNew = function ()
                    {
                        $cookieStore.put('projectid', '');
                        $state.go('app.projects.add_new_project');
                    };
        //end

        //Audit log start               
        
                   
                  AuditCreate = function () {
                        var postdata =
                       {
                           device_os: $cookieStore.get('Device_os'),
                           device_type: $cookieStore.get('Device'),
                           module_id: "Project",
                           action_id: "Project View",
                           details: "ProjectView",
                           application: "angular",
                           browser: $cookieStore.get('browser'),
                           ip_address: $cookieStore.get('IP_Address'),
                           location: $cookieStore.get('Location'),
                           organization_id: $cookieStore.get('orgID'),
                           User_ID: $cookieStore.get('userId')
                       };


                        apiService.post("AuditLog/Create", postdata).then(function (response) {
                            var loginSession = response.data;
                        },
                   function (error) {
                      
                   });
                  };
                  AuditCreate();
            //end

       //grid fuctionality start
        $scope.projectGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "Organization/GetProjectDetails?id=" + userID
    
                },
                pageSize: 20
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
                    template: " <input type='checkbox' , class='checkbox', data-id='#= name #', ng-click='projectSelected($event,dataItem)'  />",
                    title: "<input id='checkAll', type='checkbox', class='check-box' ng-click='submit(dataItem)'  />",
                    width: "60px",
                    attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                    }
                },

                 {
                     template: "<img height='40px' width='40px' src='#= project_image #'/>" +
                     "<span style='padding-left:10px' class='property-photo'> </span>",
                     title: "Logo",
                     width: "120px",
                     attributes:
                       {
                           "class": "UseHand",
                           "style": "text-align:center"
                       }
                 },
               {
                   field: "name",
                   title: "NAME",
                   width: "120px",
                   attributes:
                    {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }
               }, {
                   field: "address",
                   title: "LOCATION",
                   width: "120px",
                   attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
               },{
                   field: "unitTypes",
                   title: "UNIT TYPES",
                   width: "120px",
                   attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
               },
                {
                    field: "unitCount",
                   title: "TOTAL UNITS",
                   width: "120px",
                   attributes:
                    {
                        "class": "UseHand",
                        "style": "text-align:center"
                   }
               }, {
                   field: "available",
                   title: "AVAILABLE UNITS",
                   width: "120px",
                   attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
               }, {
                   field: "area",
                   title: "AREA",
                   width: "120px",
                   attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
               },

               {
                   field: "possession_date",
                   title: "POSSESSION DATE",
                   width: "120px",
                   attributes: {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
               },
               
               {
                   field: "price",
                   title: "PRICE",
                   width: "120px",
                   attributes: {
                       "class": "UseHand",
                       "style": "text-align:center"

                   },

               }]
        };

        // Kendo Grid on change
        $scope.myGridChange = function (dataItem) {
            // dataItem will contain the row that was selected
            window.sessionStorage.selectedCustomerID = dataItem.id;
          //  alert(window.sessionStorage.selectedCustomerID);
            $state.go('app.projectdetail');

        };

        $scope.myGridChange = function (dataItem) {
            // dataItem will contain the row that was selected
            window.sessionStorage.selectedCustomerID = dataItem.id;
            //  alert(window.sessionStorage.selectedCustomerID);
            //$state.go('app.projectdetail');
            if ($cookieStore.get('projectId') === undefined)
                $cookieStore.put('projectId', dataItem.id);
            else {
                $cookieStore.remove('projectId');
                $cookieStore.put('projectId', dataItem.id);
            }
            $state.go('app.projectdetail');

        };


        
          $scope.submit = function (e) {

              if ($('.check-box:checked').length > 0)
                  $('.checkbox').prop('checked', true);
              else
                  $('.checkbox').prop('checked', false);
          }

        //for delete project And multiple select checkbox

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
              var id = data.id;
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
                  newMember.project_id = $scope.checkedIds[i];
                  newMember.organization_id = $cookieStore.get('orgID');

                  usersToBeAddedOnServer.push(newMember);
              }

              if (usersToBeAddedOnServer.length == 0) {
                  return;
              }



              apiService.post("Project/DeleteMultipleProject", usersToBeAddedOnServer).then(function (response) {
                  var loginSession = response.data;
                  $scope.openSucessfullPopup();
                  $rootScope.$broadcast('REFRESH', 'projectGrid');
            

              },
      function (error) {
          if (error.status === 400)
              alert(error.data.Message);
          else
              alert("Network issue");
      });

              $scope.openSucessfullPopup = function ()
              {
                  var modalInstance = $modal.open({
                      animation: true,
                      templateUrl: 'newuser/delete.html',
                      backdrop: 'static',
                      controller: DeleteController,
                      size: 'md',
                      resolve: { items: { title: "Project " } }

                  });
                  $rootScope.$broadcast('REFRESH', 'projectGrid');
              }
          }

          $scope.Fruits = [{
              Id: 1,
              Name: 'DELETE'
          
          }];
          $scope.checkedIds = [];
          $scope.showCheckboxes = function () {


              for (var i in $scope.checkedIds) {

                  // alert($scope.checkedIds[i]);
              }
          };



        $scope.filterNow = function () {
            if ($scope.lastNameFilter)
                applyFilter('first_name', $scope.lastNameFilter);
            else
                clearFilters();

        };


        $scope.$on('REFRESH', function (event, args) {
            if (args == 'projectGrid') {
                $('.k-i-refresh').trigger("click");
            }
            $scope.ddlFruits = "ACTION";
        });

        $scope.openProjectPopup = function () {
           // alert("hi");
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/add_new_project.tpl.html',
                backdrop: 'static',
                controller: ProjectPopUpController,
                size: 'md'
            });
        };
       
    }
);

