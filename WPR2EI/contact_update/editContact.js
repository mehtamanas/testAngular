/// <reference path="../team/add_new_team.js" />

var updateContactController = function ($scope, $state, $modalInstance, COUNTRIES, $cookieStore, apiService, $modal, $rootScope) {
    console.info("updateContactController");



    $scope.params = {

        last_updated_date: $scope.last_updated_date,
        last_contacted: $scope.last_contacted,

    };

    $scope.save = function () {
        $scope.checkedIds = null;
        $scope.checkedIds = $cookieStore.get('checkedIds');
        var usersToBeAddedOnServer = [];

        var Url;
        if ($cookieStore.get('Selected Text') == "Update Contact") {
            for (var i in $scope.checkedIds) {
                var newMember = {};
                newMember.contact_id = $scope.checkedIds[i];
                newMember.organization_id = $cookieStore.get('orgID');
                newMember.user_id = $cookieStore.get('userId');
                newMember.last_updated_date= moment($scope.params.last_updated_date, 'MM/DD/YYYY').format('YYYY/MM/DD'),
                newMember.last_contacted= moment($scope.params.last_contacted, 'MM/DD/YYYY').format('YYYY/MM/DD'),

                usersToBeAddedOnServer.push(newMember);
            } 
        }

        apiService.post("Contact/MultipleEdit", usersToBeAddedOnServer).then(function (response) {
            var loginSession = response.data;
            AuditCreate();
            $modalInstance.dismiss();
            alert("contact updated Successfully")
            //$scope.openSucessfullPopup();

        },
       function (error) {
           if (error.status === 400)
               alert(error.data.Message);
           else
               alert("Network issue");
       });
    }

}



    //Audit log start    

    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),

           module_id: "User",
           action_id: "User View",
           details: $scope.params.account_email + "user added",
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
  

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.reset = function () {
            $scope.params = {};
        }

        $scope.sucess = function (openSucessfullPopup) {
            $state.go('newuser.sucessfull');
        }

        //popup sucessfull user invited
        $scope.opendonePopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/invite.tpl.html',
                backdrop: 'static',
                controller: InviteController,
                size: 'lg',


            });
        };

    }
