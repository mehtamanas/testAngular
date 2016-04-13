angular.module('call')
.controller('CallController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope) {
        console.log('CallController');
        $rootScope.title = 'Dwellar-Call Records';
        $scope.gridView = 'default';
        var userID = $cookieStore.get('userId');

        var orgID = $cookieStore.get('orgID');

        $scope.callrecordGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "CallRecords/GetCallsByRole?id=" + userID

                },
                schema: {
                    model: {
                        fields: {
                            starttime: { type: "date" },
                            Recording: { type: "audio/mpeg" },

                        }
                    }
                },
                pageSize: 20
            },
            groupable: true,
            sortable: true,
            selectable: "multiple",
            reorderable: true,
            resizable: true,
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
                     field: "caller_name",
                     title: "Caller Name",
                     attributes:
                    {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }
                 },
                {
                    field: "callfrom",
                    title: "Caller Number",
                    attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
                },
                {
                    field: "lead_name",
                    title: "Lead Name",
                    attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
                },
                {
                    field: "callto",
                    title: "Lead Number",
                    attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
                }, {
                    field: "calltype",
                    title: "Call Type",
                    attributes:
                    {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }
                },
                {
                    template: "<audio controls><source type='audio/mpeg' src='#= recordingurl #'></audio>",
                    title: "Recording",
                    field: 'recordingurl',
                    width: '314px',
                    attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                },
                {
                    field: "starttime",
                    title: "Date & Time",
                    format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                    attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
                }, {
                    field: "direction",
                    title: "Direction",
                    attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
                }, ]
        };

        $scope.filterNow = function () {
            if ($scope.lastNameFilter)
                applyFilter('first_name', $scope.lastNameFilter);
            else
                clearFilters();
        };

        var callViewApi = function () {

            apiService.getWithoutCaching('Notes/GetByOrgid/' + $cookieStore.get('orgID')).then(function (res) {
                $scope.views = _.filter(res.data, function (o)
                { return o.grid_name === 'call' });
            }, function (err) {

            });
        }

        callViewApi();

        $scope.saveView = function () {
            var grid = $('#contact_kenomain').getKendoGrid();

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
                resolve: { viewData: { sort: sortObject, col: grid.columns, grid: 'call', type: 'View', filterQuery: Querydata, filterObj: grid.dataSource._filter } }
            });
        }

        $scope.editView = function () {
            var viewName = _.filter($scope.views, function (o)
            { return o.id == $scope.gridView });

            var grid = $('#contact_kenomain').getKendoGrid();

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
                resolve: { viewData: { sort: sortObject, col: grid.columns, grid: 'call', type: 'View', filterQuery: Querydata, filterObj: grid.dataSource._filter, viewName: viewName[0].view_name, viewId: $scope.gridView, isViewDefault: viewName[0].default_view } }
            });
        }

        $scope.deleteView = function () {
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
                    postData = [{ id: $scope.gridView, organization_id: $cookieStore.get('orgID') }];
                    apiService.post('Notes/DeleteGridView', postData).then(function (res) {
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
                callViewApi();
                $scope.gridView = args.data;
            }
        });

        // by saroj on 9th april 2016
        // jQL coading 
        $scope.DoWork = function () {
            //  alert('hii');
            $scope.callFilter();
        };

        $scope.callFilter = function () {

            var txtdata = $scope.textareaText.toLowerCase();
            var txtdata = txtdata;
            var Firstname = "";
            var ValidFilter = false;

            var filter = "";
            var logsplit = "";

            if (txtdata.length > 0) {

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

                        //FOR DATES 
                        var expsplitIsBefore = logsplit[j].split(" isbefore ");
                        var expsplitIsAfter = logsplit[j].split(" isafter ");
                        var expsplitBetween = logsplit[j].split(" between ");

                        var expEQ = logsplit[j].split(" = ");
                        var expIS = logsplit[j].split(" is ");

                        var expsplit = "";
                        if (expEQ.length > 1)
                            expsplit = expEQ;

                        if (expIS.length > 1)
                            expsplit = expIS;

                        var expsplitCONTAINS = logsplit[j].split(" contains ");
                        // var expsplitIN = logsplit[j].split(/in(.*)?/);

                        var expsplitIN = logsplit[j].split(" in ");

                        var expSplitGTE = logsplit[j].split(" >= ");

                        var expSplitLTE = logsplit[j].split(" <= ");

                        var expSplitGT = logsplit[j].split(" > ");

                        var expSplitLT = logsplit[j].split(" < ");




                        // CONTAINS  CHECK   
                        if (expsplitCONTAINS.length > 1) {

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "CALLER NAME" || expsplitCONTAINS[0].toUpperCase().trim() == "CALLER")
                                Firstname = "caller_name";

                            filter.filters.push({ field: Firstname.trim(), operator: "contains", value: expsplitCONTAINS[1].trim() });
                            ValidFilter = true;
                        }

                        // IN CHECK

                        if (expsplitIN.length > 1) {


                            if (expsplitIN[0].toUpperCase().trim() == "CALLER NAME" || expsplitIN[0].toUpperCase().trim() == "CALLER")
                                Firstname = "caller_name";

                            var mystring = expsplitIN[1].trim().replace(/["'\(\)]/g, "");
                            // alert(mystring);

                            var newString = mystring.split(',');
                            if (newString.length >= 1) {
                                for (var k = 0; k < newString.length; k++) {
                                    // newString
                                    filter.filters.push({ field: Firstname.trim(), operator: "contains", value: newString[k].trim() });
                                    ValidFilter = true;
                                }
                            }
                        }


                        // EQUAL TO CHECK 
                        if (expsplit.length > 1) {


                            if (expsplit[0].toUpperCase().trim() == "CALLER NAME" || expsplit[0].toUpperCase().trim() == "CALLER")
                                Firstname = "caller_name";

                            if (expsplit[0].toUpperCase().trim() == "CALLDATE" || expsplit[0].toUpperCase().trim() == "DATE")
                                Firstname = "starttime";



                            //"last_updated":"2016-04-07T04:20:42.953+00:00"

                            if (Firstname == "starttime") {

                                var CurrentDate = moment().startOf('day')._d;
                                var TommDate = moment().startOf('day').add(+1, 'days')._d;
                                var YesterDayDate = moment().startOf('day').add(-1, 'days')._d;

                                // For This week 
                                /*
                                I need recent monday dates and current dates 
                                */

                                var mondayOfCurrentWeek = moment(moment().weekday(1).format('DD/MM/YYYY'))._d;

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

                                var cfyFirstDay = new Date(new Date().getFullYear(), 4, 1);



                                // Current year 

                                var currentYearFirstDay = new Date(new Date().getFullYear(), 0, 1);


                                // Dates for Current Quarter
                                var dd = new Date();
                                var currQuarter = (dd.getMonth() - 1) / 3 + 1;

                                var firstdayOfcurrQuarter = new Date(dd.getFullYear(), 3 * currQuarter - 2, 1);
                                var lastdayOfcurrQuarter = new Date(dd.getFullYear(), 3 * currQuarter + 1, 1);

                                lastdayOfcurrQuarter.setDate(lastdayOfcurrQuarter.getDate() - 1);




                                // Dates for Current Quarter
                                var ddlast = new Date();
                                var lastQuarter = (dd.getMonth() - 1) / 3 + 4;


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

                                    filter = { logic: "and", filters: [] };
                                    filter.filters.push({ field: Firstname.trim(), operator: "gt", value: CurrentDate });
                                    filter.filters.push({ field: Firstname.trim(), operator: "lt", value: TommDate });
                                }

                                if (expsplit[1].trim().toUpperCase() == "YESTERDAY") {

                                    filter = { logic: "and", filters: [] };
                                    filter.filters.push({ field: Firstname.trim(), operator: "gt", value: YesterDayDate });
                                    filter.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentDate });

                                    // filter.filters.push({ field: Firstname.trim(), operator: "eq", value: YesterDayDate.toDateString() });
                                }

                                if (expsplit[1].trim().toUpperCase() == "THIS WEEK") {

                                    filter = { logic: "and", filters: [] };
                                    filter.filters.push({ field: Firstname.trim(), operator: "gt", value: mondayOfCurrentWeek });
                                    filter.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentDate });
                                }

                                if (expsplit[1].trim().toUpperCase() == "LAST WEEK") {

                                    filter = { logic: "and", filters: [] };
                                    filter.filters.push({ field: Firstname.trim(), operator: "gt", value: lastweekmonday });
                                    filter.filters.push({ field: Firstname.trim(), operator: "lt", value: lastweeksunday });
                                }

                                if (expsplit[1].trim().toUpperCase() == "CURRENT MONTH") {

                                    filter = { logic: "and", filters: [] };
                                    filter.filters.push({ field: Firstname.trim(), operator: "gt", value: firstDayOfCurrentMonth });
                                    filter.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentDate });
                                }

                                if (expsplit[1].trim().toUpperCase() == "LAST MONTH") {

                                    filter = { logic: "and", filters: [] };
                                    filter.filters.push({ field: Firstname.trim(), operator: "gt", value: firstDayPrevMonth });
                                    filter.filters.push({ field: Firstname.trim(), operator: "lt", value: lastDayPrevMonth });
                                }

                                if (expsplit[1].trim().toUpperCase() == "THIS QUARTER" || expsplit[1].trim().toUpperCase() == "CURRENT QUARTER") {

                                    filter = { logic: "and", filters: [] };
                                    filter.filters.push({ field: Firstname.trim(), operator: "gt", value: firstdayOfcurrQuarter });
                                    filter.filters.push({ field: Firstname.trim(), operator: "lt", value: lastdayOfcurrQuarter });
                                }


                                if (expsplit[1].trim().toUpperCase() == "LAST QUARTER") {

                                    filter = { logic: "and", filters: [] };
                                    filter.filters.push({ field: Firstname.trim(), operator: "gt", value: firstdayOflastQuarter });
                                    filter.filters.push({ field: Firstname.trim(), operator: "lt", value: lastdayOflastQuarter });
                                }

                                if (expsplit[1].trim().toUpperCase() == "YEAR TO DATE") {

                                    filter = { logic: "and", filters: [] };
                                    filter.filters.push({ field: Firstname.trim(), operator: "gt", value: currentYearFirstDay });
                                    filter.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentDate });
                                }

                                if (expsplit[1].trim().toUpperCase() == "THIS FINANCIAL YEAR") {

                                    filter = { logic: "and", filters: [] };
                                    filter.filters.push({ field: Firstname.trim(), operator: "gt", value: cfyFirstDay });
                                    filter.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentDate });
                                }

                                if (expsplit[1].trim().toUpperCase() == "LAST FINANCIAL YEAR") {

                                    filter = { logic: "and", filters: [] };
                                    filter.filters.push({ field: Firstname.trim(), operator: "gt", value: lastFinancialYearFirstDay });
                                    filter.filters.push({ field: Firstname.trim(), operator: "lt", value: lastFinancialYearLastDay });
                                }

                            }
                            else {

                                filter.filters.push({ field: Firstname.trim(), operator: "eq", value: expsplit[1].trim() });

                            }
                            ValidFilter = true;

                        }




                        // IS BEFORE CHECK

                        if (expsplitIsBefore.length > 1) {


                            if (expsplitIsBefore[0].toUpperCase().trim() == "CALLDATE" || expsplitIsBefore[0].toUpperCase().trim() == "DATE")
                                Firstname = "starttime";

                            else {
                                alert(" < Operator cannot be assigned to " + expsplitIsBefore[0]);
                                return;
                            }

                            filter.filters.push({ field: Firstname.trim(), operator: "lt", value: moment(expsplitIsBefore[1].trim(), 'DD-MM-YYYY')._d });
                            ValidFilter = true;
                        }

                        // IS AFTER CHECK

                        if (expsplitIsAfter.length > 1) {

                            if (expsplitIsAfter[0].toUpperCase().trim() == "CALLDATE" || expsplitIsAfter[0].toUpperCase().trim() == "DATE")
                                Firstname = "starttime";
                            else {
                                alert(" < Operator cannot be assigned to " + expsplitIsAfter[0]);
                                return;
                            }

                            filter.filters.push({ field: Firstname.trim(), operator: "gt", value: moment(expsplitIsAfter[1].trim(), 'DD-MM-YYYY')._d });
                            ValidFilter = true;
                        }

                        // BETWEEN OR CHECK 
                        if (expsplitBetween.length > 1) {

                            if (expsplitBetween[0].toUpperCase().trim() == "CALLDATE" || expsplitBetween[0].toUpperCase().trim() == "DATE")
                                Firstname = "starttime";

                            else {
                                alert(" < Operator cannot be assigned to " + expsplitBetween[0]);
                                return;
                            }

                            var InnerBetweenSplit = expsplitBetween[1].split("||");
                            if (InnerBetweenSplit.length > 1) {

                                filter = { logic: "and", filters: [] };
                                filter.filters.push({ field: Firstname.trim(), operator: "gt", value: moment(InnerBetweenSplit[0].trim(), 'DD-MM-YYYY')._d });
                                filter.filters.push({ field: Firstname.trim(), operator: "lt", value: moment(InnerBetweenSplit[1].trim(), 'DD-MM-YYYY')._d });
                                ValidFilter = true;
                            }
                        }

                    } //for loop 
                } // if loop
            } //if loop MAIN


            // final code to get execute....
            // 11-04-2016

            if (Firstname == "") {
                alert("Invalid Feild.");
                return;
            }

            if (ValidFilter == true) {
                var ds = $('#project-record-list').getKendoGrid().dataSource;
                ds.filter(filter);
            }
            else {
                alert("Please Check Query ! ");
            }
        }

        $scope.clearFilter = function () {
            $('#project-record-list').getKendoGrid().dataSource.filter([]);
            $scope.textareaText = ''
        }

        $scope.saveFilters = function () {

            if ($scope.textareaText == "") {
                alert("Please write query.")
                return;
            }

            var Querydata = $scope.textareaText.toLowerCase();
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/Views/createView.html',
                backdrop: 'static',
                controller: createViewCtrl,
                size: 'lg',
                resolve: { viewData: { sort: null, col: null, grid: 'call', type: 'Filter', filterQuery: Querydata } }
            });
        }

    }
);

