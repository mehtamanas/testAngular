angular.module('testresult')
 .controller('testresultController',
    function ($scope, $state, security, $cookieStore, apiService) {

      
        $scope.testResultGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "Test/GetTestResult/"

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
                   field: "test_case",
                   title: "Test Case",

                   attributes:
                    {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }
               }, {
                   field: "test_module",
                   title: "Test Module",

                   attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
               }, {
                   field: "expected_result",
                   title: "Expected Result",

                   attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
               }, {
                   field: "actual_result",
                   title: "Actual Result",

                   attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
               },
                {
                    field: "test_result",
                    title: "Test Result",

                    attributes:
                     {
                         "class": "UseHand",
                         "style": "text-align:center"
                     }
                },]
        };

       
    });
