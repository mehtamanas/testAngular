var confirmationTagController = function ($scope, items, $state, $rootScope, $modal, apiService, $cookieStore, $modalInstance) {
    console.log('confirmationTagController');
    $scope.tagname = $cookieStore.get('tag_name');

    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
           module_id: "Contact",
           action_id: "Contact View",
           details: "Deleted tag: "+$scope.tagname,
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

   });
    };
    //end

    $scope.title = items.title;
    var postdata = $cookieStore.get('postdata');
    $scope.length = parseInt(postdata.length);
    $scope.gotoDelete = function () {
   

        apiService.post("Tags/Delete", postdata).then(function (response) {
            var loginSession = response.data;
            AuditCreate();
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();
            $rootScope.$broadcast('REFRESHTAG', 'Tag');
        },


      function (error) {
          if (error.status === 400)
              alert(error.data.Message);
          else
              alert("Network issue");
      });

        $scope.openSucessfullPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/delete.html',
                backdrop: 'static',
                controller: DeleteController,
                size: 'sm',
                resolve: { items: { title: "Tag" } }


            });
            
        }

    }

};