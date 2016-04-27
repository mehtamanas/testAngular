angular.module('audit')
.controller('AuditController',
    function ($scope, $state, security, $cookieStore, apiService, $rootScope) {

       var orgID = $cookieStore.get('orgID');
        var userId = $cookieStore.get('userId');
        $rootScope.title = 'Dwellar./Audit';

       // alert(orgID);
        $scope.mainGridOptions = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "AuditLog/GetByID/" + userId
                   // read: apiService.baseUrl + "AuditLog/GetByID/" + userId

                },
                pageSize: 20,
                schema: {
                    model: {
                        fields: {

                            timestamp: { type: "date" }


                        }
                    }
                },

                //group: {
                //    field: 'sport'
                //}
            },
            groupable: true,
            sortable: true,
            selectable: "multiple",
            reorderable: true,
            resizable: true,
            filterable: true,
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: [{
                field: "user_email",
                title: "USER EMAIL",
                width: "120px",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            }, {
                field: "device_os",
                title: "DEVICE O.S",
                width: "120px",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            }, {
                field: "device_type",
                title: "DEVICE TYPE",
                width: "120px",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            }, {
                field: "device_mac_id",
                title: "DEVICE MAC ID",
                width: "120px",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            },
            {
                field: "application",
                title: "APPLICATION",
                width: "120px",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            }, {
                field: "browser",
                title: "BROWSER",
                width: "120px",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            },
            {
                field: "ip_address",
                title: "IP ADDRESS",
                width: "120px",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            },
            {
                field: "location",
                title: "LOCATION",
                width: "120px",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            },
           
            {
                field: "details",
                title: "DETAILS",
                width: "120px",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            },
             {
                 field: "timestamp_Formatted",
                 title: "TIMESTAMP",
                 width: "120px",
                 //format: '{0:dd/MM/yyyy}',
                 attributes: {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
             }
            
            ]
        };

        // Paging from api


    }
);