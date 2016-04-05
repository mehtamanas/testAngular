angular.module('property')
.controller('brokerPropertyListController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope) {
        console.log('brokerPropertyListController');

        var orgID = $cookieStore.get('orgID');
        var userId = $cookieStore.get('userId');

        $scope.PropertyListGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "ToDoItem/GetTaskByRole?id=" + userId
                },
                pageSize: 20,

                schema: {
                    model: {
                        fields: {
                            due_date: { type: "date" },
                            start_date_time: { type: "date" },
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
            height: screen.height - 370,
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
                field: "name",
                template: '<a ui-sref="app.edit_task({id:dataItem.task_id})" href="" class="contact_name">#=name#</a>',
                title: "Task Name",
                width: "120px",
                attributes:
             {
                 "style": "text-align:center"
             }

            }, {
                field: "Project_Name",
                title: "Project",
                width: "120px",
                attributes:
             {
                 "style": "text-align:center"
             }

            }, {
                field: "Contact_Name",
                title: "Contact",
                width: "120px",
                attributes:
             {
                 "style": "text-align:center"
             }

            }, {
                field: "user_name",
                title: "Assign To",
                width: "120px",
                attributes:
             {
                 "style": "text-align:center"
             }

            }, {
                field: "company",
                title: "Company",
                width: "120px",
                attributes:
             {
                 "style": "text-align:center"
             }

            }, {
                field: "priority",
                title: "Priority",
                width: "120px",
                attributes:
              {
                  "style": "text-align:center"
              }

            }, {
                field: "start_date_time",
                title: "Start Date",
                width: "120px",
                format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                attributes:
              {
                  "style": "text-align:center"
              }

            }, {
                field: "due_date",
                title: "Due Date",
                width: "120px",
                format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                attributes:
              {
                  "style": "text-align:center"
              }

            },
           {
               field: "text",
               title: "Notes",
               width: "120px",
               attributes:
             {
                 "style": "text-align:center"
             }


           }, {
               field: "status",
               template: '<span id="#= status #"></span>',
               title: "Status",
               width: "120px",
               attributes:
             {
                 "style": "text-align:center"
             }

           }, ]
        };

    });