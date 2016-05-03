angular.module('billing')

.controller('BillingController',
    function ($scope, $state, security, $cookieStore, apiService, $rootScope) {
        //      alert("abcd");
        var orgID = $cookieStore.get('orgID');

        $rootScope.title = 'Dwellar./Billing';
        // alert(orgID);

        //Audit log start


        //Audit log start															
        $scope.params =
            {
                device_os: $cookieStore.get('Device_os'),
                device_type: $cookieStore.get('Device'),
                device_mac_id: "34:#$::43:434:34:45",
                module_id: "Contact",
                action_id: "Contact View",
                details: "BillingView",
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
                    read: apiService.baseUrl +"Billing/GetByID/" + orgID
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
            columnMenu: {
                messages: {
                    columns: "Choose columns",
                    filter: "Apply filter",
                    sortAscending: "Sort (asc)",
                    sortDescending: "Sort (desc)"
                }
            },
            columns: [{
                field: "bill_date",
                title: "Bill Date",
                width: "120px",
                format: '{0:dd/MM/yyyy}',
                attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:right"
                }
                
            }, {
                field: "due_date",
                title: "Due Date",
                width: "120px",
                format: '{0:dd/MM/yyyy}',
                attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:right"
                }
               
            }, {
                field: "invoice",
                title: "Invoice",
                width: "120px",
                attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:center"
                }

            }]
        };
    }
);
