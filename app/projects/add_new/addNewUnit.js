var AddNewUnitController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $rootScope, FileUploader, uploadService, $window) {
    console.log('AddNewUnitController');


    $rootScope.title = 'Dwellar./projects';
    var uploader = $scope.uploader = new FileUploader({
        url: 'https://dw-webservices-dev.azurewebsites.net/MediaElement/upload'
    });

    $scope.showProgress = false;


    //var uploader1 = $scope.uploader1 = new FileUploader({
    //    url: 'https://dw-webservices-dev.azurewebsites.net/MediaElement/upload'
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

    //uploader1.filters.push({
    //    name: 'imageFilter',
    //    fn: function (item1 /*{File|FileLikeObject}*/, options) {
    //        var type = '|' + item1.type.slice(item1.type.lastIndexOf('/') + 1) + '|';
    //        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    //    }
    //});

    uploader.onSuccessItem = function (files, response, status, headers) {
        // post image upload call the below api to update the database
        var uploadResult = response[0];

        // CALLBACKS
        //uploader1.onSuccessItem = function (files, response, status, headers) {
        //    // post image upload call the below api to update the database
        //    var uploadResult2 = response[0];
        // TODO: Need to get these values dynamically
        var postData = {
            userid: $cookieStore.get('userId'),
            //name: $scope.params.name,
            organization_id: $cookieStore.get('orgID'),
            media_name: uploadResult.Name,
            media_url: uploadResult.Location,
            class_type: "Project",
            //street_2: $scope.params.street_2,
            media_type: "Logo",
            media_type: "image",
            //project_type: $scope.params.project_type,
            id: window.sessionStorage.selectedCustomerID,
            unit_type_desc: $scope.params.unit_type_desc,
            carpet_area: $scope.params.carpet_area,
            super_built_up_area: $scope.params.super_built_up_area,

        };

        //alert(postData.city);
        //alert(postData.media_url);
        apiService.post("UnitTypes/CreateNewUnitType", postData).then(function (response) {
            var loginSession = response.data;
            alert("Unit Type Done");
            $modalInstance.dismiss();

        },
        function (error) {

        });


    };







    uploader.onErrorItem = function (fileItem, response, status, headers) {
        alert('Unable to upload file.');
    };

    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        $scope.showProgress = false;
    };


    $scope.params = {
        unit_type_desc: $scope.unit_type_desc,
        carpet_area: $scope.carpet_area,
        super_built_up_area: $scope.super_built_up_area,
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

            $scope.showValid = false;

        }

    }

};