pushedUnit = [];
insert = true;
validated = true;
var newUnit = {};
var split;
var upload;


var AddNewEditFloorController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $window, $modal, $rootScope) {
    console.log('AddNewEditFloorController');

    var FloorId = $cookieStore.get('FloorId');
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    var orgID = $cookieStore.get('orgID');

    var uploader = $scope.uploader = new FileUploader({
       url: apiService.uploadURL,
       
    });

    var uploader1 = $scope.uploader1 = new FileUploader({
       url: apiService.uploadURL,
       
    });

    $scope.showProgress = false;

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
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            var im = '||x-zip-compressed|'.indexOf(type);
            if (im === -1) {

                alert('You have selected inavalid file type');
            }
            return '||x-zip-compressed|'.indexOf(type) !== -1;
        }
    });


    projectUrl = "Floors/Get_Floor_TypeByFloorId?floorID=" + FloorId;

    //alert(projectUrl);
    //alert($scope.seletedCustomerId);
    apiService.getWithoutCaching(projectUrl).then(function (response) {
        $scope.params = response.data[0];

    },
function (error) {
    if (error.status === 400)
        alert(error.data.Message);
    else
        alert("Network issue");
}
    );

    projectUrl ="Floors/GetFloorMultiple?id=" + FloorId;

    //alert(projectUrl);
    //alert($scope.seletedCustomerId);
    apiService.getWithoutCaching(projectUrl).then(function (response) {
        $scope.units = response.data;

    },
function (error) {
    
}
    );

    var upload1 = 0;
    var upload2 = 0;
    $scope.media1 = "";
    $scope.media2 = "";

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



    // CALLBACKS
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
      
        // post image upload call the below api to update the database
        $scope.params.Image_Url_Wing1 = response[0].Location;

        upload1 = 1;
       
        if (upload1 == 1 && upload2 == 1) {
            $scope.showProgress = false;
            $scope.finalpost()
        }
    };


    uploader1.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
        $scope.params.Image_Url_Wing2= response[0].Location;

        
        // TODO: Need to get these values dynamically
        upload2 = 1;
        if (upload1 == 1 && upload2 == 1) {
            $scope.showProgress = false;
            $scope.finalpost()
        }


    };




    $scope.blur = function () {
        var array = convertToArray($(this).val());
        console.log(array);
        if (isValidFormat.isValidFormat(array) || $(this).val() == "") {
            $(this).attr("data-valid", 1);
            $(this).next().remove();
        }
        else {
            if ($(this).next().hasClass("error")) {
                $(this).next().remove();
                alert("Data Format Invalid! ");
                $(this).attr("data-valid", 0);
                return;
            }
        }
        if ($scope.isInInterval(array) && isValidFormat(array)) {
            $(this).attr("data-valid", 1);
            $(this).next().remove();
        }
        else if (!$scope.isInInterval(array) && isValidFormat(array)) {
            if ($(this).next().hasClass("error")) {
                $(this).next().remove();
                alert("Numbers Outside Interval! ");
                return;
            }
        }

    };

    $scope.submit = function (e) {

        var array = [];
        for (var i in $scope.units) {
            if ($scope.units[i].no_of_units != null) {
                var testArray = $scope.convertToArray($scope.units[i].no_of_units);
                Array.prototype.push.apply(array, testArray);
            }
        };
        $(this).nextAll().remove();
        if ($scope.isDuplicate(array)) {
            //var result = $scope.isDuplicate(array);
            alert("Duplicate numbers! ");
            return;
        }
        if ($scope.isMissingNumber(array)) {
            var nums = $scope.isMissingNumber(array);
            alert("Missing numbers! " + nums);
            return;
        }

        if ($scope.invalid(array)) {
            var nums = $scope.invalid(array);
            alert("Ivalid Range! " + nums);
            return;
        }

        var fnd = 0;
        for (var i in $scope.units) {

            if ($scope.units[i].no_of_units != null) 
            {
                fnd = 1;
                break;
            }
        }
        if (fnd == 0) {
            alert("No  unit mapped");
            return;
        }

        if (!$scope.isDuplicate(array) && !$scope.isMissingNumber(array)) {
            if (uploader.queue.length != 0)
                uploader.uploadAll();
            if (uploader1.queue.length != 0)
                uploader1.uploadAll();
            if (uploader.queue.length == 0 && uploader1.queue.length == 0)
                $scope.finalpost();
        }
    };


    $scope.isArray = function (myArray) {
        return myArray.constructor.toString().indexOf("Array") > -1;
    }
    $scope.convertToArray = function (string) {
        var dot = string.indexOf(".");
        var array = string.split(",");
        if (dot != -1)
            array.push("!");
        var reg = /\d\-\d/;
        for (var i = 0; i < array.length; i++) {
            if (reg.test(array[i])) {
                array[i] = array[i].split("-");
            }
        }
        for (var i = 0; i < array.length; i++) {
            if ($scope.isArray(array[i])) {
                if (parseInt(array[i][0]) == parseInt(array[i][1])) {
                    array.push(parseInt(array[i][0]));
                    array.push(parseInt(array[i][0]));
                }
                else if (parseInt(array[i][0]) > parseInt(array[i][1])) {
                    array.push("!");
                }
                else
                    for (var u = parseInt(array[i][0]) ; u <= parseInt(array[i][1]) ; u++) {
                        array.push(parseInt(u));
                    }
                array.splice(i, 1);
                i--;
            }
            else {
                if ($.isNumeric(array[i]))
                    array[i] = parseInt(array[i]);
            }
        }
        return array;
    }
    $scope.isValidFormat = function (array) {
        for (var i = 0; i < array.length; i++) {
            if (!$.isNumeric(array[i]))
                return false;
        }
        return true;
    }
    $scope.isInInterval = function (array) {
        var a = parseInt($scope.params.no_of_units);
        for (var i = 0; i < array.length; i++) {
            if (array[i] < 1 || array[i] > a)
                return false;
        }
        return true;
    }
    $scope.isDuplicate = function (array) {
        var array = array.sort();
        var result = [];
        for (var i = 0; i < array.length - 1; i++) {
            if (array[i] == array[i + 1]) {
                if (result.indexOf(array[i]) == -1)
                    result.push(array[i + 1]);
            }
        }
        if (result.length)
            return result;
        else
            return false;
    }
    $scope.isMissingNumber = function (array) {
        var a = parseInt($scope.params.no_of_units);
        var result = false;
        var nums = [];
        for (var i = 1; i <= a; i++) {
            for (var u = 0; u < array.length; u++) {
                if (i == array[u]) {
                    result = true;
                    break;
                }
                else
                    result = false;
            }
            if (result == false) {
                if (nums.indexOf(i) == -1)
                    nums.push(i);
            }

        }
        if (nums.length)
            return nums;
        else
            return false;
    }


    $scope.invalid = function (array) {
        var a = parseInt($scope.params.no_of_units);
        var result = false;
        var nums = [];

        for (var u = 0; u < array.length; u++) {

            if (array[u] > a) {

                nums.push(array[u]);
            }

        }
        if (nums.length)
            return nums;
        else
            return false;
    }

    var called = false;
    $scope.finalpost = function () {
        if (called == true) {
            return;
        }
        var postData = {
            user_id: $cookieStore.get('userId'),
            organization_id: $cookieStore.get('orgID'),
            media_name: "",
            Image_Url_Floor1: $scope.params.Image_Url_Wing1,
            // media_name: uploadResult1.Name,
            Image_Url_Floor2: $scope.params.Image_Url_Wing2,
            class_type: "Project",
            Floor_type: $scope.params.Unit_Type_desc,
            no_of_units: $scope.params.no_of_units,
            media_type: "image",
            floor_id:FloorId
            
        };

        $scope.openSucessfullPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/Edited.tpl.html',
                backdrop: 'static',
                controller: EditsucessfullController,
                size: 'lg',
                resolve: { items: { title: "Floor" } }
            });

            $rootScope.$broadcast('REFRESH', 'floor');
          
        }




        //alert(postData.city);
        //alert(postData.media_url);

        apiService.post("FloorType/EditFloorTypeSingle", postData).then(function (response) {
            var loginSession = response.data;
            AuditCreate();

            $modalInstance.dismiss();
            var unitupdate = [];

            for (var i in $scope.units) {

                var newUnit = {};

                
                newUnit.unit_no = $scope.units[i].no_of_units;
                newUnit.floor_id = FloorId;
                newUnit.unit_id = $scope.units[i].unit_id;

                unitupdate.push(newUnit);
            }

            apiService.post("FloorType/EditFloorTypeMultiple", unitupdate).then(function (response) {
                var loginSession = response.data;
                //    alert("Unit Edit Done...");
                called = true;
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
        uploader1.cancelAll();
        
        console.log("UploadCancelled");
    }


    //uploadService.postDataAfterUpload(postData).then(function () {
    //    // Process the successful file upload
    //    alert("project Created");
    //}, function (error) {
    //    alert('Error creating');
    //})

 


    uploader.onErrorItem = function (fileItem, response, status, headers) {
        console.log('Unable to upload file.');
    };


    uploader1.onErrorItem = function (fileItem, response, status, headers) {
        console.log('Unable to upload file.');
    };


    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        //$scope.showProgress = false;
    };
    uploader1.onCompleteItem = function (fileItem, response, status, headers) {
        //$scope.showProgress = false;
    };







    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
           module_id: "Project",
           action_id: "EditFloor View",
           details: $scope.params.Unit_Type_desc + "EditFloor View",
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


    $scope.params = {

        Unit_Type_desc: $scope.Unit_Type_desc,
        no_of_units: $scope.no_of_units,
        organization_id: $cookieStore.get('orgID'),
        User_ID: $cookieStore.get('userId')
    };

    var emp = {
        //id: $cookieStore.get('projectid'),
        unit_type_desc: $scope.unit_type_desc,
        no_of_units: $scope.no_of_units,
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
        if (isValid)
        {
            $scope.submit();

        }
        $scope.showValid = false;


    }


};
