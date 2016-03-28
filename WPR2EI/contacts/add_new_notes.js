/**
 * Created by dwellarkaruna on 24/10/15.
 */
var AddNewNotesController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal, $rootScope, $window) {
    console.log('AddNewNotesController');
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

    $scope.params;

    $scope.contact1 = $scope.seletedCustomerId;

    var userID = $cookieStore.get('userId');
    //Audit log start

    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
           //device_mac_id: "34:#$::43:434:34:45",
           module_id: "Contact",
           action_id: "Contact View",
           details: "Added new note",
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

    //end
    $scope.contactList = [];

    apiService.get("Contact/GetAllContactDetails?Id=" + userID + "&type=Lead").then(function (response) {
        data = response.data;
        contactsName = _.pluck(data, 'Name');
        contactId = _.pluck(data, 'id');
        for (i = 0; i < contactsName.length; i++) {
            $scope.contactList.push({'text': contactsName[i].toString(), 'id': contactId[i].toString()});
        }
    },function (error) {
            });


    $scope.loadTags = function (query) {
        return $scope.contactList;
    }





    projectUrl = "Notes/CreateMultipleNotes";
    ProjectCreate = function () {
        var schemeupdate = [];
 
            var newscheme = {};
            newscheme.attention = _.pluck($scope.params.Name, 'text').join(','),
            newscheme.user_id = $cookieStore.get('userId');
            newscheme.organization_id = $cookieStore.get('orgID');
            newscheme.text = $scope.params.description;
            newscheme.class_id = window.sessionStorage.selectedCustomerID;
            newscheme.class_type = "Person";
            schemeupdate.push(newscheme);
        

        apiService.post(projectUrl, schemeupdate).then(function (response) {
            var choices2 = response.data;
            AuditCreate();
            $scope.openSucessfullPopup();
            $modalInstance.dismiss();

            $rootScope.$broadcast('REFRESH', 'NotesGrid');
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




