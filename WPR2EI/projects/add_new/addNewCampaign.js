﻿

var AddNewEventproject = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $modal, $rootScope)
{
    console.log('AddNewEventproject');


    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    var orgID = $cookieStore.get('orgID');
    $scope.reminder_time = "15 min";
    $scope.project1 = window.sessionStorage.selectedCustomerID;
    $scope.start_date = moment().format();
    $scope.end_date = moment().format();

   
    //Audit log start															
    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
           module_id: "Project",
           action_id: "AddProjectEvent View",
           details: $scope.name + "AddEvent",
           application: "angular",
           browser: $cookieStore.get('browser'),
           ip_address: $cookieStore.get('IP_Address'),
           location: $cookieStore.get('Location'),
           organization_id: $cookieStore.get('orgID'),
           User_ID: $cookieStore.get('userId'),

       };


        apiService.post("AuditLog/Create", postdata).then(function (response) {
            var loginSession = response.data;
        },
    function (error) {
    });
    };


    //end

    //end


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

    projectUrl = "Event/CreateEvents1";
    ProjectCreate = function (param) {
       apiService.post(projectUrl, param).then(function (response) {
           var loginSession = response.data;
           AuditCreate();
            $modalInstance.dismiss();
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
            size: 'md',
            resolve: { items: { title: "Event" } }

        });
        //$rootScope.$broadcast('REFRESH', 'event');

    };


   
 

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.orgList = ['ABC Real Estate Ltd'];

    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {

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
                text: $scope.text,
                remind_me: remind_me,
                reminder_time: $scope.params.reminder_datetime,
                contact_id: $scope.contact1,
                project_id: $scope.project1,


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