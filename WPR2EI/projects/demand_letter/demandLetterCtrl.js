angular.module('project')

.controller('demandLetterCtrl',
    function ($scope, $state, security, $cookieStore, $rootScope, $modal, $window, $stateParams,auditService, demandLetterService, templateListService) {

        var orgID = $cookieStore.get('orgID');
        $rootScope.title = 'Dwellar./SelectClient';
        var loggedUser = $cookieStore.get('loggedUserInfo');
        var userID = $cookieStore.get('userId');
        var payment_schedule_id = $stateParams.id;
        $scope.contactforDemandLetter = [];
        $scope.params = {};
        var custom_fields = { "{{first_name}}": 'rupa', '{{last_name}}': 'margaj', "{{my_first_name}}": loggedUser.first_name, "{{my_last_name}}": loggedUser.last_name, "{{salutation}}": 'Mr/Mrs' }

        $scope.SelectClientGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: function (options) {
                        options.success($scope.contactforDemandLetter);
                    },
                },
                pageSize: 5
            },
            sortable: true,
            selectable: "multiple",
            reorderable: true,
            resizable: true,
            height: screen.height - 370,
            filterable: true,
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: [
           {
               template: "<input type='checkbox', class='checkbox',  ng-click='check($event,dataItem)' />",
               title: "<input id='checkAll', type='checkbox', class='check-box', ng-click='checkALL(dataItem)' />",
               width: "60px",
               attributes:
                {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
           }, {
               title: "Name",
               template: "<span>#=first_name#</span><span>#=last_name#</span>",
               width: "120px",
               attributes:
                 {
                     "class": "UseHand",
                     "style": "text-align:center;"
                 }
           }, ]
        };

        demandLetterService.getContactForPayment(payment_schedule_id).then(function (res) {
            $scope.contactInPayScheme = res.data;
            // Now, find out the users already in the team and mark them
            angular.forEach($scope.contactInPayScheme, function (existingUser) {
                existingUser.isSelected = false;
            })
        }, function (err) {

        })


        $scope.selectContact = function (contact) {
            if (!contact.isSelected) {
                contact.isSelected = true;
                $scope.contactforDemandLetter.push(contact);//add user to final List
                $('.k-i-refresh').trigger("click"); //now refresh grid
            }
            else {
                contact.isSelected = false;
                _.remove($scope.contactforDemandLetter, function (removeMe) { //remove user from final list
                    return removeMe
                });
                $('.k-i-refresh').trigger("click"); //now refresh grid
            }

        };


        $scope.chooseTemplate = function () {
            $state.go('app.generateDemandLetterTemplate');
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

        templateListService.getAllTemplates(orgID).then(function (response) {
            $scope.params.templateList = response.data;
        });

        $scope.selectTemplate = function () {

            if ($scope.params.template !== "") {
                $scope.params.template_name = (_.findWhere($scope.params.templateList, { id: $scope.params.template })).template_name;
                $scope.params.subject = (_.findWhere($scope.params.templateList, { id: $scope.params.template })).subject;
                $scope.params.bodyText = ((_.findWhere($scope.params.templateList, { id: $scope.params.template })).description);
            }
            else
                $scope.params.bodyText = "";
        }


        $scope.next = function () {
            if ($scope.params.bodyText != null) {
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
            else {
                alert("Enter Description");
                //$state.go('app.addTemplate');
            }

        }

        $scope.back = function () {
            $state.go('app.generateDemandLetter');
        }



        //Audit log start															
        $scope.params ={
                device_os: $cookieStore.get('Device_os'),
                device_type: $cookieStore.get('Device'),
                module_id: "Project",
                action_id: "Generated Demand Letter",
                details: "Generate Demand Letter",
                application: "angular",
                browser: $cookieStore.get('browser'),
                ip_address: $cookieStore.get('IP_Address'),
                location: $cookieStore.get('Location'),
                organization_id: $cookieStore.get('orgID'),
                User_ID: $cookieStore.get('userId')
            };

        AuditCreate = function (param) {
            auditService.saveAuditLog(param).then(function (response) {
                var loginSession = response.data;
            },
       function (error) {
           if (error.status === 400)
               alert(error.data.Message);
           else
               alert("Network issue");
       });
        };

        AuditCreate($scope.params);

        //Audit log end

    }
);