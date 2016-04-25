﻿var ActivityBulkController = function ($scope, $state, $cookieStore, apiService, $rootScope, $modalInstance, $modal) {
    console.log('ActivityBulkController');

    Url = "user/Get/" + $cookieStore.get('orgID');
    apiService.get(Url).then(function (response) {
        $scope.users = response.data;
    },

   function (error) {
       alert("Error " + error.state);
   });


    $scope.selectuser = function () {
        $scope.params.mappinguser_id = $scope.user1;

    };
    $scope.params = {
        mappinguser_id: $scope.mappinguser_id,
    };


    $scope.addNew = function () {
        $scope.checkedIds = null;
        $scope.checkedIds = $cookieStore.get('checkedIds');
        var usersToBeAddedOnServer = [];

        var Url;

        for (var i in $scope.checkedIds) {
            var newMember = {};
            newMember.contact_id = $scope.checkedIds[i];
            newMember.organization_id = $cookieStore.get('orgID');
            newMember.user_id = $scope.user1;

            usersToBeAddedOnServer.push(newMember);
        }

        Url = "Mapping/ContactToUser";


        apiService.post(Url, usersToBeAddedOnServer).then(function (response) {
            var loginSession = response.data;
            AuditCreate();
            $modalInstance.dismiss();
            $state.go('app.tasks');
            $rootScope.$broadcast('REFRESH', { name: 'outTaskGrid', data: null, action: 'assign_to' });
            $scope.openSucessfullPopup();

        },
       function (error) {
           if (error.status === 400)
               alert(error.data.Message);
           else
               alert("Network issue");
       });
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
            templateUrl: 'contacts/assignpopup.tpl.html',
            backdrop: 'static',
            controller: assigntopopup,
            size: 'sm',


        });

    }
};