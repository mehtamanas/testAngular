angular.module('templates')
.controller('templateCtrl', function ($scope, $modal, apiService, $cookieStore) {
    console.log('templateCtrl');
    $scope.title = 'Dwellar Template';

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

                read: apiService.baseUrl + "Template/GetTemplateGrid/" + $cookieStore.get('orgID')

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
        } ]

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

});