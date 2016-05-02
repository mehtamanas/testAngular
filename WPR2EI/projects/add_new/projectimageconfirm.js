var confirmProjectImageController = function ($scope, items, $state, $rootScope, $modal, apiService, $cookieStore, $modalInstance) {
    console.log('confirmProjectImageController');
    //Audit log start

 
    $scope.title = items.title;
    var imageDelete = $cookieStore.get('imagepostdata');
    $scope.length = parseInt(imageDelete.length);
    $scope.gotoDelete = function () {
        apiService.post("MediaElement/Delete", imageDelete).then(function (response) {
            var loginSession = response.data;
            $scope.openSucessfullPopup();
            $modalInstance.dismiss();
            $rootScope.$broadcast('REFRESH', 'images');
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
                resolve: { items: { title: "Image" } }

            });

        }

    }

};