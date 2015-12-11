var AddNewUnitController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $rootScope, FileUploader, uploadService, $window, $modal) {
    console.log('AddNewUnitController');


    $rootScope.title = 'Dwellar./projects';
    var uploader = $scope.uploader = new FileUploader({
        url: 'https://dw-webservices-dev.azurewebsites.net/MediaElement/upload'
    });
    var uploader1 = $scope.uploader1 = new FileUploader({
        url: 'https://dw-webservices-dev.azurewebsites.net/MediaElement/upload'
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

     //FILTERS
    //uploader1.filters.push({
    //    name: 'imageFilter',
    //    fn: function (item /*{File|FileLikeObject}*/, options) {
    //        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
    //        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    //    }
    //});
    var upload1 = 0;
    var upload2 = 0;
    $scope.media1 = "";
    $scope.media2 = "";
    // CALLBACKS
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
    var   uploadResult = response[0];
        // post image upload call the below api to update the database
    upload1 = 1;
    $scope.media1 = uploadResult.Location;
      if(upload1==1 && upload2==1)

      {
          $scope.finalpost()
      }
    };
  
    




    // CALLBACKS
    uploader1.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
    var  uploadResult1 = response[0];
    $scope.media2 = uploadResult1.Location;
        // TODO: Need to get these values dynamically
      upload2 = 1;
      if (upload1 == 1 && upload2 == 1) {
          $scope.finalpost()
      }

    };



    $scope.finalpost =function()
    {
        var postData = {
            userid: $cookieStore.get('userId'),
            //name: $scope.params.name,
            organization_id: $cookieStore.get('orgID'),
            media_name:"",
            media_url: $scope.media1,
            // media_name: uploadResult1.Name,
            Media_3d_zip: $scope.media2,
            class_type: "Project",
            //street_2: $scope.params.street_2,

            media_type: "image",
            //project_type: $scope.params.project_type,
            id: window.sessionStorage.selectedCustomerID,
            unit_type_desc: $scope.params.unit_type_desc,
            carpet_area: $scope.params.carpet_area,
            super_built_up_area: $scope.params.super_built_up_area,
            cark_park: $scope.params.cark_park,
            num_bedrooms: $scope.params.num_bedrooms,
            num_bathrooms: $scope.params.num_bathrooms

        };
        $scope.openSucessfullPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/sucessfull.tpl.html',
                backdrop: 'static',
                controller: sucessfullController,
                size: 'md',

            });
            $rootScope.$broadcast('REFRESH','unit');
        };

        //alert(postData.city);
        //alert(postData.media_url);
        
        apiService.post("UnitTypes/CreateNewUnitType", postData).then(function (response) {
            var loginSession = response.data;
            //   alert("Unit Type Done");
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();
        },
        function (error) {

        });
    }


    uploader.onErrorItem = function (fileItem, response, status, headers) {
        console.log('Unable to upload file.');
    };


    uploader1.onErrorItem = function (fileItem, response, status, headers) {
        alert('Unable to upload file.');
    };


    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        $scope.showProgress = false;
    };
    uploader1.onCompleteItem = function (fileItem, response, status, headers) {
        $scope.showProgress = false;
    };
    


    $scope.params = {
        unit_type_desc: $scope.unit_type_desc,
        carpet_area: $scope.carpet_area,
        super_built_up_area: $scope.super_built_up_area,
        cark_park: $scope.cark_park,
        num_bedrooms: $scope.num_bedrooms,
        num_bathrooms: $scope.num_bathrooms,
        organization_id: $cookieStore.get('orgID'),
        User_ID: $cookieStore.get('userId')
    };


    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }

    $scope.orgList = ['ABC Real Estate Ltd'];

    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {


            //new ProjectCreate($scope.params).then(function (response) {
            //    console.log(response);
            //    $scope.showValid = false;
            //    $state.go('guest.signup.thanks');
            //}, function (error) {
            //    console.log(error);
            //});

            $scope.showValid = false;

        }

    }
};