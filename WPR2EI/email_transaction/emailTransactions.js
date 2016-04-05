angular.module('emailtransactions')
 .controller('emailTransactionController',
    function ($scope, $state, security, $cookieStore, apiService) {
        var orgID = $cookieStore.get('orgID');

        $scope.emailTransGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "SendEmail/GetEmailTrans/" + orgID,

                },
                pageSize: 20
            },
            groupable: true,
            sortable: true,
            selectable: "multiple",
            reorderable: true,
            resizable: true,
            height: screen.height - 370,
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
            columns: [
                {
                    field: "fromemailid",
                    title: "Form EmialId",

                    attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                }, {
                    field: "toemailid",
                    title: "To EmailId",

                    attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                }, {
                    field: "cc",
                    title: "CC",

                    attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                },{
                    field: "bcc",
                    title: "BCC",

                    attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
                }, {
                    field: "template",
                    title: "Template",

                    attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
                }, {
                    field: "subject",
                    title: "Subject",

                    attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
                },]
        };


    });
