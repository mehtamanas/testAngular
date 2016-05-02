
var ActivityTagPopUpController = function ($scope, $state, $cookieStore, apiService, $rootScope, $modalInstance, $modal, $window) {
    console.log('ActivityTagPopUpController');

    var orgID = $cookieStore.get('orgID');

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    //Audit log start
    $scope.params = {
        device_os: "windows10",
        device_type: "mobile",
        device_mac_id: "34:#$::43:434:34:45",
        module_id: "Add Task Tag",
        action_id: "Add Task Tag View",
        details: "Add Task Tag detail",
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
    Url = "Tags/GetAllTags?id=" + orgID
    apiService.get(Url).then(function (response) {
        $scope.tagList = response.data;
        $scope.tagList = _.sortBy($scope.tagList, function (o) { return o.tag_name; });
  
        //$scope.tagList = _.pluck($scope.tagList, 'tag_name');
    },
function (error) {
    alert("Error " + error.state);
});
    $scope.checkedIds = null;
    $scope.checkedIds = $cookieStore.get('checkedIds');

    projectUrl = "Mapping/TaskToTag";
    ProjectCreate = function (param) {
        var tagAssignToTask = [];

        for (var i in $scope.checkedIds) {
            var newTag = {};
            newTag.task_id = $scope.checkedIds[i];
            newTag.tag_name = $scope.params.tag_name;
            newTag.user_id = $cookieStore.get('userId');
            newTag.organization_id = $cookieStore.get('orgID');
            tagAssignToTask.push(newTag);
        }
        apiService.post(projectUrl, tagAssignToTask).then(function (response) {
            var loginSession = response.data;
            $modalInstance.dismiss();
            $state.go('app.tasks');
            $rootScope.$broadcast('REFRESH', { name: 'outTaskGrid', data: null, action: 'assign_tag' });
            $scope.openSucessfullPopup();
        },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    })
    };


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

    //end

    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'contacts/assignpopup.tpl.html',
            backdrop: 'static',
            controller: assigntopopup,
            size: 'sm',
            resolve: { items: { title: "Tag" } }
        });


    }
};