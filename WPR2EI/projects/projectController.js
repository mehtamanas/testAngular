
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

          $scope.projectAction = 'no_action';

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



        $scope.chooseAction = function () {
                      var allGridElements = $(".checkbox").toArray();
                      var allCheckedElement = _.filter(allGridElements, function (o)
                      { return o.checked });
                      allCheckedIds = (_.pluck(allCheckedElement, 'dataset.id'));
                      $cookieStore.remove('checkedIds');
                      $cookieStore.put('checkedIds', allCheckedIds);

                      if (allCheckedIds.length > 0) {

                          if ($scope.projectAction === "no_action") {

                          }                         
                          else if ($scope.projectAction === "delete") {
                              var projectDelete = [];
                              for (var i in allCheckedIds) {
                                  var project = {};
                                  project.project_id = allCheckedIds[i];
                                  project.organization_id = $cookieStore.get('orgID');
                                  projectDelete.push(project);
                              }
                              $cookieStore.put('projectDelete', projectDelete);
                              $scope.openConfirmation();
                          }
                      }
                  }


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


        $scope.$on('REFRESH', function (event, args) {
            if (args == 'projectGrid') {
                $('.k-i-refresh').trigger("click");
            }
            $scope.projectAction = 'no_action';



        });

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
            height:screen.height - 370,
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
                    template: "<input type='checkbox', class='checkbox', data-id='#= id #',  ng-click='check($event,dataItem)' />",
                    title: "<input id='checkAll', type='checkbox', class='check-box', ng-click='checkALL(dataItem)' />",
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
                  
                  
                     attributes:
                       {
                           "class": "UseHand",
                           "style": "text-align:center"
                       }
                 },
               {
                   field: "name",
                   title: "NAME",
                 
                   attributes:
                    {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }
               }, {
                   field: "address",
                   title: "LOCATION",
               
                   attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
               },{
                   field: "unitTypes",
                   title: "UNIT TYPES",
                
                   attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
               },
                {
                    field: "unitCount",
                   title: "TOTAL UNITS",
               
                   attributes:
                    {
                        "class": "UseHand",
                        "style": "text-align:center"
                   }
               }, {
                   field: "available",
                   title: "AVAILABLE UNITS",
                
                   attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
               }, {
                   field: "area",
                   title: "AREA",
                
                   attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
               },

               {
                   field: "possession_date",
                   title: "POSSESSION DATE",
                 
                   attributes: {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
               },
               
               {
                   field: "price",
                   title: "PRICE",
                
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
                size: 'lg'
            });
        };
       

        $scope.openConfirmation = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/confirmproject.tpl.html',
                backdrop: 'static',
                controller: ProjectconfirmationController,
                size: 'sm',
                resolve: { items: { title: "Project" } }

            });

        }
    }
);

