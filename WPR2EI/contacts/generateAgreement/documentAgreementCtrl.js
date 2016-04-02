angular.module('contacts')
.controller('documentAgreementCtrl',
    function ($scope, $state, $cookieStore, apiService, $rootScope, $sanitize, $modal, FileUploader) {
        $scope.params = {}
        $scope.params.documentType = 'agreement';
        $scope.params.orgId = $cookieStore.get('orgID');
        $scope.params.userid = $cookieStore.get('userId')
        $scope.params.templateName;
        $scope.params.projectSelected;

        var uploader = $scope.uploader = new FileUploader({
            url: apiService.uploadURL,
        });
        uploader.onSuccessItem = function (fileItem, response, status, headers) {
            img = response[0].Location;
            var edit = $('#editor').data("kendoEditor");
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
            Url = "project/Get/" + $cookieStore.get('orgID');//project
            apiService.get(Url).then(function (response) {
                $scope.projects = response.data;
            },
           function (error) {
               alert("Error " + error.state);
           });

            Url = "Template/GetAllTemplatesByDoc?orgId=" + $cookieStore.get('orgID') + "&docId=d9b1c8d6-4201-4077-abd0-c6654a6fa7d0";//templates
            apiService.get(Url).then(function (response) {
                $scope.params.templateList = response.data;
            },
           function (error) {
               alert("Error " + error.state);
           });

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
                    document_type_id: "fd87a619-6acc-4689-b5ff-e76794d6154a"
                };

                console.log($scope.params.htmlcontent);
                apiService.post("Template/Create", postdata).then(function (response) {
                    data = response.data[0];
                    $scope.openSucessfullPopup();
                    $scope.cancel();
                    $rootScope.$broadcast('REFRESH', 'agreementCreate');
                },
                function (error) {
                    if (error.status === 400)
                        alert(error.data.Message);
                });
            }
        }

        $scope.selectproject = function () {
            
        };

        $scope.selectTemplate = function () {
            if ($scope.params.templateSelected !== "") {
                $scope.params.bodyText = $sanitize((_.findWhere($scope.params.templateList, { id: $scope.params.templateSelected })).description);
                //for (var k in custom_fields) {
                //    while (($scope.params.bodyText).search(k) > -1) {
                //        $scope.params.bodyText = ($scope.params.bodyText).replace(k, custom_fields[k]);
                //    }
                //}
            }
            else{
                $scope.params.bodyText = "";
        }
        };

        $scope.openSucessfullPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/sucessfull.tpl.html',
                backdrop: 'static',
                controller: sucessfullController,
                size: 'lg',
                resolve: { items: { title: "Demand Letter" } }
            });
        }

        $scope.preview = function () {
            demoFromHTML();

        }

        $scope.goTOTemplate = function () {
            $scope.showTemplate = true;
            $scope.showPreview = false;
        }

        var demoFromHTML = function () {
            var pdf = new jsPDF('p', 'pt', 'letter')

            // source can be HTML-formatted string, or a reference
            // to an actual DOM element from which the text will be scraped.
            , source = $scope.params.htmlcontent

            // we support special element handlers. Register them with jQuery-style 
            // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
            // There is no support for any other type of selectors 
            // (class, of compound) at this time.
            , specialElementHandlers = {
                // element with id of "bypass" - jQuery style selector
                '#bypassme': function (element, renderer) {
                    // true = "handled elsewhere, bypass text extraction"
                    return true
                }
            }

            margins = {
                top: 80,
                bottom: 60,
                left: 40,
                width: 522
            };
            // all coords and widths are in jsPDF instance's declared units
            // 'inches' in this case
            pdf.fromHTML(
                source // HTML string or DOM elem ref.
                , margins.left // x coord
                , margins.top // y coord
                , {
                    'width': margins.width // max width of content on PDF
                    , 'elementHandlers': specialElementHandlers
                },
                function (dispose) {
                    // dispose: object with X, Y of the last line add to the PDF 
                    //          this allow the insertion of new lines after html
                    //pdf.save('Test.pdf');
                    var string = pdf.output('datauristring');
                    //  pdf.save('Test.pdf');
                    window.open(string);
                    //pdf.output('datauri');
                },
                margins
            )
        }


    });

