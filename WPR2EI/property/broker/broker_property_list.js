angular.module('property')
.controller('brokerPropertyListController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope) {
        console.log('brokerPropertyListController');

        var orgID = $cookieStore.get('orgID');
        var userId = $cookieStore.get('userId');

        $scope.openPropertyPopup = function () {
            $state.go('app.brokerproperty');
        };


        $scope.PropertyListGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "Broker/GetBrokerGrid/" + orgID
                },
                pageSize: 20,

                schema: {
                    model: {
                        fields: {
                            possassion_date: { type: "date" },
                            start_date_time: { type: "date" },
                        }
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
                field: "sale_type",
                title: "Sale Type",
                width: "120px",
                attributes:
               {
                 "style": "text-align:center"
               }
            },{
                field: "property_type",
                title: "Property Type",
                width: "120px",
                attributes:
             {
                 "style": "text-align:center"
             }

            }, {
                field: "Agreement_area",
                title: "Agreement Area",
                width: "120px",
                attributes:
             {
                 "style": "text-align:center"
             }

            }, {
                field: "Build_up_area",
                title: "Build Up Area",
                width: "120px",
                attributes:
             {
                 "style": "text-align:center"
             }

            }, 
            {
                field: "locality",
                title: "Area",
                width: "120px",
                attributes:
             {
                 "style": "text-align:center"
             }

            },
             {
                 field: "city",
                 title: "City",
                 width: "120px",
                 attributes:
              {
                  "style": "text-align:center"
              }

             }, {
                 field: "availability",
                 title: "Availability",
                 width: "120px",
                 attributes:
              {
                  "style": "text-align:center"
              }

             },
             {
                 field: "possassion_date",
                 title: "Possession Date",
                 width: "120px",
                 format: '{0:dd/MM/yyyy}',
                 attributes:
               {
                   "style": "text-align:center"
               }

             },
              {
                  field: "lease_period",
                  title: "Leased Period",
                  width: "120px",
                  attributes:
                {
                    "style": "text-align:center"
                }

              },
               {
                   field: "property_condition",
                   title: "Property Condition",
                   width: "120px",
                   attributes:
                 {
                     "style": "text-align:center"
                 }

               },
                 {
                     field: "listing_source",
                     title: "Listing Source",
                     width: "120px",
                     attributes:
                   {
                       "style": "text-align:center"
                   }

                 },
                 {
                     field: "type_of_agreement",
                     title: "Agreement Type",
                     width: "120px",
                     format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                     attributes:
                   {
                       "style": "text-align:center"
                   }

                 },
                  {
                      field: "car_park",
                      title: "Car Park",
                      width: "120px",
                      attributes:
                    {
                        "style": "text-align:center"
                    }


                  },
                {
                field: "furnishing",
                title: "Furnishing",
                width: "120px",
                attributes:
              {
                  "style": "text-align:center"
              } 
                },
                 {
                     field: "agent_name",
                     title: "Agent Name",
                     width: "120px",
                     attributes:
                   {
                       "style": "text-align:center"
                   }


                 },
               {
                   field: "agent_phone_no",
                   title: "Agent Phone",
                   width: "120px",
                   attributes:
                 {
                     "style": "text-align:center"
                 }


               },
              {
               field: "base_rent",
               title: "Base Rent",
               width: "120px",
               attributes:
             {
                 "style": "text-align:center"
             }
            },
            {
                field: "advanced_rent",
                title: "Advanced Rent",
                width: "120px",
                attributes:
              {
                  "style": "text-align:center"
              }
            },
           
             {
                 field: "monthly_rent",
                 title: "Monthly Rent",
                 width: "120px",
                 attributes:
               {
                   "style": "text-align:center"
               }


             },
              {
                  field: "deposit_type",
                  title: "Deposit Type",
                  width: "120px",
                  attributes:
                {
                    "style": "text-align:center"
                }
              },
               {
                   field: "mode_of_payment",
                   title: "Payment Mode",
                   width: "120px",
                   attributes:
                 {
                     "style": "text-align:center"
                 }
               },
             
                 {
                     field: "car_park_rate",
                     title: "Car Park Rate",
                     width: "120px",
                     attributes:
                   {
                       "style": "text-align:center"
                   }


                 },
                   {
                       field: "licensee_brokerage_type",
                       title: "Licensee Brokerage",
                       width: "120px",
                       attributes:
                     {
                         "style": "text-align:center"
                     }


                   },
                    {
                        field: "licensee_brokerage",
                        title: "Brokerage Amount",
                        width: "120px",
                        attributes:
                      {
                          "style": "text-align:center"
                      }


                    }]
        };

        $scope.$on('REFRESH', function (event, args) {
            if (args == 'PropertyListGrid') {
                $('.k-i-refresh').trigger("click");
            }
        });
    });

     