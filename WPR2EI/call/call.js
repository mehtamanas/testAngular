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
            filterable: false,
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
                    format: '{0:dd/MM/yyyy hh:mm tt}',
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

        callViewApi();

        // for help 
        $scope.helpjqlpopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'call/Grammar_Call.html',
                backdrop: 'static',
                controller: helpjqlController,
                size: 'lg'
            });
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
        });


        // by saroj on 14-04-2016
        // Applying JQL Query 
        $scope.DoWork = function () {
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

                        if (fValue == "CALLER NAME")
                            feild1 = "caller_name";

                        else if (fValue == "CALLER NUMBER")
                            feild1 = "callfrom";

                        else if (fValue == "LEAD NAME")
                            feild1 = "lead_name";

                        else if (fValue == "LEAD NUMBER")
                            feild1 = "callto";

                        else if (fValue == "CALL TYPE")
                            feild1 = "calltype";

                        else if (fValue == "DATE & TIME")
                            feild1 = "starttime";

                        else if (fValue == "DIRECTION")
                            feild1 = "direction";
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

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "CALLER NAME")
                                Firstname = "caller_name";

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "CALLER NUMBER")
                                Firstname = "callfrom";

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "LEAD NAME")
                                Firstname = "lead_name";

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "LEAD NUMBER")
                                Firstname = "callto";

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "CALL TYPE")
                                Firstname = "calltype";

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "DIRECTION")
                                Firstname = "direction";


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

                            if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "CALLER NAME")
                                Firstname = "caller_name";

                            if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "CALLER NUMBER")
                                Firstname = "callfrom";

                            if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "LEAD NAME")
                                Firstname = "lead_name";

                            if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "LEAD NUMBER")
                                Firstname = "callto";

                            if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "CALL TYPE")
                                Firstname = "calltype";


                            if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "DIRECTION")
                                Firstname = "direction";


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

                            if (expsplitIN[0].toUpperCase().trim() == "CALLER NAME")
                                Firstname = "caller_name";

                            if (expsplitIN[0].toUpperCase().trim() == "CALLER NUMBER")
                                Firstname = "callfrom";

                            if (expsplitIN[0].toUpperCase().trim() == "LEAD NAME")
                                Firstname = "lead_name";

                            if (expsplitIN[0].toUpperCase().trim() == "LEAD NUMBER")
                                Firstname = "callto";

                            if (expsplitIN[0].toUpperCase().trim() == "CALL TYPE")
                                Firstname = "calltype";

                            if (expsplitIN[0].toUpperCase().trim() == "DIRECTION")
                                Firstname = "direction";

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

                            if (expsplitNOTIN[0].toUpperCase().trim() == "CALLER NAME")
                                Firstname = "caller_name";

                            if (expsplitNOTIN[0].toUpperCase().trim() == "CALLER NUMBER")
                                Firstname = "callfrom";

                            if (expsplitNOTIN[0].toUpperCase().trim() == "LEAD NAME")
                                Firstname = "lead_name";

                            if (expsplitNOTIN[0].toUpperCase().trim() == "LEAD NUMBER")
                                Firstname = "callto";

                            if (expsplitNOTIN[0].toUpperCase().trim() == "CALL TYPE")
                                Firstname = "calltype";

                            if (expsplitNOTIN[0].toUpperCase().trim() == "DIRECTION")
                                Firstname = "direction";


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

                            if (expsplit[0].toUpperCase().trim() == "CALLER NAME")
                                Firstname = "caller_name";

                            if (expsplit[0].toUpperCase().trim() == "CALLER NUMBER")
                                Firstname = "callfrom";

                            if (expsplit[0].toUpperCase().trim() == "LEAD NAME")
                                Firstname = "lead_name";

                            if (expsplit[0].toUpperCase().trim() == "LEAD NUMBER")
                                Firstname = "callto";

                            if (expsplit[0].toUpperCase().trim() == "CALL TYPE")
                                Firstname = "calltype";

                            if (expsplit[0].toUpperCase().trim() == "DIRECTION")
                                Firstname = "direction";

                            if (expsplit[0].toUpperCase().trim() == "CALLDATE")
                                Firstname = "starttime";

                            if (Firstname == "") {
                                // 18-04-2016
                                //saroj
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            //"last_updated":"2016-04-07T04:20:42.953+00:00"

                            if (Firstname == "starttime") {

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
                                if (expsplit[1].toUpperCase().trim() == "BLANK") {
                                    filter.filters.push({ field: Firstname.trim(), operator: "eq", value: undefined });
                                }
                                else {
                                    //removing inverted commas
                                    expsplit[1] = expsplit[1].replace(/"/g, "");
                                    filter.filters.push({ field: Firstname.trim(), operator: "eq", value: expsplit[1].trim() });
                                }
                            }

                            ValidFilter = true;
                            spiltOK = false;
                        }


                        // NOT EQUAL TO CHECK 
                        if (expsplitNOT.length > 1) {

                            if (expsplitNOT[0].toUpperCase().trim() == "CALLER NAME")
                                Firstname = "caller_name";

                            if (expsplitNOT[0].toUpperCase().trim() == "CALLER NUMBER")
                                Firstname = "callfrom";

                            if (expsplitNOT[0].toUpperCase().trim() == "LEAD NAME")
                                Firstname = "lead_name";

                            if (expsplitNOT[0].toUpperCase().trim() == "LEAD NUMBER")
                                Firstname = "callto";

                            if (expsplitNOT[0].toUpperCase().trim() == "CALL TYPE")
                                Firstname = "calltype";

                            if (expsplitNOT[0].toUpperCase().trim() == "DIRECTION")
                                Firstname = "direction";

                            if (expsplitNOT[0].toUpperCase().trim() == "CALLDATE")
                                Firstname = "starttime";

                            if (Firstname == "") {
                                // 18-04-2016
                                //saroj
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            if (expsplitNOT[1].toUpperCase().trim() == "BLANK") {
                                filter.filters.push({ field: Firstname.trim(), operator: "neq", value: undefined });
                            }
                            else {
                                //removing inverted commas
                                expsplitNOT[1] = expsplitNOT[1].replace(/"/g, "");

                                filter.filters.push({ field: Firstname.trim(), operator: "neq", value: expsplitNOT[1].trim() });
                            }



                            ValidFilter = true;
                            spiltOK = false;
                        }



                        // IS BEFORE CHECK

                        if (expsplitIsBefore.length > 1) {

                            if (expsplitIsBefore[0].toUpperCase().trim() == "CALLDATE")
                                Firstname = "starttime";


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

                            if (expsplitIsAfter[0].toUpperCase().trim() == "CALLDATE")
                                Firstname = "starttime";


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
                                filter.filters.push({ field: Firstname.trim(), operator: "gt", value: moment(expsplitIsAfter[1].trim(), 'DD-MM-YYYY')._d });
                                ValidFilter = true;
                                spiltOK = false;
                            }



                        }


                        // BETWEEN OR CHECK 
                        if (expsplitBetween.length > 1) {

                            if (expsplitBetween[0].toUpperCase().trim() == "CALLDATE")
                                Firstname = "starttime";

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
            $('#project-record-list').getKendoGrid().dataSource.filter([]);
            $scope.textareaText = ''
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
                resolve: { viewData: { sort: sortObject, col: grid.columns, grid: 'call', type: 'View', filterQuery: Querydata, filterObj: grid.dataSource._filter } }
            });
        }

        $scope.editView = function () {
            if ($scope.gridView !== 'default') {
                var viewName = _.filter($scope.views, function (o)
                { return o.id == $scope.gridView });

                var grid = $('##project-record-list').getKendoGrid();

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
                            swal(
                          'Deleted!',
                          'Your file has been deleted.',
                          'success'
                        );
                            $scope.textareaText = ''
                            _.remove($scope.views, function (o) { // remove view name from column
                                return o.id == $scope.gridView;
                            })
                            $scope.gridView = 'default';
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

    }
);

