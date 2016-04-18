
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
                                 created_date: { type: "date" },
                                 budget: { type: "number" },
                                 bounces: { type: "number" },
                                 opens: { type: "number" },
                                 unsubscribes: { type: "number" },
                                 open_rate: { type: "number" }
                             }
                         }
                     }

            },
            groupable: true,
            sortable: true,
            selectable: "multiple",
            reorderable: true,
            resizable: true,
            filterable: false,
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
            }, {
                field: "name",
                title: "NAME",
                width: "180px",
                attributes:
                 {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
            }, {
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
            },
            {
                field: "conversion_rate",
                title: "CON.RATE",
                attributes:
                  {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
            },
             {
                 field: "bounces",
                 hidden: true,
                 title: "Bounces",
                 attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
             },
              {
                  field: "opens",
                  hidden: true,
                  title: "Opens",
                  attributes:
                    {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }
              },
               {
                   field: "unsubscribes",
                   hidden: true,
                   title: "Unsubscribes",
                   attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
               },
                {
                    field: "open_rate",
                    hidden: true,
                    title: "Open_rate",
                    attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                },
            {
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
                field: "status",
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
            $rootScope.selectedEvent = "89755882-e7f3-4e19-9070-7a0fb94d1a6f";
            $state.go('app.addEmailCampaign');
            //var modalInstance = $modal.open({
            //    animation: true,
            //    templateUrl: 'campaigns/campaigns.tpl.html',
            //    backdrop: 'static',
            //    controller: campaignsController,
            //    size: 'lg'
            //});
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


        // code by saroj on 18-04-2016 for view & JQL Query 
        var callViewApi = function () {

            apiService.getWithoutCaching('Notes/GetByOrgid/' + $cookieStore.get('orgID')).then(function (res) {
                $scope.views = _.filter(res.data, function (o)
                { return o.query_type === 'View' && o.grid_name === 'email' });
            }, function (err) {

            });
        }

        callViewApi();

        $scope.changeView = function () {
            if ($scope.gridView !== 'default') {
                //filter by grid name
                viewObj = _.filter($scope.views, function (o)
                { return o.id === $scope.gridView });

                //get the grid datasource
                var grid = $('#project-record-list').getKendoGrid();

                if (viewObj.sort_by) {//sort
                    var sort = [];
                    sort.push({ field: viewObj[0].sort_by, dir: viewObj[0].sort_order });
                    grid.dataSource.sort(sort);
                }


                var col = JSON.parse(viewObj[0].column_names);
                for (i = 0; i < grid.columns.length; i++) {
                    var colFlag = false;
                    for (j = 0; j < col.length; j++) {
                        if (col[j].field === grid.columns[i].field) {
                            if (!col[j].hidden) {
                                grid.showColumn(i);
                                colFlag = true;
                                break;
                            }
                        }
                        if (j === col.length - 1 && colFlag == false) {
                            grid.hideColumn(i);
                        }
                    }
                }

                // saroj on 14-04-2016
                // removing " " from string otherwise JQL will not work
                var str = viewObj[0].query_string;
                str = str.replace(/"/g, "");

                $scope.textareaText = str;
                grid.dataSource.filter(JSON.parse(viewObj[0].filters));
            }
            else {
                $('#project-record-list').getKendoGrid().dataSource.sort({});
                $('#project-record-list').getKendoGrid().dataSource.filter({});
                $scope.textareaText = null;
                for (i = 0; i < $('#project-record-list').getKendoGrid().columns.length; i++) {
                    $('#project-record-list').getKendoGrid().showColumn(i);

                }

            }

        }

        $scope.saveView = function () {
            var grid = $('#project-record-list').getKendoGrid();

            if (grid.dataSource._sort) {
                var sortObject = grid.dataSource._sort[0];
            }

            if ($scope.textareaText) {
                var Querydata = $scope.textareaText.toLowerCase();
            }
            //var colObject = _.filter(grid.columns, function (o)
            //{ return !o.hidden });
            //colObject = (_.pluck(colObject, 'field')).join(',');

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/Views/createView.html',
                backdrop: 'static',
                controller: createViewCtrl,
                size: 'sm',
                resolve: { viewData: { sort: sortObject, col: grid.columns, grid: 'email', type: 'View', filterQuery: Querydata, filterObj: grid.dataSource._filter } }
            });
        }


        $scope.editView = function () {
            if ($scope.gridView !== 'default') {
                var viewName = _.filter($scope.views, function (o)
                { return o.id == $scope.gridView });

                var grid = $('#project-record-list').getKendoGrid();

                if (grid.dataSource._sort) {
                    var sortObject = grid.dataSource._sort[0];
                }

                if ($scope.textareaText) {
                    var Querydata = $scope.textareaText.toLowerCase();
                }
                //var colObject = _.filter(grid.columns, function (o)
                //{ return !o.hidden });
                //colObject = (_.pluck(colObject, 'field')).join(',');

                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'contacts/Views/editView.html',
                    backdrop: 'static',
                    controller: editViewCtrl,
                    size: 'sm',
                    resolve: { viewData: { sort: sortObject, col: grid.columns, grid: 'email', type: 'View', filterQuery: Querydata, filterObj: grid.dataSource._filter, viewName: viewName[0].view_name, viewId: $scope.gridView, isViewDefault: viewName[0].default_view } }
                });
            }
            else {
                alert('Cannot edit this view');
            }
        }

        $scope.deleteView = function () {
            if ($scope.gridView !== 'default') {
                swal({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes, delete it!',
                    closeOnConfirm: false
                }).then(function (isConfirm) {
                    if (isConfirm) {
                        postData = { id: $scope.gridView, organization_id: $cookieStore.get('orgID') };
                        apiService.post('Notes/DeleteGridView', postData).then(function (res) {
                            $('#project-record-list').getKendoGrid().dataSource.filter({});
                            $scope.textareaText = ''
                            $scope.gridView = 'default';

                            swal(
                          'Deleted!',
                          'Your file has been deleted.',
                          'success'
                        );
                        }, function (err) {
                            swal(
                        'Not Deleted!',
                        'Something went wrong. Try again later.',
                        'error'
                      );
                        })
                    }
                })
            }
            else {
                alert('cannot delete this view')
            }
        }

        $scope.DoWork = function () {
            var txtdata = $scope.textareaText.toLowerCase();
            if (txtdata.text != '')
                $scope.callFilter();
        };

        $scope.callFilter = function () {
            if ($scope.textareaText == '') {
                alert('Please enter query');
                return;
            }
            var txtdata = $scope.textareaText.toLowerCase();
            var txtdata = txtdata;
            var Firstname = "";
            var ValidFilter = false;

            var filter = [];
            var abc = [];
            var logsplit = "";


            if (txtdata.length > 0) {

                var aryClause = txtdata.split(" order by ");
                var feild1 = "";
                var dir1 = "";
                if (aryClause.length >= 2) {
                    var arydir = "";
                    if (aryClause[1].split(" asc").length > aryClause[1].split(" desc").length) {

                        arydir = aryClause[1].split(" asc");
                        dir1 = "asc";
                        feild1 = arydir[0];
                    }
                    else if (aryClause[1].split(" desc").length >= 2) {

                        arydir = aryClause[1].split(" desc");
                        dir1 = "desc";
                        feild1 = arydir[0];
                    }
                    else {

                        ValidFilter = false;
                    }
                }

                if (txtdata.split(" and ").length > txtdata.split(" or ").length) {

                    filter = { logic: "and", filters: [] };
                    logsplit = txtdata.split(" and ");
                }
                else {
                    filter = { logic: "or", filters: [] };
                    logsplit = txtdata.split(" or ");
                }

                // alert("or split value =  " + logsplit.length);
                if (logsplit.length > 0) {


                    for (var j = 0; j < logsplit.length; j++) {
                        // alert("value for j is " + j);


                        var expEQ = logsplit[j].split(" = ");
                        var expIS = logsplit[j].split(" is ");

                        var expsplit = "";
                        if (expEQ.length > 1)
                            expsplit = expEQ;

                        if (expIS.length > 1)
                            expsplit = expIS;

                        var expSplitGTE = logsplit[j].split(" >= ");

                        var expSplitLTE = logsplit[j].split(" <= ");

                        // EQUAL TO CHECK 
                        if (expsplit.length > 1) {

                            if (expsplit[0].toUpperCase().trim() == "OPEN RATE")
                                Firstname = "open_rate";

                            if (expsplit[0].toUpperCase().trim() == "OPENS")
                                Firstname = "opens";

                            if (expsplit[0].toUpperCase().trim() == "BOUNCES")
                                Firstname = "bounces";

                            else if (expsplit[0].toUpperCase().trim() == "UNSUBSCRIBES")
                                Firstname = "unsubscribes";

                            if (expsplit[0].toUpperCase().trim() == "BUDGET")
                                Firstname = "budget";

                            else if (expsplit[0].toUpperCase().trim() == "REVENUE")
                                Firstname = "revenue";

                            else if (expsplit[0].toUpperCase().trim() == "CONVERSIONS")
                                Firstname = "conversion_rate";

                            filter.filters.push({ field: Firstname.trim(), operator: "eq", value: parseFloat(expsplit[1].trim()) });
                            ValidFilter = true;

                        }


                        // GREATER THAN EQUAL TO CHECK
                        if (expSplitGTE.length > 1) {

                            if (expSplitGTE[0].toUpperCase().trim() == "OPEN RATE")
                                Firstname = "open_rate";

                            if (expSplitGTE[0].toUpperCase().trim() == "OPENS")
                                Firstname = "opens";

                            if (expSplitGTE[0].toUpperCase().trim() == "BOUNCES")
                                Firstname = "bounces";

                            else if (expSplitGTE[0].toUpperCase().trim() == "UNSUBSCRIBES")
                                Firstname = "unsubscribes";

                            if (expSplitGTE[0].toUpperCase().trim() == "BUDGET")
                                Firstname = "budget";

                            else if (expSplitGTE[0].toUpperCase().trim() == "REVENUE")
                                Firstname = "revenue";

                            else if (expSplitGTE[0].toUpperCase().trim() == "CONVERSIONS")
                                Firstname = "conversion_rate";

                            filter.filters.push({ field: Firstname.trim(), operator: "gte", value: parseFloat(expSplitGTE[1].trim()) });
                            ValidFilter = true;
                        }

                        // LESSER THAN EQUAL TO CHECK
                        if (expSplitLTE.length > 1) {

                            if (expSplitLTE[0].toUpperCase().trim() == "OPEN RATE")
                                Firstname = "open_rate";

                            if (expSplitLTE[0].toUpperCase().trim() == "OPENS")
                                Firstname = "opens";

                            if (expSplitLTE[0].toUpperCase().trim() == "BOUNCES")
                                Firstname = "bounces";

                            else if (expSplitLTE[0].toUpperCase().trim() == "UNSUBSCRIBES")
                                Firstname = "unsubscribes";

                            if (expSplitLTE[0].toUpperCase().trim() == "BUDGET")
                                Firstname = "budget";

                            else if (expSplitLTE[0].toUpperCase().trim() == "REVENUE")
                                Firstname = "revenue";

                            else if (expSplitLTE[0].toUpperCase().trim() == "CONVERSIONS")
                                Firstname = "conversion_rate";

                            filter.filters.push({ field: Firstname.trim(), operator: "lte", value: parseFloat(expSplitLTE[1].trim()) });
                            ValidFilter = true;
                        }


                    } //for loop 
                } // if loop
            } //if loop MAIN


            // final code to get execute....

            if (Firstname == "") {
                alert("Invalid Query.");
                return;
            }

            if (ValidFilter == true) {

                var dsSort = [];
                dsSort.push({ field: feild1, dir: dir1 });
                //  dsSort.push({ field: "budget", dir: "desc" });
                //ds.dataSource.sort(dsSort);
                // var ds = $('#project-record-list').getKendoGrid().dataSource.sort(dsSort);
                var ds = $('#project-record-list').getKendoGrid().dataSource;
                ds.filter(filter);
                ds.sort(dsSort);
            }
            else {
                alert("Please Check Query.");
            }
        }

        $scope.clearFilter = function () {
            $('#project-record-list').getKendoGrid().dataSource.filter({});
            $scope.textareaText = ''
            $scope.gridView = 'default';
        }


        // end
    });

