
var TagPopUpController = function ($scope, $state, $cookieStore, apiService, $rootScope, $modalInstance, $modal, $window) {
    console.log('TagPopUpController');

    var orgID = $cookieStore.get('orgID');

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    //Audit log start
    $scope.params = {
        device_os: "windows10",
        device_type: "mobile",
        device_mac_id: "34:#$::43:434:34:45",
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
    //API functionality start  
    Url = "Tags/GetAllTags?id=" + orgID
    apiService.get(Url).then(function (response) {
        $scope.tagList = response.data;
        //$scope.tagList = _.pluck($scope.tagList, 'tag_name');
    },
function (error) {
    alert("Error " + error.state);
});
    $scope.checkedIds = null;
    $scope.checkedIds = $cookieStore.get('checkedIds');

    projectUrl = "Tags/ContactTagMappingGrid";
    ProjectCreate = function (param) {
        var usersToBeAddedOnServer = [];
        for (var i in $scope.checkedIds) {
            var newMember = {};
            newMember.contact_id = $scope.checkedIds[i];
            newMember.tag_name = $scope.params.tag_name;
            newMember.user_id = $cookieStore.get('userId');
            newMember.organization_id = $cookieStore.get('orgID');
            usersToBeAddedOnServer.push(newMember);
        }
        apiService.post(projectUrl, usersToBeAddedOnServer).then(function (response) {
            var loginSession = response.data;
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();
            $rootScope.$broadcast('REFRESH1', 'contactGrid');
            $rootScope.$broadcast('REFRESH2', 'LeadGrid');
            $rootScope.$broadcast('REFRESH3', 'ClientContactGrid');
        },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    })
    };


    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {


            new ProjectCreate().then(function (response) {
                console.log(response);
                $scope.showValid = false;
                $state.go('guest.signup.thanks');
            }, function (error) {
                console.log(error);
            });

            $scope.showValid = false;

        }

    }

    //end

    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'lg',
            resolve: { items: { title: "Tag" } }
        });


    }
};