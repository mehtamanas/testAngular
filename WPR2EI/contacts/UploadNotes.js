var ContactNotesUploadPopUpController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $rootScope, FileUploader, uploadService, $window, $modal) {
    console.log('ContactNotesUploadPopUpController');


    $rootScope.title = 'Dwellar./projects';
    var uploader = $scope.uploader = new FileUploader({
        url: apiService.uploadURL,

    });

    $scope.showProgress = false;

    // FILTERS
    //uploader.filters.push({
    //    name: 'imageFilter',
    //    fn: function (item /*{File|FileLikeObject}*/, options) {
    //        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
    //        return '||csv|'.indexOf(type) !== -1;
    //    }
    //});


    uploader.onAfterAddingFile = function (fileItem, response, status, headers) {
        if (uploader.queue.length > 1) {
            uploader.removeFromQueue(0);
        }
    }


    uploader.onSuccessItem = function (files, response, status, headers) {
        // post image upload call the below api to update the database
        var uploadResult = response[0];


        var postData = {

            media_url: uploadResult.Location,
            user_id: $cookieStore.get('userId'),
            organization_id: $cookieStore.get('orgID'),
            class_id: $cookieStore.get('userId'),
            media_name: uploadResult.Name,
            class_type: "Contact",
            media_type: "LeadNotesUploadZoho",

        };

        apiService.post("MediaElement/Create", postData).then(function (response) {
            var loginSession = response.data;
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();

        },
      function (error) {

      });

    };

    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'contacts/uploadSuccess.html',
            backdrop: 'static',
            controller: uploadSuccessController,
            size: 'lg',
            resolve: { items: { title: "Notes Uploaded" } }
        });

    };


    uploader.onErrorItem = function (fileItem, response, status, headers) {
        console.log('Unable to upload file.');
    };

    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        $scope.showProgress = false;
    };


    $scope.params = {
        organization_id: $cookieStore.get('orgID'),
        User_ID: $cookieStore.get('userId')
    };

    $scope.orgList = ['ABC Real Estate Ltd'];

    $scope.addNew = function (isValid) {
        $scope.showValid = true;


        $scope.showValid = false;



    }

};