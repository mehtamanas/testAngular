var confirmBlogController = function ($scope, items, $state, $rootScope, $modal, apiService, $cookieStore, $window, $modalInstance)
{
    console.log('confirmBlogController');
    $scope.selectedBlogID = window.sessionStorage.selectedBlogID;

    //$scope.title = items.title;
    $scope.approval = function () {
        var postdataApproval = {
            organization_id: $cookieStore.get('orgID'),
            user_id: $cookieStore.get('userId'),
            approval_user_id: $cookieStore.get('userId'),
            class_id: window.sessionStorage.selectedBlogID,
            status: "Approved",

        };
        apiService.post("Blogs/CreateApproval", postdataApproval).then(function (response) {
            data = response.data[0];
            $rootScope.$broadcast('REFRESH', 'BlogsPostGrid');
            $scope.cancel();
        },
              function (error) {
                  if (error.status === 400)
                      alert(error.data.Message);
              });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss();
    }

};

