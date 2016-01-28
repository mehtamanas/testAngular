pushedUnit = [];
insert = true;
validated = true;
var newUnit = {};
var split;
var upload;


var AddNewFloorController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $window, $modal, $rootScope) {
    console.log('AddNewFloorController');

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
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    //FILTERS
    uploader1.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '||x-zip-compressed|'.indexOf(type) !== -1;
        }
    });



    projectUrl = "UnitTypes/Get_Unit_Type?id=" + $scope.seletedCustomerId + "&orgID=" + orgID;

    //alert(projectUrl);
    //alert($scope.seletedCustomerId);
    apiService.get(projectUrl).then(function (response) {
        $scope.units = response.data;

    },
function (error) {
    console.log("Error " + error.state);
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
        //var uploadResult = response[0];
        // post image upload call the below api to update the database

        $scope.media1 = response[0].Location;
        upload1 = 1;
        
        if (upload1 == 1 && upload2 == 1) {
            $scope.finalpost()
        }
    };


    uploader1.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
        //var uploadResult1 = response[0];

        $scope.media2 = response[0].Location;

        
        // TODO: Need to get these values dynamically
        upload2 = 1;
        if (upload1 == 1 && upload2 == 1) {
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

            if ($scope.units[i].no_of_units != null) {
                fnd = 1;
                break;
            }
        }
        if (fnd == 0) {
            alert("No  unit mapped");
            return;
        }

        if (!$scope.isDuplicate(array) && !$scope.isMissingNumber(array))
        {
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
            userid: $cookieStore.get('userId'),
            organization_id: $cookieStore.get('orgID'),
            media_name: "",
            media_url: $scope.media1,
            // media_name: uploadResult1.Name,
            Media_3d_zip: $scope.media2,
            class_type: "Project",
            id: window.sessionStorage.selectedCustomerID,
            // unit_type_desc: $scope.params.unit_type_desc,
            no_of_units: $scope.params.no_of_units,
            media_type: "image",
            unit_name: $scope.params.unit_name,
            unit_no: $scope.params.unit_no
        };

        $scope.openSucessfullPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/sucessfull.tpl.html',
                backdrop: 'static',
                controller: sucessfullController,
                size: 'md',
                resolve: { items: { title: "Floor" } }
            });

            $rootScope.$broadcast('REFRESH', 'floor');
            // $rootScope.$emit('REFRESH','floor');
            called = true;
        }



        //alert(postData.city);
        //alert(postData.media_url);

    

        apiService.post("FloorType/FloorCreate", postData).then(function (response) {
            var loginSession = response.data;
            //    alert("Floor Done...");

            $modalInstance.dismiss();
            var unitupdate = [];

            for (var i in $scope.units)
            {

                var newUnit = {};

                newUnit.unit_type_desc = $scope.units[i].unit_type_desc;
                newUnit.no_of_units = $scope.units[i].no_of_units;
                newUnit.floorID = loginSession.id;
                newUnit.id = $scope.units[i].id;

                unitupdate.push(newUnit);
            }

            apiService.post("UnitTypes/Edit_Unit_type", unitupdate).then(function (response)
            {
                var loginSession = response.data;
                //    alert("Unit Edit Done...");

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

    



    uploader.onErrorItem = function (fileItem, response, status, headers) {
        console.log('Unable to upload file.');
    };


    uploader1.onErrorItem = function (fileItem, response, status, headers) {
        console.log('Unable to upload file.');
    };


    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        $scope.showProgress = false;
    };
    uploader1.onCompleteItem = function (fileItem, response, status, headers) {
        $scope.showProgress = false;
    };





    //Audit log start
    // $scope.params = {

    //     device_os: "windows10",
    //     device_type: "mobile",
    //     device_mac_id: "34:#$::43:434:34:45",
    //     module_id: "Addnew Project",
    //     action_id: "Addnew Project View",
    //     details: "Addnew Project detail",
    //     application: "angular",
    //     browser: $cookieStore.get('browser'),
    //     ip_address: $cookieStore.get('IP_Address'),
    //     location: $cookieStore.get('Location'),
    //     organization_id: $cookieStore.get('orgID'),
    //     User_ID: $cookieStore.get('userId')
    // };


    // AuditCreate = function (param) {

    //     apiService.post("AuditLog/Create", param).then(function (response) {
    //         var loginSession = response.data;

    //     },
    //function (error) {

    //});
    // };
    // AuditCreate($scope.params);

    //end


    $scope.params = {

        unit_name: $scope.unit_name,
        unit_no: $scope.unit_no,
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
        
        if (isValid) {

            if ($scope.params.no_of_units != "" && $scope.params.unit_name != "")
            {
                $scope.submit();
            }

            $scope.showValid = false;

        }

    }

};