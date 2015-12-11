
/**
 * Created by dwellarkaruna on 27/10/15.
 */

angular.module('project')
    .controller('projectListController' ,
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope) {

        $rootScope.title = 'Dwellar./Projects';
       // console.log('projectListController');

     //   var loginSession1;
        var orgID = $cookieStore.get('orgID');
        //$scope.delete1 = function (id) {
        //    apiService.remove('team/Delete/' + id).then(function (response) {
        //        $scope.loginSession2 = response.data;
        //        //alert('Login Session : ' + loginSession.user_id);
        //        $state.go('loggedIn.modules.team');

        //    },
        //          function (error) {
        //              //alert('Hi1');
        //              // deferred.reject(error);
        //              return deferred.promise;
        //          });

        //};

        //var j = 0;
        //$scope.editnew = function (id) {
        //    $cookieStore.put('teamid', id);
        //    apiService.get('team/Get?orgid=' + orgID).then(function (response) {
        //        $scope.loginSession2 = response.data;
        //        //alert('Login Session : ' + loginSession.user_id);
        //        $state.go('loggedIn.modules.team.add_new');

        //    },
        //     function (error) {
        //         alert('Hi5');
        //         // deferred.reject(error);
        //         return deferred.promise;
        //     });
        //};
        //apiService.get('team/Get?orgid=' + orgID).then(function (response) {
        //    $scope.loginSession1 = response.data;
        //    //alert('Login Session : ' + loginSession.user_id);
        //},



    //function (error) {
    //    alert('Hi3');
    //    // deferred.reject(error);
    //    return deferred.promise;
    //});

        $scope.goAddNew = function () {
            $cookieStore.put('projectid', '');
            $state.go('app.projects.add_new_project');
        };
        //$scope.goEdit = function () {
        //    $state.go('loggedIn.modules.team.update');
        //};

        //Audit log start
        $scope.params = {

            device_os: "windows10",
            device_type: "mobile",
            device_mac_id: "34:#$::43:434:34:45",
            module_id: "Project",
            action_id: "Project View",
            details: "Project detail",
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

        // Kendo code
       // alert(orgID);
        $scope.mainGridOptions = {
            dataSource: {
                type: "json",
                transport: {
                    read: "http://dw-webservices-dev.azurewebsites.net/Project/GetCount/" + orgID
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
                buttonCount: 5
            },
            columns: [
                {
                    //template: "<img height='40px' width='40px' src='#= Project_image #'/>" +
                    //"<span style='padding-left:10px' class='property-photo'> </span>",
                    template: "<input type='checkbox' class='checkbox' ng-click='onClick($event)' />",
                    title: "COLUMN",
                    width: "60px",
                    attributes: {
                        "class": "UseHand",

                    }
                },

                 {
                     template: "<img height='40px' width='40px' src='#= Project_image #'/>" +
                     "<span style='padding-left:10px' class='property-photo'> </span>",
                     title: "Logo",
                     width: "120px",
                     attributes: {
                         "class": "UseHand",

                     }
                 },

               {
                   //  template: "<img height='40px' width='40px'  class='user-photo' src='assets/images/image-2.jpg' />" +
                   //"<span style='padding-left:10px' class='customer-name'>#: first_name #</span>",


                   field: "name",
                   title: "Name",
                   width: "120px",
                   attributes: {
                       "class": "UseHand",

                   }
               }, {
                   field: "Description",
                   title: "Location",
                   width: "120px",
                   attributes: {
                       "class": "UseHand",

                   }
               },{
                   field: "ProjectUserCnt",
                   title: "Unit Types",
                   width: "120px",
                   attributes: {
                       "class": "UseHand",

                   }
               },
                {
                   field: "ProjectTeamCnt",
                   title: "Total Units",
                   width: "120px",
                   attributes: {
                       "class": "UseHand",

                   }
               }, {
                   field: "Property_count",
                   title: "Available Units",
                   width: "120px",
                   attributes: {
                       "class": "UseHand",

                   }
               }, {
                   field: "People_count",
                   title: "Area",
                   width: "120px",
                   attributes: {
                       "class": "UseHand",

                   }
               }, {
                   field: "Task_count",
                   title: "Price",
                   width: "120px",
                   attributes: {
                       "class": "UseHand",

                   }
               }]
        };
        //$scope.Fruits = [{
        //    Id: 1,
        //    Name: 'ACTIONS'
        //}, {
        //    Id: 2,
        //    Name: 'DELETE'
        //}, {
        //    Id: 3,
        //    Name: 'EDIT'
        //}
        //];

        //$scope.GetValue = function (fruit) {

        //    var fruitId = $scope.ddlFruits;
        //    var fruitName = $.grep($scope.Fruits, function (fruit) {
        //        return fruit.Id == fruitId;
        //    })[0].Name;

        //    $cookieStore.put('Selected Text', fruitName);
        //    // $window.alert("Selected Value: " + fruitId + "\nSelected Text: " + fruitName);
        //}

        // Kendo Grid on change
        $scope.myGridChange = function (dataItem) {
            // dataItem will contain the row that was selected
            window.sessionStorage.selectedCustomerID = dataItem.id;
          //  alert(window.sessionStorage.selectedCustomerID);
            $state.go('app.projectdetail');

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
        function clearFilters() {
            var gridData = $("#peopleGrid").data("kendoGrid");
            gridData.dataSource.filter({});
        }
    }
);

