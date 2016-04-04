var confirmationController = function ($scope, items, $state, $rootScope, $modal, apiService, $cookieStore, $modalInstance) {
    console.log('confirmationController');

    $scope.title = items.title;
    var people_type = $cookieStore.get('people_type');

    if (people_type == "Contact") {
        items.title = 'contact';
        $scope.title = items.title;
    }
    else if (people_type == "Client") {
        items.title = 'client';
        $scope.title = items.title;
    }
    else if (people_type == "Lead") {
        items.title = 'lead';
        $scope.title = items.title;
    }
    else {
        $rootScope.title = '';
    }

    //Audit log start															

    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
           module_id: "Contact",
           action_id: "Contact View",
           details: "Deleted" + $scope.title + ": " + $scope.params.first_name,
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


    var contactDelete = $cookieStore.get('contactDelete');
    $scope.length = parseInt(contactDelete.length);
    $scope.gotoDelete = function () {
            apiService.post("Contact/DeleteMultipleContact", contactDelete).then(function (response) {
            var loginSession = response.data;
            $scope.openSucessDeletefullPopup();
            $rootScope.$broadcast('REFRESH1', 'contactGrid');
            $rootScope.$broadcast('REFRESH2', 'LeadGrid');
            $rootScope.$broadcast('REFRESH3', 'ClientContactGrid');
            $rootScope.$broadcast('REFRESH', 'contactcount');
            $modalInstance.dismiss();

        },
       function (error) {
           if (error.status === 400)
               alert(error.data.Message);
           else
               alert("Network issue");
       });

        $scope.openSucessDeletefullPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/delete.html',
                backdrop: 'static',
                controller: DeleteController,
                size: 'sm',
                resolve: { items: { title: "Contact" } }

            });

        }

    }
    
};