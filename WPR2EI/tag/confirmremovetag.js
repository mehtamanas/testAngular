var confirmTagController = function ($scope, items, $state, $rootScope, $modal, apiService, $cookieStore, $modalInstance) {
    console.log('confirmTagController');

    $scope.title = items.title;
    var tagDelete = $cookieStore.get('tagDelete');
    $scope.length = parseInt(tagDelete.length);
    $scope.gotoDelete = function () {

        apiService.post("Tags/DeleteMultipleTags", tagDelete).then(function (response) {
            var loginSession = response.data;
            $modalInstance.dismiss();          
            $scope.openSucessfullPopup();
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
                size: 'md',
                resolve: { items: { title: "Tag" } }
            });
            $rootScope.$broadcast('REFRESH', 'tagGrid');
        }

    }

};