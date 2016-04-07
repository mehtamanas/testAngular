/// <reference path="../team/add_new_team.js" />

var UserPopUpController = function ($scope, $state, $modalInstance, COUNTRIES, $cookieStore, apiService, $modal, $rootScope, PATTERNREGEXS) {
    console.info("UserPopUpController");

    $scope.countryList = COUNTRIES;
    $scope.jobTitleList = ['Sr.Manager', 'Sr.Leader'];
    $scope.departmentList = ['Sales', 'CEO'];
    $scope.cityList = ['Kolkata'];
    $scope.stateList = ['West Bengal'];
    $scope.Organization = $cookieStore.get('orgID');
    $scope.emailRegex = PATTERNREGEXS.email;

    $scope.params = {
        first_name: $scope.first_name,
        last_name: $scope.last_name,
        account_email: $scope.account_email,
        product_type: 'dwellar',
        organization_id: $scope.Organization
    };
    $scope.sucess = function (openSucessfullPopup) {
        $state.go('newuser.sucessfull');
    }
    $scope.newuse = function () {
        var im = 0;
        email = $scope.params.account_email;
        var emails = email.split(",");
        for (i = 0; i < emails.length; i++) {
            var schemeupdate = [];
            var userscheme = {};
            userscheme.first_name = $scope.first_name,
            userscheme.last_name = $scope.last_name,
            userscheme.account_email = emails[i],
            userscheme.product_type = 'dwellar',
            userscheme.organization_id = $scope.Organization,

            schemeupdate.push(userscheme);

            Url = "Register/InviteUser";
            apiService.post(Url, schemeupdate).then(function (response) {
                var loginSession = response.data;
                AuditCreate();
                im++;
                if (im == emails.length) {
                
                    $scope.opendonePopup();
                    $modalInstance.dismiss();
                  
                    $rootScope.$broadcast('REFRESH', 'mainGridOptions');
                }
            },
        function (error) {
            if (error.status === 400)
            {
                im++;
                alert(error.data.Message);
            }
               
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
           details: $scope.params.account_email+"user added",
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
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }

  
    //popup sucessfull user invited
    $scope.opendonePopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/invite.tpl.html',
            backdrop: 'static',
            controller: InviteController,
            size: 'sm',


        });
    };

}
