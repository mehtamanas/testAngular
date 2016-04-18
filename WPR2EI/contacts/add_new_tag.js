
var AddTagController = function ($scope, $state, $cookieStore, apiService, $rootScope, $modalInstance, $modal, $window) {
    console.log('AddTagController');

    var orgID = $cookieStore.get('orgID');
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    //Audit log start
    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
           module_id: "Contact",
           action_id: "Contact View",
           details: "Added new tag: " + $scope.params.tag_name,
           application: "Angular",
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
    //API functionality start  
    Url = "Tags/GetAllTags?id=" + orgID
    apiService.get(Url).then(function (response) {
        $scope.tagList = response.data;
        $scope.tagList = _.pluck($scope.tagList, 'tag_name');
    },
function (error) {
    alert("Error " + error.state);
});

    $scope.saveFun = function () {
       
        var usersToBeAddedOnServer = [];
         
            var newMember = {};
            newMember.contact_id = $scope.seletedCustomerId;
            newMember.tag_name = $scope.params.tag_name;
            newMember.user_id = $cookieStore.get('userId');
            newMember.organization_id = $cookieStore.get('orgID');
            $cookieStore.put('tag_name', newMember.tag_name);
            usersToBeAddedOnServer.push(newMember);
         
           

            apiService.post("Tags/ContactTagMappingGrid", usersToBeAddedOnServer).then(function (response) {
            var loginSession = response.data;
                // alert("Document done");
            AuditCreate();
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();
            $rootScope.$broadcast('REFRESH1', {name:'contactGrid',data:null});
            $rootScope.$broadcast('REFRESH2', {name:'LeadGrid',data:null});
            $rootScope.$broadcast('REFRESH3', {name:'ClientContactGrid',data:null});
            $rootScope.$broadcast('REFRESHTAG', 'Tag');
        },
        function (error)
        {
            if (error.status === 400)
                alert(error.data.Message);
            else
                alert("Network issue");
        });
    }
    $scope.params = {

        tag_name: $scope.tag_name,
        organization_id: $cookieStore.get('orgID'),
        User_ID: $cookieStore.get('userId'),
        contact_id: $scope.seletedCustomerId,

    };


    //projectUrl = "Tags/ContactTagMapping";
    //ProjectCreate = function (param) {      
    //        apiService.post(projectUrl, param).then(function (response) {
    //        var loginSession = response.data;
    //        $modalInstance.dismiss();
    //        $scope.openSucessfullPopup();
    //        $rootScope.$broadcast('REFRESH1', 'contactGrid');
    //        $rootScope.$broadcast('REFRESH2', 'LeadGrid');
    //        $rootScope.$broadcast('REFRESH3', 'ClientContactGrid');
    //    },
    //function (error) {
    //    if (error.status === 400)
    //        alert(error.data.Message);
    //    else
    //        alert("Network issue");
    //})
    //};


    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {
          


            $scope.saveFun();

            $scope.showValid = false;

        }

    }

    //end

    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'sm',
            resolve: { items: { title: "Tag" } }
        });


    }
};