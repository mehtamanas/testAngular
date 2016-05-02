var sendEmailCtrl = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, $window, uploadService, $modal, $rootScope, $sanitize, $sce, emailData) {
    console.log('sendEmailController');
    $scope.params = {};
    var nullCheck = function () {
        if (emailData.Contact_First_Name === null)
            emailData.Contact_First_Name = '';
        if (emailData.Contact_Last_Name === null)
            emailData.Contact_Last_Name = '';
        if (emailData.first_name === null)
            emailData.first_name = '';
        if (emailData.last_name === null)
            emailData.last_name = '';
        if (emailData.salutation === null)
            emailData.salutation = '';
    }
    nullCheck();
    var loggedUser = $cookieStore.get('loggedUserInfo');
    var custom_fields = { "{{first_name}}": emailData.Contact_First_Name, '{{last_name}}': emailData.Contact_Last_Name, "{{my_first_name}}": loggedUser.first_name, "{{my_last_name}}": loggedUser.last_name, "{{salutation}}": emailData.salutation, "{{brochure_url}}": 'http://www.dwellar.com' }
    $scope.params.emailFrom = [{ text: loggedUser.account_email }];
    $scope.params.emailTo = [{ text: emailData.Contact_Email }];
    $scope.params.emailCc;
    $scope.params.emailBcc;
    $scope.params.template;
    $scope.params.templateList;
    $scope.params.subject;
    $scope.params.bodyText;


    var uploader = $scope.uploader = new FileUploader({
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

    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        loc = response[0].Location;
        var edit = $('#sendEmailEditor').data("kendoEditor");
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

                  "viewHtml",
        ],
    }

    $scope.loadTags = function () {
        return { text: emailData.Contact_Email }, { text: loggedUser.account_email }
    }

    apiService.getWithoutCaching('Template/GetAllTemplates?orgId=' + $cookieStore.get('orgID')).then(function (response) {
        $scope.params.templateList = response.data;
    });

    $scope.selectTemplate = function () {
        if ($scope.params.template !== "") {
            $scope.params.subject = (_.findWhere($scope.params.templateList, { id: $scope.params.template })).subject;
            $scope.params.bodyText = ((_.findWhere($scope.params.templateList, { id: $scope.params.template })).description); //removed sanitize and expilcitly trusting content
            for (var k in custom_fields) {
                while (($scope.params.bodyText).search(k) > -1) {
                    $scope.params.bodyText = ($scope.params.bodyText).replace(k, custom_fields[k]);
                }
            }
        }
        else
            $scope.params.bodyText = "";
    }

    $scope.sendEmail = function (isValid) {
        if (isValid) {
            $scope.disabled = true;
            var postData = {
                fromemailid: _.pluck($scope.params.emailFrom, 'text').join(','),
                toemailid: _.pluck($scope.params.emailTo, 'text').join(','),
                cc: _.pluck($scope.params.emailCc, 'text').join(','),
                bcc: _.pluck($scope.params.emailBcc, 'text').join(','),
                template: $scope.params.bodyText,
                template_id: $scope.params.template,
                subject: $scope.params.subject,
                document_type_id: "6978399d-7ee7-42a6-85dd-6fec5b7312c2",
                user_id: $cookieStore.get('userId'),
                organization_id: $cookieStore.get('orgID')

            }
            apiService.post('SendEmail/SaveEmail', postData).then(function (response) {
                data = response.data;
                $scope.openSucessfullPopup();
                $scope.cancel();
            },
           function (error) {

           });
        }
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
            size: 'sm',
            resolve: { items: { title: "Email" } }
        });
    }



};
