

var OptionPopUpController = function ($scope, $state, $cookieStore, apiService, $rootScope, $modalInstance, $modal) {
    console.log('OptionPopUpController');

    //Audit log start
    $scope.params = {
        device_os: $cookieStore.get('Device_os'),
        device_type: $cookieStore.get('Device'),
        module_id: "Addnew Project",
        action_id: "Addnew Project View",
        details: "Addnew Project detail",
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

    $scope.params = {};

    apiService.get('Role/Get/1').then(function (response) {
        $scope.roles = response.data;
    },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    });


    $scope.selectRole = function () {
    };

    $scope.addNew = function (isvalid) {
        if (isvalid) {
            $scope.loadingDemo = true;
            $scope.checkedIds = null;
            $scope.checkedIds = $cookieStore.get('checkedIds');
            var usersToBeAddedOnServer = [];

            var Url;
            for (var i in $scope.checkedIds) {
                var newMember = {};
                newMember.role_user_id = $scope.checkedIds[i];
                newMember.role_id = $scope.role;
                newMember.user_id = $cookieStore.get('userId');
                newMember.organization_id = $cookieStore.get('orgID');
                usersToBeAddedOnServer.push(newMember);
            }
            Url = "Mapping/UserToRole";
            apiService.post("Mapping/UserToRole", usersToBeAddedOnServer).then(function (response) {
                var loginSession = response.data;
                $modalInstance.dismiss();
                $scope.openSucessfullPopup();
                $rootScope.$broadcast('REFRESH', 'mainGridOptions');
            },
       function (error) {
           $scope.loadingDemo = false;
           if (error.status === 400)
               alert(error.data.Message);
           else
               alert("Network issue");
       });
        }
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }

    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'projects/AssignTo.html',
            backdrop: 'static',
            controller: AssignToController,
            size: 'sm',
            resolve: { items: { title: "Role" } }

        });
    }
};