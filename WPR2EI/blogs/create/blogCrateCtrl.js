
var BlogPostPopUpCtrl = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $modal, $rootScope, $sanitize) {
    $scope.selectedBlogID = window.sessionStorage.selectedBlogID;
    console.log('BlogPostPopUpCtrl');
    $scope.showBlog = true;
    $scope.showPreview = false;
    $scope.params = {}
    $scope.params.bodyText;

    var orgID = $cookieStore.get('orgID');
    var uploader = $scope.uploader = new FileUploader({
        url: apiService.uploadURL,

    });

    var uploader1 = $scope.uploader1 = new FileUploader({
        url: apiService.uploadURL,

    });
    uploader.filters.push({
        name: 'attchementFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.name.slice(item.name.lastIndexOf('.') + 1) + '|';
            var im = '|jpg|png|jpeg|bmp|gif|xls|xlsx|pdf|csv|zip|txt|doc|docx|ppt|pptx|'.indexOf(type);
            if (im === -1) {

                alert('You have selected invalid file type');
            }
            if (item.size > 10485760) {

                alert('File size should be less than 10mb');
            }
            return '|jpg|png|jpeg|bmp|gif|xls|xlsx|pdf|csv|zip|txt|doc|docx|ppt|pptx|'.indexOf(type) !== -1 && item.size <= 10485760;
        }
    });

    // FILTERS
    uploader1.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            var im = '|jpg|png|jpeg|bmp|gif|'.indexOf(type);
            if (im === -1) {
                sweetAlert("Oops...", "You have selected inavalid file type!", "error");
                //alert('You have selected inavalid file type');
            }
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    uploader1.onAfterAddingFile = function (fileItem, response, status, headers) {
        if (uploader1.queue.length > 1) {
            uploader1.removeFromQueue(0);
        }
    }

    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        loc = response[0].Location;
        var edit = $('#Blog_editor').data("kendoEditor");
        var fileType = response[0].ContentType.slice(response[0].ContentType.lastIndexOf('/') + 1);
        if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg' || fileType === 'bmp' || fileType === 'gif')
            edit.exec('inserthtml', { value: "<img alt=''  src='" + loc + "' />" });
        else {
            edit.exec('inserthtml', { value: "<a href='" + loc + "' >" + loc + "</a>" });
        }

    };

    uploader.onAfterAddingFile = function (fileItem, response, status, headers) {
        uploader.uploadAll();
    }


    $scope.editorOption = {
        messages: {
            insertHtml: "Insert Variable"
        },
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
                        $('#BlogimageBrowser').trigger("click");
                    }
                },
                  {
                      name: "insertHtml",
                      items: [
                          { text: "Last Name", value: "{{last_name}}" },
                          { text: "First Name", value: "{{first_name}}" },
                          { text: "My First Name", value: "{{my_first_name}}" },
                          { text: "My Last Name", value: "{{my_last_name}}" },
                          { text: "Salutation", value: "{{salutation}}" },
                           { text: "Brochure Url", value: "<a href='{{brochure_url}}'>{{brochure_url}}</a>" },

                      ]
                  },
                  "viewHtml",
        ],
    }



    apiService.get('Template/GetTemplatesByType/' + orgID + '/ReleaseOrder').then(function (response) {
        $scope.params.templateList = response.data;
        //$cookieStore.put('',)
    });

    $scope.selectTemplate = function () {
        $scope.id = $scope.params.template;
        $cookieStore.put('id', $scope.id);
        $scope.templateId = $cookieStore.get('id');
        if ($scope.params.template !== "") {
            //$scope.params.subject = (_.findWhere($scope.params.templateList, { id: $scope.params.template })).subject;
            $scope.params.bodyText = $sanitize((_.findWhere($scope.params.templateList, { id: $scope.params.template })).description);
        }
        else
            $scope.params.bodyText = "";
    }

   
    //start
    // CALLBACKS
    var uploadResult;
    uploader1.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
        console.log("uploader1 called");
        $scope.media_url = response[0].Location;
            $scope.saveTemplate();
    };

        $scope.saveTemplate = function ()
        {            
            $scope.params.bodyText = $sanitize($scope.params.bodyText);
                var postdata = {
                    name:$scope.params.name,
                    media_type:"image",
                    //media_name: uploadResult.Name,
                    media_url: $scope.media_url,
                    description:  $scope.params.bodyText,
                    organization_id: $cookieStore.get('orgID'),
                    user_id: $cookieStore.get('userId'),
                    tag_name: $scope.params.tag_name,
                    template_id: $scope.params.template,
               
                };
                apiService.post("Blogs/CreateBlogTag", postdata).then(function (response)
                {
                    data = response.data;
                    $scope.blog_id = data.blog_id;
                    $scope.openSucessfullPopup();
                    $rootScope.$broadcast('REFRESH', 'BlogsPostGrid');
                    $modalInstance.dismiss();
                    if ($scope.sendApproval) {
                        $scope.sendForApproval();
                    }
                },
                function (error)
                {
                    $scope.showValid = false;
                    if (error.status === 400)
                        //sweetAlert("Oops...", error.data.Message, "error");
                       alert(error.data.Message);
                });
            }
       
         
        $scope.sendForApproval = function () {
            var postdataSendForApproval = {
                organization_id: $cookieStore.get('orgID'),
                user_id: $cookieStore.get('userId'),
                // comment: $scope.params.comment,
                blog_id: $scope.blog_id,
                status: "Sent For Approval",
                template_id: $scope.templateId,

            };
            apiService.post("Blogs/BlogCommentCreate", postdataSendForApproval).then(function (response) {
                data = response.data[0];
                $modalInstance.dismiss();
            },
                  function (error) {
                      $scope.showValid = false;
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
            size: 'sm',
            resolve: { items: { title: "Blog" } }
        });
        $rootScope.$broadcast('REFRESH', 'BlogsPostGrid');      
    }
    $scope.params = {
        media_url: $scope.media_url,
        organization_id: $cookieStore.get('orgID'),
        User_ID: $cookieStore.get('userId'),      
        description: $scope.bodyText,
        tag_name: $scope.tag_name,
        name: $scope.name,

    };

    $scope.saveAndSend = function () {
        $scope.sendApproval = true;
    }

    $scope.addNewContact = function (isValid) {
        if (isValid) {
            $scope.showValid = true;
            if (uploader1.queue.length != 0)
                uploader1.uploadAll();
            else {
                $scope.saveTemplate();
            }

            
        }
    }

};


