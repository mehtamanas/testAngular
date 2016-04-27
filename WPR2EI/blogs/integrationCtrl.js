angular.module('blogs')
.controller('IntegrationController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope, teamService, $window) {

        var authRights = ($cookieStore.get('UserRole'));
        $scope.isContentWriter = (_.find(authRights, function (o) { return o == 'Content Writer'; })) == 'Content Writer' ? true : false
        $scope.isContentApprover = (_.find(authRights, function (o) { return o == 'Content Approver'; })) == 'Content Approver' ? true : false
        $scope.isContentPublisher = (_.find(authRights, function (o) { return o == 'Content Publisher'; })) == 'Content Publisher' ? true : false

        console.log('IntegrationController');
        $rootScope.title = 'Dwellar - Blog';
     
        var userID = $cookieStore.get('userId');
      $scope.loggedUserRole = $cookieStore.get('loggedUserRole');
        //loggedUserFlag = $cookieStore.get('loggedUserFlag');
       
        //Audit log start															
        $scope.params =
            {
                device_os: $cookieStore.get('Device_os'),
                device_type: $cookieStore.get('Device'),
                device_mac_id: "34:#$::43:434:34:45",
                module_id: "Blogs",
                action_id: "Contact View",
                details: "ContactView",
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

       });
        };
        AuditCreate($scope.params);

        //end

        // Kendo code
        $scope.BlogsPostGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: function (options) {
                        apiService.getWithoutCaching ("Blogs/GetGrid/" + userID).then (function(response){
                            data = response.data;
                           // var loggedUserFlag = (_.findWhere(data, { user_id: $cookieStore.get('userId') })).flag
                           // $cookieStore.put('loggedUserFlag', loggedUserFlag.trim());
                            options.success(data);
                        },
                          function (error) {
                              options.error(error);
                          })
                    }
                },
                pageSize: 20,

                schema: {
                    model: {
                        fields: {
                            blog_created_date: { type: "date" },
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
                template: "<div class='user-photo_1'style='margin-left:44%'><img class='image2' src='#= media_url #'/></div>" +
                    "<span style='padding-left:10px' class='customer-name'> </span>",            
                title: "Picture",
                width: "120px",
                attributes:
                {
                    "class": "UseHand",
                    "style":"text-align:center",
                }
             }, {
                field: "name",
               // template: '<a ui-sref="app.edit_task({id:dataItem.task_id})" href="">#=name#</a>',
                title: "Blog Title",
                width: "120px",
                attributes:
                 {
                     "style": "text-align:center"
                 }

             }, {
                 field: "tag_name",
                 title: "Tags",
                 width: "120px",
                 attributes:
                  {
                      "style": "text-align:center"
                  }

             }, {
                 field: "template_name",
                 title: "Template Name",
                 width: "120px",
                 attributes:
                  {
                      "style": "text-align:center"
                  }

             }, {
                field: "description",
                title: "Description",
                width: "120px",
                attributes:
             {
                 "style": "text-align:center"
             }
             }, {
                 field: "blog_created_date",
                 title: "Created Date",
                 format: '{0:dd/MM/yyyy}',
                 width: "120px",
                 attributes: {
                     "class": "UseHand",
                     "style": "text-align:center"
                 }
             }, {
                 field: "status",
                 //template: '<a href="" ng-click="openEditBlogPopup(dataItem.blog_id>#=status#</a>',
                //template: '<a class="contact_name" id="publishId" ng-click="openEditBlogPopup(dataItem.blog_id)">#=status#</a>',
               title: "Status",
               width: "120px",
               attributes:
             {
                 "style": "text-align:center"
             }

             },{
                 field: "moderator_status",                
                 title: "Moderator Status",
                 width: "120px",
                 attributes:
               {
                   "style": "text-align:center"
               }

             },
             //{
             //    template: '<button class="btn btn-primary" id="publishId" ng-click="openEditBlogPopup(dataItem.blog_id)">COPY</button>',
             //    width: "120px",
             //    attributes:
             //  {
             //      "style": "text-align:center"
             //  }

             //    },
             ]
        };


     
      
      

        $scope.filterNow = function () {
            if ($scope.lastNameFilter)
                applyFilter('first_name', $scope.lastNameFilter);
            else
                clearFilters();

        };

        function applyFilter(filterField, filterValue) {

            // get the kendoGrid element.
            var gridData = $("#peopleGrid").data("kendoGrid");

            // get currently applied filters from the Grid.
            var currFilterObj = gridData.dataSource.filter();

            // get current set of filters, which is supposed to be array.
            // if the oject we obtained above is null/undefined, set this to an empty array
            var currentFilters = currFilterObj ? currFilterObj.filters : [];

            // iterate over current filters array. if a filter for "filterField" is already
            // defined, remove it from the array
            // once an entry is removed, we stop looking at the rest of the array.
            if (currentFilters && currentFilters.length > 0) {
                for (var i = 0; i < currentFilters.length; i++) {
                    if (currentFilters[i].field == filterField) {
                        currentFilters.splice(i, 1);
                        break;
                    }
                }
            }

            // if "filterValue" is "0", meaning "-- select --" option is selected, we don't
            // do any further processing. That will be equivalent of removing the filter.
            // if a filterValue is selected, we add a new object to the currentFilters array.
            if (filterValue != "0") {
                currentFilters.push({
                    field: filterField,
                    operator: "eq",
                    value: filterValue
                });
            }

            // finally, the currentFilters array is applied back to the Grid, using "and" logic.
            gridData.dataSource.filter({
                logic: "and",
                filters: currentFilters
            });

        }
    
        function clearFilters() {
            var gridData = $("#peopleGrid").data("kendoGrid");
            gridData.dataSource.filter({});
        }

        // Kendo Grid on change

        $scope.myBlogGridChange = function (dataItem) {
            window.sessionStorage.selectedBlogID = dataItem.blog_id;
            $scope.openEditBlogPopup(dataItem.blog_id);
            //$scope.openEditBlogPopup();
        };
       

        $scope.$on('REFRESH', function (event, args) {
            if (args == 'BlogsPostGrid') {
                $('.k-i-refresh').trigger("click");
            }
        });

        $scope.openAddBlogPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'blogs/create/blogCrate.html',
                backdrop: 'static',
                controller: BlogPostPopUpCtrl,
                size: 'lg'
            });
        };

        $scope.openEditBlogPopup = function (blog_id) {
          
            window.sessionStorage.selectedBlogID = blog_id;
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'blogs/edit/blogEdit.html',
                backdrop: 'static',
                controller: BlogPostEditCtrl,
                size: 'lg'
            });
        };
        //$scope.openEditBlogPopup = function () {

        //    //window.sessionStorage.selectedBlogID = blog_id;
        //    var modalInstance = $modal.open({
        //        animation: true,
        //        templateUrl: 'blogs/edit/blogEdit.html',
        //        backdrop: 'static',
        //        controller: BlogPostEditCtrl,
        //        size: 'lg'
        //    });
        //};
    });

