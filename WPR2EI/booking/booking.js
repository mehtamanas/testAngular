﻿angular.module('Bookings')
.controller('BookController',
    function ($scope, $state, security, $cookieStore, apiService, $rootScope) {
        $rootScope.title = 'Dwellar-Bookings';
                
        var userID = $cookieStore.get('userId');



       

        //grid fuctionality start
        $scope.bookingGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "Organization/GetProjectDetails?id=" + userID

                },
                pageSize: 20
            },
            groupable: true,
            sortable: true,
            selectable: "multiple",
            reorderable: true,
            resizable: true,
            height: screen.height - 370,
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
                    template: "<input type='checkbox', class='checkbox', data-id='#= id #',  ng-click='check($event,dataItem)' />",
                    title: "<input id='checkAll', type='checkbox', class='check-box', ng-click='checkALL(dataItem)' />",
                    width: "60px",
                    attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                },

               {
                   field: "name",
                   title: "UNIT NO",

                   attributes:
                    {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }
               }, {
                   field: "address",
                   title: "UNIT TYPE",

                   attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
               }, {
                   field: "unitTypes",
                   title: "FLOOR NO",

                   attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
               },
                {
                    field: "unitCount",
                    title: "PROJECT",

                    attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
                }, {
                    field: "available",
                    title: "AGGREMENT COST",

                    attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                }, {
                    field: "area",
                    title: "BOOKING AMOUNT",

                    attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                },

               {
                   field: "possession_date",
                   title: "PAYMENT PLAN",

                   attributes: {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
               },

               {
                   field: "price",
                   title: "PAYMENT",

                   attributes: {
                       "class": "UseHand",
                       "style": "text-align:center"

                   }
               },
               {
                   field: "status",
                   title: "Status",

                   attributes: {
                       "class": "UseHand",
                       "style": "text-align:center"

                   },


               }]
        };

        // Kendo Grid on change
        
    }
);

