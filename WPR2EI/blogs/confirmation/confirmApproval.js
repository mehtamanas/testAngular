var confirmApprovalController = function ($scope, items, $state, $rootScope, $modal, apiService, $cookieStore, $window, $modalInstance) {
    console.log('confirmApprovalController');
    $scope.selectedBlogID = window.sessionStorage.selectedBlogID;

    //$scope.title = items.title;
    $scope.sendForApproval = function () {
        var postdataSendForApproval = {
            organization_id: $cookieStore.get('orgID'),
            user_id: $cookieStore.get('userId'),
            // comment: $scope.params.comment,
            blog_id: window.sessionStorage.selectedBlogID,
            status: "Sent For Approval",


        };
        apiService.post("Blogs/BlogCommentCreate", postdataSendForApproval).then(function (response) {
            data = response.data[0];
            $rootScope.$broadcast('REFRESH', 'BlogsPostGrid');
            $modalInstance.dismiss();
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

