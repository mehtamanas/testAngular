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
       
     // $scope.gridResult = [{ "approvels": [{ "approver_user_id": "7c8c37e1-a8ae-4b04-b155-780d7bf19e41", "status_a": "Approved", "status_na": null, "approvels": "Abhijeetc Rathod" }, { "approver_user_id": "e621ac4a-37ff-4652-a517-55563964181d", "status_a": null, "status_na": "Not Approved", "approvels": "Jyoti Deshpande" }], "name": "blog1", "description": "test all blogs ", "flag": null, "blog_url": "5d5db6dd-bcbc-45cd-be00-715bd3088e14/blog1", "status": "Not Approved", "approver_status": null, "publication_date": null, "blog_created_date": "2016-05-03T07:12:25.339+00:00", "approved_date": null, "activation_date": null, "user_id": "7c8c37e1-a8ae-4b04-b155-780d7bf19e41", "organization_id": "4eeba6a5-5482-4f51-958d-5e9f5fc149a2", "blog_id": "5d5db6dd-bcbc-45cd-be00-715bd3088e14", "tag_type": null, "comment": null, "Media_Element_id": "b7034bf5-7281-46ae-b23e-43b82a7860a3", "moderator_status": null, "tag_id": "827d4004-4c1c-4ed9-bc32-5b728e05edc0", "class_id": "5d5db6dd-bcbc-45cd-be00-715bd3088e14", "class_type": "Blog", "media_name": null, "media_url": null, "storage_sync_pending": false, "media_type": "Blog_Thumbnail_Image", "tag_name": "test", "background_color": "#3fcdf1", "border_color": null, "role_name": "Abhijeetc Rathod", "author": null, "approver": null, "publisher": null, "approval_user_id": null, "template_id": null, "template_name": "UAT RO", "copy": false },
        //  { "approvels": [{ "approver_user_id": "7c8c37e1-a8ae-4b04-b155-780d7bf19e41", "status_a": "Approved", "status_na": null, "approvels": "Abhijeetc Rathod" }, { "approver_user_id": "e621ac4a-37ff-4652-a517-55563964181d", "status_a": null, "status_na": "Not Approved", "approvels": "Jyoti Deshpande" }], "name": "blog2", "description": "test all blogs ", "flag": null, "blog_url": "f0cf50d1-756d-4819-8cc8-e8b8ef889f7a/blog2", "status": "Partially Approved", "approver_status": null, "publication_date": null, "blog_created_date": "2016-05-03T10:37:24.862+00:00", "approved_date": null, "activation_date": null, "user_id": "7c8c37e1-a8ae-4b04-b155-780d7bf19e41", "organization_id": "4eeba6a5-5482-4f51-958d-5e9f5fc149a2", "blog_id": "f0cf50d1-756d-4819-8cc8-e8b8ef889f7a", "tag_type": null, "comment": null, "Media_Element_id": "86e3f32c-55df-4775-bced-d220307b1fe1", "moderator_status": null, "tag_id": "827d4004-4c1c-4ed9-bc32-5b728e05edc0", "class_id": "f0cf50d1-756d-4819-8cc8-e8b8ef889f7a", "class_type": "Blog", "media_name": null, "media_url": null, "storage_sync_pending": false, "media_type": "Blog_Thumbnail_Image", "tag_name": "test", "background_color": "#3fcdf1", "border_color": null, "role_name": "Abhijeetc Rathod", "author": null, "approver": null, "publisher": null, "approval_user_id": null, "template_id": null, "template_name": "UAT RO", "copy": false },
         // { "approvels": [{ "approver_user_id": "7c8c37e1-a8ae-4b04-b155-780d7bf19e41", "status_a": "Approved", "status_na": null, "approvels": "Abhijeetc Rathod" }, { "approver_user_id": "e621ac4a-37ff-4652-a517-55563964181d", "status_a": "Approved", "status_na":  null, "approvels": "Jyoti Deshpande" }], "name": "blog3", "description": "test all blogs ", "flag": null, "blog_url": "5d133ff6-5dc6-45df-93c7-9283ceeedb9f/blog3", "status": "Not Approved", "approver_status": null, "publication_date": null, "blog_created_date": "2016-05-03T12:08:02.582+00:00", "approved_date": null, "activation_date": null, "user_id": "7c8c37e1-a8ae-4b04-b155-780d7bf19e41", "organization_id": "4eeba6a5-5482-4f51-958d-5e9f5fc149a2", "blog_id": "5d133ff6-5dc6-45df-93c7-9283ceeedb9f", "tag_type": null, "comment": null, "Media_Element_id": "45cf9cea-a7d3-4a2e-bb80-81b265003ede", "moderator_status": null, "tag_id": "827d4004-4c1c-4ed9-bc32-5b728e05edc0", "class_id": "5d133ff6-5dc6-45df-93c7-9283ceeedb9f", "class_type": "Blog", "media_name": null, "media_url": null, "storage_sync_pending": false, "media_type": "Blog_Thumbnail_Image", "tag_name": "test", "background_color": "#3fcdf1", "border_color": null, "role_name": "Abhijeetc Rathod", "author": null, "approver": null, "publisher": null, "approval_user_id": null, "template_id": null, "template_name": "UAT RO", "copy": false }];
      
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
                        //data = $scope.gridResult;
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
                template: '<a ui-sref="app.editBlog({id:dataItem.blog_id})" href="">#=name#</a>',
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

             },{
                field: "approvels",
               //template: '<div ng-repeat="approver in dataItem.approvels"><span>{{approver.approvels}}</span><span ng-class="approver.status_a==\'Approved\' ? \'cls_Approved\': approver.status_na==\'Not Approved\' ? \'cls_NotApproved\': \'cls_AnyStatus\'"><div ng-show="approver.status_a==\'Approved\'">{{approver.status_a}}</div><div ng-show="approver.status_a!=\'Approved\'">{{approver.status_na}}</div></span><br/></div>',
                template: '<div ng-repeat="approver in dataItem.approvels"><span>{{approver.approvels}}</span><span ng-class="approver.status_a==\'Approved\' ? \'cls_Approved\': approver.status_na==\'Not Approved\' ? \'cls_NotApproved\': \'cls_AnyStatus\'"><div ng-show="approver.status_a==\'Approved\'">{{approver.status_a}}</div><div ng-show="approver.status_a!=\'Approved\'">{{approver.status_na}}</div></span><br/></div>',
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

        //$scope.myBlogGridChange = function (dataItem) {
        //    window.sessionStorage.selectedBlogID = dataItem.blog_id;
        //    $scope.openEditBlogPopup(dataItem.blog_id);
        //    //$scope.openEditBlogPopup();
        //};
       

        $scope.$on('REFRESH', function (event, args) {
            if (args == 'BlogsPostGrid') {
                $('.k-i-refresh').trigger("click");
            }
        });

        //$scope.openAddBlogPopup = function () {
        //    var modalInstance = $modal.open({
        //        animation: true,
        //        templateUrl: 'blogs/create/blogCrate.html',
        //        backdrop: 'static',
        //        controller: BlogPostPopUpCtrl,
        //        size: 'lg'
        //    });
        //};

        //$scope.openEditBlogPopup = function (blog_id) {
          
        //    window.sessionStorage.selectedBlogID = blog_id;
        //    var modalInstance = $modal.open({
        //        animation: true,
        //        templateUrl: 'blogs/edit/blogEdit.html',
        //        backdrop: 'static',
        //        controller: BlogPostEditCtrl,
        //        size: 'lg'
        //    });
        //};

        
        $scope.openAddBlogPopup = function () {
            $state.go('app.addBlog');
        };

       
        $scope.openEditBlogPopup = function () {
            $state.go('app.editBlog');
        };
    });

