/**
 * Created by karuna on 24/10/15.
 */
angular.module('contacts')
.controller('ContactDetailControllerdm', function ($scope, $state, security, $cookieStore, apiService, $window, $modal, $rootScope)
    {
        console.log('ContactDetailControllerdm');
        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

     
        
    ////Audit log start															
    //    $scope.params =
    //        {
    //            device_os: $cookieStore.get('Device_os'),
    //            device_type: $cookieStore.get('Device'),
    //            device_mac_id: "34:#$::43:434:34:45",
    //            module_id: "Contact",
    //            action_id: "Contact View",
    //            details: "ContactDetailView",
    //            application: "angular",
    //            browser: $cookieStore.get('browser'),
    //            ip_address: $cookieStore.get('IP_Address'),
    //            location: $cookieStore.get('Location'),
    //            organization_id: $cookieStore.get('orgID'),
    //            User_ID: $cookieStore.get('userId')
    //        };

    //    AuditCreate = function (param) {
    //        apiService.post("AuditLog/Create", param).then(function (response) {
    //            var loginSession = response.data;
    //        },
    //   function (error) {

    //   });
    //    };
    //    AuditCreate($scope.params);

    ////end
        contactUrl = "Contact/GetContactSummary/" + $scope.seletedCustomerId;//f2294ca0-0fee-4c16-86af-0483a5718991";
        apiService.get(contactUrl).then(function (response) {
            $scope.main = response.data;
            $scope.image = $scope.main[0];

        },
   function (error) {
       console.log("Error " + error.state);
   }
        );


      
      
        $scope.DocumentGrid = {
            dataSource:
                {
                    type: "json",
                    transport: {
                    read: "http://dw-webservices-dev2.azurewebsites.net/Contact/GetDocument/" + $scope.seletedCustomerId
                },
                schema: {
                    model: {
                        fields: {
                            Document_Name: { type: "string" },
                            Document_Category: { type: "string" },
                            Date_Modified: { type: "date" },
                            Attachment_URL: { type: "string" },
                            Attachment_Type: { type: "string" }
                        }
                    }
                },
                pageSize: 5
            },
            sortable: true,
            pageable: true,
            groupable: true,
            filterable: true,
            columns: [{
                field: "Document_Name",
                title: "Document Name",
                width: "150px",
               
            }, {
                field: "Document_Category",
                title: "Category",
                width: "150px",
              
            }, {
                field: "Date_Modified",
                title: "Last Modified ",
                width: "120px",
                format: '{0:dd/MM/yyyy}',
               
            }, {
                template: "<div><a href='#= Attachment_URL#'>" +
                "#if(Attachment_Type !== null) { #<img class='fileType' src='assets/images/fileTypes/#=Attachment_Type#.ico' alt='Unknown file type'/>#}" +
                "else{# <img class='fileType' src='assets/images/fileTypes/unknown.ico' alt='Unknown file type'/> #}#" +
                "</a></div>",
                title: "Attachment",
                width: "80px",
               
            }]
        };

        $scope.PropertyListGrid = {
            dataSource: {
                type: "json",
                transport: {
                    //read: "http://dw-webservices-dev2.azurewebsites.net/PersonContactDevice/GetById?ID=" + orgID
                    //read: "http://dw-webservices-dev2.azurewebsites.net//PropertyListing/GetByID/" + $scope.seletedCustomerId
                    read: "http://dw-webservices-dev2.azurewebsites.net/PropertyListing/GetPropertyMediaByContact/" + $scope.seletedCustomerId

                },
                pageSize: 5,

                schema: {
                    model: {
                        fields: {

                            date: { type: "date" }



                        }
                    }
                }

                //group: {
                //    field: 'sport'
                //}
            },
            sortable: true,
            pageable: true,
            groupable: true,
            filterable: true,
            columns: [{
                field: "Property_Name",
                title: "Property Name",
             
                width: "120px"
            }, {
                field: "Area",
                title: "Area",
                width: "120px",
              
            }, {
                field: "status",
                title: "Status",
                width: "120px",
                
                field: "Image_Url",
                title: "Image Url",
                width: "120px",
              
            },
                {
                    field: "Date",
                    title: "Date",
                    width: "120px",
                    format: '{0:dd/MM/yyyy}',
                    
                }]

        };

        //$scope.PaymentGrid = {
        //    dataSource: {

        //        type: "json",
        //        transport: {
        //            read: "http://dw-webservices-dev2.azurewebsites.net/Contact/GetPayment/" + $scope.seletedCustomerId

        //        },

        //        pageSize: 5,

        //        schema: {
        //            model: {
        //                fields: {

        //                    duedate: { type: "date" },
        //                    datepaid: { type: "date" }


        //                }
        //            }
        //        }

        //        //group: {
        //        //    field: 'sport'
        //        //}
        //    },

        //    sortable: true,
        //    pageable: true,
        //    groupable: true,
        //    filterable: true,
        //    columns: [{
        //        field: "amount",
        //        title: "Amount",
        //        width: "120px",

        //    }, {
        //        field: "payment_type",
        //        title: "Type",
        //        width: "120px",

        //    }, {
        //        field: "payment_status",
        //        title: "Status",
        //        width: "120px",

        //    }, {
        //        field: "duedate",
        //        title: "Due Required",
        //        width: "120px",
        //        format: '{0:dd/MM/yyyy}',

        //    },
        //    {
        //        field: "datepaid",
        //        title: "Date Paid",
        //        width: "120px",
        //        format: '{0:dd/MM/yyyy}',

        //    }]
    ////////////};
        alert($scope.seletedCustomerId);
        $scope.PaymentGrid = {
            dataSource: {

                type: "json",
                transport: {
                    read: "http://dw-webservices-dev2.azurewebsites.net/Payment/GetByPaymentId?contact_id=" + $scope.seletedCustomerId

                },

                pageSize: 5,

                schema: {
                    model: {
                        fields: {

                            duedate: { type: "date" },
                            datepaid: { type: "date" }


                        }
                    }
                }

            },

            sortable: true,
            pageable: true,
            groupable: true,
            filterable: true,
            columns: [{
                field: "amount",
                title: "Amount",
                width: "120px",

            }, {
                field: "payment_type_id",
                title: "Type",
                width: "120px",

            }, {
                field: "payment_status",
                title: "Status",
                width: "120px",

            }, {
                field: "duedate",
                title: "Due Required",
                width: "120px",
                format: '{0:dd/MM/yyyy}',

            },
            {
                field: "datepaid",
                title: "Date Paid",
                width: "120px",
                format: '{0:dd/MM/yyyy}',

            }]
        };
       
        $scope.TaskGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: "http://dw-webservices-dev2.azurewebsites.net/ToDoItem/GetMultipleTaskById/" + $scope.seletedCustomerId

                },
                pageSize: 5,

                schema: {
                    model: {
                        fields: {

                            created_date_time: { type: "date" },
                            start_date_time: { type: "date" },
                            end_date_time: { type: "date" }



                        }
                    }
                }


                //group: {
                //    field: 'sport'
                //}
            },
            sortable: true,
            pageable: true,
            groupable: true,
            filterable: true,
            columns: [{
                field: "name",
                title: "Name",
                width: "120px",

            }, {
                field: "priority",
                title: "Priority",
                width: "120px",
                format: '{0:dd/MM/yyyy}',

            }, {
                field: "description",
                title: "Description",
                width: "120px",
                format: '{0:dd/MM/yyyy}',

            },
            {
                field: "summary",
                title: "Summary",
                width: "120px",
                format: '{0:dd/MM/yyyy}',

            },
            {
                field: "text",
                title: "Text",
                width: "120px",
                format: '{0:dd/MM/yyyy}',

            },
          ]
        };

        $scope.engagementGrid = {
            dataSource: {
                pageSize: 20,
                type: "json",
                transport: {
                    read: "http://dw-webservices-dev2.azurewebsites.net/Contact/GetEngagement/" + $scope.seletedCustomerId
                },
                schema: {
                    model: {
                        fields: {
                            Message: { type: "string" },
                            via_type: { type: "string" },
                            via_image: { type: "string" },
                            date: { type: "date" }
                        }
                    }
                }
            },
            groupable: true,
            sortable: true,
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: [
                {
                    template: "<div class='pull_right'><img src='#= via_image#' /></div><p class='pad_title'>#= via_type#</p>",
                    title: "VIA",
                    width: "70px",

                },
                {
                    field: "Message",
                    title: "Messages",
                    width: "350px",

                },
                {
                    field: "date",
                    title: "Date",
                    width: "50px",
                    format: '{0:dd/MM/yyyy}',

                }
            ]
        };

        $scope.NotesGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: "http://dw-webservices-dev2.azurewebsites.net/Notes/GetByID/" + $scope.seletedCustomerId

                },
                pageSize: 5

                //group: {
                //    field: 'sport'
                //}
            },
            sortable: true,
            pageable: true,
            groupable: true,
            filterable: true,
            columns: [{
                field: "class_type",
                title: "Type",
                width: "120px",

            }, {
                field: "text",
                title: "TEXT",
                width: "120px",

            }, ]
        };

        $scope.QuotesGrid = {
            dataSource: {
                type: "json",
                transport: {
                    ////  read: "http://dw-webservices-dev2.azurewebsites.net/PersonContactDevice/GetById?ID=" + orgID
                    //  // read:" https://dw-webservices-dev2.azurewebsites.net/Contact/GetQuote/4a0ef2c4-09cc-46ba-abc3-8970f5eb6ee8"
                    //  read: " https://dw-webservices-dev2.azurewebsites.net/Contact/GetQuote/4a0ef2c4-09cc-46ba-abc3-8970f5eb6ee8"
                    read: "http://dw-webservices-dev2.azurewebsites.net/Contact/GetQuote/" + $scope.seletedCustomerId
                },
                pageSize: 5,

                schema: {
                    model: {
                        fields: {

                            date: { type: "date" },



                        }
                    }
                }

                //group: {
                //    field: 'sport'
                //}
            },
            sortable: true,
            pageable: true,
            groupable: true,
            filterable: true,
            columns: [{
                field: "amount",
                title: "amount",
                width: "50px",
               
            }, {
                field: "description",
                title: "Description",
                width: "50px",
               
            }, {
                field: "date",
                title: "Date",
                width: "50px",
                format: '{0:dd/MM/yyyy}',
               
            }, {
                field: "file_attachment_url",
                title: "File Attachment Url",
                width: "50px",
               
            }]
        };

        $scope.AssignmentToGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: "http://dw-webservices-dev2.azurewebsites.net/Contact/GetAssignTo/" + $scope.seletedCustomerId
                    // read:" https://dw-webservices-dev2.azurewebsites.net/Contact/GetQuote/4a0ef2c4-09cc-46ba-abc3-8970f5eb6ee8"
                },
                pageSize: 5

                //group: {
                //    field: 'sport'
                //}
            },
            sortable: true,
            pageable: true,
            groupable: true,
            filterable: true,
            columns: [{
                field: "id",
                title: " Contact",
                width: "120px",
                attributes: {
                    "class": "UseHand",

                }
            }, {
                field: "project_id",
                title: "Project ",
                width: "120px",
                
            }, {
                field: "date",
                title: "User",
                width: "120px",
              
               
            }]
        };

    //popup functionality start
        $scope.openEditContactPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/edit_contact.tpl.html',
                backdrop: 'static',

                controller: EditContactPopUpController,
                size: 'md'
            });
        };

    //end

        $scope.openNewPaymentPopup = function () {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/addpayment.tpl.html',
                backdrop: 'static',
                controller: PaymentUpController,
                size: 'md'

            });

        };

        $scope.openAddNewTask = function () {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/add_new_task.tpl.html',
                backdrop: 'static',
                controller: AddNewTaskController,
                size: 'md'

            });

        };


    });