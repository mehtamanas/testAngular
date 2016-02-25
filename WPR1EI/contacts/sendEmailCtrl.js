var sendEmailCtrl = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, $window, uploadService, $modal, $rootScope, $sanitize, emailData) {
    console.log('sendEmailController');
    $scope.params = {};
    var loggedUser = $cookieStore.get('loggedUserInfo');
    var custom_fields = { "{{first_name}}": emailData.Contact_First_Name , '{{last_name}}': emailData.Contact_First_Name , "{{my_first_name}}": loggedUser.first_name , "{{my_last_name}}": loggedUser.last_name,"{{salutation}}" : 'Mr/Mrs'}
    $scope.params.emailFrom = loggedUser.account_email;
    $scope.params.emailTo = emailData.Contact_Email;
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
                  //{
                  //    name: "insertHtml",
                  //    items: [
                  //        { text: "Last Name", value: "{{last_name}}" },
                  //        { text: "First Name", value: "{{first_name}}" },
                  //        { text: "My First Name", value: "{{my_first_name}}" },
                  //        { text: "My Last Name", value: "{{my_last_name}}" },
                  //          { text: "Salutation", value: "{{salutation}}" },
                  //         { text: "Brochure Url", value: "{{brochure_url}}" },
                  //    ]
                  //}

    ];
    
    apiService.get('Template/GetAllTemplates').then(function (response) {
        $scope.params.templateList= response.data;
    });

    $scope.selectTemplate = function () {
        $scope.params.subject = (_.findWhere($scope.params.templateList, { id: $scope.params.template })).subject;
        $scope.params.bodyText = $sanitize((_.findWhere($scope.params.templateList, { id: $scope.params.template })).description);
        for (var k in custom_fields) {
            while (($scope.params.bodyText).search(k) > -1) {
                $scope.params.bodyText = ($scope.params.bodyText).replace(k, custom_fields[k]);
            }
        }
    }

    $scope.sendEmail = function () {

        var postData = {
            fromemailid: $scope.params.emailFrom,
            toemailid:  $scope.params.emailTo,
            cc: $scope.params.emailCc,
            bcc: $scope.params.emailBcc,
            template: $scope.params.bodyText,
            template_id: $scope.params.template,
            subject: $scope.params.subject,
            document_type_id: "6978399d-7ee7-42a6-85dd-6fec5b7312c2",
            user_id: $cookieStore.get('userId'),
            organization_id:$cookieStore.get('orgID')

        }
        apiService.post('SendEmail/SaveEmail', postData).then(function (response) {
            data = response.data;
            $scope.openSucessfullPopup();
            $scope.cancel();
        },
       function (error) {

       });
    }

    $scope.cancel = function () {
        $modalInstance.dismiss();
    };

    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'contacts/sucessfullEmail.tpl.html',
            backdrop: 'static',
            controller: sucessfullEmailController,
            size: 'md',
            resolve: { items: { title: "Email" } }
        });
    }

};
