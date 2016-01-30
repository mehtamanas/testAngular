﻿var AddNewVideosController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $rootScope, FileUploader, uploadService, $window, $modal) {
    console.log('AddNewVideosController');


    $rootScope.title = 'Dwellar./projects';
    var uploader = $scope.uploader = new FileUploader({
       url: apiService.uploadURL,
       
    });

    $scope.showProgress = false;


    //var uploader1 = $scope.uploader1 = new FileUploader({
    //   url: apiService.uploadURL,

    //});

    //$scope.showProgress = false;

    // FILTERS
    uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            var im = '|mp4|'.indexOf(type);
            if (im === -1) {

                alert('You have selected inavalid file type');
            }
            return '|mp4|'.indexOf(type) !== -1;
        }
    });


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
                class_id: window.sessionStorage.selectedCustomerID,
                media_name: uploadResult.Name,
                class_type: "Project",
                media_type: "Gallery_video_Type_Full_2D",
            //    notes: $scope.params.notes,
                //project_type: $scope.params.project_type,                     
                //user_id : mediaElement.user_id,
                //class_id : mediaElement.class_id,
                //class_type : mediaElement.class_type,
                //media_name : mediaElement.media_name,
                //media_url : mediaElement.media_url,
                //storage_sync_pending : mediaElement.storage_sync_pending,
                //media_type : mediaElement.media_type,
                //organization_id : mediaElement.organization_id


            };
            $scope.openSucessfullPopup = function () {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'newuser/sucessfull.tpl.html',
                    backdrop: 'static',
                    controller: sucessfullController,
                    size: 'md',
                    resolve: { items: { title: "Video" } }
                });
                $rootScope.$broadcast('REFRESH', 'videos');
            };

            
            apiService.post("MediaElement/Create", postData).then(function (response) {
                var loginSession = response.data;
               
                $modalInstance.dismiss();
                $scope.openSucessfullPopup();

            },
            function (error)
            {
                if (error.status === 400)
                    alert(error.data.Message);
                else
                    alert("Network issue");
            });
        }

    $scope.CanceUpload = function () {
        uploader.cancelAll();
        
        console.log("UploadCancelled");
    }

        //Audit log start															
        $scope.params =
            {
                device_os: $cookieStore.get('Device_os'),
                device_type: $cookieStore.get('Device'),
                device_mac_id: "34:#$::43:434:34:45",
                module_id: "Contact",
                action_id: "Contact View",
                details: "GalleryView",
                application: "angular",
                browser: $cookieStore.get('browser'),
                ip_address: $cookieStore.get('IP_Address'),
                location: $cookieStore.get('Location'),
                organization_id: $cookieStore.get('orgID'),
                User_ID: $cookieStore.get('userId')
            };

        AuditCreate = function (param) {
            apiService.post("AuditLog/Create", param).then(function (response) {
                var loginSession = response.data;
            },
       function (error)
       {
           if (error.status === 400)
               alert(error.data.Message);
           else
               alert("Network issue");
       });
        };
        AuditCreate($scope.params);

        //end



        uploader.onErrorItem = function (fileItem, response, status, headers) {
            console.log('Unable to upload file.');
        };

        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            $scope.showProgress = false;
        };


        $scope.params = {
            notes: $scope.notes,
            organization_id: $cookieStore.get('orgID'),
            User_ID: $cookieStore.get('userId')
        };

        $scope.orgList = ['ABC Real Estate Ltd'];

        $scope.addNew = function (isValid) {
            $scope.showValid = true;
            if (isValid) {

                $scope.showValid = false;

            }

        }
   
};