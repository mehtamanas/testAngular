angular.module('campaigns')
.controller('campaignsDetailController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope, $window) {
        console.log('campaignsDetailController');
        var orgID = $cookieStore.get('orgID');
        var userID = $cookieStore.get('userId');
        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
        $scope.campaignAction = 'no_action';


        //Audit log start               
        AuditCreate = function () {
            var postdata =
           {
               device_os: $cookieStore.get('Device_os'),
               device_type: $cookieStore.get('Device'),
               //device_mac_id: "34:#$::43:434:34:45",
               module_id: "Contact",
               action_id: "Contact View",
               details: "Campaign Grid",
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
                if (error.status === 400)
                    alert(error.data.Message);
                else
                    alert("Network issue");
            });
        };
        AuditCreate();

        //end


        //grid fuctionality start
        $scope.projectGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "CampaignEvent/GetCampaignGrid?id=" + orgID + "&type=Email"

                },
                pageSize: 20,
                schema:
                     {
                         model: {
                             fields: {

                                 start_date1: { type: "date" },
                                 created_date: { type: "date" }


                             }
                         }
                     }

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
                template: "<input type='checkbox', class='checkbox', data-id='#= campaign_ID #',  ng-click='check($event,dataItem)' />",
                title: "<input id='checkAll', type='checkbox', class='check-box', ng-click='checkALL(dataItem)' />",
                width: "60px",
                attributes:
                 {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
            },{
                   field: "name",
                   title: "NAME",
                   width: "180px",
                   attributes:
                    {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }
                 },{
                   field: "channel_type_name",
                   title: "CHANNEL",
                   width: "120px",
                   attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
                   }, {
                       field: "budget",
                       title: "Budget",
                       attributes:
                         {
                             "class": "UseHand",
                             "style": "text-align:center"
                         }
                   }, {
                       field: "spent",
                       title: "SPENT",

                       attributes:
                        {
                            "class": "UseHand",
                            "style": "text-align:center"
                        }
                   }, {
                       field: "clicks",
                       title: "CLICKS",

                       attributes:
                         {
                             "class": "UseHand",
                             "style": "text-align:center"
                         }
                   }, {
                       field: "conversion_rate",
                       title: "CON.RATE",

                       attributes:
                         {
                             "class": "UseHand",
                             "style": "text-align:center"
                         }
                   }, {
                       field: "no_of_leads",
                       title: "LEAD",

                       attributes: {
                           "class": "UseHand",
                           "style": "text-align:center"
                       }
                   }, {
                       field: "created_date",
                       title: "Created Date",
                       width: "200px",
                       format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                       attributes: {
                           "class": "UseHand",
                           "style": "text-align:center"
                       }
                   }, {
                       field: "start_date1",
                       title: "Start Date",
                       width: "200px",
                       format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                       attributes: {
                           "class": "UseHand",
                           "style": "text-align:center"
                       }
                   }, {
                       field:"status",
                       template: '<span id="#= status #"></span>',
                       title: "STATUS",
                       width: "120px",
                       attributes: {
                           "class": "UseHand",
                           "style": "text-align:center"
                       }
                   }, {                       
                       template: '#if (status=="Completed") {# <a class="btn btn-primary" id="launch_now" ng-click="openLaunch(dataItem)">Relaunch</a> #}#',
                       title: "ACTION",
                       width: "120px",
                       attributes: {
                           "class": "UseHand",
                           "style": "text-align:center"
                       },

                   }

            ]
        };

        $scope.chooseAction = function () {
            var allGridElements = $(".checkbox").toArray();
            var allCheckedElement = _.filter(allGridElements, function (o)
            { return o.checked });
            allCheckedIds = (_.pluck(allCheckedElement, 'dataset.id'));
            $cookieStore.remove('checkedIds');
            $cookieStore.put('checkedIds', allCheckedIds);

            if (allCheckedIds.length > 0) {

                if ($scope.campaignAction === "no_action") {

                }
                else if ($scope.campaignAction === "add_tag") {
                    $state.go($scope.tagOptionPopup());
                }
                else if ($scope.campaignAction === "assign_to") {
                    $state.go($scope.assignToUpPopup());
                }
                else if ($scope.campaignAction === "delete") {
                    var campaignDelete = [];
                    for (var i in allCheckedIds) {
                        var contact = {};
                        contact.id = allCheckedIds[i];
                        contact.organization_id = $cookieStore.get('orgID');
                        campaignDelete.push(contact);
                    }
                    $cookieStore.put('contactDelete', campaignDelete);
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


        $scope.openConfirmation = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'campaigns/delete/confirmCampiagn.html',
                backdrop: 'static',
                controller: confirmCampiagnCtrl,
                size: 'sm',
                resolve: { items: { title: "Campigans" } }

            });

        }

        $scope.changeGridChange = function (dataItem) {
            window.sessionStorage.selectedCustomerID = dataItem.campaign_ID;
            $state.go('app.campaign_statistics');


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
        function clearFilters() {
            var gridData = $("#peopleGrid").data("kendoGrid");
            gridData.dataSource.filter({});
        }

        $scope.$on('REFRESH', function (event, args) {
            if (args == 'projectGrid') {
                $('.k-i-refresh').trigger("click");
            }
            $scope.campaignAction = 'no_action';
        });


        $scope.openCampaignsPopUp = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'campaigns/campaigns.tpl.html',
                backdrop: 'static',
                controller: campaignsController,
                size: 'lg'
            });
        };

        $scope.openLaunch = function (id) {
            var campaign_ID = id.campaign_ID;
            $cookieStore.put('campaign_ID', campaign_ID);
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'campaigns/emailCampaign/emailLaunch.tpl.html',
                backdrop: 'static',
                controller: emialLaunchController,
                size: 'sm'
            });
        };

    });

