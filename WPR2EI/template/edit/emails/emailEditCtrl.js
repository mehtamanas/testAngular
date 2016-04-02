emailEditCtrl = function ($scope, $state, $cookieStore, apiService, $modalInstance, $rootScope, $sanitize, $modal, emailData, FileUploader) {
    $scope.showTemplate = true;
    $scope.showPreview = false;
    $scope.params = {}

    $scope.params.orgId = $cookieStore.get('orgID');
    $scope.params.userid = $cookieStore.get('userId')
    $scope.params.templateName = emailData.template_name;
    $scope.params.subject = emailData.subject;
    $scope.params.projectSelected;
    //$scope.params.orightml = '<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li>Super Easy <b>Theming</b> Options</li><li style="color: green;">Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li class="text-danger">Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE8+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p>';
    $scope.params.htmlcontent = emailData.description;
    var uploader = $scope.uploader = new FileUploader({
        url: apiService.uploadURL,
    });
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        img = response[0].Location;
        var edit = $('#editEmailDescription').data("kendoEditor");
        edit.exec('inserthtml', { value: "<img alt=''  src='" + img + "' />" });

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
                        $('#imageBrowser').trigger("click");
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
                  "insertFile",
                  "viewHtml",
        ],
        //imageBrowser: {
        //    messages: {
        //        dropFilesHere: "Drop files here"
        //    },
        //    transport: {
        //        read: "http://demos.telerik.com/kendo-ui/service/ImageBrowser/Read",
        //        destroy: {
        //            url: "http://demos.telerik.com/kendo-ui/service/ImageBrowser/Destroy",
        //            type: "POST"
        //        },
        //        create: {
        //            url: "http://demos.telerik.com/kendo-ui/service/ImageBrowser/Create",
        //            type: "POST"
        //        },
        //        thumbnailUrl: "http://demos.telerik.com/kendo-ui/service/ImageBrowser/Thumbnail",
        //        uploadUrl: "http://demos.telerik.com/kendo-ui/service/ImageBrowser/Upload",
        //        imageUrl: function (name) {
        //            var pictureUrl = decodeURIComponent(name);
        //            return pictureUrl;
        //        },
        //    }
        //},
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

    var callApi = function () {
        apiService.get("TemplateField/Get").then(function (response) {
            $scope.fieldList = response.data;
        })
        apiService.get("Project/Get").then(function (response) {
            $scope.projectList = response.data;
        })
    }

    callApi();

    $scope.saveTemplate = function (isvalid) {
        if (isvalid) {
            $scope.params.htmlcontent = $sanitize($scope.params.htmlcontent);
            var postdata = {
                template_name: $scope.params.templateName,
                subject: $scope.params.subject,
                description: $scope.params.htmlcontent,
                organization_id: $cookieStore.get('orgID'),
                user_id: $cookieStore.get('userId'),
                document_type_id: "6978399d-7ee7-42a6-85dd-6fec5b7312c2",
                id: emailData.id
            };

            
            apiService.post("Template/EditTemplate", postdata).then(function (response) {
                data = response.data[0];
                $scope.openSucessfullPopup();
                $scope.cancel();
                $rootScope.$broadcast('REFRESH', 'emailCreated');
            },
            function (error) {
                if (error.status === 400)
                    alert(error.data.Message);
            });
        }
    }

    $scope.preview=function(){
        $scope.showTemplate = false;
        $scope.showPreview = true;
    }

    $scope.goTOTemplate = function () {
        $scope.showTemplate = true;
        $scope.showPreview = false;
    }

    $scope.cancel = function () {
        $modalInstance.dismiss();
    }

    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/Edited.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'md',
            resolve: { items: { title: "Email" } }
        });
    }


    
};