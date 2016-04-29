
angular.module('campaigns')
.controller('campaignsDetailController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope, $window) {
        $scope.gridView = 'default';
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
            else if (args.name == 'ViewCreated') {
                $scope.views.push(args.data);//push new view into view list
                $scope.gridView = args.data.id; // select currently created view in view list
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
        // for help 
        $scope.helpjqlpopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'campaigns/emailCampaign/Grammar_Email.html',
                backdrop: 'static',
                controller: helpjqlController,
                size: 'lg'
            });
        };

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
                //sss
                $scope.callFilter();
                //grid.dataSource.filter(JSON.parse(viewObj[0].filters));
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
                            $('#project-record-list').getKendoGrid().dataSource.sort({});
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
            if (txtdata != '')
                $scope.callFilter();
        };

        

        $scope.callFilter = function () {
            
          


            var txtdata = $scope.textareaText.toLowerCase();
            var txtdata = txtdata;
            var Firstname = "";
            var ValidFilter = false;
            var ValidClause = false;
            var filter = [];
            var abc = [];
            var logsplit = "";

            if (txtdata.length > 0) {

                var pos = txtdata.indexOf("order by");
                var aryClause = txtdata.split(" order by ");
                var feild1 = "";
                var dir1 = "";
                var fValue = "";

                if (pos >= 0) {
                    var arydir = "";
                    if (pos == 0) {

                        if (aryClause[0].split(" asc").length > aryClause[0].split(" desc").length) {
                            arydir = aryClause[0].split(" asc");
                            dir1 = "asc";
                            var arynewClause = arydir[0].split("order by ");
                            fValue = arynewClause[1].toUpperCase().trim();
                            ValidClause = true;
                        }
                        else if (aryClause[0].split(" desc").length >= 2) {
                            arydir = aryClause[0].split(" desc");
                            dir1 = "desc";
                            var arynewClause = arydir[0].split("order by ");
                            fValue = arynewClause[1].toUpperCase().trim();
                            ValidClause = true;
                        }
                        else {
                            ValidClause = false;
                            alert("Invalid Query.");
                            return;
                        }
                    }
                    else {
                        if (aryClause[1].split(" asc").length > aryClause[1].split(" desc").length) {
                            arydir = aryClause[1].split(" asc");
                            dir1 = "asc";
                            fValue = arydir[0].toUpperCase().trim();
                            ValidClause = true;
                        }
                        else if (aryClause[1].split(" desc").length >= 2) {
                            arydir = aryClause[1].split(" desc");
                            dir1 = "desc";
                            fValue = arydir[0].toUpperCase().trim();
                            ValidClause = true;
                        }
                        else {
                            ValidClause = false;
                            alert("Invalid Query.");
                            return;
                        }
                    }

                    if (ValidClause == true) {
                        if (fValue == "NAME")
                            feild1 = "name";
                        else if (fValue == "CHANNEL")
                            feild1 = "channel_type_name";
                        else if (fValue == "BUDGET")
                            feild1 = "budget";
                        else if (fValue == "SPENT")
                            feild1 = "spent";
                        else if (fValue == "CLICKS")
                            feild1 = "clicks";
                        else if (fValue == "CON.RATE")
                            feild1 = "conversion_rate";
                        else if (fValue == "LEAD")
                            feild1 = "no_of_leads";
                        else if (fValue == "CREATED DATE")
                            feild1 = "created_date";
                        else if (fValue == "START DATE")
                            feild1 = "start_date1";
                        else if (fValue == "STATUS")
                            feild1 = "status";
                    }
                }



                if (aryClause[0].split(" and ").length > aryClause[0].split(" or ").length) {

                    filter = { logic: "and", filters: [] };
                    logsplit = aryClause[0].split(" and ");
                }
                else {
                    filter = { logic: "or", filters: [] };
                    logsplit = aryClause[0].split(" or ");
                }



                var spiltOK = false;
                // alert("or split value =  " + logsplit.length);
                if (logsplit.length > 0) {
                    for (var j = 0; j < logsplit.length; j++) {
                        // alert("value for j is " + j);

                        var expsplitIsBefore = [];
                        var expsplitIsAfter = [];
                        var expsplitBetween = [];

                        var expsplitCONTAINS = [];
                        var expsplitDOESNOTCONTAINS = [];
                        var expsplitIN = [];
                        var expsplitNOTIN = [];
                        var expSplitGTE = [];
                        var expSplitLTE = [];
                        var expSplitGT = [];
                        var expSplitLT = [];
                        var expsplit = [];
                        var expsplitNOT = [];

                        if (spiltOK == false) {

                            var oplen = (" is before ").length;
                            var startpos = logsplit[j].indexOf(" is before ");
                            if (startpos >= 0) {
                                expsplitIsBefore[0] = logsplit[j].substr(0, startpos);
                                expsplitIsBefore[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }

                            //expsplitIsBefore = logsplit[j].split(" is before ");
                            //if (expsplitIsBefore.length > 2)
                        }

                        if (spiltOK == false) {

                            var oplen = (" is after ").length;
                            var startpos = logsplit[j].indexOf(" is after ");
                            if (startpos >= 0) {
                                expsplitIsAfter[0] = logsplit[j].substr(0, startpos);
                                expsplitIsAfter[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }
                        }

                        if (spiltOK == false) {

                            var oplen = (" between ").length;
                            var startpos = logsplit[j].indexOf(" between ");
                            if (startpos >= 0) {
                                expsplitBetween[0] = logsplit[j].substr(0, startpos);
                                expsplitBetween[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }

                        }

                        if (spiltOK == false) {

                            var oplen = (" contains ").length;
                            var startpos = logsplit[j].indexOf(" contains ");
                            if (startpos >= 0) {
                                expsplitCONTAINS[0] = logsplit[j].substr(0, startpos);
                                expsplitCONTAINS[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }
                        }

                        if (spiltOK == false) {

                            var oplen = (" does not contain ").length;
                            var startpos = logsplit[j].indexOf(" does not contain ");
                            if (startpos >= 0) {
                                expsplitDOESNOTCONTAINS[0] = logsplit[j].substr(0, startpos);
                                expsplitDOESNOTCONTAINS[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }
                        }


                        if (spiltOK == false) {
                            var oplen = (" not in ").length;
                            var startpos = logsplit[j].indexOf(" not in ");
                            if (startpos >= 0) {
                                expsplitNOTIN[0] = logsplit[j].substr(0, startpos);
                                expsplitNOTIN[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }
                        }

                        if (spiltOK == false) {
                            var oplen = (" in ").length;
                            var startpos = logsplit[j].indexOf(" in ");
                            if (startpos >= 0) {
                                expsplitIN[0] = logsplit[j].substr(0, startpos);
                                expsplitIN[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }
                        }


                        if (spiltOK == false) {

                            var oplen = (" >= ").length;
                            var startpos = logsplit[j].indexOf(" >= ");
                            if (startpos >= 0) {
                                expSplitGTE[0] = logsplit[j].substr(0, startpos);
                                expSplitGTE[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }
                        }

                        if (spiltOK == false) {

                            var oplen = (" <= ").length;
                            var startpos = logsplit[j].indexOf(" <= ");
                            if (startpos >= 0) {
                                expSplitLTE[0] = logsplit[j].substr(0, startpos);
                                expSplitLTE[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }
                        }

                        if (spiltOK == false) {

                            var oplen = (" > ").length;
                            var startpos = logsplit[j].indexOf(" > ");
                            if (startpos >= 0) {
                                expSplitGT[0] = logsplit[j].substr(0, startpos);
                                expSplitGT[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }
                        }


                        if (spiltOK == false) {

                            var oplen = (" < ").length;
                            var startpos = logsplit[j].indexOf(" < ");
                            if (startpos >= 0) {
                                expSplitLT[0] = logsplit[j].substr(0, startpos);
                                expSplitLT[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }
                        }

                        if (spiltOK == false) {

                            var oplen = (" != ").length;
                            var startpos = logsplit[j].indexOf(" != ");
                            if (startpos >= 0) {
                                expsplitNOT[0] = logsplit[j].substr(0, startpos);
                                expsplitNOT[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }
                        }


                        if (spiltOK == false) {

                            var oplen = (" = ").length;
                            var startpos = logsplit[j].indexOf(" = ");
                            if (startpos >= 0) {
                                expsplit[0] = logsplit[j].substr(0, startpos);
                                expsplit[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }
                        }

                        if (spiltOK == false) {

                            var oplen = (" is ").length;
                            var startpos = logsplit[j].indexOf(" is ");
                            if (startpos >= 0) {
                                expsplit[0] = logsplit[j].substr(0, startpos);
                                expsplit[1] = logsplit[j].substr(startpos + oplen, logsplit[j].length).trim();
                                spiltOK = true;
                            }
                        }


                        // CONTAINS  CHECK   
                        if (expsplitCONTAINS.length > 1) {

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "NAME")
                                Firstname = "name";

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "STATUS")
                                Firstname = "status";

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "CHANNEL")
                                Firstname = "channel_type_name";

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            if (Firstname == "status" && expsplitCONTAINS[1].trim().toUpperCase() == "IN PROGRESS") {
                                expsplitCONTAINS[1] = expsplitCONTAINS[1].replace(/\s/g, '');
                            }

                            expsplitCONTAINS[1] = expsplitCONTAINS[1].replace(/"/g, "");

                            filter.filters.push({ field: Firstname.trim(), operator: "contains", value: expsplitCONTAINS[1].trim() });
                            ValidFilter = true;
                            spiltOK = false;
                        }

                        // DOES NOT CONTAINS  CHECK   
                        if (expsplitDOESNOTCONTAINS.length > 1) {

                            if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "NAME")
                                Firstname = "name";

                            if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "STATUS")
                                Firstname = "status";

                            if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "CHANNEL")
                                Firstname = "channel_type_name";

                            // by saroj on 18-04-2016

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            if (Firstname == "status" && expsplitDOESNOTCONTAINS[1].trim().toUpperCase() == "IN PROGRESS") {
                                expsplitDOESNOTCONTAINS[1] = expsplitDOESNOTCONTAINS[1].replace(/\s/g, '');
                            }

                            //removing inverted commas
                            expsplitDOESNOTCONTAINS[1] = expsplitDOESNOTCONTAINS[1].replace(/"/g, "");

                            filter.filters.push({ field: Firstname.trim(), operator: "doesnotcontain", value: expsplitDOESNOTCONTAINS[1].trim() });
                            ValidFilter = true;
                            spiltOK = false;
                        }

                        // IN CHECK

                        if (expsplitIN.length > 1) {

                            if (expsplitIN[0].toUpperCase().trim() == "NAME")
                                Firstname = "name";

                            if (expsplitIN[0].toUpperCase().trim() == "STATUS")
                                Firstname = "status";

                            if (expsplitIN[0].toUpperCase().trim() == "CHANNEL")
                                Firstname = "channel_type_name";

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }


                            var mystring = expsplitIN[1].trim().replace(/["'\(\)]/g, "");
                            // alert(mystring);

                            var newString = mystring.split(',');
                            abc = { logic: "or", filters: [] };

                            if (newString.length >= 1) {
                                for (var k = 0; k < newString.length; k++) {
                                    if (Firstname == "status" && newString[k].trim().toUpperCase() == "IN PROGRESS") {
                                        newString[k] = newString[k].replace(/\s/g, '');
                                    }
                                    //removing inverted commas
                                    newString[k] = newString[k].replace(/"/g, "");

                                    abc.filters.push({ field: Firstname.trim(), operator: "contains", value: newString[k].trim() });
                                }
                                filter.filters.push(abc);
                                ValidFilter = true;
                                spiltOK = false;
                            }
                        }


                        // NOT IN CHECK

                        if (expsplitNOTIN.length > 1) {

                            if (expsplitNOTIN[0].toUpperCase().trim() == "NAME")
                                Firstname = "name";

                            if (expsplitNOTIN[0].toUpperCase().trim() == "STATUS")
                                Firstname = "status";

                            if (expsplitNOTIN[0].toUpperCase().trim() == "CHANNEL")
                                Firstname = "channel_type_name";

                            // by saroj on 18-04-2016

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            var mystring = expsplitNOTIN[1].trim().replace(/["'\(\)]/g, "");
                            // alert(mystring);

                            var newString = mystring.split(',');
                            abc = { logic: "and", filters: [] };

                            if (newString.length >= 1) {
                                for (var k = 0; k < newString.length; k++) {
                                    if (Firstname == "status" && newString[k].trim().toUpperCase() == "IN PROGRESS") {
                                        newString[k] = newString[k].replace(/\s/g, '');
                                    }
                                    //removing inverted commas
                                    newString[k] = newString[k].replace(/"/g, "");
                                    abc.filters.push({ field: Firstname.trim(), operator: "doesnotcontain", value: newString[k].trim() });
                                }
                                filter.filters.push(abc);
                                ValidFilter = true;
                                spiltOK = false;
                            }

                        }

                        // EQUAL TO CHECK 
                        if (expsplit.length > 1) {

                            if (expsplit[0].toUpperCase().trim() == "NAME")
                                Firstname = "name";

                            if (expsplit[0].toUpperCase().trim() == "STATUS")
                                Firstname = "status";

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

                            else if (expsplit[0].toUpperCase().trim() == "CLICKS")
                                Firstname = "clicks";

                            else if (expsplit[0].toUpperCase().trim() == "CREATED DATE")
                                Firstname = "created_date";

                            else if (expsplit[0].toUpperCase().trim() == "START DATE")
                                Firstname = "start_date1";


                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            if (Firstname == "status" || Firstname == "name") {
                                //removing inverted commas
                                if (expsplit[1].toUpperCase().trim() == "BLANK") {
                                    filter.filters.push({ field: Firstname.trim(), operator: "eq", value: undefined });
                                }
                                else {
                                    expsplit[1] = expsplit[1].replace(/"/g, "");
                                    filter.filters.push({ field: Firstname.trim(), operator: "eq", value: expsplit[1].trim() });
                                }
                            }
                            else if (Firstname == "created_date" || Firstname == "start_date1") {

                                var CurrentDate = moment().startOf('day')._d;
                                var CurrentEndDate = moment().endOf('day')._d;
                                // alert(CurrentEndDate);

                                var TommDate = moment().startOf('day').add(+1, 'days')._d;
                                var TommEndDate = moment().endOf('day').add(+1, 'days')._d;

                                var next7Day = moment().endOf('day').add(+7, 'days')._d;
                                // alert(next7Day);

                                // alert(TommDate);
                                //  alert(TommEndDate);

                                var YesterDayDate = moment().startOf('day').add(-1, 'days')._d;

                                // For This week 
                                /*
                                I need recent monday dates and current dates 
                                */
                                // var mondayOfCurrentWeek = moment(moment().weekday(1).format('DD/MM/YYYY'))._d;

                                var mondayOfCurrentWeek = moment().startOf('isoweek')._d;

                                // For Last week 
                                /*
                                I need recent monday dates and current dates 
                                */

                                var d = new Date();

                                // set to Monday of this week
                                d.setDate(d.getDate() - (d.getDay() + 6) % 7);

                                // set to previous Monday
                                d.setDate(d.getDate() - 7);

                                // create new date of day before
                                var lastweekmonday = new Date(d.getFullYear(), d.getMonth(), d.getDate());
                                var lastweeksunday = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 6);

                                // Last Financial Current year 

                                var lastFinancialYearFirstDay = new Date(new Date().getFullYear() - 1, 3, 1); // last year first day of financial yr
                                var lastFinancialYearLastDay = new Date(new Date().getFullYear(), 2, 31); // current year march month

                                // Financial Current year 
                                var cfyFirstDay = new Date(new Date().getFullYear(), 3, 1);
                                // Current year 
                                var currentYearFirstDay = new Date(new Date().getFullYear(), 0, 1);
                                // Dates for Current Quarter
                                var dd = new Date();
                                var currQuarter = (dd.getMonth() - 1) / 3 + 1;
                                //   alert("currQuarter"+ currQuarter);
                                var firstdayOfcurrQuarter = new Date(dd.getFullYear(), 3 * currQuarter - 2, 1);
                                var lastdayOfcurrQuarter = new Date(dd.getFullYear(), 3 * currQuarter + 1, 1);
                                lastdayOfcurrQuarter.setDate(lastdayOfcurrQuarter.getDate() - 1);
                                // Dates for Current Quarter
                                var ddlast = new Date();

                                //moment().subtract(1, 'quarter').startOf('quarter')._d
                                //moment().subtract(1, 'quarter').endOf('quarter')._d

                                var lastQuarter = (dd.getMonth() - 1) / 3 + 4;
                                //  alert("lastQuarter" + currQuarter);
                                var firstdayOflastQuarter = new Date(ddlast.getFullYear(), 3 * lastQuarter - 2, 1);
                                var lastdayOflastQuarter = new Date(ddlast.getFullYear(), 3 * lastQuarter + 1, 1);
                                lastdayOflastQuarter.setDate(lastdayOflastQuarter.getDate() - 1);
                                // Current Month First date 
                                var firstDayOfCurrentMonth = new Date(CurrentDate.getFullYear(), CurrentDate.getMonth(), 1);
                                //For Last Month
                                //  First Date 
                                var firstDayPrevMonth = new Date(CurrentDate.getFullYear(), CurrentDate.getMonth() - 1, 1);
                                //Last Date
                                var lastDayPrevMonth = new Date(); // current date
                                lastDayPrevMonth.setDate(1); // going to 1st of the month
                                lastDayPrevMonth.setHours(-1); // going to last hour before this date even started.

                                if (expsplit[1].trim().toUpperCase() == "TODAY") {

                                    abc = { logic: "and", filters: [] };
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: CurrentDate });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: TommDate });
                                    filter.filters.push(abc);
                                }

                                else if (expsplit[1].trim().toUpperCase() == "YESTERDAY") {

                                    abc = { logic: "and", filters: [] };
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: YesterDayDate });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentDate });
                                    filter.filters.push(abc);

                                }

                                else if (expsplit[1].trim().toUpperCase() == "TOMORROW") {

                                    abc = { logic: "and", filters: [] };
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: CurrentEndDate });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: TommEndDate });
                                    filter.filters.push(abc);
                                }

                                else if (expsplit[1].trim().toUpperCase() == "THIS WEEK") {

                                    abc = { logic: "and", filters: [] };
                                    if (mondayOfCurrentWeek.getDate() == CurrentDate.getDate()) {

                                        abc.filters.push({ field: Firstname.trim(), operator: "gt", value: CurrentDate });
                                        abc.filters.push({ field: Firstname.trim(), operator: "lt", value: TommDate });
                                    }
                                    else {
                                        abc.filters.push({ field: Firstname.trim(), operator: "gt", value: mondayOfCurrentWeek });
                                        abc.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentEndDate });
                                    }
                                    filter.filters.push(abc);
                                }

                                else if (expsplit[1].trim().toUpperCase() == "LAST WEEK") {

                                    abc = { logic: "and", filters: [] };
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: lastweekmonday });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: lastweeksunday });
                                    filter.filters.push(abc);
                                }

                                else if (expsplit[1].trim().toUpperCase() == "THIS MONTH") {

                                    abc = { logic: "and", filters: [] };
                                    //if (firstDayOfCurrentMonth.getDate() == CurrentDate.getDate()) {
                                    //    filter.filters.push({ field: Firstname.trim(), operator: "gt", value: firstDayOfCurrentMonth });
                                    //    filter.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentDate.getDate() + 1 });
                                    //}
                                    //else {
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: firstDayOfCurrentMonth });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentEndDate });
                                    filter.filters.push(abc);
                                    // }
                                }

                                else if (expsplit[1].trim().toUpperCase() == "LAST MONTH") {

                                    abc = { logic: "and", filters: [] };
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: firstDayPrevMonth });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: lastDayPrevMonth });
                                    filter.filters.push(abc);
                                }

                                else if (expsplit[1].trim().toUpperCase() == "THIS QUARTER" || expsplit[1].trim().toUpperCase() == "CURRENT QUARTER") {

                                    abc = { logic: "and", filters: [] };
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: firstdayOfcurrQuarter });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: lastdayOfcurrQuarter });
                                    filter.filters.push(abc);
                                }

                                else if (expsplit[1].trim().toUpperCase() == "LAST QUARTER") {

                                    abc = { logic: "and", filters: [] };
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: prevQuarterStartDay });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: prevQuarterEndDay });
                                    filter.filters.push(abc);
                                }

                                else if (expsplit[1].trim().toUpperCase() == "YEAR TO DATE") {

                                    abc = { logic: "and", filters: [] };
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: currentYearFirstDay });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentEndDate });
                                    filter.filters.push(abc);
                                }

                                else if (expsplit[1].trim().toUpperCase() == "THIS FINANCIAL YEAR") {

                                    abc = { logic: "and", filters: [] };
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: cfyFirstDay });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentEndDate });
                                    filter.filters.push(abc);
                                }

                                else if (expsplit[1].trim().toUpperCase() == "LAST FINANCIAL YEAR") {

                                    abc = { logic: "and", filters: [] };
                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: lastFinancialYearFirstDay });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: lastFinancialYearLastDay });
                                    filter.filters.push(abc);
                                }

                                else if (expsplit[1].trim().toUpperCase() == "NEVER") {

                                    abc = { logic: "and", filters: [] };
                                    abc.filters.push({ field: Firstname.trim(), operator: "eq", value: undefined });
                                    filter.filters.push(abc);
                                }
                                else {
                                    //new chnage 9-4-16
                                    abc = { logic: "and", filters: [] };

                                    var Date1 = moment(expsplit[1].trim(), 'D/M/YYYY');
                                    var Datex = moment(expsplit[1].trim(), 'D/M/YYYY');
                                    var Date2 = Datex.add('days', 1);

                                    abc.filters.push({ field: Firstname.trim(), operator: "gt", value: Date1 });
                                    abc.filters.push({ field: Firstname.trim(), operator: "lt", value: Date2 });
                                    filter.filters.push(abc);
                                }

                            }
                            else {
                                filter.filters.push({ field: Firstname.trim(), operator: "eq", value: parseFloat(expsplit[1].trim()) });
                            }

                            ValidFilter = true;
                            spiltOK = false;

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

                            else if (expSplitGTE[0].toUpperCase().trim() == "CLICKS")
                                Firstname = "clicks";

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            filter.filters.push({ field: Firstname.trim(), operator: "gte", value: parseFloat(expSplitGTE[1].trim()) });
                            ValidFilter = true;
                            spiltOK = false;
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

                            else if (expSplitLTE[0].toUpperCase().trim() == "CLICKS")
                                Firstname = "clicks";

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            filter.filters.push({ field: Firstname.trim(), operator: "lte", value: parseFloat(expSplitLTE[1].trim()) });
                            ValidFilter = true;
                            spiltOK = false;
                        }

                        // GREATER THAN  TO CHECK
                        if (expSplitGT.length > 1) {

                            if (expSplitGT[0].toUpperCase().trim() == "OPEN RATE")
                                Firstname = "open_rate";

                            if (expSplitGT[0].toUpperCase().trim() == "OPENS")
                                Firstname = "opens";

                            if (expSplitGT[0].toUpperCase().trim() == "BOUNCES")
                                Firstname = "bounces";

                            else if (expSplitGT[0].toUpperCase().trim() == "UNSUBSCRIBES")
                                Firstname = "unsubscribes";

                            if (expSplitGT[0].toUpperCase().trim() == "BUDGET")
                                Firstname = "budget";

                            else if (expSplitGT[0].toUpperCase().trim() == "REVENUE")
                                Firstname = "revenue";

                            else if (expSplitGT[0].toUpperCase().trim() == "CONVERSIONS")
                                Firstname = "conversion_rate";

                            else if (expSplitGT[0].toUpperCase().trim() == "CLICKS")
                                Firstname = "clicks";

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            filter.filters.push({ field: Firstname.trim(), operator: "gt", value: parseFloat(expSplitGT[1].trim()) });
                            ValidFilter = true;
                            spiltOK = false;
                        }

                        // LESSER THAN CHECK
                        if (expSplitLT.length > 1) {

                            if (expSplitLT[0].toUpperCase().trim() == "OPEN RATE")
                                Firstname = "open_rate";

                            if (expSplitLT[0].toUpperCase().trim() == "OPENS")
                                Firstname = "opens";

                            if (expSplitLT[0].toUpperCase().trim() == "BOUNCES")
                                Firstname = "bounces";

                            else if (expSplitLT[0].toUpperCase().trim() == "UNSUBSCRIBES")
                                Firstname = "unsubscribes";

                            if (expSplitLT[0].toUpperCase().trim() == "BUDGET")
                                Firstname = "budget";

                            else if (expSplitLT[0].toUpperCase().trim() == "REVENUE")
                                Firstname = "revenue";

                            else if (expSplitLT[0].toUpperCase().trim() == "CONVERSIONS")
                                Firstname = "conversion_rate";

                            else if (expSplitLT[0].toUpperCase().trim() == "CLICKS")
                                Firstname = "clicks";

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            filter.filters.push({ field: Firstname.trim(), operator: "lt", value: parseFloat(expSplitLT[1].trim()) });
                            ValidFilter = true;
                            spiltOK = false;
                        }


                        // IS BEFORE CHECK
                        if (expsplitIsBefore.length > 1) {

                            if (expsplitIsBefore[0].toUpperCase().trim() == "CREATED DATE")
                                Firstname = "created_date";

                            else if (expsplitIsBefore[0].toUpperCase().trim() == "START DATE")
                                Firstname = "start_date1";

                            // by saroj on 18-04-2016

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }


                            var CurrentDate = moment().endOf('day')._d;;
                            var YesterDayDate = moment().endOf('day').add(-1, 'days')._d;
                            var beforeYesterDayDate = moment().endOf('day').add(-2, 'days')._d;


                            if (expsplitIsBefore[1].trim().toUpperCase() == "TODAY") {

                                //abc = { logic: "and", filters: [] };
                                filter.filters.push({ field: Firstname.trim(), operator: "lt", value: YesterDayDate });
                                //abc.filters.push({ field: Firstname.trim(), operator: "lt", value: TommDate });
                                // filter.filters.push(abc);
                                ValidFilter = true;
                                spiltOK = false;
                            }

                            else if (expsplitIsBefore[1].trim().toUpperCase() == "TOMORROW") {

                                // abc = { logic: "and", filters: [] };
                                filter.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentDate });
                                // abc.filters.push({ field: Firstname.trim(), operator: "lt", value: TommEndDate });
                                // filter.filters.push(abc);
                                ValidFilter = true;
                                spiltOK = false;
                            }

                            else if (expsplitIsBefore[1].trim().toUpperCase() == "YESTERDAY") {

                                //   abc = { logic: "and", filters: [] };
                                filter.filters.push({ field: Firstname.trim(), operator: "lt", value: beforeYesterDayDate });
                                //abc.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentDate });
                                //filter.filters.push(abc);
                                ValidFilter = true;
                                spiltOK = false;
                            }

                            else {

                                filter.filters.push({ field: Firstname.trim(), operator: "lt", value: moment(expsplitIsBefore[1].trim(), 'DD-MM-YYYY')._d });
                                ValidFilter = true;
                                spiltOK = false;
                            }


                        }


                        // IS AFTER CHECK

                        if (expsplitIsAfter.length > 1) {

                            if (expsplitIsAfter[0].toUpperCase().trim() == "CREATED DATE")
                                Firstname = "created_date";

                            else if (expsplitIsAfter[0].toUpperCase().trim() == "START DATE")
                                Firstname = "start_date1";

                            // by saroj on 18-04-2016

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            var CurrentDate = moment().endOf('day')._d;;
                            var YesterDayDate = moment().endOf('day').add(-1, 'days')._d;
                            var TommDate = moment().endOf('day').add(+1, 'days')._d;


                            if (expsplitIsAfter[1].trim().toUpperCase() == "TODAY") {

                                //abc = { logic: "and", filters: [] };
                                filter.filters.push({ field: Firstname.trim(), operator: "gt", value: CurrentDate });
                                //abc.filters.push({ field: Firstname.trim(), operator: "lt", value: TommDate });
                                // filter.filters.push(abc);
                                ValidFilter = true;
                                spiltOK = false;
                            }

                            else if (expsplitIsAfter[1].trim().toUpperCase() == "TOMORROW") {

                                // abc = { logic: "and", filters: [] };
                                filter.filters.push({ field: Firstname.trim(), operator: "gt", value: TommDate });
                                // abc.filters.push({ field: Firstname.trim(), operator: "lt", value: TommEndDate });
                                // filter.filters.push(abc);
                                ValidFilter = true;
                                spiltOK = false;
                            }

                            else if (expsplitIsAfter[1].trim().toUpperCase() == "YESTERDAY") {

                                //   abc = { logic: "and", filters: [] };
                                filter.filters.push({ field: Firstname.trim(), operator: "gt", value: YesterDayDate });
                                //abc.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentDate });
                                //filter.filters.push(abc);
                                ValidFilter = true;
                                spiltOK = false;
                            }
                            else {
                                filter.filters.push({ field: Firstname.trim(), operator: "gt", value: moment(expsplitIsAfter[1], "DD-MM-YYYY").add('day', 1)._d });
                                ValidFilter = true;
                                spiltOK = false;
                            }

                        }

                        // 

                        // BETWEEN OR CHECK 
                        if (expsplitBetween.length > 1) {

                            if (expsplitBetween[0].toUpperCase().trim() == "CREATED DATE")
                                Firstname = "created_date";

                            else if (expsplitBetween[0].toUpperCase().trim() == "START DATE")
                                Firstname = "start_date1";

                            // by saroj on 18-04-2016

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            var InnerBetweenSplit = expsplitBetween[1].split("&&");

                            if (InnerBetweenSplit.length > 1) {

                                abc = { logic: "and", filters: [] };

                                abc.filters.push({ field: Firstname.trim(), operator: "gte", value: moment(InnerBetweenSplit[0].trim().toString(), 'DD-MM-YYYY').startOf('day')._d });
                                abc.filters.push({ field: Firstname.trim(), operator: "lte", value: moment(InnerBetweenSplit[1].trim().toString(), 'DD-MM-YYYY').endOf('day')._d });
                                filter.filters.push(abc);
                                ValidFilter = true;
                                spiltOK = false;
                            }
                        }



                    } //for loop 
                } // if loop
                //if loop MAIN
            }

            // final code to get execute....

            if (Firstname == "" && ValidClause == false) {
                alert("Invalid Query.");
                return;
            }

            if (ValidFilter == true && ValidClause == false) {
                var ds = $('#project-record-list').getKendoGrid().dataSource;
                ds.filter(filter);
                // alert('Query Executed Successfully.');
            }
            else if (ValidFilter == false && ValidClause == true) {
                var dsSort = [];
                dsSort.push({ field: feild1, dir: dir1 });
                var ds = $('#project-record-list').getKendoGrid().dataSource;
                ds.sort(dsSort);
                //  alert('Query Executed Successfully.');
            }
            else if (ValidFilter == true && ValidClause == true) {
                var dsSort = [];
                dsSort.push({ field: feild1, dir: dir1 });
                var ds = $('#project-record-list').getKendoGrid().dataSource;
                ds.filter(filter);
                ds.sort(dsSort);
                // alert('Query Executed Successfully.');
            }
            else {
                alert("Please Check Query.");
            } 

           
        }




        $scope.clearFilter = function () {
            $('#project-record-list').getKendoGrid().dataSource.filter({});
            $('#project-record-list').getKendoGrid().dataSource.sort({});
            $scope.textareaText = ''
            $scope.gridView = 'default';
        }


        // end
    });

