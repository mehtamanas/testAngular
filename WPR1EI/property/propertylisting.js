angular.module('property')



.controller('PropertyListingController',
    function ($scope, $state, security, $cookieStore, apiService, $rootScope, $modal) {

        var orgID = $cookieStore.get('orgID');

        $rootScope.title = 'Dwellar./Properties';

        var userId = $cookieStore.get('userId');
       

        $('#btnSave').hide();
        $('#iconEdit').hide();
        $('#btnAdd').hide();



        security.isAuthorized().then(function (response) {
            nav = response;
            console.log(nav);
            if (nav.length > 0) {

                for (i = 0; i < nav.length; i++) {
                    if (nav[i].resource === "Projects")  $rootScope.projects = nav[i];
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



            if ($rootScope.property.write) {
                $('#btnSave').show();
                $('#iconEdit').show();
                $('#btnAdd').show();
            }



        });

         $scope.TowerListGrid = {
       // $scope.mainGridOptions = {


            dataSource: {
                type: "json",
                transport: {

                    //read: apiService.baseUrl +"UnitTypes/GetTowerunitpropertiesall/bcd0a0ad-68c2-4a96-9498-c1a19e429f53"
                    read: apiService.baseUrl +"UnitTypes/GetTowerunitpropertiesall/" + userId
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
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: [
                {
                    //template: "<img height='40px' width='40px' src='#= Project_image #'/>" +
                    //"<span style='padding-left:10px' class='property-photo'> </span>",
                    template: " <input type='checkbox' , class='checkbox', data-id='#= name #', ng-click='propertySelected($event,dataItem)'  />",
                    title: "<input id='checkAll', type='checkbox', class='check-box' ng-click='submit(dataItem)' />",
                    width: "60px",
                    attributes: {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }
                },

                {
                    template: "<img height='40px' width='40px' src='#= Image_Url_Unit1 #'/>" +
                    "<span style='padding-left:10px' class='property-photo'> </span>",
                    title: "Photo",
                    width: "120px",
                    attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                },
               
                {
                    field: "tower_name",
                    title: "NAME",
                    width: "120px",
                    attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
                },
             {
                 field: "floorno",
                 title: "FLOOR NO",
                 width: "120px",
                 attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
             },
              {
                  field: "unitno",
                  title: "UNIT NO",
                  width: "120px",
                  attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
              },
              {
                  field: "carpark",
                  title: "CAR PARK",
                  width: "120px",
                  attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
              },
              {
                  field: "num_bedrooms",
                  title: "BEDROOMS",
                  width: "120px",
                  attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
              },
            {
                field: "num_bathrooms",
                title: "BATHROOMS",
                width: "120px",
                attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
            },
            {
                field: "super_built_up_area",
                type: "number",
                title: "SLB. AREA",
                width: "120px",
                attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
            },
              {
                  field: "carpet_area",
                  type: "number",
                  title: "CRP AREA",
                  width: "120px",
                  attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
              },
               {
                   field: "total_consideration",
                   title: "PRICE",
                   width: "120px",
                   attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
               },
                {
                    field: "project_name",
                    title: "PROJECT",
                    width: "120px",
                    attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
                },
            {
               
                field: "available_status",
                title: "STATUS",
                width: "120px",
                attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
            }]

        };


        //Audit log start															
        $scope.params =
            {
                device_os: $cookieStore.get('Device_os'),
                device_type: $cookieStore.get('Device'),
                device_mac_id: "34:#$::43:434:34:45",
                module_id: "Contact",
                action_id: "Contact View",
                details: "PropertyView",
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
       function (error)
       {
           if (error.status === 400)
               alert(error.data.Message);
           else
               alert("Network issue");
       });
        };
        AuditCreate($scope.params);

        //end


        // Kendo Grid on change
        $scope.myGridChange = function (dataItem) {
            // dataItem will contain the row that was selected

            
            window.sessionStorage.selectedCustomerID = dataItem.id;
            //$state.go('app.propertydetail');


        };



        $scope.submit = function (e) {

            if ($('.check-box:checked').length > 0)
                $('.checkbox').prop('checked', true);
            else
                $('.checkbox').prop('checked', false);
        }

        $scope.propertySelected = function (e, data) {
            console.log(e);
            var element = $(e.currentTarget);
            var checked = element.is(':checked')
            row = element.closest("tr")
            var id = data.tower_id;
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

        $scope.GetValue = function (fruit) {

            var fruitId = $scope.ddlFruits;
            var fruitName = $.grep($scope.Fruits, function (fruit) {
                return fruit.Id == fruitId;
            })[0].Name;

            $cookieStore.put('Selected Text', fruitName);
            // $window.alert("Selected Value: " + fruitId + "\nSelected Text: " + fruitName);
        //    alert("hiii");



        }

        $scope.soldProperty = function () {

            var usersToBeAddedOnServer = [];
            $cookieStore.remove('checkedIds');
            $cookieStore.put('checkedIds', $scope.checkedIds);
            // Add the new users
            for (var i in $scope.checkedIds) {
                var newMember = {};
                newMember.id = $scope.checkedIds[i];
                newMember.organization_id = $cookieStore.get('orgID');
                newMember.available_status = 1;
             
                usersToBeAddedOnServer.push(newMember);
            }

            if (usersToBeAddedOnServer.length == 0) {
                return;
            }



            apiService.post("Floors/StatusChange", usersToBeAddedOnServer).then(function (response) {
                var loginSession = response.data;
          
                $scope.openSucessfullPopup();
            //    $modalInstance.dismiss();
                $rootScope.$broadcast('REFRESH', 'TowerListGrid');


            },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    });

            $scope.openSucessfullPopup = function () {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'property/sold.html',
                    backdrop: 'static',
                    controller: SoldController,
                    size: 'md',
                    resolve: { items: { title: "Property " } }

                });
                $rootScope.$broadcast('REFRESH', 'TowerListGrid');
            }
        }

        $scope.Fruits = [{
            Id: 1,
            Name: 'SOLD'

        }];
        $scope.checkedIds = [];
        $scope.showCheckboxes = function () {


            for (var i in $scope.checkedIds) {

               alert($scope.checkedIds[i]);
            }
        };

        $scope.$on('REFRESH', function (event, args) {
            if (args == 'TowerListGrid') {
                $('.k-i-refresh').trigger("click");
            }
            $scope.ddlFruits = "ACTION";
        });
     
      
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


        function clearFilters() {
            var gridData = $("#peopleGrid").data("kendoGrid");
            gridData.dataSource.filter({});
        }

        $scope.openPropertyPopup = function () {
            // alert("hi");
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'property/add_new_property.tpl.html',
                backdrop: 'static',
                controller: PropertyPopUpController,
                size: 'md'
            });
        };
    }

);