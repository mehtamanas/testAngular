
var BlogPostPopUpCtrl = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, $modal, $rootScope, $sanitize) {
    console.log('BlogPostPopUpCtrl');

    $scope.showBlog = true;
    $scope.showPreview = false;
    $scope.params = {}

    var orgID = $cookieStore.get('orgID');
    var uploader = $scope.uploader = new FileUploader({
        url: apiService.uploadURL,

    });

    var uploader1 = $scope.uploader1 = new FileUploader({
        url: apiService.uploadURL,

    });

    // FILTERS
    uploader1.filters.push({
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

    uploader1.onAfterAddingFile = function (fileItem, response, status, headers) {
        if (uploader1.queue.length > 1) {
            uploader1.removeFromQueue(0);
        }
    }



    $scope.showProgress = false;

    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        img = response[0].Location;       
        var edit = $('#editor').data("kendoEditor");
        edit.exec('inserthtml', { value: "<img alt=''  src='" + img + "' />" });

    };


    uploader.onAfterAddingFile = function (fileItem, response, status, headers) {
        uploader.uploadAll();
    }
    $scope.editorOption = {
        tools: ["bold",
                "italic",
                "underline",
                "strikethrough",
                "justifyLeft",
                "justifyCenter",
                "justifyRight",
                "justifyFull",
                "insertUnorderedList",
                "insertOrderedList",
                "indent",
                "outdent",
                "createLink",
                'pdf',
                "unlink",
                "fontName",
                "fontSize",
                "foreColor",
                "backColor",
                "print",
                'createTable',
                {
                    name: "myTool",
                    tooltip: "Insert Image",
                    exec: function (e) {
                        $('#imageBrowser').trigger("click");
                    }
                },
                 
                  "insertFile",
                  "viewHtml",
        ],
       
        fileBrowser: {
            messages: {
                dropFilesHere: "Drop files here"
            },
            transport: {
                read: "http://demos.telerik.com/kendo-ui/service/FileBrowser/Read",
                destroy: {
                    url: "http://demos.telerik.com/kendo-ui/service/FileBrowser/Destroy",
                    type: "POST"
                },
                create: {
                    url: "http://demos.telerik.com/kendo-ui/service/FileBrowser/Create",
                    type: "POST"
                },
                uploadUrl: "http://demos.telerik.com/kendo-ui/service/FileBrowser/Upload",
                fileUrl: "http://demos.telerik.com/kendo-ui/service/FileBrowser/File?fileName={0}"
            }
        }
    }


 
    //start
    // CALLBACKS
    var uploadResult;
    uploader1.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
        console.log("uploader1 called");
        $scope.media_url = response[0].Location;
        uploader_done = true;
        if (uploader_done == true) {
            $scope.showProgress = false;
            $scope.saveTemplate();
        }
    };
        var called = false;

        $scope.saveTemplate = function ()
        {
         
            if (called == true) {
                return;
            }
            
                $scope.params.htmlcontent = $sanitize($scope.params.htmlcontent);
                var postdata = {
                    name:$scope.params.name,
                    media_type:"image",
                    //media_name: uploadResult.Name,
                    media_url: $scope.media_url,
                    description: $scope.params.htmlcontent,
                    organization_id: $cookieStore.get('orgID'),
                    user_id: $cookieStore.get('userId'),
                    tag_name: $scope.params.tag_name,
               
                };

                console.log($scope.params.htmlcontent);
                apiService.post("Blogs/CreateBlogTag", postdata).then(function (response)
                {
                    data = response.data[0];
                    $scope.openSucessfullPopup();
                    $scope.cancel();
                    $rootScope.$broadcast('REFRESH', 'BlogsPostGrid');
                },
                function (error)
                {
                    if (error.status === 400)
                        alert(error.data.Message);
                });
            }
       
         

 
    //end

    Url = "Tags/GetAllTags?id=" + orgID
    apiService.get(Url).then(function (response) {
        $scope.tagList = response.data;
        $scope.tagList = _.pluck($scope.tagList, 'tag_name');
    },
function (error) {
    alert("Error " + error.state);
});



    uploader1.onErrorItem = function (fileItem, response, status, headers) {
        console.log('Unable to upload file.');
    };
    uploader1.onCompleteItem = function (fileItem, response, status, headers) {
        //$scope.showProgress = false;
    };

    $scope.preview = function () {
        $scope.showBlog = false;
        $scope.showPreview = true;
    }

    $scope.goTOBlog = function () {
        $scope.showBlog = true;
        $scope.showPreview = false;
    }

    $scope.cancel = function () {
        $modalInstance.dismiss();
    }


    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'md',
            resolve: { items: { title: "Blog" } }
        });
        $rootScope.$broadcast('REFRESH', 'BlogsPostGrid');      
    }
    $scope.params = {
        media_url: $scope.media_url,
        organization_id: $cookieStore.get('orgID'),
        User_ID: $cookieStore.get('userId'),      
        description: $scope.description,
        tag_name: $scope.tag_name,
        name: $scope.name,

    };


    $scope.addNewContact = function (isValid) {
        $scope.showValid = true;

        if (isValid) {
            if (uploader1.queue.length != 0)
                uploader1.uploadAll();
            if (uploader1.queue.length == 0)
                $scope.saveTemplate();

            $scope.showValid = false;
        }
    }

};


