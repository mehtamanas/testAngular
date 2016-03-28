angular.module('contact_report')
.controller('ContactReportController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope) {
        $scope.duration = "3";
        $scope.params = {};

        var userID = $cookieStore.get('userId');
        var orgID = $cookieStore.get('orgID');
        $scope.fromdate = moment().format('MM/DD/YYYY');
        $scope.endDate = moment().format('MM/DD/YYYY');
      
        $scope.myGridChange = function (dataItem) {
            // dataItem will contain the row that was selected
            window.sessionStorage.selectedCustomerID = dataItem.Contact_Id;

            $state.go('app.contactdetail');

        };

       
        

        $scope.newLeadAddedGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: function (options) {
                        
                        apiService.get('Reports/GetNewLeadAdded?Id=' + orgID + "&type=Lead&fromdate=" + moment($scope.params.fromdate, 'MM/DD/YYYY').format('YYYY/MM/DD') + "&todate=" + moment($scope.params.endDate, 'MM/DD/YYYY').format('YYYY/MM/DD')).then(function (response) {
                            options.success(response.data);
                        }, function (error) {
                            options.error(error);
                        });
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
                      template: "<input type='checkbox', class='checkbox', data-id='#= Name #',  ng-click='projectSelected($event,dataItem)' />",
                      title: "<input id='checkAll', type='checkbox', class='check-box', ng-click='submit(dataItem)' />",
                      width: "60px",
                      attributes:
                       {
                           "class": "UseHand",
                           "style": "text-align:center"
                       }
                  }, {
                      template: "<img height='40px' width='40px'  class='user-photo' src='#= Contact_Image #'/>" +
                      "<span style='padding-left:10px' class='customer-name'> </span>",
                      width: "120px",
                      title: "Picture",
                      attributes:
                      {
                          "class": "UseHand",
                      }
                  }, {
                      field: "Name",
                      title: "Name",
                      width: "120px",
                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                    }, {
                        field: "contact_designation",
                        title: "Designation",
                        width: "120px",
                        attributes: {
                            "class": "UseHand",
                            "style": "text-align:center"
                        }
                    },{
                      field: "Contact_Phone",
                      title: "Phone",
                      width: "120px",
                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "Contact_Email",
                      title: " Email",
                      width: "120px",
                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "City",
                      title: "City",
                      width: "120px",
                      attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "Assigned_To",
                      title: "Assigned To",
                      width: "120px",
                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "Type",
                      title: "Type",
                      width: "120px",
                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  },
             {
                 field: "company",
                 title: "Company",
                 width: "120px",
                 attributes: {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
             },
             {
                 field: "Tags",
                 title: "TAGS",
                 width: "120px",
                 attributes: {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
             },
              {
                  field: "leadsource",
                  title: "Lead Source",
                  width: "120px",
                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
              },
             {
                 field: "Contact_Created_Date",
                 title: "Updated Date",
                 width: "120px",
                 format: '{0:dd-MM-yyyy }',
                 template: "#= kendo.toString(kendo.parseDate(Contact_Created_Date, 'yyyy-MM-dd hh:mmtt'), 'MM/dd/yyyy') #",
                 attributes: {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
             },
             {
                 title: "Action",
                 template: "<a id='followUp'class='btn btn-primary' ng-click='openFollowUp(dataItem)' data-toggle='modal'>Follow up </a> </div>",
                 width: "120px",
                 attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
             }, ]
        };

       
        $scope.newLeadFollowUpGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: function (options) {

                        apiService.get('Reports/GetNewLeadFollowUp?Id=' + orgID + "&type=Lead&fromdate=" + moment($scope.params.fromdate, 'MM/DD/YYYY').format('YYYY/MM/DD') + "&todate=" + moment($scope.params.endDate, 'MM/DD/YYYY').format('YYYY/MM/DD')).then(function (response) {
                            options.success(response.data);
                        }, function (error) {
                            options.error(error);
                        });
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
                      template: "<input type='checkbox', class='checkbox', data-id='#= Name #',  ng-click='projectSelected($event,dataItem)' />",
                      title: "<input id='checkAll', type='checkbox', class='check-box', ng-click='submit(dataItem)' />",
                      width: "60px",
                      attributes:
                       {
                           "class": "UseHand",
                           "style": "text-align:center"
                       }
                  }, {
                      template: "<img height='40px' width='40px'  class='user-photo' src='#= Contact_Image #'/>" +
                      "<span style='padding-left:10px' class='customer-name'> </span>",
                      width: "120px",
                      title: "Picture",
                      attributes:
                      {
                          "class": "UseHand",
                      }
                  }, {
                      field: "Name",
                      title: "Name",
                      width: "120px",
                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "contact_designation",
                      title: "Designation",
                      width: "120px",
                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "Contact_Phone",
                      title: "Phone",
                      width: "120px",
                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "Contact_Email",
                      title: " Email",
                      width: "120px",
                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "City",
                      title: "City",
                      width: "120px",
                      attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "Assigned_To",
                      title: "Assigned To",
                      width: "120px",
                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "Type",
                      title: "Type",
                      width: "120px",
                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  },
             {
                 field: "company",
                 title: "Company",
                 width: "120px",
                 attributes: {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
             },
             {
                 field: "Tags",
                 title: "TAGS",
                 width: "120px",
                 attributes: {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
             },
              {
                  field: "leadsource",
                  title: "Lead Source",
                  width: "120px",
                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
              },
             {
                 field: "Contact_Created_Date",
                 title: "Updated Date",
                 width: "120px",
                 format: '{0:dd-MM-yyyy }',
                 template: "#= kendo.toString(kendo.parseDate(Contact_Created_Date, 'yyyy-MM-dd hh:mmtt'), 'MM/dd/yyyy') #",
                 attributes: {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
             },
             {
                 title: "Action",
                 template: "<a id='followUp'class='btn btn-primary' ng-click='openFollowUp(dataItem)' data-toggle='modal'>Follow up </a> </div>",
                 width: "120px",
                 attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
             }, ]
        };

        
        //$scope.newLeadFollowUpTodayGrid = {
        //    dataSource: {
        //        type: "json",
        //        transport: {
        //            read: function (options) {
                        
        //                apiService.get('Reports/GetNewLeadFollowUpToday?Id=' + orgID + "&type=Lead&start_date=" + moment($scope.params.start_date, 'MM/DD/YYYY').format('YYYY/MM/DD')).then(function (response) {
        //                    options.success(response.data);
        //                }, function (error) {
        //                    options.error(error);
        //                });
        //            }

        //        },
        //        pageSize: 20
        //    },
        //    groupable: true,
        //    sortable: true,
        //    selectable: "multiple",
        //    reorderable: true,
        //    resizable: true,
        //    filterable: true,
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
        //          {
        //              template: "<input type='checkbox', class='checkbox', data-id='#= Name #',  ng-click='projectSelected($event,dataItem)' />",
        //              title: "<input id='checkAll', type='checkbox', class='check-box', ng-click='submit(dataItem)' />",
        //              width: "60px",
        //              attributes:
        //               {
        //                   "class": "UseHand",
        //                   "style": "text-align:center"
        //               }
        //          }, {
        //              template: "<img height='40px' width='40px'  class='user-photo' src='#= Contact_Image #'/>" +
        //              "<span style='padding-left:10px' class='customer-name'> </span>",
        //              width: "120px",
        //              title: "Picture",
        //              attributes:
        //              {
        //                  "class": "UseHand",
        //              }
        //          }, {
        //              field: "Name",
        //              title: "Name",
        //              width: "120px",
        //              attributes: {
        //                  "class": "UseHand",
        //                  "style": "text-align:center"
        //              }
        //          }, {
        //              field: "contact_designation",
        //              title: "Designation",
        //              width: "120px",
        //              attributes: {
        //                  "class": "UseHand",
        //                  "style": "text-align:center"
        //              }
        //          }, {
        //              field: "Contact_Phone",
        //              title: "Phone",
        //              width: "120px",
        //              attributes: {
        //                  "class": "UseHand",
        //                  "style": "text-align:center"
        //              }
        //          }, {
        //              field: "Contact_Email",
        //              title: " Email",
        //              width: "120px",
        //              attributes: {
        //                  "class": "UseHand",
        //                  "style": "text-align:center"
        //              }
        //          }, {
        //              field: "City",
        //              title: "City",
        //              width: "120px",
        //              attributes:
        //              {
        //                  "class": "UseHand",
        //                  "style": "text-align:center"
        //              }
        //          }, {
        //              field: "Assigned_To",
        //              title: "Assigned To",
        //              width: "120px",
        //              attributes: {
        //                  "class": "UseHand",
        //                  "style": "text-align:center"
        //              }
        //          }, {
        //              field: "Type",
        //              title: "Type",
        //              width: "120px",
        //              attributes: {
        //                  "class": "UseHand",
        //                  "style": "text-align:center"
        //              }
        //          },
        //     {
        //         field: "company",
        //         title: "Company",
        //         width: "120px",
        //         attributes: {
        //             "class": "UseHand",
        //             "style": "text-align:center"
        //         }
        //     },
        //     {
        //         field: "Tags",
        //         title: "TAGS",
        //         width: "120px",
        //         attributes: {
        //             "class": "UseHand",
        //             "style": "text-align:center"
        //         }
        //     },
        //      {
        //          field: "leadsource",
        //          title: "Lead Source",
        //          width: "120px",
        //          attributes: {
        //              "class": "UseHand",
        //              "style": "text-align:center"
        //          }
        //      },
        //     {
        //         field: "Contact_Created_Date",
        //         title: "Updated Date",
        //         width: "120px",
        //         format: '{0:dd-MM-yyyy }',
        //         template: "#= kendo.toString(kendo.parseDate(Contact_Created_Date, 'yyyy-MM-dd hh:mmtt'), 'MM/dd/yyyy') #",
        //         attributes: {
        //             "class": "UseHand",
        //             "style": "text-align:center"
        //         }
        //     },
        //     {
        //         title: "Action",
        //         template: "<a id='followUp'class='btn btn-primary' ng-click='openFollowUp(dataItem)' data-toggle='modal'>Follow up </a> </div>",
        //         width: "120px",
        //         attributes:
        //           {
        //               "class": "UseHand",
        //               "style": "text-align:center"
        //           }
        //     }, ]
        //};

        $scope.newLeadNotFollowUpGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: function (options) {

                        apiService.get('Reports/GetNewLeadAddedPast?Id=' + orgID + "&type=Lead&enterdays=" + $scope.params.enterdays).then(function (response) {
                            options.success(response.data);
                        }, function (error) {
                            options.error(error);
                        });
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
                      template: "<input type='checkbox', class='checkbox', data-id='#= Name #',  ng-click='projectSelected($event,dataItem)' />",
                      title: "<input id='checkAll', type='checkbox', class='check-box', ng-click='submit(dataItem)' />",
                      width: "60px",
                      attributes:
                       {
                           "class": "UseHand",
                           "style": "text-align:center"
                       }
                  }, {
                      template: "<img height='40px' width='40px'  class='user-photo' src='#= Contact_Image #'/>" +
                      "<span style='padding-left:10px' class='customer-name'> </span>",
                      width: "120px",
                      title: "Picture",
                      attributes:
                      {
                          "class": "UseHand",
                      }
                  }, {
                      field: "Name",
                      title: "Name",
                      width: "120px",
                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "contact_designation",
                      title: "Designation",
                      width: "120px",
                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "Contact_Phone",
                      title: "Phone",
                      width: "120px",
                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "Contact_Email",
                      title: " Email",
                      width: "120px",
                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "City",
                      title: "City",
                      width: "120px",
                      attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "Assigned_To",
                      title: "Assigned To",
                      width: "120px",
                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  }, {
                      field: "Type",
                      title: "Type",
                      width: "120px",
                      attributes: {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                  },
             {
                 field: "company",
                 title: "Company",
                 width: "120px",
                 attributes: {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
             },
             {
                 field: "Tags",
                 title: "TAGS",
                 width: "120px",
                 attributes: {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
             },
              {
                  field: "leadsource",
                  title: "Lead Source",
                  width: "120px",
                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
              },
             {
                 field: "last_contacted",
                 title: "Last Contacted Date",
                 width: "120px",
                 format: '{0:dd-MM-yyyy }',
                 template: "#= kendo.toString(kendo.parseDate(last_contacted, 'yyyy-MM-dd hh:mmtt'), 'MM/dd/yyyy') #",
                 attributes: {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
             },
             {
                 title: "Action",
                 template: "<a id='followUp'class='btn btn-primary' ng-click='openFollowUp(dataItem)' data-toggle='modal'>Follow up </a> </div>",
                 width: "120px",
                 attributes:
                   {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
             }, ]
        };

        $scope.filterGrid=function()
        {
            $('.k-i-refresh').trigger("click");

            newLeadFollowUpUrl = "Reports/GetNewLeadAddedPastCount?Id=" + orgID + "&type=Lead&enterdays=" + $scope.params.enterdays;
            apiService.getWithoutCaching(newLeadFollowUpUrl).then(function (response) {
                data = response.data;
                $scope.totalLeadNotFollowUp = data.LeadAddedCount;
            },
            function (error) {

            });
        }


        $scope.params = {
            enterdays: $scope.enterdays,
        }


        $scope.filterLead = function () {

            $('.k-i-refresh').trigger("click");

            newLeadAddedUrl = "Reports/GetNewLeadAddedCount?Id=" + orgID + "&type=Lead&fromdate=" + moment($scope.params.fromdate, 'MM/DD/YYYY').format('YYYY/MM/DD') + "&todate=" + moment($scope.params.endDate, 'MM/DD/YYYY').format('YYYY/MM/DD');
            apiService.getWithoutCaching(newLeadAddedUrl).then(function (response) {
                data = response.data;

                $scope.totalLeadAdded = data.LeadAddedCount;
            },
            function (error) {

            });

            newLeadFollowUpUrl = "Reports/GetNewLeadFollowUpCount?Id=" + orgID + "&type=Lead&fromdate=" + moment($scope.params.fromdate, 'MM/DD/YYYY').format('YYYY/MM/DD') + "&todate=" + moment($scope.params.endDate, 'MM/DD/YYYY').format('YYYY/MM/DD');
            apiService.getWithoutCaching(newLeadFollowUpUrl).then(function (response) {
                data = response.data;
                $scope.totalLeadFollowUp = data.LeadAddedCount;
            },
            function (error) {

            });
            
            //newLeadFollowUpTodayUrl = "Reports/GetNewLeadFollowUpTodayCount?Id=" + orgID + "&type=Lead&start_date=" + moment($scope.params.start_date, 'MM/DD/YYYY').format('YYYY/MM/DD');
            //apiService.getWithoutCaching(newLeadFollowUpTodayUrl).then(function (response) {
            //    data = response.data;
            //    $scope.totalLeadFollowUpToday = data.LeadAddedCount;
            //},
            //function (error) {

            //});
          
            LeadNotFollowUpUrl = "Reports/GetNewLeadNotFollowUpCount?Id=" + orgID + "&type=Lead&fromdate=" + moment($scope.params.fromdate, 'MM/DD/YYYY').format('YYYY/MM/DD') + "&todate=" + moment($scope.params.endDate, 'MM/DD/YYYY').format('YYYY/MM/DD');
            apiService.getWithoutCaching(LeadNotFollowUpUrl).then(function (response) {
                data = response.data;
                $scope.totalLeadNotFollowUp = data.LeadAddedCount;
            },
            function (error) {

            });
        }

        $scope.addNew = function (isValid) {
            $scope.showValid = true;
            if (isValid) {

                $scope.showValid = false;

            }

        }

    });

