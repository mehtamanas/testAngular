/**
 * Created by dwellarkaruna on 24/10/15.
 */
var EditNotesContactController = function ($scope, $state, $cookieStore, apiService, $modalInstance, $modal, $rootScope, $window, FileUploader) {
    console.log('EditNotesContactController');
    $scope.loadingDemo = false;
    $scope.seletedNotesId = window.sessionStorage.selectedNotesID;
    $scope.selectedCustomerID = window.sessionStorage.selectedCustomerID;

    var userID = $cookieStore.get('userId');
  
    //Audit log start
  
    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
          // device_mac_id: "34:#$::43:434:34:45",
           module_id: "Contact",
           action_id: "Contact View",
           details: "EditNote",
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
    AuditCreate();

    //end


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

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    //API functionality start

    contactUrl = "Notes/EditGet/" + $scope.seletedNotesId;
    apiService.getWithoutCaching(contactUrl).then(function (response) {
        data = response.data[0];
        attentions = (data.attention).split(',');
        $scope.params.text = data.text;
        $scope.params.Name = [];
        for(i=0;i<attentions.length;i++){
            $scope.params.Name.push({ 'text': attentions[i] })
        }
    },
    function (error) {
      
    }
   );

    $scope.contactList = [];

    apiService.get("Contact/GetAllContactDetails?Id=" + userID + "&type=Lead").then(function (response) {
        data = response.data;
        contactsName = _.pluck(data, 'Name');
        contactId = _.pluck(data, 'id');
        for (i = 0; i < contactsName.length; i++) {
            $scope.contactList.push({ 'text': contactsName[i].toString(), 'id': contactId[i].toString() });
        }
    }, function (error) {
    });


    $scope.loadTags = function (query) {
        return $scope.contactList;
    }

    $scope.params = {
        text: $scope.text,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),
        class_type: "Person",
        id: window.sessionStorage.selectedCustomerID,

    };

    $scope.save = function () {
        var postData =
               {
                   id: $scope.seletedNotesId,
                 
                   text: $scope.params.text,
                   attention : _.pluck($scope.params.Name, 'text').join(','),
                   organization_id: $cookieStore.get('orgID'),
                   user_id: $cookieStore.get('userId'),
                   class_id:$scope.selectedCustomerID,
                   class_type: "Person"
               };

        apiService.post("Notes/Edit", postData).then(function (response) {
            var loginSession = response.data;
            $modalInstance.dismiss();
            $scope.loadingDemo = false;
            $scope.openSucessfullPopup();
            $rootScope.$broadcast('REFRESH', 'NotesGrid');

        },
        function (error) {
            if (error.status === 400)
                alert(error.data.Message);
            else
                alert("Network issue");
        });
    }


    //end
    //popup functionality start
    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/Edited.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'sm',
            resolve: { items: { title: "Notes" } }
        });
    }

    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid)
        {
            $scope.loadingDemo = true;
            $scope.save();

            $scope.showValid = false;

        }
    }
};




