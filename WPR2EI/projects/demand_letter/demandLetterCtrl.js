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

        $scope.goToList();//onload to go list
        
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

        $scope.goToTemplate = function () {
            $state.go('app.demandLetter.generateTemplate');
        }

        $scope.cancel = function () {

        }

        //Select Template
        
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


        $scope.goToSave = function () {
            if ($scope.params.bodyText != null) {
                $state.go('app.demandLetter.save');
            }
            else {
                alert("Enter Description");
                //$state.go('app.addTemplate');
            }

        }

        $scope.goToList = function () {
            $state.go('app.demandLetter.generateList');
        }


        //save Demand letter

        $scope.sendDemandLetter = function () {
            var letterDetails = [];

            for (var i in $scope.totalContact) {

                letterDetails.push({ 'client_id': $scope.totalContact[i], 'template_id': demandLetterTemplate.template_id, 'template': demandLetterTemplate.template, 'subject': demandLetterTemplate.subject, 'project_id': $scope.project_id, 'user_id': $cookieStore.get('userId'), 'organization_id': $cookieStore.get('orgID'), 'payment_detail_scheme_id': $scope.PaymentId, })
                apiService.post('Template/ClientDemandLetterMapping', letterDetails).then(function (response) {
                    var SessionData = response.data;
                    $scope.openSucessfullPopup();
                },

            function (error) {
            });


            }
        }

        $scope.addNew = function (isValid) {
            $scope.showValid = true;
            if (isValid) {
                $scope.sendDemandLetter();
                $scope.showValid = false;

            }

        }

        $scope.openSucessfullPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'projects/demand_letter/successfull/sendSuccessful.html',
                backdrop: 'static',
                controller: sendSuccessfulCtrl,
                size: 'lg',
                resolve: { items: { title: "Demand Letter" } }

            });
            $rootScope.$broadcast('REFRESH1', 'EmailTemplateGrid');
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

        auditService.saveAuditLog(params);

        //Audit log end

    }
);