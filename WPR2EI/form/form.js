angular.module('form')
.controller('FormTeamController', function ($scope, $state, $cookieStore, apiService, $modal, $rootScope, $window) {
    console.log('FormTeamController');
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
   
    var userId = $cookieStore.get('userId');

    var orgID = $cookieStore.get('orgID');
    

    $scope.contact1 = $scope.seletedCustomerId;
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

    //API functionality start
    $scope.params = {
        name: $scope.name,
        contact_id: $scope.contact1,
        class_type: "Contact",
        due_date: $scope.due_date,
        priority: $scope.priority1,
        project_id: $scope.project1,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),
        assign_user_id: $scope.user1,
        end_date_time: $scope.end_date_time,
        task_type_id: $scope.event1,
        text: $scope.text,
        remind_me: $scope.remind_me,
        reminder_time: $scope.reminder_time,
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


    Url = "Team/Get/" + $cookieStore.get('orgID');
    apiService.get(Url).then(function (response) {
        $scope.teams = response.data;
    },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");

   });

    $scope.selectteam = function () {
        $scope.params.team_id = $scope.team1;

    };



    projectUrl = "Form/GenerateFormId";
    apiService.getWithoutCaching(projectUrl).then(function (response) {
        $scope.params = response.data;
        //$cookieStore.put('Random_id', $scope.params.random_id);
    },
function (error) {
    if (error.status === 400)
        alert(error.data.Message);
    else
        alert("Network issue");
}
    );


    Url = "Form/GetForms/" + orgID;
    apiService.get(Url).then(function (response) {
        $scope.formList = response.data;
        $scope.formList = _.pluck($scope.formList, 'name');
    },
   function (error) {
       alert("Error " + error.state);
   });


    projectUrl = "Form/FormToTeam";
    ProjectCreate = function (param) {

        apiService.post(projectUrl, param).then(function (response) {
            var loginSession = response.data;
            alert("form submitted successfully..");
        
        },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    })
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');

    };

    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {
            $cookieStore.put('name', $scope.params.form);

            $scope.params = {
             
                project_id: $scope.project1,
                organization_id: $cookieStore.get('orgID'),
                user_id: $cookieStore.get('userId'),
                team_id: $scope.team1,
                Random_formId: $scope.params.random_id,
                form_name: $scope.params.form,

                
            };

            new ProjectCreate($scope.params).then(function (response) {
                console.log(response);
               
                $scope.showValid = false;
               
            }, function (error) {
                console.log(error);
            });

            $scope.showValid = false;

        }

    }

    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'lg',
            resolve: { items: { title: "form" } }
        });
    }

    
}

);




