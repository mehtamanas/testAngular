var AddNewPanoramicViewController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $rootScope, FileUploader, uploadService, $window, $modal) {
    console.log('AddNewPanoramicViewController');


    $rootScope.title = 'Dwellar./projects';
    var uploader = $scope.uploader = new FileUploader({
       url: apiService.uploadURL,
        
    });

    $scope.showProgress = false;


    //var uploader1 = $scope.uploader1 = new FileUploader({
    //    url: apiService.baseUrl +'MediaElement/upload'
    //});

    //$scope.showProgress = false;

    // FILTERS
    uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
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
            media_type: "View_Type_Full_2D",

        };

        apiService.post("MediaElement/Create", postData).then(function (response) {
            var loginSession = response.data;
            //   alert("Image upload Done");
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();

        },
      function (error) {

      });

    };

    $scope.CanceUpload = function () {
        uploader.cancelAll();

        console.log("UploadCancelled");
    }

        $scope.openSucessfullPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/sucessfull.tpl.html',
                backdrop: 'static',
                controller: sucessfullController,
                size: 'md',
                resolve: { items: { title: "Panoramic View" } }
            });
            $rootScope.$broadcast('REFRESH', 'panoramic');
        };

      

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
   function (error) {

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