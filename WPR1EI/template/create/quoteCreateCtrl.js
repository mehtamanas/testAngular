quoteCreateCtrl = function ($scope, $state, $cookieStore, apiService, $modalInstance, $rootScope, $sanitize, $modal) {
    $scope.params = {}

    $scope.params.orgId = $cookieStore.get('orgID');
    $scope.params.userid = $cookieStore.get('userId')
    $scope.params.templateName;
    $scope.params.projectSelected;
    $scope.params.orightml = '<h2>Try me!</h2><p>textAngular is a super cool WYSIWYG Text Editor directive for AngularJS</p><p><b>Features:</b></p><ol><li>Automatic Seamless Two-Way-Binding</li><li>Super Easy <b>Theming</b> Options</li><li style="color: green;">Simple Editor Instance Creation</li><li>Safely Parses Html for Custom Toolbar Icons</li><li class="text-danger">Doesn&apos;t Use an iFrame</li><li>Works with Firefox, Chrome, and IE8+</li></ol><p><b>Code at GitHub:</b> <a href="https://github.com/fraywing/textAngular">Here</a> </p>';
    $scope.params.htmlcontent = $scope.params.orightml;
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
                          { text: "project Name", value: "{{project_name}}"}
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

    $scope.selectField = function () {
        if ($scope.field === "1") {
            var editor = $('#editor').data("kendoEditor");
            editor.exec("inserthtml", { value: "{{first_name}}" });
        }
        if ($scope.field === "2") {
            var editor = $('#editor').data("kendoEditor");
            editor.exec("inserthtml", { value: "{{last_name}}" });
        }

        if ($scope.field === "3")
        {
        var editor = $('#editor').data("kendoEditor");
        editor.exec("inserthtml", { value: "{{project_name}}" });
    }
        
    }

    $scope.saveTemplate = function () {
        $scope.params.htmlcontent = $sanitize($scope.params.htmlcontent);
        var postdata = {
            name: $scope.params.templateName,
            description: $scope.params.htmlcontent
        };

        console.log($scope.params.htmlcontent);
        apiService.post("AgreementMaster/Create", postdata).then(function (response) {
            data = response.data[0];
            $scope.cancel();
        },
        function (error)
        {
            if (error.status === 400)
                alert(error.data.Message);
        });
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

    
};