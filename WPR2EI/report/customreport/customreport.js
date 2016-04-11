angular.module('report')
.controller('CustomreportController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope, teamService, $window, $localStorage, $sessionStorage, $interval) {

        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
        console.log('CustomreportController');
        $scope.gridView = 'default';
        $scope.leadAction = 'no_action';

        var userID = $cookieStore.get('userId');
        //alert($cookieStore.get('userId'));
        $cookieStore.put("people_type", "Lead");

        $rootScope.title = 'Dwellar - Lead Details';
        var loginSession1;
        var orgID = $cookieStore.get('orgID');



        var j = 0;
        $scope.editnew = function (id) {
            $cookieStore.put('contactid', id);
            apiService.get('PersonContactDevice/GetById?ID=' + orgID).then(function (response) {
                $scope.loginSession2 = response.data;
                $state.go('loggedIn.modules.people.add_new');
            },
             function (error) {
                 return deferred.promise;
             });
        };

        $scope.goAddNew = function () {
            $cookieStore.put('contactid', '');
            $state.go('loggedIn.modules.people.add_new');
        };
        $scope.goEdit = function () {
            $state.go('loggedIn.modules.people.update');
        };

        //Audit log start															
        $scope.params =
            {
                device_os: $cookieStore.get('Device_os'),
                device_type: $cookieStore.get('Device'),
                device_mac_id: "34:#$::43:434:34:45",
                module_id: "Contact",
                action_id: "Contact View",
                details: "ContactView",
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

        var callViewApi = function () {

            apiService.getWithoutCaching('Notes/GetByOrgid/' + $cookieStore.get('orgID')).then(function (res) {
                $scope.views = _.filter(res.data, function (o)
                { return o.grid_name === 'lead' && o.query_type !== 'Filter' });
            }, function (err) {

            });
        }


        callViewApi();

        var callFilterApi = function () {

            apiService.getWithoutCaching('Notes/GetByOrgid/' + $cookieStore.get('orgID')).then(function (res) {
                $scope.filterview = _.filter(res.data, function (o)
                { return o.query_type === 'Filter' && o.grid_name === 'lead' });
            }, function (err) {

            });
        }


        callFilterApi();

        $scope.changeView = function () {
            if ($scope.gridView !== 'default') {
                //filter by grid name
                sortObj = _.filter($scope.views, function (o)
                { return o.view_name === $scope.gridView });

                //get the grid datasource
                var grid = $('#contact_kenomain').getKendoGrid();
                var sort = [];
                sort.push({ field: sortObj[0].sort_by, dir: sortObj[0].sort_order });
                var col = (sortObj[0].column_names).split(',');
                for (i = 0; i < $('#contact_kenomain').getKendoGrid().columns.length; i++) {
                    var colFlag = false;
                    for (j = 0; j < col.length; j++) {
                        if (col[j] === $('#contact_kenomain').getKendoGrid().columns[i].field) {
                            $('#contact_kenomain').getKendoGrid().showColumn(i);
                            colFlag = true;
                            break;
                        }
                        if (j === col.length - 1 && colFlag == false) {
                            $('#contact_kenomain').getKendoGrid().hideColumn(i);
                        }
                    }
                }

                $('#contact_kenomain').getKendoGrid().dataSource.sort(sort);
            }
            else {
                $('#contact_kenomain').getKendoGrid().dataSource.sort({});
                for (i = 0; i < $('#contact_kenomain').getKendoGrid().columns.length; i++) {
                    $('#contact_kenomain').getKendoGrid().showColumn(i);
                }

            }
        }

        $scope.changeFilter = function () {
            if ($scope.gridView !== 'default') {
                sortObj = _.filter($scope.filterview, function (o) {
                    return o.view_name === $scope.gridView
                });

                $scope.textareaText = sortObj[0].query_string;
                $scope.callFilter();

            }

        }

        $scope.saveFilters = function () {
            var Querydata = $scope.textareaText.toLowerCase();
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/Views/createView.html',
                backdrop: 'static',
                controller: createViewCtrl,
                size: 'lg',
                resolve: { viewData: { sort: null, col: null, grid: 'lead', type: 'Filter', filterQuery: Querydata } }
            });
        }


        $scope.saveView = function () {
            var grid = $('#contact_kenomain').getKendoGrid();
            if (grid.dataSource._sort) {
                var sortObject = grid.dataSource._sort[0];
            }
            var colObject = _.filter(grid.columns, function (o)
            { return !o.hidden });
            colObject = (_.pluck(colObject, 'field')).join(',');

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/Views/createView.html',
                backdrop: 'static',
                controller: createViewCtrl,
                size: 'lg',
                resolve: { viewData: { sort: sortObject, col: colObject, grid: 'lead', type: 'View', filterQuery: null } }
            });
        }

        $scope.DoWork = function () {
          //  alert('enter hit');
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

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "NAME")
                                Firstname = "Name";

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "FIRSTNAME")
                                Firstname = "Contact_First_Name";

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "LASTNAME")
                                Firstname = "Contact_Last_Name";

                            else if (expsplitCONTAINS[0].toUpperCase().trim() == "EMAIL")
                                Firstname = "Contact_Email";

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "PHONE" || expsplitCONTAINS[0].toUpperCase().trim() == "NUMBER")
                                Firstname = "Contact_Phone";

                            else if (expsplitCONTAINS[0].toUpperCase().trim() == "TAGS")
                                Firstname = "tag1";

                            else if (expsplitCONTAINS[0].toUpperCase().trim() == "COMPANY")
                                Firstname = "company";

                                // for notes still need to confirm with sir
                            else if (expsplitCONTAINS[0].toUpperCase().trim() == "TEXT" || expsplitCONTAINS[0].toUpperCase().trim() == "NOTES")
                                Firstname = "text";

                            else if (expsplitCONTAINS[0].toUpperCase().trim() == "LEAD SOURCE")
                                Firstname = "leadsource";

                            filter.filters.push({ field: Firstname.trim(), operator: "contains", value: expsplitCONTAINS[1].trim() });
                            ValidFilter = true;
                        }

                        // IN CHECK

                        if (expsplitIN.length > 1) {


                            if (expsplitIN[0].toUpperCase().trim() == "NAME")
                                Firstname = "Name";

                            if (expsplitIN[0].toUpperCase().trim() == "FIRSTNAME")
                                Firstname = "Contact_First_Name";

                            if (expsplitIN[0].toUpperCase().trim() == "LASTNAME")
                                Firstname = "Contact_Last_Name";

                            else if (expsplitIN[0].toUpperCase().trim() == "EMAIL")
                                Firstname = "Contact_Email";

                            if (expsplitIN[0].toUpperCase().trim() == "PHONE" || expsplitIN[0].toUpperCase().trim() == "NUMBER")
                                Firstname = "Contact_Phone";

                            else if (expsplitIN[0].toUpperCase().trim() == "TAGS")
                                Firstname = "tag1";

                            else if (expsplitIN[0].toUpperCase().trim() == "COMPANY")
                                Firstname = "company";

                                // for notes still need to confirm with sir
                            else if (expsplitIN[0].toUpperCase().trim() == "TEXT" || expsplitIN[0].toUpperCase().trim() == "NOTES")
                                Firstname = "text";

                            else if (expsplitIN[0].toUpperCase().trim() == "LEAD SOURCE")
                                Firstname = "leadsource";

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


                            if (expsplit[0].toUpperCase().trim() == "FIRSTNAME")
                                Firstname = "Contact_First_Name";

                            if (expsplit[0].toUpperCase().trim() == "LASTNAME")
                                Firstname = "Contact_Last_Name";

                            else if (expsplit[0].toUpperCase().trim() == "EMAIL")
                                Firstname = "Contact_Email";

                            if (expsplit[0].toUpperCase().trim() == "PHONE" || expsplit[0].toUpperCase().trim() == "NUMBER")
                                Firstname = "Contact_Phone";

                            else if (expsplit[0].toUpperCase().trim() == "TAGS")
                                Firstname = "tag1";

                            else if (expsplit[0].toUpperCase().trim() == "COMPANY")
                                Firstname = "company";

                                // for notes still need to confirm with sir
                            else if (expsplit[0].toUpperCase().trim() == "TEXT" || expsplit[0].toUpperCase().trim() == "NOTES")
                                Firstname = "text";

                            else if (expsplit[0].toUpperCase().trim() == "ASSIGNED TO")
                                Firstname = "Assigned_To";

                            else if (expsplit[0].toUpperCase().trim() == "LEAD SOURCE")
                                Firstname = "leadsource";

                            else if (expsplit[0].toUpperCase().trim() == "NAME")
                                Firstname = "Name";

                            else if (expsplit[0].toUpperCase().trim() == "LEAD SOURCE")
                                Firstname = "leadsource";

                            else if (expsplit[0].toUpperCase().trim() == "FOLLOW UP COUNT")
                                Firstname = "follow_up_count";

                            if (expsplit[0].toUpperCase().trim() == "LAST CONTACTED DATE")
                                Firstname = "last_contacted";

                            if (expsplit[0].toUpperCase().trim() == "UPDATED DATE")
                                Firstname = "last_updated";

                            if (Firstname == "follow_up_count") {
                                filter.filters.push({ field: Firstname.trim(), operator: "eq", value: parseFloat(expsplit[1].trim()) });
                                ValidFilter = true;
                            }
                            else {
                                //"last_updated":"2016-04-07T04:20:42.953+00:00"

                                if (Firstname == "last_contacted" || Firstname == "last_updated") {


                                    var CurrentDate = moment().startOf('day')._d;
                                    var TommDate = moment().startOf('day').add(+1, 'days')._d;
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

                                    else if (expsplit[1].trim().toUpperCase() == "YESTERDAY") {

                                        filter = { logic: "and", filters: [] };
                                        filter.filters.push({ field: Firstname.trim(), operator: "gt", value: YesterDayDate });
                                        filter.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentDate });

                                        // filter.filters.push({ field: Firstname.trim(), operator: "eq", value: YesterDayDate.toDateString() });
                                    }

                                    else if (expsplit[1].trim().toUpperCase() == "THIS WEEK") {

                                        filter = { logic: "and", filters: [] };
                                        if (mondayOfCurrentWeek.getDate() == CurrentDate.getDate()) {

                                            filter.filters.push({ field: Firstname.trim(), operator: "gt", value: CurrentDate });
                                            filter.filters.push({ field: Firstname.trim(), operator: "lt", value: TommDate });
                                        }
                                        else {
                                            filter.filters.push({ field: Firstname.trim(), operator: "gte", value: mondayOfCurrentWeek });
                                            filter.filters.push({ field: Firstname.trim(), operator: "lte", value: CurrentDate });
                                        }

                                    }

                                    else if (expsplit[1].trim().toUpperCase() == "LAST WEEK") {

                                        filter = { logic: "and", filters: [] };
                                        filter.filters.push({ field: Firstname.trim(), operator: "gt", value: lastweekmonday });
                                        filter.filters.push({ field: Firstname.trim(), operator: "lt", value: lastweeksunday });
                                    }

                                    else if (expsplit[1].trim().toUpperCase() == "CURRENT MONTH") {

                                        filter = { logic: "and", filters: [] };
                                        //if (firstDayOfCurrentMonth.getDate() == CurrentDate.getDate()) {
                                        //    filter.filters.push({ field: Firstname.trim(), operator: "gt", value: firstDayOfCurrentMonth });
                                        //    filter.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentDate.getDate() + 1 });
                                        //}
                                        //else {
                                        filter.filters.push({ field: Firstname.trim(), operator: "gt", value: firstDayOfCurrentMonth });
                                        filter.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentDate });
                                        // }
                                    }

                                    else if (expsplit[1].trim().toUpperCase() == "LAST MONTH") {

                                        filter = { logic: "and", filters: [] };
                                        filter.filters.push({ field: Firstname.trim(), operator: "gt", value: firstDayPrevMonth });
                                        filter.filters.push({ field: Firstname.trim(), operator: "lt", value: lastDayPrevMonth });
                                    }

                                    else if (expsplit[1].trim().toUpperCase() == "THIS QUARTER" || expsplit[1].trim().toUpperCase() == "CURRENT QUARTER") {

                                        filter = { logic: "and", filters: [] };
                                        filter.filters.push({ field: Firstname.trim(), operator: "gt", value: firstdayOfcurrQuarter });
                                        filter.filters.push({ field: Firstname.trim(), operator: "lt", value: lastdayOfcurrQuarter });
                                    }


                                    else if (expsplit[1].trim().toUpperCase() == "LAST QUARTER") {

                                        filter = { logic: "and", filters: [] };
                                        filter.filters.push({ field: Firstname.trim(), operator: "gt", value: firstdayOflastQuarter });
                                        filter.filters.push({ field: Firstname.trim(), operator: "lt", value: lastdayOflastQuarter });
                                    }

                                    else if (expsplit[1].trim().toUpperCase() == "YEAR TO DATE") {

                                        filter = { logic: "and", filters: [] };
                                        filter.filters.push({ field: Firstname.trim(), operator: "gt", value: currentYearFirstDay });
                                        filter.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentDate });
                                    }

                                    else if (expsplit[1].trim().toUpperCase() == "THIS FINANCIAL YEAR") {

                                        filter = { logic: "and", filters: [] };
                                        filter.filters.push({ field: Firstname.trim(), operator: "gt", value: cfyFirstDay });
                                        filter.filters.push({ field: Firstname.trim(), operator: "lt", value: CurrentDate });
                                    }

                                    else if (expsplit[1].trim().toUpperCase() == "LAST FINANCIAL YEAR") {

                                        filter = { logic: "and", filters: [] };
                                        filter.filters.push({ field: Firstname.trim(), operator: "gt", value: lastFinancialYearFirstDay });
                                        filter.filters.push({ field: Firstname.trim(), operator: "lt", value: lastFinancialYearLastDay });
                                    }

                                    else if (expsplit[1].trim().toUpperCase() == "NEVER") {

                                        filter = { logic: "and", filters: [] };
                                        filter.filters.push({ field: Firstname.trim(), operator: "eq", value: '' });
                                    }
                                    else {
                                        //new chnage 9-4-16
                                        filter = { logic: "and", filters: [] };

                                        var Date1 = moment(expsplit[1].trim(), 'D/M/YYYY');
                                        var Datex = moment(expsplit[1].trim(), 'D/M/YYYY');
                                        var Date2 = Datex.add('days', 1);

                                        filter.filters.push({ field: Firstname.trim(), operator: "gt", value: Date1 });
                                        filter.filters.push({ field: Firstname.trim(), operator: "lt", value: Date2 });

                                    }
                                }

                                else {
                                    filter.filters.push({ field: Firstname.trim(), operator: "eq", value: expsplit[1].trim() });
                                }
                                ValidFilter = true;
                            }
                        }


                        // GREATER THAN EQUAL TO CHECK
                        if (expSplitGTE.length > 1) {

                            if (expSplitGTE[0].toUpperCase().trim() == "FOLLOW UP COUNT")
                                Firstname = "follow_up_count";
                            else {
                                alert(" >= Operator cannot be assigned to " + expSplitGTE[0]);
                                return;
                            }

                            filter.filters.push({ field: Firstname.trim(), operator: "gte", value: parseFloat(expSplitGTE[1].trim()) });
                            ValidFilter = true;
                        }

                        // LESSER THAN EQUAL TO CHECK
                        if (expSplitLTE.length > 1) {

                            if (expSplitLTE[0].toUpperCase().trim() == "FOLLOW UP COUNT")
                                Firstname = "follow_up_count";
                            else {
                                alert(" <= Operator cannot be assigned to " + expSplitLTE[0]);
                                return;
                            }

                            filter.filters.push({ field: Firstname.trim(), operator: "lte", value: parseFloat(expSplitLTE[1].trim()) });
                            ValidFilter = true;
                        }

                        // IS BEFORE CHECK

                        if (expsplitIsBefore.length > 1) {


                            if (expsplitIsBefore[0].toUpperCase().trim() == "LAST CONTACTED DATE")
                                Firstname = "last_contacted";

                            else if (expsplitIsBefore[0].toUpperCase().trim() == "UPDATED DATE")
                                Firstname = "last_updated";

                            else {
                                alert(" < Operator cannot be assigned to " + expsplitIsBefore[0]);
                                return;
                            }

                            filter.filters.push({ field: Firstname.trim(), operator: "lt", value: moment(expsplitIsBefore[1].trim(), 'DD-MM-YYYY')._d });
                            ValidFilter = true;
                        }

                        // IS AFTER CHECK

                        if (expsplitIsAfter.length > 1) {

                            if (expsplitIsAfter[0].toUpperCase().trim() == "LAST CONTACTED DATE")
                                Firstname = "last_contacted";

                            else if (expsplitIsAfter[0].toUpperCase().trim() == "UPDATED DATE")
                                Firstname = "last_updated";

                            else {
                                alert(" < Operator cannot be assigned to " + expsplitIsAfter[0]);
                                return;
                            }

                            filter.filters.push({ field: Firstname.trim(), operator: "gt", value: moment(expsplitIsAfter[1].trim(), 'DD-MM-YYYY')._d });
                            ValidFilter = true;
                        }

                        // 

                        // BETWEEN OR CHECK 
                        if (expsplitBetween.length > 1) {

                            if (expsplitBetween[0].toUpperCase().trim() == "LAST CONTACTED DATE")
                                Firstname = "last_contacted";

                            else if (expsplitBetween[0].toUpperCase().trim() == "UPDATED DATE")
                                Firstname = "last_updated";

                            else {
                                alert(" < Operator cannot be assigned to " + expsplitBetween[0]);
                                return;
                            }

                            var InnerBetweenSplit = expsplitBetween[1].split("||");

                            if (InnerBetweenSplit.length > 1) {

                                filter = { logic: "and", filters: [] };

                                filter.filters.push({ field: Firstname.trim(), operator: "gte", value: moment(InnerBetweenSplit[0].trim().toString(), 'DD-MM-YYYY').startOf('day')._d });
                                filter.filters.push({ field: Firstname.trim(), operator: "lte", value: moment(InnerBetweenSplit[1].trim().toString(), 'DD-MM-YYYY').endOf('day')._d });
                                ValidFilter = true;
                            }
                        }

                    } //for loop 
                } // if loop
            } //if loop MAIN


            // final code to get execute....

            if (Firstname == "") {
                alert("Invalid Feild.");
                return;
            }

            if (ValidFilter == true) {
                var ds = $('#contact_kenomain').getKendoGrid().dataSource;
                ds.filter(filter);
            }
            else {
                alert("Please Check Query.");
            }
        }

        //var ValidFilter = false;
        //var filter = "";
        //var logsplit = "";


        //$scope.callFilter = function () {
        //    var txtdata = $scope.textareaText.toLowerCase();
        //    var Firstname = "";

        //    var AndSpl = txtdata.split(" and ");


        //    if (AndSpl.length == 1) {
        //        filter = { logic: "and", filters: [] };
        //        callPush(AndSpl);
        //    }

        //    if (AndSpl.length > 1) {
        //        var ORSpl1 = AndSpl[1].split(" or ");

        //        if (ORSpl1.length == 1) {
        //            filter = { logic: "and", filters: [] };
        //            callPush(AndSpl);
        //            //callPush(AndSpl[1]);
        //        }
        //        else if (ORSpl1.length > 1) {
        //            filter = { logic: "or", filters: [] };
        //            callPush(ORSpl1);
        //        }

        //        var ORSpl2 = AndSpl[0].split(" or ");

        //        if (ORSpl2.length == 1) {
        //            filter = { logic: "and", filters: [] };
        //            callPush(ORSpl2);
        //            //callPush(AndSpl[1]);
        //        }
        //        else if (ORSpl2.length > 1) {
        //            filter = { logic: "or", filters: [] };
        //            callPush(ORSpl2);
        //        }
        //    }

        //    //else {
        //    //    filter = { logic: "or", filters: [] };
        //    //    callPush(AndSpl[0]);

        //    //}



        //    //filter = { logic: "or", filters: [] };

        //    //if (txtdata.length > 0) {
        //    //    logsplit = txtdata.split(" or ");

        //    //    callPush(txtdata, logsplit);

        //    if (ValidFilter == true) {
        //        var ds = $('#contact_kenomain').getKendoGrid().dataSource;
        //        ds.filter(filter);
        //    }
        //    else {
        //        alert("Please Check Query ! ");
        //    }

        //}

        //function callPush(logsplit) {

        //    // alert("or split value =  " + logsplit.length);
        //    if (logsplit.length > 0) {
        //        for (var j = 0; j < logsplit.length; j++) {
        //            // alert("value for j is " + j);

        //            //FOR DATES 
        //            var expsplitIsBefore = logsplit[j].split(" isbefore ");
        //            var expsplitIsAfter = logsplit[j].split(" isafter ");
        //            var expsplitBetween = logsplit[j].split(" between ");

        //            var expEQ = logsplit[j].split(" = ");
        //            var expIS = logsplit[j].split(" is ");

        //            var expsplit = "";
        //            if (expEQ.length > 1)
        //                expsplit = expEQ;

        //            if (expIS.length > 1)
        //                expsplit = expIS;

        //            var expsplitCONTAINS = logsplit[j].split(" contains ");
        //            // var expsplitIN = logsplit[j].split(/in(.*)?/);

        //            var expsplitIN = logsplit[j].split(" in ");

        //            var expSplitGTE = logsplit[j].split(" >= ");

        //            var expSplitLTE = logsplit[j].split(" <= ");

        //            var expSplitGT = logsplit[j].split(" > ");

        //            var expSplitLT = logsplit[j].split(" < ");

        //            // CONTAINS  CHECK   
        //            if (expsplitCONTAINS.length > 1) {

        //                if (expsplitCONTAINS[0].toUpperCase().trim() == "NAME")
        //                    Firstname = "Name";

        //                if (expsplitCONTAINS[0].toUpperCase().trim() == "FIRSTNAME")
        //                    Firstname = "Contact_First_Name";

        //                if (expsplitCONTAINS[0].toUpperCase().trim() == "LASTNAME")
        //                    Firstname = "Contact_Last_Name";

        //                else if (expsplitCONTAINS[0].toUpperCase().trim() == "EMAIL")
        //                    Firstname = "Contact_Email";

        //                if (expsplitCONTAINS[0].toUpperCase().trim() == "PHONE" || expsplitCONTAINS[0].toUpperCase().trim() == "NUMBER")
        //                    Firstname = "Contact_Phone";

        //                else if (expsplitCONTAINS[0].toUpperCase().trim() == "TAGS")
        //                    Firstname = "tag1";

        //                else if (expsplitCONTAINS[0].toUpperCase().trim() == "COMPANY")
        //                    Firstname = "company";

        //                    // for notes still need to confirm with sir
        //                else if (expsplitCONTAINS[0].toUpperCase().trim() == "TEXT" || expsplitCONTAINS[0].toUpperCase().trim() == "NOTES")
        //                    Firstname = "text";

        //                filter.filters.push({ field: Firstname.trim(), operator: "contains", value: expsplitCONTAINS[1].trim() });
        //                ValidFilter = true;
        //            }



        //            // IN CHECK

        //            if (expsplitIN.length > 1) {


        //                if (expsplitIN[0].toUpperCase().trim() == "NAME")
        //                    Firstname = "Name";

        //                if (expsplitIN[0].toUpperCase().trim() == "FIRSTNAME")
        //                    Firstname = "Contact_First_Name";

        //                if (expsplitIN[0].toUpperCase().trim() == "LASTNAME")
        //                    Firstname = "Contact_Last_Name";

        //                else if (expsplitIN[0].toUpperCase().trim() == "EMAIL")
        //                    Firstname = "Contact_Email";

        //                if (expsplitIN[0].toUpperCase().trim() == "PHONE" || expsplitIN[0].toUpperCase().trim() == "NUMBER")
        //                    Firstname = "Contact_Phone";

        //                else if (expsplitIN[0].toUpperCase().trim() == "TAGS")
        //                    Firstname = "tag1";

        //                else if (expsplitIN[0].toUpperCase().trim() == "COMPANY")
        //                    Firstname = "company";

        //                    // for notes still need to confirm with sir
        //                else if (expsplitIN[0].toUpperCase().trim() == "TEXT" || expsplitIN[0].toUpperCase().trim() == "NOTES")
        //                    Firstname = "text";

        //                var mystring = expsplitIN[1].trim().replace(/["'\(\)]/g, "");
        //                // alert(mystring);

        //                var newString = mystring.split(',');
        //                if (newString.length >= 1) {
        //                    for (var k = 0; k < newString.length; k++) {
        //                        // newString
        //                        filter.filters.push({ field: Firstname.trim(), operator: "contains", value: newString[k].trim() });
        //                        ValidFilter = true;
        //                    }
        //                }
        //            }


        //            // EQUAL TO CHECK 
        //            if (expsplit.length > 1) {


        //                if (expsplit[0].toUpperCase().trim() == "FIRSTNAME")
        //                    Firstname = "Contact_First_Name";

        //                if (expsplit[0].toUpperCase().trim() == "LASTNAME")
        //                    Firstname = "Contact_Last_Name";

        //                else if (expsplit[0].toUpperCase().trim() == "EMAIL")
        //                    Firstname = "Contact_Email";

        //                if (expsplit[0].toUpperCase().trim() == "PHONE" || expsplit[0].toUpperCase().trim() == "NUMBER")
        //                    Firstname = "Contact_Phone";

        //                else if (expsplit[0].toUpperCase().trim() == "TAGS")
        //                    Firstname = "tag1";

        //                else if (expsplit[0].toUpperCase().trim() == "COMPANY")
        //                    Firstname = "company";

        //                    // for notes still need to confirm with sir
        //                else if (expsplit[0].toUpperCase().trim() == "TEXT" || expsplit[0].toUpperCase().trim() == "NOTES")
        //                    Firstname = "text";

        //                else if (expsplit[0].toUpperCase().trim() == "ASSIGNED TO")
        //                    Firstname = "Assigned_To";

        //                else if (expsplit[0].toUpperCase().trim() == "LEAD SOURCE")
        //                    Firstname = "leadsource";

        //                else if (expsplit[0].toUpperCase().trim() == "NAME")
        //                    Firstname = "Name";

        //                else if (expsplit[0].toUpperCase().trim() == "FOLLOW UP COUNT")
        //                    Firstname = "follow_up_count";

        //                //if (expsplit[1].trim() == "")
        //                //    expsplit[1].trim() = null;

        //                if (Firstname == "follow_up_count") {
        //                    filter.filters.push({ field: Firstname.trim(), operator: "eq", value: parseFloat(expsplit[1].trim()) });
        //                    ValidFilter = true;
        //                }
        //                else {
        //                    filter.filters.push({ field: Firstname.trim(), operator: "eq", value: expsplit[1].trim() });
        //                    ValidFilter = true;
        //                }
        //            }


        //            // GREATER THAN EQUAL TO CHECK
        //            if (expSplitGTE.length > 1) {

        //                if (expSplitGTE[0].toUpperCase().trim() == "FOLLOW UP COUNT")
        //                    Firstname = "follow_up_count";
        //                else {
        //                    alert(" >= Operator cannot be assigned to " + expSplitGTE[0]);
        //                    return;
        //                }

        //                filter.filters.push({ field: Firstname.trim(), operator: "gte", value: parseFloat(expSplitGTE[1].trim()) });
        //                ValidFilter = true;
        //            }

        //            // LESSER THAN EQUAL TO CHECK
        //            if (expSplitLTE.length > 1) {



        //                if (expSplitLTE[0].toUpperCase().trim() == "FOLLOW UP COUNT")
        //                    Firstname = "follow_up_count";
        //                else {
        //                    alert(" <= Operator cannot be assigned to " + expSplitLTE[0]);
        //                    return;
        //                }

        //                filter.filters.push({ field: Firstname.trim(), operator: "lte", value: parseFloat(expSplitLTE[1].trim()) });
        //                ValidFilter = true;
        //            }

        //            // IS BEFORE CHECK

        //            if (expsplitIsBefore.length > 1) {


        //                if (expsplitIsBefore[0].toUpperCase().trim() == "LAST CONTACTED DATE")
        //                    Firstname = "last_contacted";

        //                else if (expsplitIsBefore[0].toUpperCase().trim() == "UPDATED DATE")
        //                    Firstname = "last_updated";

        //                else {
        //                    alert(" < Operator cannot be assigned to " + expsplitIsBefore[0]);
        //                    return;
        //                }

        //                filter.filters.push({ field: Firstname.trim(), operator: "lt", value: moment(expsplitIsBefore[1].trim(), 'DD-MM-YYYY')._d });
        //                ValidFilter = true;
        //            }

        //            // IS AFTER CHECK

        //            if (expsplitIsAfter.length > 1) {

        //                if (expsplitIsAfter[0].toUpperCase().trim() == "LAST CONTACTED DATE")
        //                    Firstname = "last_contacted";

        //                else if (expsplitIsAfter[0].toUpperCase().trim() == "UPDATED DATE")
        //                    Firstname = "last_updated";

        //                else {
        //                    alert(" < Operator cannot be assigned to " + expsplitIsAfter[0]);
        //                    return;
        //                }

        //                filter.filters.push({ field: Firstname.trim(), operator: "gt", value: moment(expsplitIsAfter[1].trim(), 'DD-MM-YYYY')._d });
        //                ValidFilter = true;
        //            }


        //            // 

        //            // BETWEEN OR CHECK 
        //            if (expsplitBetween.length > 1) {

        //                if (expsplitBetween[0].toUpperCase().trim() == "LAST CONTACTED DATE")
        //                    Firstname = "last_contacted";

        //                else if (expsplitBetween[0].toUpperCase().trim() == "UPDATED DATE")
        //                    Firstname = "last_updated";

        //                else {
        //                    alert(" < Operator cannot be assigned to " + expsplitBetween[0]);
        //                    return;
        //                }

        //                var InnerBetweenSplit = expsplitBetween[1].split("||");

        //                if (InnerBetweenSplit.length > 1) {
        //                    filter.filters.push({ field: Firstname.trim(), operator: "gt", value: moment(InnerBetweenSplit[0].trim(), 'DD-MM-YYYY')._d });
        //                    filter.filters.push({ field: Firstname.trim(), operator: "lt", value: moment(InnerBetweenSplit[1].trim(), 'DD-MM-YYYY')._d });
        //                    ValidFilter = true;
        //                }
        //            }

        //        }
        //    }
        //}



        $scope.chooseAction = function () {
            var allGridElements = $(".checkbox").toArray();
            var allCheckedElement = _.filter(allGridElements, function (o)
            { return o.checked });
            allCheckedIds = (_.pluck(allCheckedElement, 'dataset.id'));
            $cookieStore.remove('checkedIds');
            $cookieStore.put('checkedIds', allCheckedIds);

            if (allCheckedIds.length > 0) {

                if ($scope.leadAction === "no_action") {

                }
                else if ($scope.leadAction === "add_tag") {
                    $state.go($scope.tagOptionPopup());
                }
                else if ($scope.leadAction === "assign_to") {
                    $state.go($scope.assignToUpPopup());
                }
                else if ($scope.leadAction === "delete") {
                    var contactDelete = [];
                    for (var i in allCheckedIds) {
                        var contact = {};
                        contact.id = allCheckedIds[i];
                        contact.organization_id = $cookieStore.get('orgID');
                        contactDelete.push(contact);
                    }
                    $cookieStore.put('contactDelete', contactDelete);
                    $scope.openConfirmation();
                }
            }
        }

        //Sync
        $scope.clearFilter = function () {
            $('#contact_kenomain').getKendoGrid().dataSource.filter([]);
            $scope.textareaText = ''
        }


        var syncLeadDataSource = function () {
            apiService.getWithoutCaching("Contact/GetAllContactDetails?Id=" + userID + "&type=Lead").then(function (response) {
                data = response.data;
                for (i = 0; i < data.length; i++) {
                    var tag = (data[i].Tags);
                    if (tag !== null) {
                        tag = JSON.parse(tag);
                        data[i].Tags = [];
                        data[i].Tags = tag;
                    }
                    else { data[i].Tags = []; }
                }
                $localStorage.leadDataSource = data;
            })
        };
        //Sync Ends

        // Kendo code
        $scope.LeadGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: function (options) {
                        if ($localStorage.leadDataSource)
                        { options.success($localStorage.leadDataSource); }
                        else {
                            apiService.getWithoutCaching("Contact/GetAllContactDetails?Id=" + userID + "&type=Lead").then(function (response) {
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
                                $localStorage.leadDataSource = data;
                                options.success(data);
                            }, function (error) {
                                options.error(error);
                            })
                        }
                    },

                },
                pageSize: 20
            },
            dataBound: function () {
                //syncData = $interval(syncLeadDataSource, 5000);
            },
            groupable: true,
            sortable: true,
            selectable: "multiple",
            reorderable: true,
            height: screen.height - 350,
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
            },
            columns: [
                  {
                      template: "<input type='checkbox', class='checkbox', data-id='#= Contact_Id #',  ng-click='check($event,dataItem)' />",
                      title: "<input id='checkAll', type='checkbox', class='check-box', ng-click='checkALL(dataItem)' />",
                      width: "60px",
                      field: 'Contact_Id',
                      attributes:
                       {
                           "class": "UseHand",
                           "style": "text-align:center"
                       }
                  }, {
                      template: "<div class='user-photo_1' style='margin-left:35%'><img class='image2' src='#= Contact_Image #'/></div>" +
                                "<span style='padding-left:10px' class='customer-name'> </span>",
                      width: "120px",
                      title: "Picture",
                      field: 'Contact_Image',
                      attributes:
                      {
                          "class": "UseHand",
                      }
                  }, {
                      field: "Name",
                      template: '<a ui-sref="app.contactdetail({id:dataItem.Contact_Id})" href="" class="contact_name">#=Name#</a>',
                      width: "200px",
                      title: 'Name',
                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "Contact_Phone",
                      title: "Phone",
                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"

                      }
                  }, {
                      field: "Contact_Email",
                      title: " Email",

                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "City",
                      title: "City",

                      attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "Assigned_To",
                      title: "Assigned To",

                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "Type",
                      title: "Type",

                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  },
        {
            field: "company",
            title: "Company",

            attributes: {
                "class": "UseHand",
                "style": "text-align:center"
            }
        },
        {
            field: "Tags",
            template: "<span ng-repeat='tag in dataItem.Tags' style='background-color:{{tag.background_color}}; margin-bottom: 5px;line-height:1.2em;' class='properties-close  upper tag-name' ng-hide='{{$index>1}}'>{{tag.name}}</span><br><span  ng-hide='{{dataItem.Tags.length<3}}'><small>Show More..</small></span>",
            title: "TAGS",
            width: "220px",

            attributes: {
                "class": "UseHand",
                "style": "text-align:center"
            }
        },
        {
            field: "leadsource",
            title: "Lead Source",

            attributes: {
                "class": "UseHand",
                "style": "text-align:center"
            }
        },
        //{
        //    field: "follow_up_count",
        //    title: "Follow Up",
        //    type:'number',
        //    attributes: {
        //        "class": "UseHand",
        //        "style": "text-align:center"
        //    }
        //},
        {
            field: "last_contacted",
            title: "Last Contacted Date",
            type: 'date',
            format: '{0:dd/MM/yyyy hh:mm:ss tt}',
            attributes: {
                "class": "UseHand",
                "style": "text-align:center"
            }
        },
        {
            field: "last_updated",
            title: "Updated Date",
            type: 'date',
            format: '{0:dd/MM/yyyy hh:mm:ss tt}',
            //template: "#= kendo.toString(kendo.parseDate(Contact_Created_Date, 'yyyy-MM-dd hh:mmtt'), 'MM/dd/yyyy') #",
            attributes: {
                "class": "UseHand",
                "style": "text-align:center"
            }
        },
        {
            title: "Action",
            template: "<a id='followUp'class='btn btn-primary' ng-click='openFollowUp(dataItem)' data-toggle='modal'>Follow up </a> </div>",
            field: 'Action',
            attributes:
            {
                "class": "UseHand",
                "style": "text-align:center"
            }
        }, ]
        };


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
            $("#contact_kenomain").kendoTooltip({
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
                filter: "td:nth-child(10)", //this filter selects the  column cells
                position: "top",
                beforeShow: function (e) {
                    console.log(e);
                    if ($(e.target).data("tagName") === null) {

                        // don't show the tooltip if the name attribute contains null
                        e.preventDefault();
                    }
                },
                content: function (e) {

                    var dataItem = $("#contact_kenomain").data("kendoGrid").dataItem(e.target.closest("tr"));
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

        // Kendo Grid on change
        $scope.myGridChange = function (dataItem) {
            // dataItem will contain the row that was selected
            window.sessionStorage.selectedCustomerID = dataItem.Contact_Id;

            $state.go('app.contactdetail', { id: dataItem.Contact_Id });
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

        $scope.$on('REFRESH2', function (event, args) {
            if (args.name == 'LeadGrid') {
                // $('.k-i-refresh').trigger("click");
                $('#contact_kenomain').getKendoGrid().dataSource.insert(0, { 'Name': args.data.first_name + '' + args.data.last_name, 'Contact_Id': args.data.id, 'Contact_Image': 'https://dwellarstorageuat.blob.core.windows.net/personphoto/655faf0a-1295-4390-bb5d-23febc9ae672default.jpg' });
            } else if (args.name == 'LeadGrid') {
                callViewApi();
                callFilterApi();
                $scope.gridView = args;
            }
            $scope.leadAction = 'no_action';
            $('#checkAll').prop('checked', false);

            callViewApi();
            callFilterApi();
        });

        $scope.openFollowUp = function (d) {
            var id = d.Contact_Id;
            window.sessionStorage.selectedCustomerID = id;
            $cookieStore.put('company_name', d.company);
            $cookieStore.put('lead_name', d.Name);
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/company/followUp.html',
                backdrop: 'static',
                controller: FollowUpController,
                size: 'lg'

            });

        };


        $scope.openContactPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/add_new_contact.tpl.html',
                backdrop: 'static',

                controller: ContactPopUpController,
                size: 'lg'
            });
        };

        $scope.openUploadContactPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/UploadContact.html',
                backdrop: 'static',

                controller: ContactUploadPopUpController,
                size: 'lg'
            });
        };

        $scope.openUploadNotesPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/UploadNotes.html',
                backdrop: 'static',

                controller: ContactNotesUploadPopUpController,
                size: 'lg'
            });
        };

        $scope.openAddLeadPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/optionLead.html',
                backdrop: 'static',
                controller: OptionLeadController,
                windowClass: 'addUser',
                resolve: {
                    teamService: teamService,
                    teamData: {
                        teamId: window.sessionStorage.selectedCustomerID,
                        orgId: $cookieStore.get('orgID')
                    }
                }
            });
        };


        $scope.tagOptionPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/option.html',
                backdrop: 'static',
                controller: TagPopUpController,
                size: 'lg'
            });
        };

        $scope.assignToUpPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/AssignToContact.tpl.html',
                backdrop: 'static',
                controller: ActionUpController,
                size: 'lg'
            });
        };

        $scope.openConfirmation = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/confirm.tpl.html',
                backdrop: 'static',
                controller: confirmationController,
                size: 'lg',
                resolve: { items: { title: "Contact" } }

            });

        }

        function clearFilters() {
            var gridData = $("#peopleGrid").data("kendoGrid");
            gridData.dataSource.filter({});
        }
    }
);

