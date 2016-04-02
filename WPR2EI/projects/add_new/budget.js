

var AddBudgetproject = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $modal, $rootScope) {
    console.log('AddBudgetproject');


    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    var orgID = $cookieStore.get('orgID');

    $scope.project1 = window.sessionStorage.selectedCustomerID;


    //Audit log start
    $scope.params = {

        device_os: "windows10",
        device_type: "mobile",
        device_mac_id: "34:#$::43:434:34:45",
        module_id: "Wing",
        action_id: "Wing View",
        details: "ProjectDetail",
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
    projectUrl = "Event/CreateEvents1";
    $scope.eventCreate = function (params) {

        if ($scope.realyesno == 1) {

            $scope.remind_me = "1";
        }
        else {
            $scope.remind_me = "0";
        };

        $scope.params.remind_me = $scope.remind_me;
        apiService.post(projectUrl, $scope.params).then(function (response) {
            $scope.loginSession = response.data;
            $modalInstance.dismiss();
            // alert("events done...");
            $scope.openSucessfullPopup();
            $rootScope.$broadcast('REFRESH', 'EventGrid');
        },
         function (error) {

         });

        $modalInstance.dismiss();

    },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   };

    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'lg',
            resolve: { items: { title: "Event" } }

        });
        //$rootScope.$broadcast('REFRESH', 'event');

    };


    Url = "project/Get/" + $cookieStore.get('orgID');
    apiService.get(Url).then(function (response) {
        $scope.projects = response.data;
    },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });

    $scope.selectproject = function () {
        $scope.params.project_id = $scope.project1;
    };

    Url = "Contact/GetContactByOrg/" + $cookieStore.get('orgID');
    apiService.get(Url).then(function (response) {
        $scope.contacts = response.data;
    },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });

    $scope.selectcontact = function () {
        $scope.params.assigned_to_id = $scope.contact1;
    };

    $scope.params = {
        event_date: $scope.event_date,
        end_date: $scope.end_date,
        street_1: $scope.street_1,
        name: $scope.name,
        assigned_to_id: $scope.contact1,
        project_id: window.sessionStorage.selectedCustomerID,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),
        //event_type_id: $scope.event1,
        remind_me: $scope.remind_me,
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.orgList = ['ABC Real Estate Ltd'];

    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {
            if ($scope.realyesno == 1) {

                $scope.remind_me = "1";
            }
            else {
                $scope.remind_me = "0";
            };
            new eventCreate($scope.params).then(function (response) {
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