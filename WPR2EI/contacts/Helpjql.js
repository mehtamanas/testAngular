
var helpjqlController = function ($scope, $state, $cookieStore, apiService, $rootScope, $modalInstance, $modal, $window) {
    console.log('helpjqlController');

    var orgID = $cookieStore.get('orgID');
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    //Audit log start
    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
           module_id: "Contact",
           action_id: "Contact View",
           details: "Added new tag: " + $scope.params.tag_name,
           application: "Angular",
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

    //end

    //API functionality start  
   
   
    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'sm',
            resolve: { items: { title: "Tag" } }
        });


    }
};