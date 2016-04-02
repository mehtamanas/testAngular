angular.module('contacts')
.controller('CompanyListController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope, teamService)
    {
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
                        last_contacted: { type: "date" }
                    }
                }
            },
            groupable: true,
            sortable: true,
            selectable: "multiple",
            reorderable: true,
            resizable: true,
            filterable: true,
            height:screen.height -370,
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
    }
);

