var AddNewPanoramicController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $rootScope, FileUploader, uploadService, $window, $modal,items) {
    console.log('AddNewPanoramicController');

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

    $scope.items = items;
    $scope.box_price = items.box_price;
    $scope.box_price_applicable = items.box_price_applicable;
    $scope.media1 = items.Image_Url_NSEW;
    $scope.dir1 = items.notes;
    $scope.organization_id = $cookieStore.get('orgID');
    $scope.User_ID = $cookieStore.get('userId'); 
   

    $rootScope.title = 'Dwellar./projects';
    var uploader = $scope.uploader = new FileUploader({
        url: apiService.baseUrl +'MediaElement/upload'
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



    uploader.onSuccessItem = function (files, response, status, headers) {
        // post image upload call the below api to update the database
        $scope.media1 = response[0].Location;

      

        var postData = {

            media_url: $scope.media1,
            user_id: $cookieStore.get('userId'),
            organization_id: $cookieStore.get('orgID'),
            class_id: window.sessionStorage.selectedCustomerID,
            //media_name: uploadResult.Name,
            class_type: "Unit_Type",
            media_type: "Unit_NWES_Full_2D",
            notes: $scope.dir1,
            box_price: $scope.box_price,
            box_price_applicable: $scope.box_price_applicable,

        };

        apiService.post("Floors/UpdateInventory", postData).then(function (response) {
            var loginSession = response.data;
            //   alert("Image upload Done");
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

    };
    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'lg',
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