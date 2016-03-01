angular.module('campaigns')

.controller('emailAddTemplate',
function ($scope, $state, $cookieStore, apiService, FileUploader, $window, uploadService, $modal, $rootScope, $sanitize) {

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
    $scope.params.tools = ["bold",
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


    ];
    apiService.get('Template/GetAllTemplates').then(function (response) {
        $scope.params.templateList = response.data;
    });

    $scope.selectTemplate = function () {
        $scope.params.subject = (_.findWhere($scope.params.templateList, { id: $scope.params.template })).subject;
        $scope.params.bodyText = $sanitize((_.findWhere($scope.params.templateList, { id: $scope.params.template })).description);
        //for (var k in custom_fields) {
        //    while (($scope.params.bodyText).search(k) > -1) {
        //        $scope.params.bodyText = ($scope.params.bodyText).replace(k, custom_fields[k]);
        //    }
        //}
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

    $scope.next = function () {
        var postData = {
            template: $scope.params.bodyText,
            template_id: $scope.params.template,
            subject: $scope.params.subject,
            document_type_id: "6978399d-7ee7-42a6-85dd-6fec5b7312c2"
        }
        $cookieStore.put('emailAddTemplate', postData);
        AuditCreate();
        $state.go('app.summaryEmail');
    }

    $scope.back = function () {
        $cookieStore.remove('emailAddTemplate');
        $state.go('app.option');
    }


})