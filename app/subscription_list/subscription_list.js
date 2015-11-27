angular.module('subscription_list')

.controller('SubscriptionListController',
    function ($scope, $state, security, $cookieStore, apiService, $rootScope) {
        $rootScope.title = 'Dwellar./SubscriptionList';
        var orgID = $cookieStore.get('orgID');
        //$rootScope.title = 'Dwellar/SubscriptionList';

        //Audit log start
        $scope.params = {

            device_os: "windows10",
            device_type: "mobile",
            device_mac_id: "34:#$::43:434:34:45",
            module_id: "subscription_list",
            action_id: "subscription_list View",
            details: "subscription_list detail",
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
      
   //   alert(orgID);
        $scope.mainGridOptions = {
            dataSource: {
                type: "json",
                transport: {
                    read: "http://dw-webservices-dev.azurewebsites.net/Subscription/GetById/" + orgID

                },
                pageSize: 5

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
                field: "Subscription_Name",
                title: "Name",
                width: "120px",
               
            }, {
                field: "description",
                title: "Description",
                width: "120px",
                
            },
            {
                field: "Status",
                title: "Status",
                width: "120px",
              
            },{
                field: "Active_Untill",
                title: "Active Untill",
                width: "120px",
              
            },
             {
                field: "Total_User_Licence",
                title: "User Licenses(Total)",
                width: "120px",
              
             },
            {
                field: "Assigned_User_Licence",
                title: "User Licenses(Assigned)",
                width: "120px",
               
            },
            {
                field: "Total_Project_Licence",
                title: "Project Licenses(Total)",
                width: "120px",
              
            },
             {
                 field: "Assigned_Project_Licence",
                 title: "Project Licenses(Assigned)",
                 width: "120px",
                
             },{
                field: "Storage_Limit",
                title: "Storage Limit",
                width: "120px",
               
            }, {
                field: "Used_Storage",
                title: "Used Storage",
                width: "120px",
               
            }]
        };

    
    
        
    }
);
