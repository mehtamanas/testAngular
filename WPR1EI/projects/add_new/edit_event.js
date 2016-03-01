

var EditEventproject = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $modal, $rootScope) {
    console.log('EditEventproject');


    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    var orgID = $cookieStore.get('orgID');
    $scope.project1 = window.sessionStorage.selectedCustomerID;
 
    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
           module_id: "Project",
           action_id: "EditEvent",
           details: $scope.params.name + "EditEvent",
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

    contactUrl = "Event/EditGet/" + $scope.seletedCustomerId;
    apiService.getWithoutCaching(contactUrl).then(function (response) {
        $scope.params = response.data[0];

        //var remindTime = moment.utc(moment(response.data[0].start_date).diff(moment(response.data[0].reminder_time))).format("HH:mm:ss")
        var remindTime = moment.duration(moment.utc(moment(response.data[0].start_date).diff(moment(response.data[0].reminder_time))).format("HH:mm:ss")).asMinutes();
        $scope.reminder_time = remindTime.toString();
        $scope.start_date = moment(moment.utc(response.data[0].start_date).toDate()).format("DD/MM/YYYY HH:mm A");
        $scope.end_date = moment(moment.utc(response.data[0].end_date).toDate()).format("DD/MM/YYYY HH:mm A");

        if (response.data[0].remind_me === "1")
            $scope.remind_me = true;
        else
            $scope.remind_me = false;

        //$scope.realyesno = response.data[0].remind_me;
        $scope.project1 = response.data[0].project_id;
        $scope.contact1 = response.data[0].contact_id;

    },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    }
  );

    Url = "project/Get/" + $cookieStore.get('orgID');
    apiService.getWithoutCaching(Url).then(function (response) {
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
    apiService.getWithoutCaching(Url).then(function (response) {
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
        id: window.sessionStorage.selectedCustomerID,
        name: $scope.params.name,
        start_date: $scope.params.start_date,
        end_date: $scope.params.end_date,
        remind_me: $scope.params.remind_me,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),
        location: $scope.params.location,
        reminder_time: $scope.params.reminder_time,
        text: $scope.params.text,
        project_id: $scope.project1,
        contact_id: $scope.contact1,
      
    };



    $scope.save = function () {
        var postData =
               {
                   id: window.sessionStorage.selectedCustomerID,
                   name: $scope.params.name,
                   start_date: $scope.params.start_date,
                   end_date: $scope.params.end_date,
                   remind_me: $scope.params.remind_me,
                   organization_id: $cookieStore.get('orgID'),
                   user_id: $cookieStore.get('userId'),
                   location: $scope.params.location,
                   reminder_time: $scope.params.reminder_time,
                   text: $scope.params.text,
                   project_id: $scope.project1,
                   contact_id: $scope.contact1,
               };

        apiService.post("Event/EditEvent", postData).then(function (response) {
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
        });
    }



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
                //$scope.params.reminder_datetime = moment($scope.params.reminder_datetime, "MM-DD-YYYY HH:");
                $scope.start_date = moment($scope.start_date, 'DD/MM/YYYY HH:mm:ss')._d;
                $scope.end_date = moment($scope.end_date, 'DD/MM/YYYY HH:mm:ss')._d;

            }

            else remind_me = "0";
            $scope.showValid = false;

            $scope.params = {
                start_date: $scope.start_date,
                end_date: $scope.end_date,
                location: $scope.params.location,
                name: $scope.params.name,
                project_id: $scope.project1,
                contact_id: $scope.contact1,
                //  class_type: "Contact",
                organization_id: $cookieStore.get('orgID'),
                user_id: $cookieStore.get('userId'),
                text: $scope.params.text,
                remind_me: remind_me,
                reminder_time: $scope.params.reminder_datetime,
                id: $scope.seletedCustomerId,
            };

            $scope.save($scope.params);

        }

    }

    $scope.save = function (postData) {
        apiService.post("Event/EditEvent", postData).then(function (response) {
            var loginSession = response.data;
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();
            $rootScope.$broadcast('REFRESH', 'TaskGrid');

        },
        function (error) {
            alert("not working ");
        });
    }



    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/Edited.tpl.html',
            backdrop: 'static',
            controller: EditsucessfullController,
            size: 'md',
            resolve: { items: { title: "Event" } }
        });
    
        //$rootScope.$broadcast('REFRESH', 'event');

    };


};