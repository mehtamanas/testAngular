angular.module('contacts')
.controller('LeadListController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope, teamService, $window, $localStorage, $sessionStorage, $interval, $timeout, $filter) {

        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
        console.log('ContactListController');
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

        // code by ankit on 13-04-2016 for view & JQL Query 
        function getDefaultView(views, id) {
            var result = id == null ? $filter('filter')(views, { default_view: true }, true)[0] : $filter('filter')(views, { id: id }, true)[0];
            return result;
        }		        

        var callViewApi = function (id) {

            apiService.getWithoutCaching('Notes/GetByOrgid/' + $cookieStore.get('orgID')).then(function (res) {
                $scope.views = _.filter(res.data, function (o)
                { return o.query_type === 'View' && o.grid_name === 'lead' });

                $scope.defaultView = id == null ? getDefaultView($scope.views) : getDefaultView($scope.views, id);
                if ($scope.defaultView == null) {
                    $scope.gridView = 'default';
                }
                else {
                    $scope.gridView = $scope.defaultView.id;
                    $scope.queryText = $scope.defaultView.query_string.replace(/"/g, "");
                }
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
                var grid = $('#contact_kenomain').getKendoGrid();

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
                $('#contact_kenomain').getKendoGrid().dataSource.sort({});
                $('#contact_kenomain').getKendoGrid().dataSource.filter({});
                $scope.textareaText = null;
                for (i = 0; i < $('#contact_kenomain').getKendoGrid().columns.length; i++) {
                    $('#contact_kenomain').getKendoGrid().showColumn(i);

                }

            }

        }


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
                resolve: { viewData: { sort: sortObject, col: grid.columns, grid: 'lead', type: 'View', filterQuery: Querydata, filterObj: grid.dataSource._filter } }
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
                    resolve: { viewData: { sort: sortObject, col: grid.columns, grid: 'lead', type: 'View', filterQuery: Querydata, filterObj: grid.dataSource._filter, viewName: viewName[0].view_name, viewId: $scope.gridView, isViewDefault: viewName[0].default_view } }
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
                            $('#contact_kenomain').getKendoGrid().dataSource.filter({});
                            $('#contact_kenomain').getKendoGrid().dataSource.sort({});
                            $scope.textareaText = ''
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
                syncData = $interval(syncLeadDataSource, 300000);
            },
            groupable: true,
            columnMenu: true,
            sortable: true,
            selectable: "multiple",
            reorderable: true,
            height: window.innerHeight - 210,
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
            },
            columns: [
                  {
                      //template: "<div class='checkbox c-checkbox needsclick'><label class='needsclick'><input type='checkbox' required='' name='checkbox' ng-model='checkbox' class='checkbox needsclick ng-dirty ng-valid-parse ng-touched ng-not-empty ng-valid ng-valid-required' data-id='#= Contact_Id #',  ng-click='check($event,dataItem)' style=''><span class='fa fa-check'></span></label></div>",
                      //title: "<div class='checkbox c-checkbox needsclick'><label class='needsclick'><input id='checkAll' type='checkbox' required='' name='checkbox' ng-model='checkbox' class='check-box needsclick ng-dirty ng-valid-parse ng-touched ng-not-empty ng-valid ng-valid-required' data-id='#= Contact_Id #',  ng-click='checkALL(dataItem)' style=''><span class='fa fa-check'></span></label></div>",
                      template: "<input type='checkbox' class='checkbox'  data-id='#= Contact_Id #', ng-click='onClick($event)' />",
                      title: "<input id='checkAll', type='checkbox', class='check-box' data-id='#= Contact_Id #',  ng-click='checkALL(dataItem)' />",
                      width: "60px",
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
             //new feilds by vaibhav
              {
                  field: "contact_designation",
                  title: "Designation",

                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
              },
             {
                 field: "text",
                 title: "Notes",
                 template: "<span  ng-bind-html='dataItem.text | limitTo:200'></span>",
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
               {
                   field: "last_contacted",
                   title: "Last Contacted Date",
                   hidden: true,
                   type: 'date',
                   filterable: {
                       ui: "datepicker"
                   },
                   format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                   attributes: {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
               },

           {
               field: "last_updated",
               hidden: true,
               title: "Updated Date",
               type: 'date',
               filterable: {
                   ui: "datepicker"
               },
               format: '{0:dd/MM/yyyy hh:mm:ss tt}',
               //template: "#= kendo.toString(kendo.parseDate(Contact_Created_Date, 'yyyy-MM-dd hh:mmtt'), 'MM/dd/yyyy') #",
               attributes: {
                   "class": "UseHand",
                   "style": "text-align:center"
               }


           },
              {
                  field: "Formatted_last_contacted_date",
                  title: "Last Contacted Date",

                  filterable: {
                      ui: "datepicker"
                  },
                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
              },
        {
            field: "Formatted_last_updated_date",
            title: "Updated Date",

            filterable: {
                ui: "datepicker"
            },
            attributes: {
                "class": "UseHand",
                "style": "text-align:center"
            }
        },
        //saroj on 13-04-2016
           {
               field: "created_at",
               hidden: true,
               title: "Created Date",
               type: 'date',
               filterable: {
                   ui: "datepicker"
               },
               format: '{0:dd/MM/yyyy hh:mm:ss tt}',
               // template: "<span style='display:none;' ></span>",
               //template: "#= kendo.toString(kendo.parseDate(Contact_Created_Date, 'yyyy-MM-dd hh:mmtt'), 'MM/dd/yyyy') ,#",
               attributes: {
                   "class": "UseHand",
                   "style": "text-align:center"
               }
           },


        {
            title: "Action",
            template: '<div class="uib-dropdown drop_lead" uib-dropdown ><button class="btn drop_lead_btn uib-dropdown-toggle" uib-dropdown-toggle type="button" data-toggle="uib-dropdown"><span class="caret caret_lead"></span></button><ul class="uib-dropdown-menu dropdown_lead" uib-dropdown-menu ><li>' +
               '<a  class="follow_lead" ng-click="openFollowUp(dataItem)" data-toggle="modal">Follow up </a>' +
               '</li><li><a href="" ng-click="openLog(dataItem)">Log Contact</a></li></ul></div>',
            // template: '<select class="drop_select fa fa-inr"><option value="volvo">Volvo</option><option value="saab">Saab</option><option value="mercedes">Mercedes</option><option value="audi">Audi</option></select>',

            field: 'Action',
            width: '120px',
            attributes:
              {
                  "class": "UseHand",
                  "style": "text-align:center"
              }
        }, ]
        };
        $scope.openLog = function (d) {
            var id = d.Contact_Id;
            window.sessionStorage.selectedCustomerID = id;
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/log/logContact.tpl.html',
                backdrop: 'static',
                controller: logContactCtrl,
                size: 'lg'
            });
        }


        $scope.DoWork = function () {
            var txtdata = $scope.textareaText.toLowerCase();
            if (txtdata != '')
                $scope.callFilter();
             //  $scope.Notification();
        };
       
        $scope.Notification = function () {
            //welcome notification
            $.notify({
                message: 'Query Executed Successfully'
            }, {
                // settings
                element: 'body',
                position: null,
                type: "success",
                allow_dismiss: false,
                placement: {
                    from: "top",
                    align: "center"
                },
                mouse_over: null,
                delay: 100,
               
                animate: {
                    enter: 'animated fadeInDown',
                    exit: 'animated fadeOutUp'
                }
            }, 1000);
            //end welcome notification
        }

        $scope.highlightFilteredWords = function () {
            $("#contact_kenomain").highlight($scope.textareaText);
        }


        $scope.callFilter = function () {


            var prevQuarterStartDay = moment(moment().startOf('quarter')).add('quarter', -1)._d;
            var prevQuarterEndDay = moment(moment().endOf('quarter')).add('quarter', -1)._d;

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
                            feild1 = "Name";
                        else if (fValue == "PHONE")
                            feild1 = "Contact_Phone";
                        else if (fValue == "EMAIL")
                            feild1 = "Contact_Email";
                        else if (fValue == "CITY")
                            feild1 = "City";
                        else if (fValue == "ASSIGNED TO")
                            feild1 = "Assigned_To";
                        else if (fValue == "TYPE")
                            feild1 = "Type";
                        else if (fValue == "COMPANY")
                            feild1 = "company";
                        else if (fValue == "NOTES")
                            feild1 = "text";
                        else if (fValue == "TAGS")
                            feild1 = "Tag1";
                        else if (fValue == "LEAD SOURCE")
                            feild1 = "leadsource";
                        else if (fValue == "LAST CONTACTED DATE")
                            feild1 = "last_contacted";
                        else if (fValue == "UPDATED DATE")
                            feild1 = "last_updated";
                        else if (fValue == "LAST CONTACTED DATE")
                            feild1 = "Formatted_last_contacted_date";
                        else if (fValue == "UPDATED DATE")
                            feild1 = "Formatted_last_updated_date";
                        else if (fValue == "CREATED DATE")
                            feild1 = "created_at";
                        else if (fValue == "ACTION")
                            feild1 = "Action";
                        else if (fValue == "DESIGNATION")
                            feild1 = "contact_designation";
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

                            if (expsplitCONTAINS[0].toUpperCase().trim() == "NAME")
                                Firstname = "Name";

                            else if (expsplitCONTAINS[0].toUpperCase().trim() == "FIRSTNAME")
                                Firstname = "Contact_First_Name";

                            else if (expsplitCONTAINS[0].toUpperCase().trim() == "LASTNAME")
                                Firstname = "Contact_Last_Name";

                            else if (expsplitCONTAINS[0].toUpperCase().trim() == "EMAIL")
                                Firstname = "Contact_Email";

                            else if (expsplitCONTAINS[0].toUpperCase().trim() == "PHONE" || expsplitCONTAINS[0].toUpperCase().trim() == "NUMBER")
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

                            else if (expsplitCONTAINS[0].toUpperCase().trim() == "ASSIGNED TO")
                                Firstname = "Assigned_To";

                            else if (expsplitCONTAINS[0].toUpperCase().trim() == "CITY")
                                Firstname = "City";

                            else if (expsplitCONTAINS[0].toUpperCase().trim() == "TYPE")
                                Firstname = "Type";

                            else if (expsplitCONTAINS[0].toUpperCase().trim() == "DESIGNATION")
                                Firstname = "contact_designation";




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

                            if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "NAME")
                                Firstname = "Name";

                            else if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "FIRSTNAME")
                                Firstname = "Contact_First_Name";

                            else if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "LASTNAME")
                                Firstname = "Contact_Last_Name";

                            else if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "EMAIL")
                                Firstname = "Contact_Email";

                            else if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "PHONE" || expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "NUMBER")
                                Firstname = "Contact_Phone";

                            else if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "TAGS")
                                Firstname = "tag1";

                            else if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "COMPANY")
                                Firstname = "company";

                                // for notes still need to confirm with sir
                            else if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "TEXT" || expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "NOTES")
                                Firstname = "text";

                            else if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "LEAD SOURCE")
                                Firstname = "leadsource";

                            else if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "ASSIGNED TO")
                                Firstname = "Assigned_To";

                            else if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "CITY")
                                Firstname = "City";

                            else if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "TYPE")
                                Firstname = "Type";

                            else if (expsplitDOESNOTCONTAINS[0].toUpperCase().trim() == "DESIGNATION")
                                Firstname = "contact_designation";

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


                            if (expsplitIN[0].toUpperCase().trim() == "NAME")
                                Firstname = "Name";

                            else if (expsplitIN[0].toUpperCase().trim() == "FIRSTNAME")
                                Firstname = "Contact_First_Name";

                            else if (expsplitIN[0].toUpperCase().trim() == "LASTNAME")
                                Firstname = "Contact_Last_Name";

                            else if (expsplitIN[0].toUpperCase().trim() == "EMAIL")
                                Firstname = "Contact_Email";

                            else if (expsplitIN[0].toUpperCase().trim() == "PHONE" || expsplitIN[0].toUpperCase().trim() == "NUMBER")
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

                            else if (expsplitIN[0].toUpperCase().trim() == "ASSIGNED TO")
                                Firstname = "Assigned_To";

                            else if (expsplitIN[0].toUpperCase().trim() == "CITY")
                                Firstname = "City";

                            else if (expsplitIN[0].toUpperCase().trim() == "TYPE")
                                Firstname = "Type";

                            else if (expsplitIN[0].toUpperCase().trim() == "DESIGNATION")
                                Firstname = "contact_designation";


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

                            if (expsplitNOTIN[0].toUpperCase().trim() == "NAME")
                                Firstname = "Name";

                            else if (expsplitNOTIN[0].toUpperCase().trim() == "FIRSTNAME")
                                Firstname = "Contact_First_Name";

                            else if (expsplitNOTIN[0].toUpperCase().trim() == "LASTNAME")
                                Firstname = "Contact_Last_Name";

                            else if (expsplitNOTIN[0].toUpperCase().trim() == "EMAIL")
                                Firstname = "Contact_Email";

                            else if (expsplitNOTIN[0].toUpperCase().trim() == "PHONE" || expsplitNOTIN[0].toUpperCase().trim() == "NUMBER")
                                Firstname = "Contact_Phone";

                            else if (expsplitNOTIN[0].toUpperCase().trim() == "TAGS")
                                Firstname = "tag1";

                            else if (expsplitNOTIN[0].toUpperCase().trim() == "COMPANY")
                                Firstname = "company";

                                // for notes still need to confirm with sir
                            else if (expsplitNOTIN[0].toUpperCase().trim() == "TEXT" || expsplitNOTIN[0].toUpperCase().trim() == "NOTES")
                                Firstname = "text";

                            else if (expsplitNOTIN[0].toUpperCase().trim() == "LEAD SOURCE")
                                Firstname = "leadsource";

                            else if (expsplitNOTIN[0].toUpperCase().trim() == "ASSIGNED TO")
                                Firstname = "Assigned_To";

                            else if (expsplitNOTIN[0].toUpperCase().trim() == "CITY")
                                Firstname = "City";

                            else if (expsplitNOTIN[0].toUpperCase().trim() == "TYPE")
                                Firstname = "Type";

                            else if (expsplitNOTIN[0].toUpperCase().trim() == "DESIGNATION")
                                Firstname = "contact_designation";

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

                            if (expsplit[0].toUpperCase().trim() == "FIRSTNAME")
                                Firstname = "Contact_First_Name";

                            else if (expsplit[0].toUpperCase().trim() == "LASTNAME")
                                Firstname = "Contact_Last_Name";

                            else if (expsplit[0].toUpperCase().trim() == "EMAIL")
                                Firstname = "Contact_Email";

                            else if (expsplit[0].toUpperCase().trim() == "PHONE" || expsplit[0].toUpperCase().trim() == "NUMBER")
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

                            else if (expsplit[0].toUpperCase().trim() == "CITY")
                                Firstname = "City";

                            else if (expsplit[0].toUpperCase().trim() == "TYPE")
                                Firstname = "Type";

                            else if (expsplit[0].toUpperCase().trim() == "FOLLOW UP COUNT")
                                Firstname = "follow_up_count";

                            else if (expsplit[0].toUpperCase().trim() == "LAST CONTACTED DATE")
                                Firstname = "last_contacted";

                            else if (expsplit[0].toUpperCase().trim() == "UPDATED DATE")
                                Firstname = "last_updated";

                            else if (expsplit[0].toUpperCase().trim() == "CREATED DATE")
                                Firstname = "created_at";

                            else if (expsplit[0].toUpperCase().trim() == "DESIGNATION")
                                Firstname = "contact_designation";

                            if (Firstname == "") {
                                // 18-04-2016
                                //saroj
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            if (Firstname == "follow_up_count") {
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
                            }

                            ValidFilter = true;
                            spiltOK = false;
                        }

                        // NOT EQUAL TO CHECK 
                        if (expsplitNOT.length > 1) {

                            if (expsplitNOT[0].toUpperCase().trim() == "FIRSTNAME")
                                Firstname = "Contact_First_Name";

                            else if (expsplitNOT[0].toUpperCase().trim() == "LASTNAME")
                                Firstname = "Contact_Last_Name";

                            else if (expsplitNOT[0].toUpperCase().trim() == "EMAIL")
                                Firstname = "Contact_Email";

                            else if (expsplitNOT[0].toUpperCase().trim() == "PHONE" || expsplitNOT[0].toUpperCase().trim() == "NUMBER")
                                Firstname = "Contact_Phone";

                            else if (expsplitNOT[0].toUpperCase().trim() == "TAGS")
                                Firstname = "tag1";

                            else if (expsplitNOT[0].toUpperCase().trim() == "COMPANY")
                                Firstname = "company";

                            else if (expsplitNOT[0].toUpperCase().trim() == "TEXT" || expsplitNOT[0].toUpperCase().trim() == "NOTES")
                                Firstname = "text";

                            else if (expsplitNOT[0].toUpperCase().trim() == "ASSIGNED TO")
                                Firstname = "Assigned_To";

                            else if (expsplitNOT[0].toUpperCase().trim() == "LEAD SOURCE")
                                Firstname = "leadsource";

                            else if (expsplitNOT[0].toUpperCase().trim() == "NAME")
                                Firstname = "Name";

                            else if (expsplitNOT[0].toUpperCase().trim() == "LEAD SOURCE")
                                Firstname = "leadsource";

                            else if (expsplitNOT[0].toUpperCase().trim() == "FOLLOW UP COUNT")
                                Firstname = "follow_up_count";

                            if (expsplitNOT[0].toUpperCase().trim() == "LAST CONTACTED DATE")
                                Firstname = "last_contacted";

                            if (expsplitNOT[0].toUpperCase().trim() == "UPDATED DATE")
                                Firstname = "last_updated";

                            if (expsplitNOT[0].toUpperCase().trim() == "CREATED DATE")
                                Firstname = "created_at";

                            else if (expsplitNOT[0].toUpperCase().trim() == "DESIGNATION")
                                Firstname = "contact_designation";

                            if (Firstname == "") {
                                // 18-04-2016
                                //saroj
                                ValidFilter = false;
                                alert("Invalid Query.");
                                return;
                            }

                            if (Firstname == "follow_up_count") {
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

                            if (expSplitGTE[0].toUpperCase().trim() == "FOLLOW UP COUNT")
                                Firstname = "follow_up_count";

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

                            if (expSplitLTE[0].toUpperCase().trim() == "FOLLOW UP COUNT")
                                Firstname = "follow_up_count";
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

                            if (expSplitGT[0].toUpperCase().trim() == "FOLLOW UP COUNT")
                                Firstname = "follow_up_count";

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

                            if (expSplitLT[0].toUpperCase().trim() == "FOLLOW UP COUNT")
                                Firstname = "follow_up_count";

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

                            if (expsplitIsBefore[0].toUpperCase().trim() == "LAST CONTACTED DATE")
                                Firstname = "last_contacted";

                            else if (expsplitIsBefore[0].toUpperCase().trim() == "UPDATED DATE")
                                Firstname = "last_updated";

                            else if (expsplitIsBefore[0].toUpperCase().trim() == "CREATED DATE")
                                Firstname = "created_at";

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

                            if (expsplitIsAfter[0].toUpperCase().trim() == "LAST CONTACTED DATE")
                                Firstname = "last_contacted";

                            else if (expsplitIsAfter[0].toUpperCase().trim() == "UPDATED DATE")
                                Firstname = "last_updated";

                            else if (expsplitIsAfter[0].toUpperCase().trim() == "CREATED DATE")
                                Firstname = "created_at";

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

                                expsplitIsAfter[1] = expsplitIsAfter[1].replace(/"/g, "");
                                filter.filters.push({ field: Firstname.trim(), operator: "gt", value: moment(expsplitIsAfter[1], "DD-MM-YYYY").add('day', 1)._d });

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

                            if (expsplitBetween[0].toUpperCase().trim() == "LAST CONTACTED DATE")
                                Firstname = "last_contacted";

                            else if (expsplitBetween[0].toUpperCase().trim() == "UPDATED DATE")
                                Firstname = "last_updated";

                            else if (expsplitBetween[0].toUpperCase().trim() == "CREATED DATE")
                                Firstname = "created_at";

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
                var ds = $('#contact_kenomain').getKendoGrid().dataSource;
                ds.filter(filter);

                // alert('Query Executed Successfully.');
            }
            else if (ValidFilter == false && ValidClause == true) {
                var dsSort = [];
                dsSort.push({ field: feild1, dir: dir1 });
                var ds = $('#contact_kenomain').getKendoGrid().dataSource;
                ds.sort(dsSort);
                //  alert('Query Executed Successfully.');
            }
            else if (ValidFilter == true && ValidClause == true) {
                var dsSort = [];
                dsSort.push({ field: feild1, dir: dir1 });
                var ds = $('#contact_kenomain').getKendoGrid().dataSource;
                ds.filter(filter);
                ds.sort(dsSort);
                // alert('Query Executed Successfully.');
            }
            else {
                alert("Please Check Query.");
            }
        }

        $scope.callWordFilter = function () {


            $(".k-grid-content *").unhighlight($scope.textareaText);
            var txtSearch = $scope.textareaText;


            var filter = { logic: "or", filters: [] };
            var grid = $('#contact_kenomain').data('kendoGrid');
            var columns = grid.columns;
            var title = columns[0].Name;
            for (var i = 0; i < grid.columns.length; i++) {

                if (columns[i].title.trim().toUpperCase().trim() == "NAME")
                    filter.filters.push({ field: "Name", operator: "contains", value: txtSearch });

                if (columns[i].title.trim().toUpperCase().trim() == "PHONE")
                    filter.filters.push({ field: "Contact_Phone", operator: "contains", value: txtSearch });


                if (columns[i].title.trim().toUpperCase().trim() == "EMAIL")
                    filter.filters.push({ field: "Contact_Email", operator: "contains", value: txtSearch });


                if (columns[i].title.trim().toUpperCase().trim() == "ASSIGNED TO")
                    filter.filters.push({ field: "Assigned_To", operator: "contains", value: txtSearch });


                if (columns[i].title.trim().toUpperCase().trim() == "TYPE")
                    filter.filters.push({ field: "Type", operator: "contains", value: txtSearch });

                if (columns[i].title.trim().toUpperCase().trim() == "COMPANY")
                    filter.filters.push({ field: "company", operator: "contains", value: txtSearch });

                if (columns[i].title.trim().toUpperCase().trim() == "NOTES")
                    filter.filters.push({ field: "text", operator: "contains", value: txtSearch });

                if (columns[i].title.trim().toUpperCase().trim() == "TAGS")
                    filter.filters.push({ field: "Tag1", operator: "contains", value: txtSearch });

                if (columns[i].title.trim().toUpperCase().trim() == "LEAD SOURCE")
                    filter.filters.push({ field: "leadsource", operator: "contains", value: txtSearch });


                if (columns[i].title.trim().toUpperCase().trim() == "DESIGNATION")
                    filter.filters.push({ field: "contact_designation", operator: "contains", value: txtSearch });
            }

            var ds = $('#contact_kenomain').getKendoGrid().dataSource;
            ds.filter(filter);

            $timeout(function () {
                $(".k-grid-content *").highlight($scope.textareaText);
            }, 100)


            //var cells = document.querySelectorAll("#contact_kenomain .k-grid-content td");
            //for (var i = 0; i < cells.length; i++) {
            //    //check for a text match
            //    var index = cells[i].innerText.toLowerCase().indexOf(txtSearch);
            //    if (index != -1) {
            //        //if there is a match, locate the matching string
            //        var match = cells[i].innerText.substring(index, index + txtSearch.length);
            //        //replace the matching string with itself, but wrapped in a span element
            //        cells[i].innerHTML = cells[i].innerText.replace(match, "<span class='highlighted'>" + match + "</span>");
            //    }
            //    else {
            //        //if there is no match in the cell, remove any styling-related HTML from it
            //       // cells[i].innerHTML = cells[i].innerText;
            //    }
            //}


            // $(".k-grid-content *").highlight($scope.textareaText);



            //  ds.highlight($scope.textareaText);

            //  $("#contact_kenomain").highlight($scope.textareaText);



        }

        $scope.clearFilter = function () {
            $('#contact_kenomain').getKendoGrid().dataSource.filter({});
            $('#contact_kenomain').getKendoGrid().dataSource.sort({});
            $scope.textareaText = ''
            $scope.gridView = 'default';
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
                filter: "td:nth-child(12)", //this filter selects the  column cells
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

        var contactAddEditRefresh = function () {
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
                $('.k-i-refresh').trigger("click");
            })
        }

        $rootScope.$on('REFRESH2', function (event, args) {

            if (args.name == 'LeadGrid') {
                if (args.action === 'add') {
                    //$('#contact_kenomain').getKendoGrid().dataSource.insert(0, { 'Name': args.data.first_name + '' + args.data.last_name, 'Contact_Id': args.data.id, 'Contact_Image': 'https://dwellarstorageuat.blob.core.windows.net/personphoto/655faf0a-1295-4390-bb5d-23febc9ae672default.jpg' });
                    contactAddEditRefresh();
                }
                else if (args.action === 'edit') {
                    contactAddEditRefresh();
                }
                else if (args.action === 'delete') {
                    for (i = 0; i < args.data.length; i++) {
                        var a = _.remove($localStorage.leadDataSource, function (o) {
                            return o.Contact_Id == args.data[i].id
                        });
                    }
                    contactAddEditRefresh();
                }
                else if (args.action == 'tag') {
                    contactAddEditRefresh();
                }
                else if (args.action == 'assignTo') {
                    contactAddEditRefresh();
                }
                else if (args.action == 'notesAdd' || args.action == 'notesEdit') {
                    contactAddEditRefresh();
                }

            } else if (args.name == 'ViewCreated') {
                $scope.views.push(args.data);//push new view into view list
                $scope.gridView = args.data.id; // select currently created view in view list
            }
            $scope.leadAction = 'no_action';
            $('#checkAll').prop('checked', false);


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


        //$scope.openContactPopup = function () {
        //    var modalInstance = $modal.open({
        //        animation: true,
        //        templateUrl: 'contacts/add_new_contact.tpl.html',
        //        backdrop: 'static',
        //        controller: ContactPopUpController,
        //        size: 'lg'
        //    });
        //};


        $scope.openContactPopup = function () {
            $state.go('app.addNewContact');
        };// add new contact page


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

        // by pradip patil for JQL Grammar popup
        // on 14-04-2016

        $scope.helpjqlpopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/helpjql.html',
                backdrop: 'static',
                controller: helpjqlController,
                size: 'lg'
            });
        };


        $scope.assignToUpPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/AssignToContact.tpl.html',
                backdrop: 'static',
                controller: ActionUpController,
                size: 'sm'
            });
        };

        $scope.openConfirmation = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/confirm.tpl.html',
                backdrop: 'static',
                controller: confirmationController,
                size: 'sm',
                resolve: { items: { title: "Contact" } }

            });

        }

        function clearFilters() {
            var gridData = $("#peopleGrid").data("kendoGrid");
            gridData.dataSource.filter({});

            $scope.gridView = 'default';
        }

    }
);

