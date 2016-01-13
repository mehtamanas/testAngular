var AddNewUnitController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $window, $modal, $rootScope, items) {
    console.log('AddNewUnitController');

    $scope.items = items;
    $scope.unit_id=items.unit_id;
    $scope.unit_type_desc= items.unit_type_desc;
    $scope.carpet_area= items.carpet_area;
    $scope.super_built_up_area= items.super_built_up_area;
    $scope.cark_park= items.cark_park;
    $scope.num_bedrooms= items.num_bedrooms;
    $scope.num_bathrooms= items.num_bathrooms;
    $scope.organization_id= $cookieStore.get('orgID');
    $scope.User_ID = $cookieStore.get('userId');
    $rootScope.title = 'Dwellar./projects';
    $scope.media1 = items.Image_Url_unit1;
    $scope.media2 = items.Image_Url_Unit2;

    if (items.unit_id == undefined) $scope.title = "Add New Unit";
    else $scope.title = "Edit Unit";


     uploader = $scope.uploader = new FileUploader({
         url: 'https://dw-webservices-uat.azurewebsites.net/MediaElement/upload',
         queueLimit: 1
    });
     uploader1 = $scope.uploader1 = new FileUploader({
         url: 'https://dw-webservices-uat.azurewebsites.net/MediaElement/upload',
         queueLimit: 1
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
    uploader1.filters.push({
        name: 'imageFilter1',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|x-zip-compressed|'.indexOf(type) !== -1;
        }
    });
    var upload1 = 0;
    var upload2 = 0;
    // CALLBACKS
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
    var   uploadResult = response[0];
        // post image upload call the below api to update the database
    upload1 = 1;
    $scope.media1 = uploadResult.Location;
      if(upload1==1 && upload2==1)

      {
          $scope.showProgress = false;
          $scope.finalpost()
      }
      else if (upload1 == 1 && uploader1.queue.length == 0) { // For the first uploader not uploading
          $scope.showProgress = false;
          $scope.finalpost();
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
          $scope.showProgress = false;
          $scope.finalpost()
      }
      else if (upload2 == 1 && uploader.queue.length == 0) { // For the second uploader not uploading
          $scope.showProgress = false;
          $scope.finalpost();
      }
    };

    //$scope.submit = function () {
       

    //        if (uploader.queue.length != 0)
    //            uploader.uploadAll();
    //        if (uploader1.queue.length != 0)
    //            uploader1.uploadAll();
    //        if (uploader.queue.length == 0 && uploader1.queue.length == 0)
    //            $scope.finalpost();

            
        
    //};



    $scope.finalpost =function()
    {
        upload1 = 0;
        upload2 = 0;

        if (items.unit_id == undefined)
        {//add
            var postData = {
                user_id: $cookieStore.get('userId'),
                //name: $scope.params.name,
                organization_id: $cookieStore.get('orgID'),
                media_name: "",
                media_url: $scope.media1,
                // media_name: uploadResult1.Name,
                Media_3d_zip: $scope.media2,
                class_type: "Project",
                //street_2: $scope.params.street_2,
                unit_id: items.unit_id,
                media_type: "image",
                //project_type: $scope.params.project_type,
                id: window.sessionStorage.selectedCustomerID,
                unit_type_desc: $scope.unit_type_desc,
                carpet_area: $scope.carpet_area,
                super_built_up_area: $scope.super_built_up_area,
                cark_park: $scope.cark_park,
                num_bedrooms: $scope.num_bedrooms,
                num_bathrooms: $scope.num_bathrooms

            };
            if ($scope.super_built_up_area >= $scope.carpet_area)
            {

                apiService.post("UnitTypes/CreateNewUnitType", postData).then(function (response)
                {
                    var loginSession = response.data;
                    //   alert("Unit Type Done");
                    $scope.openSucessfullPopup = function () {
                        var modalInstance = $modal.open({
                            animation: true,
                            templateUrl: 'newuser/sucessfull.tpl.html',
                            backdrop: 'static',
                            controller: sucessfullController,
                            size: 'md',
                            resolve: { items: { title: "Unit" } }

                        });
                        $rootScope.$broadcast('REFRESH', 'unit');
                    };
                    $modalInstance.dismiss();
                    $scope.openSucessfullPopup();
                },
           function (error) {

           });
            }
            else { alert("Please enter saleable area greater than carpet area..."); }

           
        }
        else
        { //edit
             var postData = {
                //userid: $cookieStore.get('userId'),
                //name: $scope.params.name,
                //organization_id: $cookieStore.get('orgID'),
               // media_name: "",
                 Image_Url: $scope.media1,
                // media_name: uploadResult1.Name,
                 Image_Url_Unit1: $scope.media2,
                //class_type: "Project",
                //street_2: $scope.params.street_2,
                    id: items.unit_id,
                //media_type: "image",
                //project_type: $scope.params.project_type,
                //id: window.sessionStorage.selectedCustomerID,
                unit_type_desc: $scope.unit_type_desc,
                carpet_area: $scope.carpet_area,
                super_built_up_area: $scope.super_built_up_area,
                cark_park: $scope.cark_park,
                num_bedrooms: $scope.num_bedrooms,
               num_bathrooms: $scope.num_bathrooms

            };
             if ($scope.super_built_up_area >= $scope.carpet_area)
             {
                 apiService.post("UnitTypes/EditUnit", postData).then(function (response)
                 {
                     var loginSession = response.data;
                     //   alert("Unit Type Done");
                     $scope.openSucessfullPopup = function () {
                         var modalInstance = $modal.open({
                             animation: true,
                             templateUrl: 'newuser/sucessfull.tpl.html',
                             backdrop: 'static',
                             controller: sucessfullController,
                             size: 'md',

                         });
                         $rootScope.$broadcast('REFRESH', 'unit');
                     };
                     $modalInstance.dismiss();
                     $scope.openSucessfullPopup();
                 },
                function (error) {

                });
             }
           
             else { alert("Please enter saleable area greater than carpet area..."); }
           

        }
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
    
    //Audit log start															
    $scope.params =
        {
            device_os: $cookieStore.get('Device_os'),
            device_type: $cookieStore.get('Device'),
            device_mac_id: "34:#$::43:434:34:45",
            module_id: "Contact",
            action_id: "Contact View",
            details: "AddNewUnit",
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

    //$scope.params = {
    //    unit_type_desc: $scope.unit_type_desc,
    //    carpet_area: $scope.carpet_area,
    //    super_built_up_area: $scope.super_built_up_area,
    //    cark_park: $scope.cark_park,
    //    num_bedrooms: $scope.num_bedrooms,
    //    num_bathrooms: $scope.num_bathrooms,
    //    organization_id: $cookieStore.get('orgID'),
    //    User_ID: $cookieStore.get('userId')
    //};


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


            if (uploader.queue.length != 0)
            uploader.uploadAll();
            if (uploader1.queue.length != 0)
            uploader1.uploadAll();
            if (uploader.queue.length == 0 && uploader1.queue.length == 0)
             $scope.finalpost();

            $scope.showValid = false;

        }

    }
};