emailCreateCtrl = function ($scope, $state, $cookieStore, apiService, $modalInstance, $rootScope, $sanitize, $modal) {
    $scope.showTemplate = true;
    $scope.showPreview = false;
    $scope.params = {}

    $scope.params.orgId = $cookieStore.get('orgID');
    $scope.params.userid = $cookieStore.get('userId')
    $scope.params.templateName;
    $scope.params.subject;
    $scope.params.projectSelected;
    //$scope.params.orightml = '<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li>Super Easy <b>Theming</b> Options</li><li style="color: green;">Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li class="text-danger">Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE8+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p>';
    //$scope.params.htmlcontent = $scope.params.orightml;
    $scope.tools = ["bold",
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
                "unlink",
                "insertImage",
                "insertFile",
                "subscript",
                "superscript",
                "createTable",
                "addRowAbove",
                "addRowBelow",
                "addColumnLeft",
                "addColumnRight",
                "deleteRow",
                "deleteColumn",
                "viewHtml",
                "formatting",
                "cleanFormatting",
                "fontName",
                "fontSize",
                "foreColor",
                "backColor",
                "print",
                  { name: "insertHtml",
                  items: [
                           { text: "Last Name", value: "{{last_name}}" },
                           { text: "First Name", value: "{{first_name}}" },
                           { text: "My First Name", value: "{{my_first_name}}" },
                           { text: "My Last Name", value: "{{my_last_name}}" },
                             { text: "Salutation", value: "{{salutation}}" },
                            { text: "Brochure Url", value: "{{brochure_url}}" },

                  ]
                  }
                
    ];

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
            document_type_id:"6978399d-7ee7-42a6-85dd-6fec5b7312c2"
        };

        console.log($scope.params.htmlcontent);
        apiService.post("Template/Create", postdata).then(function (response) {
            data = response.data[0];
            $scope.openSucessfullPopup();
            $scope.cancel();
            $rootScope.$broadcast('REFRESH', 'emailCreated');
        },
        function (error)
        {
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
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'md',
            resolve: { items: { title: "Email" } }
        });
    }


    
};