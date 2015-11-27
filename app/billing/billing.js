angular.module('billing')

.controller('BillingController',
    function ($scope, $state, security, $cookieStore, apiService, $rootScope) {
        //      alert("abcd");
        var orgID = $cookieStore.get('orgID');

        $rootScope.title = 'Dwellar./Billing';
        // alert(orgID);

        //Audit log start
        $scope.params = {

            device_os: "windows10",
            device_type: "mobile",
            device_mac_id: "34:#$::43:434:34:45",
            module_id: "Billing",
            action_id: "Bill View",
            details: "Billing detail",
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

        //alert(orgID);
        $scope.mainGridOptions = {
            dataSource: {
                type: "json",
                transport: {
                    read: "http://dw-webservices-dev.azurewebsites.net/Billing/GetByID/" + orgID
                },
                pageSize: 2,

                schema: {
                    model: {
                        fields: {

                            bill_date: { type: "date" },
                            due_date: { type: "date" }

                        }
                    }
                }

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
                field: "bill_date",
                title: "Bill Date",
                width: "120px",
                format: '{0:dd/MM/yyyy}',
                
            }, {
                field: "due_date",
                title: "Due Date",
                width: "120px",
                format: '{0:dd/MM/yyyy}',
               
            }, {
                field: "invoice",
                title: "Invoice",
                width: "120px",

            }]
        };
    }
);
