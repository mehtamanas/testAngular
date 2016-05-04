angular.module('Bookings')
.controller('BookController',
    function ($scope, $state, security, $cookieStore, apiService, $rootScope) {
        $rootScope.title = 'Dwellar-Bookings';

        var userID = $cookieStore.get('userId');
        var orgID = $cookieStore.get('orgID');

        //grid fuctionality start
        $scope.bookingGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "Booking/Get/d84f1c5b-2d4c-4427-acb2-1cb639b28bd5" // + orgID

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
                    template: "<input type='checkbox', class='checkbox', ng-click='check($event,dataItem)' />",
                    title: "<input id='checkAll', type='checkbox', class='check-box', ng-click='checkALL(dataItem)' />",
                    width: "60px",
                    attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                }, {
                    field: "booking_id",
                    title: "BOOKING ID",

                    attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
                },
               {
                   field: "floor_num",
                   title: "FLOOR NO",

                   attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
               },
                {
                    field: "project_name",
                    title: "PROJECT",

                    attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
                }, {
                    field: "Agreement_cost",
                    title: "AGGREMENT COST",

                    attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                }, {
                    field: "booking_amount",
                    title: "BOOKING AMOUNT",

                    attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                },
               {
                   field: "Payment_plan",
                   title: "PAYMENT PLAN",

                   attributes: {
                       "class": "UseHand",
                       "style": "text-align:center"
                   }
               },
               {
                   field: "Action",
                   template: '<div class="uib-dropdown drop_lead" uib-dropdown ><button class="btn drop_lead_btn uib-dropdown-toggle" uib-dropdown-toggle type="button" data-toggle="uib-dropdown"><span class="caret caret_lead"></span></button><ul class="uib-dropdown-menu dropdown_lead" uib-dropdown-menu ><li>' +
                   '<a  class="follow_lead" ng-click="openBookingPreview(dataItem)" data-toggle="modal">Approved </a>' +
                   '</li><li><a href="" ng-click="openBookingPreview(dataItem)">Postpone</a></li></ul></div>',
                   title: "Action",

                   attributes: {
                       "class": "UseHand",
                       "style": "text-align:center"

                   },
               }]
        };

        // Approve Booking Code//
        $scope.openBookingPreview = function (d) {
            $state.go('app.confirmBooking', { bookingId: d.booking_id });
        
        };

    }
);

