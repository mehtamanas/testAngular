angular.module('templates')
.controller('templateCtrl', function ($scope, $modal, apiService, $cookieStore) {
    console.log('templateCtrl');
    $scope.title = 'Dwellar Template';
    $scope.templateAction = 'no_action';

    $scope.openCreateTemplate = function (args) {
        
        if (args === 'quotes') {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'template/create/quoteCreate.html',
                backdrop: 'static',
                controller: quotesCreateCtrl,
                size: 'md'
            });
        }
        else if (args === 'agreement') {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'template/create/agreement/agreementCreate.html',
                backdrop: 'static',
                controller: agreementCreateCtrl,
                size: 'md'
            });
        }
        else if (args === 'invoice') {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'template/create/invoiceCreate.html',
                backdrop: 'static',
                controller: invoiceCreateCtrl,
                size: 'md'
            });
        }

        else if (args === 'channel') {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'template/create/channelCreate.html',
                backdrop: 'static',
                controller: channelCreateCtrl,
                size: 'md'
            });
        }
        else if (args === 'people') {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'template/create/peopleCreate.html',
                backdrop: 'static',
                controller: peopleCreateCtrl,
                size: 'md'
            });
        }
        else if (args === 'quote') {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'template/create/quoteCreate.html',
                backdrop: 'static',
                controller: quoteCreateCtrl,
                size: 'md'
            });
        }
        else if (args === 'email') {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'template/create/emails/emailCreate.html',
                backdrop: 'static',
                controller: emailCreateCtrl,
                size: 'md'
            });
        }

    };

    $scope.EmailTemplateGrid = {
        dataSource: {
            type: "json",
            transport: {
                read: apiService.baseUrl + "Template/GetTemplateGrid/" + $cookieStore.get('orgID') + '/6978399d-7ee7-42a6-85dd-6fec5b7312c2'
            },
            pageSize: 5,
            refresh: true,
            schema: {
                model: {
                    fields: {
                        date: { type: "date" }
                    }
                }
            }        
        },
        groupable: true,
        sortable: true,
        selectable: "multiple",
        reorderable: true,
        resizable: true,
        filterable: true,
        columnMenu: {
            messages: {
                columns: "Choose columns",
                filter: "Apply filter",
                sortAscending: "Sort (asc)",
                sortDescending: "Sort (desc)"
            }
        },
        pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
        },
        columns: [{
                  template: "<input type='checkbox', class='checkbox', data-id='#= id #',  ng-click='check($event,dataItem)' />",
                  title: "<input id='checkAll', type='checkbox', class='check-box', ng-click='checkALL(dataItem)' />",
                  width: "60px",
                  attributes:
                     {
                         "style": "text-align:center"
                     }
                }, {
                    field: "template_name",
                    title: "Name",
                    width: "120px",
                    attributes:
                     {
                         "style": "text-align:center"
                     }
                }, {
                    field: "subject",
                    title: "Subject",
                    width: "120px",
                    attributes:
                     {
                         "style": "text-align:center"
                     }

                }, {
                    field: "description",
                    title: "Html",
                    width: "120px",
                    attributes:
                     {
                         "style": "text-align:center"
                     }
                } ]

            };

    $scope.agreementTemplateGrid = {
        dataSource: {
            type: "json",
            transport: {

                read: apiService.baseUrl + "Template/GetTemplateGrid/" + $cookieStore.get('orgID') + '/fd87a619-6acc-4689-b5ff-e76794d6154a'

            },
            pageSize: 5,
            refresh: true,

            schema: {
                model: {
                    fields: {

                        date: { type: "date" }

                    }
                }
            }
        },
        groupable: true,
        sortable: true,
        selectable: "multiple",
        reorderable: true,
        resizable: true,
        filterable: true,
        pageable: {
            refresh: true,
            pageSizes: true,
            buttonCount: 5
        },
        columns: [{
            field: "template_name",
            title: "Name",
            width: "120px"
        }, {
            field: "subject",
            title: "Subject",
            width: "120px",

        }, {
            field: "description",
            title: "Html",
            width: "120px",
        }]

    };

    $scope.emailEdit = function (dataItem) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'template/edit/emails/emailEdit.html',
            backdrop: 'static',
            controller: emailEditCtrl,
            size: 'md',
            resolve:{
                emailData: dataItem
        }
        });

    }

    $scope.agreementEdit = function (dataItem) {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'template/edit/agreement/agreementEdit.html',
            backdrop: 'static',
            controller: agreementEditCtrl,
            size: 'md',
            resolve: {
                agreementData: dataItem
            }
        });

    }

    $scope.$on('REFRESH', function (event, args) {
        if (args == 'emailCreated') {
            $('.k-i-refresh').trigger("click");
        }
    });

    $scope.$on('REFRESH', function (event, args) {
        if (args == 'agreementCreate') {
            $('.k-i-refresh').trigger("click");
        }
    });

    $scope.$on('REFRESH1', function (event, args) {
        if (args == 'EmailTemplateGrid') {
            $('.k-i-refresh').trigger("click");
        }
        $scope.templateAction = 'no_action';
    });

    //sheetal's code starts

    var auditLog = function () {
        //Audit log start
        $scope.params = {

            device_os: "windows10",
            device_type: "mobile",
            device_mac_id: "34:#$::43:434:34:45",
            module_id: "Addnew TEAM",
            action_id: "Addnew TEAM View",
            details: "Addnew TEAM detail",
            application: "angular",
            browser: $cookieStore.get('browser'),
            ip_address: $cookieStore.get('IP_Address'),
            location: $cookieStore.get('Location'),
            organization_id: $cookieStore.get('orgID'),
            User_ID: $cookieStore.get('userId')
        };

        AuditCreate = function (param) {
            apiService.post("AuditLog/Create", param).then(function (response) {
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

        //end
    }

    auditLog();

    var userId = $cookieStore.get('userId');
    var orgID = $cookieStore.get('orgID');
    $scope.contact1 = $scope.seletedCustomerId;

    Url = "project/Get/" + $cookieStore.get('orgID');
    apiService.get(Url).then(function (response) {
        $scope.projects = response.data;
    },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });

    $scope.selectproject = function () {
        $scope.params.project_id = $scope.project1;
    };


    Url = "Team/Get/" + $cookieStore.get('orgID');
    apiService.get(Url).then(function (response) {
        $scope.teams = response.data;
    },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");

   });

    $scope.selectteam = function () {
        $scope.params.team_id = $scope.team1;

    };



    projectUrl = "Form/GenerateFormId";
    apiService.getWithoutCaching(projectUrl).then(function (response) {
        $scope.params = response.data;
        //$cookieStore.put('Random_id', $scope.params.random_id);
    },
function (error) {
    if (error.status === 400)
        alert(error.data.Message);
    else
        alert("Network issue");
}
    );


    Url = "Form/GetForms/" + orgID;
    apiService.get(Url).then(function (response) {
        $scope.formList = response.data;
        $scope.formList = _.pluck($scope.formList, 'name');
    },
   function (error) {
       alert("Error " + error.state);
   });


    projectUrl = "Form/FormToTeam";
    ProjectCreate = function (param) {
        apiService.post(projectUrl, param).then(function (response) {
            var loginSession = response.data;
            alert("form submitted successfully..");
        },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    })
    };

    $scope.addNew = function (isValid) {
        $scope.showValid = true;
        if (isValid) {
            $scope.params = {
                project_id: $scope.project1,
                organization_id: $cookieStore.get('orgID'),
                user_id: $cookieStore.get('userId'),
                team_id: $scope.team1,
                Random_formId: $scope.params.random_id,
                form_name: $scope.params.form,
            };

            new ProjectCreate($scope.params).then(function (response) {
                $scope.showValid = false;
            }, function (error) {
                console.log(error);
            });

            $scope.showValid = false;

        }

    }

    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'md',
            resolve: { items: { title: "form" } }
        });
    }

    //delete code start


    $scope.openConfirmation = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'contacts/confirmnotes.tpl.html',
            backdrop: 'static',
            controller: confirmEmailController,
            size: 'md',
            resolve: { items: { title: "Email Template" } }

        });

    }

    $scope.chooseAction = function () {
        var allGridElements = $(".checkbox").toArray();
        var allCheckedElement = _.filter(allGridElements, function (o)
        { return o.checked });
        allCheckedIds = (_.pluck(allCheckedElement, 'dataset.id'));
        $cookieStore.remove('checkedIds');
        $cookieStore.put('checkedIds', allCheckedIds);

        if (allCheckedIds.length > 0) {

            if ($scope.templateAction === "no_action") {

            }
            else if ($scope.templateAction === "add_tag") {
                $state.go($scope.tagOptionPopup());
            }
            else if ($scope.templateAction === "assign_to") {
                $state.go($scope.assignToUpPopup());
            }
            else if ($scope.templateAction === "delete") {
                var templateDelete = [];
                for (var i in allCheckedIds) {
                    var template = {};
                    template.id = allCheckedIds[i];
                    template.organization_id = $cookieStore.get('orgID');
                    templateDelete.push(template);
                }
                $cookieStore.put('templateDelete', templateDelete);
                $scope.openConfirmation();
            }
        }
    }

    $scope.checkALL = function (e) {
        if ($('.check-box:checked').length > 0)
            $('.checkbox').prop('checked', true);
        else
            $('.checkbox').prop('checked', false);
    };


    $scope.check = function (e, data) {
        var allListElements = $(".checkbox").toArray();
        for (var i in allListElements) { // not all checked
            if (!allListElements[i].checked) {
                $('#checkAll').prop('checked', false);
                break;
            }
            if (i == allListElements.length - 1) // if all are checked manually
                $('#checkAll').prop('checked', true);
        }
    }

});