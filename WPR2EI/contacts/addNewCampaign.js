﻿
var AddNewEventContact = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $modal, $rootScope,$window)
{

    console.log('AddNewEventContact');
    $scope.loadingDemo = false;
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    var orgID = $cookieStore.get('orgID');
    $scope.contact1 = window.sessionStorage.selectedCustomerID;
    $scope.start_date = moment().format();
    $scope.end_date = moment().format();
    $scope.reminder_time = "15 min";
  

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

    //end audit log

    Url = "project/Get/" + $cookieStore.get('orgID');
    apiService.getWithoutCaching(Url).then(function (response) {
        $scope.projects = response.data;
    },
   function (error) {
       alert("Error " + error.state);
   });

    $scope.selectproject = function () {
        $scope.params.project_id = $scope.project1;
        //alert($scope.params.project_id);
    };

    Url = "Contact/GetContactByOrg/" + $cookieStore.get('orgID');
    apiService.getWithoutCaching(Url).then(function (response) {
        $scope.contacts = response.data;
    },
   function (error) {
       alert("Error " + error.state);
   });

    $scope.selectcontact = function () {
        $scope.params.assigned_to_id = $scope.contact1;
    };


    $scope.params = {
        name: $scope.name,
        location: $scope.location,
        contact_id: $scope.contact1,
       // class_type: "Contact",
        start_date: $scope.start_date,
        end_date: $scope.end_date,      
        project_id: $scope.project1,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),       
        text: $scope.text,
        remind_me: $scope.remind_me,
        reminder_time: $scope.reminder_time,
    };

     projectUrl = "Event/CreateEvents1";
    ProjectCreate = function (param) {

        apiService.post(projectUrl, param).then(function (response) {
            var loginSession = response.data;
            $modalInstance.dismiss();
            $scope.loadingDemo = false;
            $scope.openSucessfullPopup();
            $rootScope.$broadcast('REFRESH', 'EventGrid');
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
            size: 'sm',
            resolve: { items: { title: "Event" } }

        });
        $rootScope.$broadcast('REFRESH', 'event');

    };

  
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.orgList = ['ABC Real Estate Ltd'];

    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {
            $scope.loadingDemo = true;
             if ($scope.remind_me === true) {
                remind_me = "1";
                $scope.params.reminder_datetime = (($scope.reminder_time).replace(' min', '')).trim();
                $scope.params.reminder_datetime = moment($scope.start_date, 'DD/MM/YYYY HH:mm:ss').subtract($scope.params.reminder_datetime, 'minutes')._d;
              
                $scope.start_date = moment($scope.start_date, 'DD/MM/YYYY HH:mm:ss')._d;
                $scope.end_date = moment($scope.end_date, 'DD/MM/YYYY HH:mm:ss')._d;
            }
            else remind_me = "0";


            $scope.params = {
                start_date: $scope.start_date,
                end_date: $scope.end_date,
                location: $scope.location,
                name: $scope.name,
                organization_id: $cookieStore.get('orgID'),
                user_id: $cookieStore.get('userId'),
                text:$scope.text,
                remind_me: remind_me,
                reminder_time: $scope.params.reminder_datetime,
                contact_id: $scope.contact1,
                project_id:$scope.project1,
              
                
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