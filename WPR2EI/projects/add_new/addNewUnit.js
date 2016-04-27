var AddNewUnitController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $window, $modal, $rootScope, items) {
    console.log('AddNewUnitController');

    $scope.items = items;
    $scope.unit_id = items.unit_id;
    $scope.unit_type_desc = items.unit_type_desc;
    $scope.carpet_area = items.carpet_area;
    $scope.super_built_up_area = items.super_built_up_area;
    $scope.cark_park = items.cark_park;
    $scope.num_bedrooms = items.num_bedrooms;
    $scope.num_bathrooms = items.num_bathrooms;
    $scope.organization_id = $cookieStore.get('orgID');
    $scope.User_ID = $cookieStore.get('userId');
    $rootScope.title = 'Dwellar./projects';
    $scope.media1 = items.Image_Url;
    $scope.media2 = items.Image_Url_Unit2;
    $scope.media3 = items.Image_Url_Minimap;
    $scope.usable_area = items.usable_area;
    $scope.box_price = items.box_price;
    $scope.box_price_applicable = items.box_price_applicable,
    $scope.area1 = items.calculation_based_on

    if (items.unit_id == undefined) $scope.title = "Add New Unit Type";
    else $scope.title = "Edit Unit Type";


    uploader = $scope.uploader = new FileUploader({
        url: apiService.uploadURL,

    });
    uploader1 = $scope.uploader1 = new FileUploader({
        url: apiService.uploadURL,

    });

    uploader2 = $scope.uploader2 = new FileUploader({
        url: apiService.uploadURL,

    });

    $scope.showProgress = false;

    $scope.selectArea = function () {

        $scope.price_decided_on = $scope.area1;
    };

    // FILTERS
    uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            var im = '|jpg|png|jpeg|bmp|gif|'.indexOf(type);
            if (im === -1) {

                alert('You have selected inavalid file type');
            }
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }

    });

    //FILTERS
    uploader1.filters.push({
        name: 'imageFilter1',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            var im = '||x-zip-compressed|'.indexOf(type);
            if (im === -1) {

                alert('You have selected inavalid file type');
            }
            return '||x-zip-compressed|'.indexOf(type) !== -1;
        }
    });

    uploader2.filters.push({
        name: 'imageFilter2',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            var im = '|jpg|png|jpeg|bmp|gif|'.indexOf(type);
            if (im === -1) {

                alert('You have selected inavalid file type');
            }
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }

    });

    var upload1 = 0;
    var upload2 = 0;
    var upload3 = 0;
    // CALLBACKS

    uploader.onAfterAddingFile = function (fileItem, response, status, headers) {
        if (uploader.queue.length > 1) {
            uploader.removeFromQueue(0);
        }
    }
    uploader1.onAfterAddingFile = function (fileItem, response, status, headers) {
        if (uploader1.queue.length > 1) {
            uploader1.removeFromQueue(0);
        }
    }

    uploader2.onAfterAddingFile = function (fileItem, response, status, headers) {
        if (uploader2.queue.length > 1) {
            uploader2.removeFromQueue(0);
        }
    }

    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        //var   uploadResult = response[0];
        // post image upload call the below api to update the database
        upload1 = 1;
        $scope.media1 = response[0].Location;
        if (upload1 == 1 && upload2 == 1 && upload3 == 1) {
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
        //var  uploadResult1 = response[0];
        $scope.media2 = response[0].Location;
        // TODO: Need to get these values dynamically
        upload2 = 1;
        if (upload1 == 1 && upload2 == 1 && upload3 == 1) {
            $scope.showProgress = false;
            $scope.finalpost()
        }
        else if (upload2 == 1 && uploader.queue.length == 0) { // For the second uploader not uploading
            $scope.showProgress = false;
            $scope.finalpost();
        }
    };

    // CALLBACKS
    uploader2.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
        //var  uploadResult1 = response[0];
        $scope.media3 = response[0].Location;
        // TODO: Need to get these values dynamically
        upload3 = 1;
        if (upload1 == 1 && upload2 == 1 && upload3 == 1) {
            $scope.showProgress = false;
            $scope.finalpost()
        }
        else if (upload3 == 1 && uploader.queue.length == 0) { // For the second uploader not uploading
            $scope.showProgress = false;
            $scope.finalpost();
        }
    };





    $scope.finalpost = function () {
        upload1 = 0;
        upload2 = 0;
        upload3 = 0;

        if (items.unit_id == undefined) {//add
            var postData = {
                user_id: $cookieStore.get('userId'),
                //name: $scope.params.name,
                organization_id: $cookieStore.get('orgID'),
                media_name: "",
                media_url: $scope.media1,
                // media_name: uploadResult1.Name,
                Media_3d_zip: $scope.media2,
                Minimap:$scope.media3,
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
                num_bathrooms: $scope.num_bathrooms,
                usable_area: $scope.usable_area,
                box_price: $scope.box_price,
                box_price_applicable: $scope.box_price_applicable,
                calculation_based_on: $scope.area1,

            };
            if (parseInt($scope.super_built_up_area) > parseInt($scope.carpet_area)) {

                apiService.post("UnitTypes/CreateNewUnitType", postData).then(function (response) {
                    var loginSession = response.data;
                    AuditCreate();
                 
                    //   alert("Unit Type Done");
                    $scope.openSucessfullPopup = function () {
                        var modalInstance = $modal.open({
                            animation: true,
                            templateUrl: 'newuser/sucessfull.tpl.html',
                            backdrop: 'static',
                            controller: sucessfullController,
                            size: 'sm',
                            resolve: { items: { title: "Unit" } }

                        });
                        $rootScope.$broadcast('REFRESH', 'unit');
                    };
               
                    $modalInstance.dismiss();
                    $scope.openSucessfullPopup();
                },
           function (error) {
               if (error.status === 400)
                   alert(error.data.Message);
               else
                   alert("Network issue");
           });
            }
            else { alert("Please enter saleable area greater than carpet area..."); }


        }
        else { //edit
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
                Image_Url_Minimap: $scope.media3,
                unit_type_desc: $scope.unit_type_desc,
                carpet_area: $scope.carpet_area,
                super_built_up_area: $scope.super_built_up_area,
                cark_park: $scope.cark_park,
                num_bedrooms: $scope.num_bedrooms,
                num_bathrooms: $scope.num_bathrooms,
                box_price: $scope.box_price,
                box_price_applicable: $scope.box_price_applicable,
                usable_area: $scope.usable_area,
                calculation_based_on: $scope.area1
                

            };
            if (parseInt($scope.super_built_up_area) > parseInt($scope.carpet_area)) {
                apiService.post("UnitTypes/EditUnit", postData).then(function (response) {
                    var loginSession = response.data;
                    AuditCreate1();
                    //   alert("Unit Type Done");
                    $scope.openEditSucessfullPopup = function () {
                        var modalInstance = $modal.open({
                            animation: true,
                            templateUrl: 'newuser/Edited.tpl.html',
                            backdrop: 'static',
                            controller: EditsucessfullController,
                            size: 'sm',
                            resolve: { items: { title: "Unit" } }
                        });
                        $rootScope.$broadcast('REFRESH', 'unit');
                    };
                    $modalInstance.dismiss();
              
                    $scope.openEditSucessfullPopup();
                },
               function (error) {
                   if (error.status === 400)
                       alert(error.data.Message);
                   else
                       alert("Network issue");
               });
            }

            else { alert("Please enter saleable area greater than carpet area..."); }


        }
    }


    $scope.CanceUpload = function () {
        uploader.cancelAll();
        uploader1.cancelAll();

        console.log("UploadCancelled");
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
    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
           module_id: "Project",
           action_id: "UnitView",
           details: $scope.unit_type_desc + "Unit View",
           application: "angular",
           browser: $cookieStore.get('browser'),
           ip_address: $cookieStore.get('IP_Address'),
           location: $cookieStore.get('Location'),
           organization_id: $cookieStore.get('orgID'),
           User_ID: $cookieStore.get('userId'),

       };


        apiService.post("AuditLog/Create", postdata).then(function (response) {
            var loginSession = response.data;
        },
   function (error) {
   });
    };


    //end
    //Audit log start															
    AuditCreate1 = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
           module_id: "Project",
           action_id: "EditUnitView",
           details: $scope.unit_type_desc + "Unit View",
           application: "angular",
           browser: $cookieStore.get('browser'),
           ip_address: $cookieStore.get('IP_Address'),
           location: $cookieStore.get('Location'),
           organization_id: $cookieStore.get('orgID'),
           User_ID: $cookieStore.get('userId'),

       };


        apiService.post("AuditLog/Create", postdata).then(function (response) {
            var loginSession = response.data;
        },
   function (error) {
   });
    };


    //end


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

    $scope.emptyText = function () {
        $scope.box_price = null;
    }

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
            if (uploader2.queue.length != 0)
                uploader2.uploadAll();
            if (uploader.queue.length == 0 && uploader1.queue.length == 0 && uploader2.queue.length == 0)
                $scope.finalpost();

            $scope.showValid = false;

        }
    }
};