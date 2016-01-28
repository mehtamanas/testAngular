
var AddNewDocumentController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService,$rootScope, $modal) {
    console.log('AddNewDocumentController');

    var uploader = $scope.uploader = new FileUploader({
       url: apiService.uploadURL,
        
    });

    $scope.showProgress = false;

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    // FILTERS
    uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            
            return item;
        }
    });

    // CALLBACKS

    uploader.onAfterAddingFile = function (fileItem, response, status, headers) {
        if (uploader.queue.length > 1) {
            uploader.removeFromQueue(0);
        }
    }

    uploader.onSuccessItem = function (fileItem, response, status, headers)
    {
        // post image upload call the below api to update the database
        $scope.media_url = response[0].Location;
        uploader_done = true;
        if (uploader_done == true)
        {
            $scope.showProgress = false;
            $scope.finalpost();
        }
       

    }
       
    var called = false;

    $scope.finalpost = function ()
    {
        if (called == true)
        {
            return;
        }

        var postData = {

            user_id: $cookieStore.get('userId'),
            organization_id: $cookieStore.get('orgID'),
            contact_id: $scope.seletedCustomerId,
            //media_name: uploadResult.Name,
            media_url: $scope.media_url,
            Document_Category: $scope.params.documenttype,
            Document_Name: $scope.params.Document_Name,
            document_type_id: $scope.params.documenttype,

        };


        apiService.post("DocumentType/DocumentCreate", postData).then(function (response) {
            var loginSession = response.data;
            // alert("Document done");
            $scope.openSucessfullPopup();
            $modalInstance.dismiss();
            $rootScope.$broadcast('REFRESH', 'DocumentGrid');
            called = true;
        },
        function (error) {

        });
    }
       
    

    $scope.CanceUpload = function () {
        uploader.cancelAll();

        console.log("UploadCancelled");
    }


    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'md',
            resolve: { items: { title: "Document" } }
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


    $scope.addNewUser = function (isValid) {
        $scope.showValid = true;
        if (isValid) {

            
            if (uploader.queue.length != 0)
                uploader.uploadAll();
            if (uploader.queue.length == 0)
                $scope.finalpost();

            $scope.showValid = false;

        }

    }

};
