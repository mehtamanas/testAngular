/**
 * Created by dwellarkaruna on 24/10/15.
 */


var uploadController = function ($scope,$state, $modalInstance, uploadService,apiService, FileUploader) {
    var uploader = $scope.uploader = new FileUploader({
        //url: apiService.baseUrl +'MediaElement/upload'
        // url: apiService.baseUrl +'User/Upload'
        url: apiService.baseUrl +'User/UploadCSV'
    });
  

    // FILTERS
    //uploader.filters.push({
    //    name: 'imageFilter',
    //    fn: function (item /*{File|FileLikeObject}*/, options) {
    //        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
    //        return '|xlsx|'.indexOf(type) !== -1;
    //    }
    //});

    // CALLBACKS
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
        var uploadResult = response[0];

        // TODO: Need to get these values dynamically
        var postData = {
            "user_id": "7fbfbdfd-0b46-4a99-bda0-2322e67e9f49",
            "class_id": "537e8ce4-db1b-424a-be0c-57a0598971d1",
            "class_type": "Property_Listing",
            "media_name": uploadResult.Name,
            "media_url": uploadResult.Location,
            "storage_sync_pending": "True",
            "media_type": "2d plan",
            "organization_id": "38a801a8-9c32-4b52-8433-00c059421218"
        };

        uploadService.postDataAfterUpload(postData).then(function () {
            // Process the successful file 
            $modalInstance.dismiss();
            $state.go('map');

           
        }, function (error) {
            alert('Error occured while creating a new upload image');
        })
    };

    uploader.onErrorItem = function (fileItem, response, status, headers) {
        alert('Unable to upload file.');
    };

    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        $scope.showProgress = false;
    };
    
   
    $scope.mapfun = function () {
        
            $state.go('map');
        

    };


    $scope.reviewfun = function () {

        $state.go('review');


    };


    $scope.summaryfun = function () {

        $state.go('summary');


    };
};