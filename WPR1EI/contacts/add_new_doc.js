
var AddNewDocumentController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $modal) {
    console.log('AddNewDocumentController');

    var uploader = $scope.uploader = new FileUploader({
        url: 'https://dw-webservices-uat.azurewebsites.net/MediaElement/upload',
        queueLimit: 1
    });

    $scope.showProgress = false;

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    // FILTERS
    uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    // CALLBACKS
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
        var uploadResult = response[0];

        // TODO: Need to get these values dynamically
        var postData = {

            user_id: $cookieStore.get('userId'),
            organization_id: $cookieStore.get('orgID'),
            contact_id: $scope.seletedCustomerId,
            media_name: uploadResult.Name,
            media_url: uploadResult.Location,
            Document_Category: $scope.params.documenttype,
            Document_Name: $scope.params.Document_Name,            
            document_type_id: $scope.params.documenttype,
            
        };


        apiService.post("DocumentType/DocumentCreate", postData).then(function (response) {
            var loginSession = response.data;
           // alert("Document done");
            $scope.openSucessfullPopup();
            $modalInstance.dismiss();

        },
        function (error) {

        });
    };


    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'md'
        });
    }

    uploader.onErrorItem = function (fileItem, response, status, headers) {
        alert('Unable to upload file.');
    };

    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        $scope.showProgress = false;
    };


    $scope.params = {

        documenttype: $scope.documenttype,
        Document_Name: $scope.Document_Name,        
        document_type_id: $scope.Document_Category,
        organization_id: $cookieStore.get('orgID'),
        User_ID: $cookieStore.get('userId'),
        contact_id: $scope.seletedCustomerId,

    };




    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };


    Url = "DocumentType/Get";
    apiService.get(Url).then(function (response) {
        $scope.categories = response.data;
    },
   function (error) {
       alert("Error " + error.state);
   });

    $scope.selectCategory = function () {
        $scope.params.documenttype = $scope.category1;
        //alert($scope.params.project_id);
    };


    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {

            //alert("hi");
            new ProjectCreate($scope.params).then(function (response) {
                console.log(response);
                $scope.showValid = false;
                $state.go('guest.signup.thanks');
            }, function (error) {
                console.log(error);
            });

            $scope.showValid = false;

        }

    }

};
