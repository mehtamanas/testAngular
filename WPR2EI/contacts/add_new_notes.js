/**
 * Created by dwellarkaruna on 24/10/15.
 */
var AddNewNotesController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal, $rootScope, $window) {
    console.log('AddNewNotesController');
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

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


    $scope.choices = [{ id: 'choice1' }];

    $scope.addNewChoice = function () {
        var newItemNo = $scope.choices.length + 1;
        $scope.choices.push({ 'id': 'choice' + newItemNo });
    };


    $scope.choices2 = [{ id: 'choice1' }];
    $(document).on("click", ".remove-field", function () {
        $(this).parent().remove();
    });

    $scope.choices2 = [{ id: 'choice1' }];
    $scope.addNewChoice2 = function (e) {
        var classname = e.currentTarget.className;
        if (classname == 'remove-field') {
            // $scope.choices2.pop();
        }
        else if ($scope.choices2.length) {
            var newItemNo2 = $scope.choices2.length + 1;
            $scope.choices2.push({ 'id': 'choice' + newItemNo2 });
        }

    };

    //API functionality start
    //$scope.params = {
    //    project_id: $scope.project1,
    //    text: $scope.text,
    //    class_id:$scope.contact1,
    //    organization_id: $cookieStore.get('orgID'),
    //    user_id: $cookieStore.get('userId'),
    //    class_type: "Person",
        
    //};


   



    projectUrl = "Notes/CreateMultipleNotes";
    ProjectCreate = function () {
        var schemeupdate = [];

        for (var i in $scope.choices2)
        {
         

            var newscheme = {};

            newscheme.user_id = $cookieStore.get('userId');
            newscheme.organization_id = $cookieStore.get('orgID');
            newscheme.text = $scope.choices2[i].text;
            newscheme.class_id = window.sessionStorage.selectedCustomerID;
            newscheme.class_type = "Person";
            schemeupdate.push(newscheme);

       
        }
        apiService.post(projectUrl, schemeupdate).then(function (response) {
            var choices2 = response.data;


            $scope.openSucessfullPopup();
            $modalInstance.dismiss();
            $rootScope.$broadcast('REFRESH', 'NotesGrid');
        },
function (error) {
    if (error.status === 400)
        alert(error.data.Message);
    else
        alert("Network issue");
});
        }
       


    //projectUrl = "/Notes/Create";
    //ProjectCreate = function (param) {

    //    apiService.post(projectUrl, param).then(function (response) {
    //        var loginSession = response.data;
    //        $scope.openSucessfullPopup();
    //        $modalInstance.dismiss();
    //        $rootScope.$broadcast('REFRESH', 'NotesGrid');
    //    },
    //function (error) {
    //    if (error.status === 400)
    //        alert(error.data.Message);
    //    else
    //        alert("Network issue");
    //})
    //};



    //end
    //popup functionality start
    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'md',
            resolve: { items: { title: "Notes" } }
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


};




