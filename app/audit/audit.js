angular.module('audit')
.controller('AuditController',
    function ($scope, $state, security, $cookieStore, apiService, $rootScope) {

        var orgID = $cookieStore.get('orgID');

        $rootScope.title = 'Dwellar./Audit';

       // alert(orgID);
        $scope.mainGridOptions = {
            dataSource: {
                type: "json",
                transport: {
                    read: "http://dw-webservices-dev.azurewebsites.net/AuditLog/GetByID/" + orgID

                },
                pageSize: 5,
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
                title: "user_email",
                width: "120px"
            }, {
                field: "device_os",
                title: "device_os",
                width: "120px"
            }, {
                field: "device_type",
                title: "device_type",
                width: "120px"
            }, {
                field: "device_mac_id",
                title: "device_mac_id",
                width: "120px"
            },
            {
                field: "application",
                title: "application",
                width: "120px"
            }, {
                field: "browser",
                title: "browser",
                width: "120px"
            },
            {
                field: "ip_address",
                title: "ip_address",
                width: "120px"
            },
            {
                field: "location",
                title: "location",
                width: "120px"
            },
           
            {
                field: "details",
                title: "details",
                width: "120px"
            },
             {
                 field: "timestamp",
                 title: "timestamp",
                 width: "120px",
                 format: '{0:dd/MM/yyyy}'
             }
            
            ]
        };

        // Paging from api


    }
);