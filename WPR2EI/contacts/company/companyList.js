angular.module('contacts')
.controller('CompanyListController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope, teamService, $filter) {
        console.log('CompanyListController');


        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
        var orgID = $cookieStore.get('orgID');
        var userID = $cookieStore.get('userId');

        $rootScope.title = 'Dwellar-Company';

        $scope.companyAction = 'no_action';

        //Audit log start               

        AuditCreate = function () {
            var postdata =
           {
               device_os: $cookieStore.get('Device_os'),
               device_type: $cookieStore.get('Device'),
               // device_mac_id: "34:#$::43:434:34:45",
               module_id: "Contact",
               action_id: "Contact View",
               details: "CompanyListView",
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


        // Kendo code
        //$scope.companyGrid =
        //{
        //    dataSource: {
        //        type: "json",
        //        transport: {

        //            read: apiService.baseUrl + "Company/GetCompanyList/" + orgID
        //            },
        //        pageSize: 20
        //    },
        //    schema: {
        //        model: {
        //            fields: {
        //                date_of_birth: { type: "date" },
        //                last_contacted: { type: "date" }
        //            }
        //        }
        //    },

        //    groupable: true,
        //    sortable: true,
        //    selectable: "multiple",
        //    reorderable: true,
        //    resizable: true,
        //    filterable: true,
        //    height: screen.height - 370,
        //    columnMenu: {
        //        messages: {
        //            columns: "Choose columns",
        //            filter: "Apply filter",
        //            sortAscending: "Sort (asc)",
        //            sortDescending: "Sort (desc)"
        //        }
        //    },
        //    pageable: {
        //        refresh: true,
        //        pageSizes: true,
        //        buttonCount: 5
        //    },
        //    columns: [
        //         {
        //             template: "<input type='checkbox', class='checkbox', data-id='#= id #',  ng-click='check($event,dataItem)' />",
        //             title: "<input id='checkAll', type='checkbox', class='check-box', ng-click='checkALL(dataItem)' />",
        //             width: "60px",
        //             attributes:
        //              {
        //                  "class": "UseHand",
        //                  "style": "text-align:center"
        //              }
        //         }, {
        //             field: "name",
        //             title: "Name",
        //             width: "120px",
        //             attributes: {
        //                 "class": "UseHand",
        //                 "style": "text-align:center"
        //             }
        //         },
        //         {
        //             field: "Tags",
        //             title: "Tags",
        //             width: "120px",
        //             attributes: {
        //                 "class": "UseHand",
        //                 "style": "text-align:center"
        //             }
        //         },{
        //             field: "person_count",
        //            title: "People",
        //            width: "120px",
        //            attributes: {
        //                "class": "UseHand",
        //                "style": "text-align:center"
        //            }
        //        },{
        //            field: "total_task_count",
        //            title: "Task",
        //            width: "120px",
        //            attributes: {
        //                "class": "UseHand",
        //                "style": "text-align:right"
        //            }
        //        },{
        //            field: "total_quote_count",
        //            title: "Quote",
        //            width: "120px",
        //            attributes: {
        //                "class": "UseHand",
        //                "style": "text-align:center"
        //            }
        //    },{
        //        field: "last_contacted",
        //        title: "Last Follow Up",
        //        format: '{0:dd-MM-yyyy hh:mm:ss tt }',
        //        type: 'date',
        //        width: "120px",
        //        attributes:
        //        {
        //            "class": "UseHand",
        //            "style": "text-align:center"
        //        }
        //    },
        //      {
        //          field: "rating",
        //          title: "Rating",
        //          width: "120px",
        //          attributes: {
        //              "class": "UseHand",
        //              "style": "text-align:center"
        //          }
        //      }, ]

        //};



        $scope.companyGrid =
        {
            dataSource: {
                type: "json",
                transport: {
                    read: function (options) {
                        apiService.getWithoutCaching("Company/GetCompanyList/" + orgID).then(function (response) {
                            data = response.data;

                            for (i = 0; i < data.length; i++) {
                                var tag = (data[i].Tags);
                                if (tag !== null) {
                                    tag = JSON.parse(tag);
                                    data[i].Tags = [];
                                    data[i].Tags = tag;
                                }
                                else
                                    data[i].Tags = [];
                            }
                            options.success(data);
                        }, function (error) {
                            options.error(error);
                        })

                    },
                },
                pageSize: 20
            },
            schema: {
                model: {
                    fields: {
                        date_of_birth: { type: "date" },
                        last_contacted: { type: "date" },
                        //name: { type: "string" },
                        //person_count: { type: "string" },
                        //total_task_count: { type: "number" },
                        //total_quote_count: { type: "string" },
                        //rating: { type: "string" },
                        //TAGS: { type: "string" },

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
                template: "<input type='checkbox', class='checkbox', data-id='#= id #',  ng-click='check($event,dataItem)' />",
                title: "<input id='checkAll', type='checkbox', class='check-box', ng-click='checkALL(dataItem)' />",
                width: "60px",
                attributes:
                 {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
            }, {
                field: "name",
                title: "Name",

                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            }, {
                field: "person_count",
                title: "People",

                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            }, {
                field: "total_task_count",
                title: "Task",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:right"
                }
            }, {
                field: "total_quote_count",
                title: "Quote",

                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            }, {
                field: "last_contacted",
                title: "Last Follow Up",
                format: '{0:dd-MM-yyyy hh:mm:ss tt }',
                type: 'date',

                attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            },
              {
                  field: "rating",
                  title: "Rating",

                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
              },
                 {
                     field: "TAGS",
                     template: "<span ng-repeat='tag in dataItem.Tags' style='background-color:{{tag.background_color}}; margin-bottom: 5px;line-height:1.2em;' class='properties-close  upper tag-name' ng-hide='{{$index>1}}'>{{tag.name}}</span><br><span  ng-hide='{{dataItem.Tags.length<3}}'><small>Show More..</small></span>",
                     title: "TAGS",
                     attributes: {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
                 },
            ]

        };




        // Kendo Grid on change
        $scope.myGridChange = function (dataItem) {
            // dataItem will contain the row that was selected
            window.sessionStorage.selectedCustomerID = dataItem.id;
            $scope.companyName = $cookieStore.get('Company_Name');
            $cookieStore.put('company_name', dataItem.name);
            $state.go('app.companyDetail');


        };

        $scope.tagPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/company/addTag.html',
                backdrop: 'static',
                controller: AddTagCompanyController,
                size: 'lg'
            });
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

        //for tags tooltip
        $(document).ready(function () {
            kendo.ui.Tooltip.fn._show = function (show) {
                return function (target) {
                    var e = {
                        sender: this,
                        target: target,
                        preventDefault: function () {
                            this.isDefaultPrevented = true;
                        }
                    };

                    if (typeof this.options.beforeShow === "function") {
                        this.options.beforeShow.call(this, e);
                    }
                    if (!e.isDefaultPrevented) {
                        // only show the tooltip if preventDefault() wasn't called..
                        show.call(this, target);
                    }
                };
            }(kendo.ui.Tooltip.fn._show);
            $("#company_kendomain").kendoTooltip({
                animation: {
                    close: {
                        effects: "fadeOut zoom:out",
                        duration: 600
                    },
                    open: {
                        effects: "fadeIn zoom:in",
                        duration: 100
                    }
                },
                filter: "td:nth-child(8)", //this filter selects the  column cells
                position: "top",
                beforeShow: function (e) {
                    console.log(e);
                    if ($(e.target).data("tagName") === null) {

                        // don't show the tooltip if the name attribute contains null
                        e.preventDefault();
                    }
                },
                content: function (e) {

                    var dataItem = $("#company_kendomain").data("kendoGrid").dataItem(e.target.closest("tr"));
                    var data = dataItem.Tags;
                    var content = '';
                    for (i = 0; i < data.length; i++) {
                        content = content + "<span style='background-color:" + data[i].background_color + ";display:block; margin-bottom: 5px;' class='properties-close upper tag-name'>" + data[i].name + "</span>"
                    }

                    return content;


                }

            }).data("kendoTooltip");

        });
        //end tooltip


        $scope.$on('REFRESH', function (event, args) {
            if (args == 'contactGrid') {
                $('.k-i-refresh').trigger("click");
            }
            $scope.companyAction = 'no_action';
        });

        function clearFilters() {
            var gridData = $("#peopleGrid").data("kendoGrid");
            gridData.dataSource.filter({});
        }

        $scope.chooseAction = function () {
            var allGridElements = $(".checkbox").toArray();
            var allCheckedElement = _.filter(allGridElements, function (o)
            { return o.checked });
            allCheckedIds = (_.pluck(allCheckedElement, 'dataset.id'));
            $cookieStore.remove('checkedIds');
            $cookieStore.put('checkedIds', allCheckedIds);

            if (allCheckedIds.length > 0) {

                if ($scope.companyAction === "no_action") {

                }
                else if ($scope.companyAction === "add_tag") {
                    $state.go($scope.tagPopup());
                }
                else if ($scope.companyAction === "assign_to") {
                    $state.go($scope.assignToUpPopup());
                }
                else if ($scope.companyAction === "delete") {
                    var companyDelete = [];
                    for (var i in allCheckedIds) {
                        var company = {};
                        company.id = allCheckedIds[i];
                        company.organization_id = $cookieStore.get('orgID');
                        companyDelete.push(company);
                    }
                    $cookieStore.put('contactDelete', companyDelete);
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

        //JQL Section
        var callViewApi = function (id) {

            apiService.getWithoutCaching('Notes/GetByOrgid/' + $cookieStore.get('orgID')).then(function (res) {
                $scope.views = _.filter(res.data, function (o)
                { return o.query_type === 'View' && o.grid_name === 'company' });

                $scope.defaultView = id == null ? getDefaultView($scope.views) : getDefaultView(views, id);
                if ($scope.defaultView == null) {
                    $scope.gridView = 'default';
                }
                else {
                    $scope.gridView = $scope.defaultView.id;
                    $scope.queryText = $scope.defaultView.query_string.replace(/"/g,"");
                }
            }, function (err) {

            });
        }

        function getDefaultView(views, id) {
            var result = id == null ? $filter('filter')(views, { default_view: true }, true)[0] : $filter('filter')(views, { id: id }, true)[0];
            return result;
        }

        callViewApi();

        $scope.changeView = function () {
            if ($scope.gridView !== 'default') {
                //filter by grid name
                viewObj = _.filter($scope.views, function (o)
                { return o.id === $scope.gridView });

                //get the grid datasource
                var grid = $('#company_kendomain').getKendoGrid();

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

                $scope.queryText = str;
                grid.dataSource.filter(JSON.parse(viewObj[0].filters));
            }
            else {
                $('#company_kendomain').getKendoGrid().dataSource.sort({});
                $('#company_kendomain').getKendoGrid().dataSource.filter({});
                $scope.queryText = null;
                for (i = 0; i < $('#company_kendomain').getKendoGrid().columns.length; i++) {
                    $('#company_kendomain').getKendoGrid().showColumn(i);

                }

            }

        }

        $scope.saveView = function () {
            var grid = $('#company_kendomain').getKendoGrid();

            if (grid.dataSource._sort) {
                var sortObject = grid.dataSource._sort[0];
            }

            if ($scope.queryText) {
                var Querydata = $scope.queryText.toLowerCase();
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
                resolve: { viewData: { sort: sortObject, col: grid.columns, grid: 'company', type: 'View', filterQuery: Querydata, filterObj: grid.dataSource._filter } }
            });

            modalInstance.result.then(function (data) {
                if (data != null) {
                    callViewApi(data.id);
                }
            },
                function (error) {

                }
            );


        }

        $scope.editView = function () {
            if ($scope.gridView !== 'default') {
                var viewName = _.filter($scope.views, function (o)
                { return o.id == $scope.gridView });

                var grid = $('#company_kendomain').getKendoGrid();

                if (grid.dataSource._sort) {
                    var sortObject = grid.dataSource._sort[0];
                }

                if ($scope.queryText) {
                    var Querydata = $scope.queryText.toLowerCase();
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
                    resolve: { viewData: { sort: sortObject, col: grid.columns, grid: 'company', type: 'View', filterQuery: Querydata, filterObj: grid.dataSource._filter, viewName: viewName[0].view_name, viewId: $scope.gridView, isViewDefault: viewName[0].default_view } }
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
                            $('#company_kendomain').getKendoGrid().dataSource.filter({});
                            $('#company_kendomain').getKendoGrid().dataSource.sort({});
                            $scope.queryText = ''
                            // $scope.gridView = 'default';
                            callViewApi();
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

        $scope.doWork = function () {
            var txtdata = $scope.queryText.toLowerCase();
            if (txtdata != '')
                $scope.callFilter();
        };

        function getColumnName(field) {
            if (field == "NAME")
                return "name";

            if (field == "PEOPLE")
                return "person_count";

            if (field == "TASK")
                return "total_task_count";

            if (field == "QUOTE")
                return "total_quote_count";

            if (field == "LAST FOLLOW UP")
                return "last_contacted";

            if (field == "RATING")
                return "rating";

            if (field == "TAGS")
                return "Tags";
        }

        function isNumericField(field) {
            return field == "person_count" || field == "total_task_count" || field == "total_quote_count" || field == "rating";
        }

        function getColumnNameFromColumns(columns, field) {
            if (columns.indexOf(field) != -1) {
                return getColumnName(field);
            }

            return "";
        }

        $scope.callFilter = function () {

            var prevQuarterStartDay = moment(moment().startOf('quarter')).add('quarter', -1)._d;
            var prevQuarterEndDay = moment(moment().endOf('quarter')).add('quarter', -1)._d;

            var txtdata = $scope.queryText.toLowerCase();
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
                        feild1 = getColumnName(fValue);
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


                //if (txtdata.split(" and ").length > txtdata.split(" or ").length) {

                //    filter = { logic: "and", filters: [] };
                //    logsplit = txtdata.split(" and ");
                //}
                //else {
                //    filter = { logic: "or", filters: [] };
                //    logsplit = txtdata.split(" or ");
                //}


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

                            var columnsForContainsExpression = ["NAME"];

                            Firstname = getColumnNameFromColumns(columnsForContainsExpression, expsplitCONTAINS[0].toUpperCase().trim());

                            // by saroj on 18-04-2016

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            //removing inverted commas
                            expsplitCONTAINS[1] = expsplitCONTAINS[1].replace(/"/g, "");

                            filter.filters.push({ field: Firstname.trim(), operator: "contains", value: expsplitCONTAINS[1].trim() });
                            ValidFilter = true;
                            spiltOK = false;
                        }

                        // DOES NOT CONTAINS  CHECK   
                        if (expsplitDOESNOTCONTAINS.length > 1) {

                            var columnsForDoesNotContainExpression = ["NAME"];

                            Firstname = getColumnNameFromColumns(columnsForDoesNotContainExpression, expsplitDOESNOTCONTAINS[0].toUpperCase().trim());

                            // by saroj on 18-04-2016

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            //removing inverted commas
                            expsplitDOESNOTCONTAINS[1] = expsplitDOESNOTCONTAINS[1].replace(/"/g, "");

                            filter.filters.push({ field: Firstname.trim(), operator: "doesnotcontain", value: expsplitDOESNOTCONTAINS[1].trim() });
                            ValidFilter = true;
                            spiltOK = false;
                        }


                        // IN CHECK

                        if (expsplitIN.length > 1) {

                            var columnsForINExpression = ["NAME"];

                            Firstname = getColumnNameFromColumns(columnsForINExpression, expsplitIN[0].toUpperCase().trim());

                            // by saroj on 18-04-2016

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

                            var columnsForNotINExpression = ["NAME"];

                            Firstname = getColumnNameFromColumns(columnsForNotINExpression, expsplitNOTIN[0].toUpperCase().trim());

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

                            var columnsForEqualsExpression = ["NAME", "PEOPLE", "TASK", "QUOTE", "LAST FOLLOW UP", "RATING", "TAGS"];

                            Firstname = getColumnNameFromColumns(columnsForEqualsExpression, expsplit[0].toUpperCase().trim());

                            if (Firstname == "") {
                                // 18-04-2016
                                //saroj
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            if (isNumericField(Firstname)) {
                                filter.filters.push({ field: Firstname.trim(), operator: "eq", value: parseFloat(expsplit[1].trim()) });
                                ValidFilter = true;
                                spiltOK = false;
                            }
                            else {
                                //"last_updated":"2016-04-07T04:20:42.953+00:00"

                                if (Firstname == "last_contacted" || Firstname == "last_updated" || Firstname == "created_at") {

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
                                   
                                    var firstdayOfcurrQuarter = moment(moment().startOf('quarter'))._d;
                                    var lastdayOfcurrQuarter = moment(moment().endOf('quarter'))._d;

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
                                    if (expsplit[1].toUpperCase().trim() == "BLANK") {
                                        filter.filters.push({ field: Firstname.trim(), operator: "eq", value: undefined });
                                    }
                                    else {
                                        //removing inverted commas
                                        expsplit[1] = expsplit[1].replace(/"/g, "");
                                        filter.filters.push({ field: Firstname.trim(), operator: "eq", value: expsplit[1].trim() });
                                    }
                                }
                            }

                            ValidFilter = true;
                            spiltOK = false;
                        }

                        // NOT EQUAL TO CHECK 
                        if (expsplitNOT.length > 1) {

                            var columnsForNotEqualsExpression = ["NAME", "PEOPLE", "TASK", "QUOTE", "LAST FOLLOW UP", "RATING", "TAGS"];

                            Firstname = getColumnNameFromColumns(columnsForNotEqualsExpression, expsplitNOT[0].toUpperCase().trim());

                            if (Firstname == "") {
                                // 18-04-2016
                                //saroj
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            if (isNumericField(Firstname)) {
                                filter.filters.push({ field: Firstname.trim(), operator: "neq", value: parseFloat(expsplitNOT[1].trim()) });
                                ValidFilter = true;
                                spiltOK = false;
                            }
                            else {

                                if (expsplitNOT[1].toUpperCase().trim() == "BLANK") {
                                    filter.filters.push({ field: Firstname.trim(), operator: "neq", value: undefined });
                                }
                                else {
                                    //removing inverted commas
                                    expsplitNOT[1] = expsplitNOT[1].replace(/"/g, "");

                                    filter.filters.push({ field: Firstname.trim(), operator: "neq", value: expsplitNOT[1].trim() });
                                }
                            }

                            ValidFilter = true;
                            spiltOK = false;
                        }

                        // GREATER THAN EQUAL TO CHECK
                        if (expSplitGTE.length > 1) {

                            var columnsForGTEExpression = ["PEOPLE", "TASK", "QUOTE", "RATING"];

                            Firstname = getColumnNameFromColumns(columnsForGTEExpression, expSplitGTE[0].toUpperCase().trim());


                            // by saroj on 18-04-2016
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

                            var columnsForLTEExpression = ["PEOPLE", "TASK", "QUOTE", "RATING"];

                            Firstname = getColumnNameFromColumns(columnsForLTEExpression, expSplitLTE[0].toUpperCase().trim());

                            // by saroj on 18-04-2016

                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            filter.filters.push({ field: Firstname.trim(), operator: "lte", value: parseFloat(expSplitLTE[1].trim()) });
                            ValidFilter = true;
                            spiltOK = false;
                        }


                        // GREATER THAN TO CHECK
                        if (expSplitGT.length > 1) {

                            var columnsForGTxpression = ["PEOPLE", "TASK", "QUOTE", "RATING"];

                            Firstname = getColumnNameFromColumns(columnsForGTxpression, expSplitGT[0].toUpperCase().trim());

                            // by saroj on 19-04-2016
                            if (Firstname == "") {
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            filter.filters.push({ field: Firstname.trim(), operator: "gt", value: parseFloat(expSplitGT[1].trim()) });
                            ValidFilter = true;
                            spiltOK = false;
                        }

                        // LESSER THAN TO CHECK
                        if (expSplitLT.length > 1) {

                            var columnsForLTxpression = ["PEOPLE", "TASK", "QUOTE", "RATING"];

                            Firstname = getColumnNameFromColumns(columnsForLTxpression, expSplitLT[0].toUpperCase().trim());


                            // by saroj on 19-04-2016
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

                            var columnsForIsBeforeExpression = ["LAST FOLLOW UP"];

                            Firstname = getColumnNameFromColumns(columnsForIsBeforeExpression, expsplitIsBefore[0].toUpperCase().trim());

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

                            var columnsForIsAfterExpression = ["LAST FOLLOW UP"];

                            Firstname = getColumnNameFromColumns(columnsForIsAfterExpression, expsplitIsAfter[0].toUpperCase().trim());

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
                                filter.filters.push({ field: Firstname.trim(), operator: "gt", value: moment(expsplitIsAfter[1].trim().endOf, 'DD-MM-YYYY')._d });
                                //commented above line becoz in morning time is after takes value of current date also.

                                //var date = new Date(expsplitIsAfter[1].trim());
                                //var formatted = moment(date).format('DD MM YYYY');
                                //alert(formatted);
                                //  filter.filters.push({ field: Firstname.trim(), operator: "gt", value: moment(expsplitIsAfter[1].trim(), 'DD-MM-YYYY').endOf(expsplitIsAfter[1].trim())._d });

                                ValidFilter = true;
                                spiltOK = false;
                            }

                        }

                        // 

                        // BETWEEN OR CHECK 
                        if (expsplitBetween.length > 1) {

                            var columnsForIsBetweenExpression = ["LAST FOLLOW UP"];

                            Firstname = getColumnNameFromColumns(columnsForIsBetweenExpression, expsplitBetween[0].toUpperCase().trim());

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
            } //if loop MAIN


            // final code to get execute....

            if (Firstname == "" && ValidClause == false) {
                alert("Invalid Query.");
                return;
            }

            if (ValidFilter == true && ValidClause == false) {
                var ds = $('#company_kendomain').getKendoGrid().dataSource;
                ds.filter(filter);

                // alert('Query Executed Successfully.');
            }
            else if (ValidFilter == false && ValidClause == true) {
                var dsSort = [];
                dsSort.push({ field: feild1, dir: dir1 });
                var ds = $('#company_kendomain').getKendoGrid().dataSource;
                ds.sort(dsSort);
                //  alert('Query Executed Successfully.');
            }
            else if (ValidFilter == true && ValidClause == true) {
                var dsSort = [];
                dsSort.push({ field: feild1, dir: dir1 });
                var ds = $('#company_kendomain').getKendoGrid().dataSource;
                ds.filter(filter);
                ds.sort(dsSort);
                // alert('Query Executed Successfully.');
            }
            else {
                alert("Please Check Query.");
            }

        }

        $scope.clearFilter = function () {
            $('#company_kendomain').getKendoGrid().dataSource.filter({});
            $('#company_kendomain').getKendoGrid().dataSource.sort({});
            $scope.queryText = ''
            $scope.gridView = 'default';
        }

        $scope.showJqlHelpCompanyPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/company/jqlHelpCompany.html',
                backdrop: 'static',
                controller: helpjqlController,
                size: 'lg'
            });
        };
    }
);

