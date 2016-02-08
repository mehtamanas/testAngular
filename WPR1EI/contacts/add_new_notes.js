/**
 * Created by dwellarkaruna on 24/10/15.
 */
var AddNewNotesControllerdm = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal, $rootScope, $window) {
    console.log('AddNewNotesControllerdm');
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

    $scope.contact1 = $scope.seletedCustomerId;
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

    var called = false;

    $scope.finalpost = function ()
    {
        if (called == true) {
            return;
        }

    

         var postData =
            {
                project_id: $scope.params.project_id,
                text: $scope.params.text,
                 class_id:$scope.params.class_id,
                 organization_id: $cookieStore.get('orgID'),
                 user_id: $cookieStore.get('userId'),
                 class_type: "Person",
            }

       

            apiService.post("/Notes/Create", postData).then(function (response) {
                var loginSession = response.data;
                $scope.openSucessfullPopup();
                $modalInstance.dismiss();
                $rootScope.$broadcast('REFRESH', 'NotesGrid');
                called = true;
            },
        function (error) {
            if (error.status === 400)
                alert(error.data.Message);
            else
                alert("Network issue");
        })
        

    }


    $scope.params = {
        project_id: $scope.project1,
        text: $scope.text,
        class_id: $scope.contact1,



    };



    //end
    //popup functionality start
    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'md',
            resolve: { items: { title: "Notes" } }
        });
    }

    //end

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }

    $scope.addNewNotes = function (isValid) {
        $scope.showValid = true;
        if (isValid) {

            $scope.finalpost();
            $scope.showValid = false;

        }

    }


};




