﻿var AddNewBrochureController= function ($scope, $state, $cookieStore, apiService, $modalInstance, $rootScope, FileUploader, uploadService, $window, $modal) {
    console.log('AddNewBrochureController');


    $rootScope.title = 'Dwellar./projects';

    var uploader = $scope.uploader = new FileUploader({
        url: 'https://dw-webservices-uat.azurewebsites.net/MediaElement/upload',
        queueLimit: 1
    });

    var uploader1 = $scope.uploader1 = new FileUploader({
        url: 'https://dw-webservices-uat.azurewebsites.net/MediaElement/upload',
        queueLimit: 1
    });


    $scope.showProgress = false;


    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'md',
            resolve: { items: { title: "Brochure" } }
        });
        $rootScope.$broadcast('REFRESH', 'brochure');
    };
    // FILTERS
    uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|pdf|'.indexOf(type) !== -1;
        }
    });

    // FILTERS
    uploader1.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|pdf|'.indexOf(type) !== -1;
        }
    });


    var upload1 = 0;
    var upload2 = 0;

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
            media_type: "Pdf_start",
        
        };

        


        //alert(user_id);
        apiService.post("MediaElement/Create", postData).then(function (response) {
            upload1 = 1;
            var loginSession = response.data;
            //   alert("Image upload Done");
            if (upload1 == 1 && upload2 == 1) {
                $modalInstance.dismiss();
                $scope.openSucessfullPopup();
            }

        },
        function (error) {

        });

    };



    uploader1.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
        var uploadResult1 = response[0];
        // TODO: Need to get these values dynamically
        
        var postData1 = {

            media_url: uploadResult1.Location,
            user_id: $cookieStore.get('userId'),
            organization_id: $cookieStore.get('orgID'),
            class_id: window.sessionStorage.selectedCustomerID,
            media_name: uploadResult1.Name,
            class_type: "Project",
            media_type: "Pdf_End",

        };

        apiService.post("MediaElement/Create", postData1).then(function (response) {
            var loginSession = response.data;
            upload2 = 1;
            if (upload1 == 1 && upload2 == 1) {
                $modalInstance.dismiss();
                $scope.openSucessfullPopup();
            }
            //   alert("Image upload Done");
            
        },
        function (error) {

        });


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

    uploader1.onErrorItem = function (fileItem, response, status, headers) {
        console.log('Unable to upload file.');
    };

    uploader1.onCompleteItem = function (fileItem, response, status, headers) {
        $scope.showProgress = false;
    };



    $scope.params = {
        
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