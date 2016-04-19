﻿angular.module('campaigns')

.controller('emailAddTemplate',
function ($scope, $state, $cookieStore, apiService, FileUploader, $window, uploadService, $modal, $rootScope, $sanitize) {
    var orgID = $cookieStore.get('orgID');

    $scope.loadingDemo = false;
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
                //alert("Network issue");
        sweetAlert(
                  'Oops...',
                  'Network issue!',
                  'error'
                )
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
        var edit = $('#editor').data("kendoEditor");
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
        ],
    }

    apiService.get('Template/GetAllTemplates?orgId=' + orgID).then(function (response) {
        $scope.params.templateList = response.data;
    });

    $scope.selectTemplate = function () {
        if ($scope.params.template !== "") {
            $scope.params.subject = (_.findWhere($scope.params.templateList, { id: $scope.params.template })).subject;
            $scope.params.bodyText = $sanitize((_.findWhere($scope.params.templateList, { id: $scope.params.template })).description);
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
            $scope.loadingDemo = false;
            //$scope.openSucessfullPopup();
            // $scope.cancel();
        },
       function (error) {
           $scope.loadingDemo = false;
       });

    }

    $scope.next = function () {
        if ($scope.params.bodyText != null && $scope.params.subject != null) {
            var postData = {
                template: $scope.params.bodyText,
                template_id: $scope.params.template,
                subject: $scope.params.subject,
                document_type_id: "6978399d-7ee7-42a6-85dd-6fec5b7312c2"
            }
            window.localStorage.setItem("emailAddTemplate", JSON.stringify(postData));
            AuditCreate();
            $state.go('app.summaryEmail');
        }
        else {
            //alert("Enter Description");
            swal("Error!", "Pleas Enter Description And Subject", 'info')
            $state.go('app.addTemplate');
        }




    }

    $scope.preview = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'campaigns/emailCampaign/emailAddPreview.html',
            backdrop: 'static',
            controller: emailAddPreviewCtrl,
            size: 'lg',
            resolve: {
                items: function () {
                    return $scope.params.bodyText;
                }
            }
        });
    }

    $scope.cancel = function () {

        $state.go('app.campaigns');
    };
    $scope.back = function () {
        $cookieStore.remove('emailAddTemplate');
        $state.go('app.optionEmail');
    }

    $scope.sendEmail = function (isValid) {
        $scope.showValid = true;
        if (isValid) {
            $scope.loadingDemo = true;
            $scope.showValid = false;
        }
    }
})