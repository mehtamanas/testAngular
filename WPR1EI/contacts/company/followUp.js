/**
 * Created by dwellarkaruna on 24/10/15.
 */
var FollowUpController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal, $rootScope, $window) {

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
   // $scope.seletedCustomerId=$cookieStore.get('ID');

    $scope.companyName = $cookieStore.get('company_name');
    $scope.leadName = $cookieStore.get('lead_name');
    $scope.Email= $cookieStore.get('email');
    $scope.Phone = $cookieStore.get('phone');
    $scope.Name = $cookieStore.get('name');
    $scope.followSelect = -1;

    $scope.emailSelected = function () {
        $scope.emailChecked = true;
        $scope.callChecked = false;
        $scope.selected_email_call = "Email";
    }

    $scope.callSelected = function () {
        $scope.callChecked = true;
        $scope.emailChecked = false;
        $scope.selected_email_call = "Call";
    }
    
   
    $scope.setFollowUp=function(followType){
        if (followType === 'hour') {
            $scope.followSelect = 1;
            $scope.dueDate = moment().add(1, 'hour')._d;
            $scope.dueDate = moment($scope.dueDate).format('DD/MM/YYYY HH:mm:ss');
            $scope.Selescted_Day = "hour";
        }
        else if (followType === 'tomorrow') {
            $scope.followSelect = 2;
            $scope.dueDate = moment().add(1, 'day')._d;
            $scope.dueDate = moment($scope.dueDate).format('DD/MM/YYYY HH:mm:ss');
            $scope.Selescted_Day = "tomorrow";
        }
        else if (followType === 'week') {
            $scope.followSelect = 3;
            $scope.dueDate = moment().add(1, 'week')._d;
            $scope.dueDate = moment($scope.dueDate).format('DD/MM/YYYY HH:mm:ss');
            $scope.Selescted_Day = "week";
        }
        else {
            $scope.followSelect = 4;
            $scope.dueDate = moment().add(1, 'month')._d;
            $scope.dueDate = moment($scope.dueDate).format('DD/MM/YYYY HH:mm:ss');
            $scope.Selescted_Day = "month";
        }
    }


    var userId = $cookieStore.get('userId');
    $scope.reminder_time = "15 min";

    
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
        class_type: "Contact",
        due_date: $scope.due_date,     
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),
        text: $scope.text,
        remind_me: $scope.remind_me,
        reminder_time: $scope.reminder_time,
        contact_id: $scope.seletedCustomerId,
        assign_user_id: $cookieStore.get('userId'),
        type: $scope.Selescted_Day,
        task_type: $scope.selected_email_call,
    };

    projectUrl = "ToDoItem/CreateTask";
    ProjectCreate = function (param) {

        $scope.params.remind_me = $scope.remind_me;

        apiService.post(projectUrl, param).then(function (response) {
            var loginSession = response.data;
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();
            $rootScope.$broadcast('REFRESH', 'TaskGrid');
        },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    })
    };

    //end
    //popup functionality start
    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'md',
            resolve: { items: { title: "Follow Up Task" } }
        });
    }

    //end

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }

    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {
            if ($scope.due_date === undefined || $scope.due_date === '') {
                dDate = moment($scope.dueDate, 'DD/MM/YYYY HH:mm:ss')._d
            }
            else dDate = moment($scope.due_date, 'DD/MM/YYYY HH:mm:ss')._d;
            if ($scope.remind_me === true) {
                remind_me = "1";
                $scope.params.reminder_datetime = (($scope.reminder_time).replace('min', '')).trim();
                $scope.params.reminder_datetime = moment(dDate).subtract($scope.params.reminder_datetime, 'minutes')._d;
                //$scope.params.reminder_datetime = moment($scope.params.reminder_datetime, "MM-DD-YYYY HH:");
               
            }
            else remind_me = "0";

            if($scope.emailChecked)
                task_type_id = '451183db-3efc-4193-a119-98fd1f63c832'//email
                else
                task_type_id='322e4275-9e8b-47b9-ade2-a18fd9668b69'//call
            $scope.params = {
                name: $scope.name,             
                class_type: "Contact",
                due_date: dDate,
                start_date_time: new Date().toISOString(),
                organization_id: $cookieStore.get('orgID'),
                user_id: $cookieStore.get('userId'),            
                text: $scope.text,
                remind_me: remind_me,
                reminder_time: $scope.params.reminder_datetime,
                contact_id: $scope.seletedCustomerId,
                assign_user_id: $cookieStore.get('userId'),
                type: $scope.Selescted_Day,
                task_type: $scope.selected_email_call,
                task_type_id: task_type_id
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




