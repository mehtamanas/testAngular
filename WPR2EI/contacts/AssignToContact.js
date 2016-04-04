

var ActionUpController = function ($scope, $state, $cookieStore, apiService, $rootScope, $modalInstance, $modal) {
    console.log('ActionUpController');

    //Audit log start  
    var people_type = $cookieStore.get('people_type');

    if (people_type == "Contact") {
        $scope.title = 'contact';

    }
    else if (people_type == "Client") {
        $scope.title = 'client';

    }
    else if (people_type == "Lead") {
        $scope.title = 'lead';

    }
    else {
        $rootScope.title = '';
    }

    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
           module_id: "Contact",
           action_id: "Contact View",
           details: "Assigned the "+$scope.title+" to: "+$scope.params.city  ,
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

   });
    };
    //end



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


    //calling Api



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
            $rootScope.$broadcast('REFRESH1', 'contactGrid');
            $rootScope.$broadcast('REFRESH2', 'LeadGrid');
            $rootScope.$broadcast('REFRESH3', 'ClientContactGrid');
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