/**
 * Created by dwellarkaruna on 24/10/15.
 */
var ImageUploadController = function($scope, $modalInstance){
    $scope.uploadImageToBlob = function(flow){
        // set the flow target to upload
        flow.opts.target = apiService.baseUrl +'Contact/upload/eba432ab-ea20-482e-b3b6-7c77f11c25ff';
        flow.upload();
    }
};