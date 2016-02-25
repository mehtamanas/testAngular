agreementCreateCtrl = function ($scope, $state, $cookieStore, apiService, $modalInstance, $rootScope, $sanitize, $modal) {
    $scope.params = {}

    $scope.params.orgId = $cookieStore.get('orgID');
    $scope.params.userid = $cookieStore.get('userId')
    $scope.params.templateName;
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
            name: $scope.params.templateName,
            description: $scope.params.htmlcontent
        };

        console.log($scope.params.htmlcontent);
        apiService.post("AgreementMaster/Create", postdata).then(function (response) {
            data = response.data[0];
            $scope.openSucessfullPopup();
            $scope.cancel();
            $rootScope.$broadcast('REFRESH', 'agreementCreate');
        },
        function (error)
        {
            if (error.status === 400)
                alert(error.data.Message);
        });
        }
    }

    $scope.preview=function(){
        var modalInstance = $modal.open({
            animation: true,
            template: $scope.params.htmlcontent,
            backdrop: 'static',
            size: 'md'
        });
       
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
};