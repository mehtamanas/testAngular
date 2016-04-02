demandLetterController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $rootScope, $sanitize, $modal, FileUploader) {

    $scope.showTemplate = true;
    $scope.showPreview = false;
    $scope.params = {}

    $scope.params.orgId = $cookieStore.get('orgID');
    $scope.params.userid = $cookieStore.get('userId')
    $scope.params.templateName;
    $scope.params.projectSelected;

    var uploader = $scope.uploader = new FileUploader({
        url: apiService.uploadURL,
    });
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        loc = response[0].Location;
        var edit = $('#demandLeterDescription').data("kendoEditor");
        var fileType = fileItem.file.type.slice(fileItem.file.type.lastIndexOf('/') + 1);
        if (fileType === 'png' || fileType === 'jpg' || fileType === 'jpeg' || fileType === 'bmp' || fileType === 'gif')
            edit.exec('inserthtml', { value: "<img alt=''  src='" + loc + "' />" });
        else
            edit.exec('inserthtml', { value: "<a href='" + loc + "' >" + loc + "</a>" });

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
                  "viewHtml",
        ],
    }

    var callApi = function () {
        apiService.get("Project/Get/" + $cookieStore.get('orgID')).then(function (response) {
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
                document_type_id: "d9b1c8d6-4201-4077-abd0-c6654a6fa7d0"
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
            resolve: { items: { title: "Agreement" } }
        });
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


};