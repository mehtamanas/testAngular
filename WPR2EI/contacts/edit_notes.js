/**
 * Created by dwellarkaruna on 24/10/15.
 */
var EditNotesContactController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal, $rootScope, $window) {
    console.log('EditNotesContactController');
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;


    //Audit log start
    $scope.params = {

        device_os: "windows10",
        device_type: "mobile",
        device_mac_id: "34:#$::43:434:34:45",
        module_id: "Addnew TEAM",
        action_id: "Addnew TEAM View",
        details: "Addnew TEAM detail",
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
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });
    };
    AuditCreate($scope.params);

    //end

    //API functionality start

    contactUrl = "Notes/EditGet/" + $scope.seletedCustomerId;
    apiService.get(contactUrl).then(function (response) {
        $scope.params = response.data[0];
    },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    }
   );

    $scope.params = {
        text: $scope.params.text,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),
        class_type: "Person",
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

    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid)
        {
            $scope.save();

            $scope.showValid = false;

        }

    }


};




