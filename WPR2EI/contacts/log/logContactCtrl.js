

var logContactCtrl = function ($scope, $state, $cookieStore, apiService, $rootScope, $modalInstance, $modal) {
    console.log('logContactCtrl');

    $scope.seletedContactId = window.sessionStorage.selectedCustomerID;

    $scope.callChecked = true;
    $scope.emailSelected = function () {
        $scope.emailChecked = true;
        $scope.callChecked = false;    
        $scope.meetingChecked = false;
        $scope.otherChecked = false;
        $scope.selected_email_call = "Email";
    }

    $scope.callSelected = function () {
        $scope.callChecked = true;
        $scope.emailChecked = false;
        $scope.meetingChecked = false;
        $scope.otherChecked = false;
        $scope.selected_email_call = "Call";
    }


    $scope.meetingSelected = function () {
        $scope.callChecked = false;
        $scope.emailChecked = false;
        $scope.meetingChecked = true;
        $scope.otherChecked = false;
        $scope.selected_email_call = "Meeting";
    }

    $scope.otherSelected = function () {
        $scope.callChecked = false;
        $scope.emailChecked = false;
        $scope.meetingChecked = false;
        $scope.otherChecked = true;
        $scope.selected_email_call = "Other";
    }

    $scope.params = {       
        date_time: $scope.date_time,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),
        text: $scope.text,
        contact_id: $scope.seletedContactId,
        type: $scope.selected_email_call,
      
        class_type:"Person",
    };

    projectUrl = "Contact/EditCreateLog";
    ProjectCreate = function (param) {
        $scope.loadingDemo = true;
        

        apiService.post(projectUrl, param).then(function (response) {
            var loginSession = response.data;
            $modalInstance.dismiss();
            $scope.loadingDemo = false;
            $scope.openSucessfullyPopup();
            AuditCreate();
            $rootScope.$broadcast('REFRESH', 'TaskGrid');
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

    $scope.reset = function () {
        $scope.params = {};
    }
    $scope.editorOption = {
        messages: {
            insertHtml: "Insert Variable"
        },
        tools: ["bold",
                "italic",
                "underline",
                "strikethrough",
                "justifyLeft",
                "justifyCenter",
                "justifyRight",
                "justifyFull",
                "insertUnorderedList",
                "insertOrderedList",
                "indent",
                "outdent",
                "createLink",
                'pdf',
                "unlink",
                "fontName",
                "fontSize",
                "foreColor",
                "backColor",
                "print",
                'createTable',
                {
                    name: "myTool",
                    tooltip: "Insert Image",
                    exec: function (e) {
                        $('#imageBrowser').trigger("click");
                    }
                },
                  "viewHtml",
        ],
    }


    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {

            if ($scope.emailChecked)
                task_type_id = '451183db-3efc-4193-a119-98fd1f63c832'//email
            else if ($scope.callChecked)
                task_type_id = '322e4275-9e8b-47b9-ade2-a18fd9668b69'//call
            else if ($scope.meetingChecked)
                task_type_id = '809a2c67-7ad7-4dc6-8192-436644e8f95f'//meeting
            else
                task_type_id = '3F2FC879-B5DE-477A-B749-E8E9ABE2CDBF'//other
            $scope.params = {              
                date_time: $scope.params.date_time,
                organization_id: $cookieStore.get('orgID'),
                user_id: $cookieStore.get('userId'),
                text: $scope.params.text,
                contact_id: $scope.seletedContactId,
                type: $scope.selected_email_call,
                task_type_id: task_type_id,
                class_type:"Person"
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

    $scope.openSucessfullyPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'login/successfully.html',
            backdrop: 'static',
            controller: sucessfullyController,
            size: 'sm',
            resolve: { items: { title: "Log Created" } }
        });
    }
};