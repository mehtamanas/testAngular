var UploadViewController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $rootScope, FileUploader, uploadService, $window, $modal) {
    console.log('UploadViewController');


    $rootScope.title = 'Dwellar./projects';
    var uploader = $scope.uploader = new FileUploader({
        url: apiService.uploadURL,

    });

    $scope.showProgress = false;
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
        var tag1="";
        for (var i in $scope.choices2) {
            var postData_email
            {
                tag1 = tag1 + $scope.choices2[i].text + ",";

            }

        }

        var postData = {

            media_url: uploadResult.Location,
            user_id: $cookieStore.get('userId'),
            organization_id: $cookieStore.get('orgID'),
            class_id: window.sessionStorage.selectedCustomerID,
            media_name: uploadResult.Name,
            class_type: "Project",
            media_type: "Upload_View",
            tags:tag1
        };

        apiService.post("MediaElement/Create", postData).then(function (response) {
                var loginSession = response.data;
                //   alert("Image upload Done");
                $modalInstance.dismiss();
                $scope.openSucessfullPopup();
            },
                   function (error) {
                       if (error.status === 400)
                           alert(error.data.Message);
                       else
                           alert("Network issue");
                   });
        
    };

    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'md',
            resolve: { items: { title: "View" } }
        });
        $rootScope.$broadcast('REFRESH', 'uploadview');
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
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });
    };
    AuditCreate($scope.params);

    //end


    $scope.choices = [{ id: 'choice1' }];

    $scope.addNewChoice = function () {
        var newItemNo = $scope.choices.length + 1;
        $scope.choices.push({ 'id': 'choice' + newItemNo });
    };


    $scope.choices2 = [{ id: 'choice1' }];
    $(document).on("click", ".remove-field", function () {
        $(this).parent().remove();
    });

    $scope.choices2 = [{ id: 'choice1' }];
    $scope.addNewChoice2 = function (e) {
        var classname = e.currentTarget.className;
        if (classname == 'remove-field') {
            // $scope.choices2.pop();
        }
        else if ($scope.choices2.length) {
            var newItemNo2 = $scope.choices2.length + 1;
            $scope.choices2.push({ 'id': 'choice' + newItemNo2 });
        }

    };




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