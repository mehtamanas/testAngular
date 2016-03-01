
var EditNoteTeamController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal, $rootScope, $window) {
    console.log('EditNoteTeamController');
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

    $scope.contact1 = $scope.seletedCustomerId;
    //Audit log start               

  
    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
          // device_mac_id: "34:#$::43:434:34:45",
           module_id: "Contact",
           action_id: "Contact View",
           details: "AddNewUser",
           application: "angular",
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
    AuditCreate();

    //end

    //API functionality start

    contactUrl = "Notes/EditGet/" + $scope.seletedCustomerId;
    apiService.get(contactUrl).then(function (response) {
        $scope.params = response.data[0];
    },
    function (error) {
        
    }
   );

    $scope.params = {
        text: $scope.params.text,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),
        class_type: "Team",
        id: window.sessionStorage.selectedCustomerID,

    };

    $scope.save = function () {
        var postData =
               {
                   id: window.sessionStorage.selectedCustomerID,
                   text: $scope.params.text,
                   organization_id: $cookieStore.get('orgID'),
                   user_id: $cookieStore.get('userId'),
                   class_type: "Person"
               };

        apiService.post("Notes/Edit", postData).then(function (response) {
            var loginSession = response.data;
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();
            $rootScope.$broadcast('REFRESH', 'NotesGrid');

        },
        function (error) {
            if (error.status === 400)
                alert(error.data.Message);
            else
                alert("Network issue");
        });
    }


    //end
    //popup functionality start
    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'md',
            resolve: { items: { title: "Edit" } }
        });
    }

    //end

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {
            $scope.save();

            $scope.showValid = false;

        }

    }


};






