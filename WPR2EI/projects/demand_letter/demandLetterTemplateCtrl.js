angular.module('project')

.controller('demandLetterTemplateCtrl',
function ($scope, $state, $cookieStore, apiService, FileUploader, $window, uploadService, $modal, $rootScope, $sanitize) {
    var orgID = $cookieStore.get('orgID');
    //Audit log start               
    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
           //device_mac_id: "34:#$::43:434:34:45",
           module_id: "Contact",
           action_id: "Contact View",
           details: $scope.params.subject + "Email Template",
           application: "angular",
           browser: $cookieStore.get('browser'),
           ip_address: $cookieStore.get('IP_Address'),
           location: $cookieStore.get('Location'),
           organization_id: $cookieStore.get('orgID'),
           User_ID: $cookieStore.get('userId')
       };


        apiService.post("AuditLog/Create", postdata).then(function (response) {
            var loginSession = response.data;
        },
        function (error) {
            if (error.status === 400)
                alert(error.data.Message);
            else
                alert("Network issue");
        });
    };
   
    //end

    $scope.params = {};
    var loggedUser = $cookieStore.get('loggedUserInfo');
    // var custom_fields = { "{{first_name}}": emailData.Contact_First_Name, '{{last_name}}': emailData.Contact_First_Name, "{{my_first_name}}": loggedUser.first_name, "{{my_last_name}}": loggedUser.last_name, "{{salutation}}": 'Mr/Mrs' }
    var custom_fields = { "{{first_name}}": 'rupa', '{{last_name}}': 'margaj', "{{my_first_name}}": loggedUser.first_name, "{{my_last_name}}": loggedUser.last_name, "{{salutation}}": 'Mr/Mrs' }
    $scope.params.emailFrom = loggedUser.account_email;
    $scope.params.emailTo;
    $scope.params.emailCc;
    $scope.params.emailBcc;
    $scope.params.template;
    $scope.params.templateList;
    $scope.params.subject;
    $scope.params.bodyText;
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
                "unlink",
                "fontName",
                "fontSize",
                "foreColor",
                "backColor",
                "print",
                'createTable',
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
                  "insertImage",
                  "insertFile",
                  "viewHtml",
        ],
        imageBrowser: {
            messages: {
                dropFilesHere: "Drop files here"
            },
            transport: {
                read: "http://demos.telerik.com/kendo-ui/service/ImageBrowser/Read",
                destroy: {
                    url: "http://demos.telerik.com/kendo-ui/service/ImageBrowser/Destroy",
                    type: "POST"
                },
                create: {
                    url: "http://demos.telerik.com/kendo-ui/service/ImageBrowser/Create",
                    type: "POST"
                },
                thumbnailUrl: "http://demos.telerik.com/kendo-ui/service/ImageBrowser/Thumbnail",
                uploadUrl: "http://demos.telerik.com/kendo-ui/service/ImageBrowser/Upload",
                imageUrl: "http://demos.telerik.com/kendo-ui/service/ImageBrowser/Image?path={0}"
            }
        },
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

    apiService.get('Template/GetAllTemplates?orgId=' + orgID).then(function (response) {
        $scope.params.templateList = response.data;        
    });

    $scope.selectTemplate = function () {

        if ($scope.params.template !== "") {
            $scope.params.template_name = (_.findWhere($scope.params.templateList, { id: $scope.params.template })).template_name;
            $scope.params.subject = (_.findWhere($scope.params.templateList, { id: $scope.params.template })).subject;
            $scope.params.bodyText = $sanitize((_.findWhere($scope.params.templateList, { id: $scope.params.template })).description);
            $cookieStore.put('TemplateName', $scope.params.template_name)
        }
        else
            $scope.params.bodyText = "";
    }


    $scope.sendEmail = function () {
        var postData = {
            fromemailid: $scope.params.emailFrom,
            toemailid: $scope.params.emailTo,
            cc: $scope.params.emailCc,
            bcc: $scope.params.emailBcc,
            template: $scope.params.bodyText,
            template_id: $scope.params.template,
            subject: $scope.params.subject,
            document_type_id: "6978399d-7ee7-42a6-85dd-6fec5b7312c2",
            user_id: $cookieStore.get('userId'),
            organization_id: $cookieStore.get('orgID')
        }
        apiService.post('SendEmail/SaveEmail', postData).then(function (response) {
            data = response.data;
            //$scope.openSucessfullPopup();
           // $scope.cancel();
        },
       function (error) {

       });

    }

    $scope.next = function ()
    {
        if ($scope.params.bodyText != null)
        {
            var postData = {
                template: $scope.params.bodyText,
                template_id: $scope.params.template,
                subject: $scope.params.subject,
                document_type_id: "6978399d-7ee7-42a6-85dd-6fec5b7312c2"
            }
            window.localStorage.setItem("emailAddTemplate", JSON.stringify(postData));
            AuditCreate();
            $state.go('app.demandLetterSend');
        }
        else
        {
            alert("Enter Description");
            //$state.go('app.addTemplate');
        }
   
}
    $scope.back = function () {
        $state.go('app.contactDemandList');
    }

  
    $scope.sendEmail = function (isValid) {
        $scope.showValid = true;

        if (isValid)
        {

            $scope.showValid = false;
        }
    }
})