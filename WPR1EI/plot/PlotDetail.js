angular.module('plot')
.controller('PlotDetailController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope) {
        console.log('PlotDetailController');
        $rootScope.title = 'Dwellar./Teams';



        //Audit log start															
        $scope.params =
            {
                device_os: $cookieStore.get('Device_os'),
                device_type: $cookieStore.get('Device'),
                device_mac_id: "34:#$::43:434:34:45",
                module_id: "Contact",
                action_id: "Contact View",
                details: "PlotView",
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


        $scope.InventoryGrid = {
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
            }
        };


        //ankit
        apiService.get("Inventory/GetMultiplePlotInventory").then(function (response) {
            $scope.dynamicData = response.data;
        

        $scope.gridData = new kendo.data.DataSource({
            data: $scope.dynamicData,
            schema: {
                model: {
                    id: "id",
                    fields: {
                        Plotno: {
                            type: "string",
                            validation: {
                                required: true
                            }
                        },
                        Areasqft: {
                            type: "string",
                            validation: {
                                required: true
                            }
                        },
                        pricesqft: {
                            type: "string",
                            validation: {
                                required: true
                            }
                        },
                        status: {
                            type: "string",
                            validation: {
                                required: true
                            }
                        }
                    }
                }
            }
        });

        $scope.gridColumns = [{
                                   //template: "<img height='40px' width='40px' src='assets/images/image-2.jpg' />" +
                                   //"<span style='padding-left:10px' class='customer-name'>#: first_name #</span>",
                                   field: "Plotno",
                                   title: " Plot No",
                                   width: "120px",
                                   attributes: {
                                       "class": "UseHand",

                                   }
                               }, {
                                   field: "Areasqft",
                                   title: "Area/Sqft",
                                   width: "120px",
                                   attributes: {
                                       "class": "UseHand",

                                   }

                               }, {
                                   field: "pricesqft",
                                   title: "price/Sqft",
                                   width: "120px",
                                   attributes: {
                                       "class": "UseHand",

                                   }

                               }, {
                                   field: "status",
                                   title: "Status",
                                   width: "120px",
                                   attributes: {
                                       "class": "UseHand",

                                   }
                               }, { command: ["edit", "destroy"], title: "&nbsp;", width: "250px" }],
       


       

        $scope.editableOptions = "inline";
        $scope.saveFunction = function (e) {
            post = [];
            var postData = {
                id: e.model.id,
                Plotno: e.model.Plotno,
                Areasqft:e.model.Areasqft,
                pricesqft:e.model.pricesqft,
                status:e.model.status

            };
            post.push(postData);
            apiService.post("Inventory/Edit_MultiplePlotInventory", post).then(function (response) {
                var loginSession = response.data;
               // alert("plot edit done");
            },
          function (error) {

          });

        }


        setTimeout(function () {
            $scope.gridData.data($scope.dynamicData);
        }, 3000);


        },
        
        function (error) {
            console.log("Error " + error.state);
        }
            );


        //ankit
        $scope.deleteFunction = function (e) {
            console.log(e);

            apiService.remove("Inventory/Delete/" + e.model.id).then(function (response) {
                var loginSession = response.data;
                alert("delete sucessful");
            },
         function (error) {

         });
        }


        //end

   
        //$scope.InventoryGrid = {
        //    dataSource: {
        //        type: "json",
        //        transport: {
        //            read: "https://dw-webservices-uat.azurewebsites.net/Inventory/GetMultiplePlotInventory"
        //        },
        //        update: {
        //            url: "https://dw-webservices-uat.azurewebsites.net/Inventory/Edit_MultiplePlotInventory",
        //            dataType: "json"
        //        },
        //        pageSize: 5,

               
        //        parameterMap: function (options, operation) {
        //            if (operation !== "read" && options.models) {
        //                return { models: kendo.stringify(options.models) };
        //            }
        //        }


        //        //group: {
        //        //    field: 'sport'
        //        //}
        //    },
            

        //    groupable: true,
        //    sortable: true,
        //    selectable: "multiple",
        //    reorderable: true,
        //    resizable: true,
        //    filterable: true,
        //    pageable: {
        //        refresh: true,
        //        pageSizes: true,
        //        buttonCount: 5
        //    },
        //    columns: [
        //                   {
        //                       //template: "<img height='40px' width='40px' src='assets/images/image-2.jpg' />" +
        //                       //"<span style='padding-left:10px' class='customer-name'>#: first_name #</span>",
        //                       field: "Plotno",
        //                       title: " Plot No",
        //                       width: "120px",
        //                       attributes: {
        //                           "class": "UseHand",

        //                       }
        //                   }, {
        //                       field: "Areasqft",
        //                       title: "Area/Sqft",
        //                       width: "120px",
        //                       attributes: {
        //                           "class": "UseHand",

        //                       }

        //                   }, {
        //                       field: "pricesqft",
        //                       title: "price/Sqft",
        //                       width: "120px",
        //                       attributes: {
        //                           "class": "UseHand",

        //                       }

        //                   }, {
        //                       field: "status",
        //                       title: "Status",
        //                       width: "120px",
        //                       attributes: {
        //                           "class": "UseHand",

        //                       }

        //                   }, { command: ["edit", "destroy"], title: "&nbsp;", width: "250px" }],
        //    editable: "inline",
        //};



        //$scope.saveFunction = function (e) {
        //    console.log("somehting was modified", e);
        //    alert("update successful");
        //}

        //(document).ready(function () {

        //    dataSource = new kendo.data.DataSource({
        //        transport: {
        //            read: {
        //                read: "https://dw-webservices-uat.azurewebsites.net/Inventory/GetMultiplePlotInventory",
        //                dataType: "json"
        //            },
        //            update: {
        //                url: "https://dw-webservices-uat.azurewebsites.net/Inventory/Edit_MultiplePlotInventory",
        //                dataType: "jsonp"
        //            },

        //            parameterMap: function (options, operation) {
        //                if (operation !== "read" && options.models) {
        //                    return { models: kendo.stringify(options.models) };
        //                }
        //            }
        //        },
        //        batch: true,
        //        pageSize: 20,
        //        schema: {
        //            model: {

        //                fields: {

        //                    Plotno: { type: "number", validation: { required: true, min: 1 } },
        //                    Areasqft: { type: "number", validation: { required: true, min: 1 } },
        //                    pricesqft: { type: "boolean" },
        //                    status: { type: "number", validation: { min: 0, required: true } }
        //                }
        //            }
        //        }
        //    })
        //});


        // Kendo Grid on change
        $scope.myGridChange = function (dataItem) {
            // dataItem will contain the row that was selected
            window.sessionStorage.selectedCustomerID = dataItem.id;
            $state.go('app.teamdetail');

        };

        $scope.filterNow = function () {
            if ($scope.lastNameFilter)
                applyFilter('first_name', $scope.lastNameFilter);
            else
                clearFilters();

        };



    });