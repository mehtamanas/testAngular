/**
 * Created by dwellarkaruna on 24/10/15.
 */
var AddTagPopUpController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal, $rootScope, $window) {
    console.log('AddTagPopUpController');
   
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
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

   
    projectUrl = "Tags/Create";
    ProjectCreate = function (param) {
       
        apiService.post(projectUrl, param).then(function (response) {
            var loginSession = response.data;
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();
            $rootScope.$broadcast('REFRESH', 'tagGrid');
        },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    })
    };

    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'md',
            resolve: { items: { title: "Tag" } }
        });


    }


    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {
           
            $scope.params = {
                name: $scope.params.name,
                organization_id: $cookieStore.get('orgID'),
                user_id: $cookieStore.get('userId'),
              
            };

            new ProjectCreate($scope.params).then(function (response) {
                console.log(response);
                $scope.showValid = false;
                $state.go('guest.signup.thanks');
            }, function (error) {
                console.log(error);
            });

            $scope.showValid = false;

        }

    }



};




