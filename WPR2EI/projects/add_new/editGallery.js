﻿var uploader_done = false;



var EditGallery = function ($scope, $state, $cookieStore, apiService, $modalInstance, $window, FileUploader, $window, uploadService, $modal, $rootScope, imageData) {
    console.log('EditGallery');
    $scope.loadingDemo = false;
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

    var uploader = $scope.uploader = new FileUploader({
        url: apiService.uploadURL
    });

   
    $scope.showProgress = false;


    getApi = function () {

    };

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;


    $scope.notes = imageData.data.notes;
    $scope.media_url = imageData.data.media_url;

    // FILTERS
    uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            var im = '|jpg|png|jpeg|bmp|gif|'.indexOf(type);
            if (im === -1) {
                sweetAlert("Oops...", "You have selected inavalid file type!", "error");
                //alert('You have selected inavalid file type');
            }
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });



    projectUrl = "Project/GetImageByProjectID/" + $scope.seletedCustomerId + "/Gallery_Type_Full_2D";
    apiService.getWithoutCaching(projectUrl).then(function (response) {
        $scope.params = response.data;
    },
function (error) {

});


    // CALLBACKS
    uploader.onAfterAddingFile = function (fileItem, response, status, headers) {
        if (uploader.queue.length > 1) {
            uploader.removeFromQueue(0);
        }
    }
   
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        // alert("uploader called");
        $scope.params.media_url1 = response[0].Location;
        uploader_done = true;

        if (uploader_done == true && uploader1_done == true && uploader2_done == true && uploader3_done == true && uploader4_done == true && uploader5_done == true) {
            $scope.showProgress = false;
            $scope.finalpost();
        }

    };



   




   


  

    uploader.onErrorItem = function (fileItem, response, status, headers) {
        console.log('Unable to upload file.');
    };


 


    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        //$scope.showProgress = false;
    };
   


    //  Audit log start 

    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
           module_id: "EditProject",
           action_id: "EditProject View",
           details: $scope.params.Project_name + "EditProjectView",
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


    //endss



  

  
   
   

    // cancel progress bar code....

    $scope.CanceUpload = function () {
        uploader.cancelAll();
        
        console.log("UploadCancelled");
    }


    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.orgList = ['ABC Real Estate Ltd'];

    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        $scope.loadingDemo = true;
        if (isValid) {
            $scope.loadingDemo = true;

            if (uploader.queue.length != 0)
                uploader.uploadAll();

            $scope.showValid = false;

        }

    }

};