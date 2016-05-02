/**
 * Created by karuna on 24/10/15.
 */
angular.module('contacts')

    .controller('ContactDetailController', ['$scope', function ($scope, $cookieStore, $window, apiService) {
        // alert('hii(project/detail)');
        //$rootScope.title = 'Dwellar/ContacttDetails';
        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
        // $scope.seletedCustomerId = '73190040-23c0-44c0-82ba-25c2c46b9fd0';
       





        $scope.engagementGrid =
        {
            dataSource: {
                pageSize: 20,
                type: "json",
                transport: {
                    read: apiService.baseUrl +"Contact/GetEngagement/" + $scope.seletedCustomerId
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
                    attributes:
            {
                "class": "UseHand",
                "style": "text-align:center"
            }
                },
                {
                    field: "Message",
                    title: "Messages",
                    width: "350px",
                    attributes:
                                {
                                    "class": "UseHand",
                                    "style": "text-align:center"
                                }
                },
                {
                    field: "date",
                    title: "Date",
                    width: "50px",
                    format: '{0:dd/MM/yyyy}',
                    attributes:
            {
                "class": "UseHand",
                "style": "text-align:center"
            }
                }
            ]
        };



        $scope.PaymentGrid = {
            dataSource: {

                type: "json",
                transport: {
                    read: apiService.baseUrl +"Contact/GetPayment/" + $scope.seletedCustomerId

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
                title: "Amount",
                width: "120px",
                attributes:
                               {
                                   "class": "UseHand",
                                   "style": "text-align:right"
                               }
            }, {
                field: "payment_type",
                title: "Type",
                width: "120px",
                attributes:
                               {
                                   "class": "UseHand",
                                   "style": "text-align:center"
                               }
            }, {
                field: "payment_status",
                title: "Status",
                width: "120px",
                attributes:
                               {
                                   "class": "UseHand",
                                   "style": "text-align:center"
                               }
            }, {
                field: "duedate",
                title: "Due Required",
                width: "120px",
                format: '{0:dd/MM/yyyy}',
                attributes:
                               {
                                   "class": "UseHand",
                                   "style": "text-align:right"
                               }
            },
            {
                field: "datepaid",
                title: "Date Paid",
                width: "120px",
                format: '{0:dd/MM/yyyy}',
                attributes:
                               {
                                   "class": "UseHand",
                                   "style": "text-align:right"
                               }
            }]
        };


        $scope.PropertyListGrid = {
            dataSource: {
                type: "json",
                transport: {
                    //read: apiService.baseUrl +"PersonContactDevice/GetById?ID=" + orgID
                    //read: apiService.baseUrl +"/PropertyListing/GetByID/" + $scope.seletedCustomerId
                    read: apiService.baseUrl +"PropertyListing/GetPropertyMediaByContact/" + $scope.seletedCustomerId

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
                width: "120px",
                attributes:
                              {
                                  "class": "UseHand",
                                  "style": "text-align:center"
                              }
            }, {
                field: "Area",
                title: "Area",
                width: "120px",
                attributes:
                              {
                                  "class": "UseHand",
                                  "style": "text-align:right"
                              }
            }, {
                field: "status",
                title: "Status",
                width: "120px",
                attributes:
                              {
                                  "class": "UseHand",
                                  "style": "text-align:center"
                              }
            }, {
                field: "Image_Url",
                title: "Image Url",
                width: "120px",
                attributes:
                              {
                                  "class": "UseHand",
                                  "style": "text-align:center"
                              }
            },
                {
                    field: "date",
                    title: "Date",
                    width: "120px",
                    format: '{0:dd/MM/yyyy}',
                    attributes:
                              {
                                  "class": "UseHand",
                                  "style": "text-align:right"
                              }
                }]

        };

        $scope.NotesGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl +"Notes/GetByID/" + $scope.seletedCustomerId

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
                title: "Class Type",
                width: "120px",
                attributes:
                              {
                                  "class": "UseHand",
                                  "style": "text-align:center"
                              }
            }, {
                field: "text",
                title: "Text",
                width: "120px",
                attributes:
                              {
                                  "class": "UseHand",
                                  "style": "text-align:center"
                              }
            }, ]
        };



        $scope.QuotesGrid = {
            dataSource: {
                type: "json",
                transport: {
                   
                    read: apiService.baseUrl +"Contact/GetQuote/" + $scope.seletedCustomerId
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
                title: "Amount",
                width: "50px",
                attributes:
                              {
                                  "class": "UseHand",
                                  "style": "text-align:right"
                              }
            }, {
                field: "description",
                title: "Description",
                width: "50px",
                attributes:
                              {
                                  "class": "UseHand",
                                  "style": "text-align:center"
                              }
            }, {
                field: "date",
                title: "Date",
                width: "50px",
                format: '{0:dd/MM/yyyy}',
                attributes:
                              {
                                  "class": "UseHand",
                                  "style": "text-align:right"
                              }
            }, {
                field: "file_attachment_url",
                title: "File Aattachment Url",
                width: "50px",
                attributes:
                              {
                                  "class": "UseHand",
                                  "style": "text-align:center"
                              }
            }]
        };


        $scope.TaskGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl +"ToDoItem/GetByID/" + $scope.seletedCustomerId

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
                attributes:
                              {
                                  "class": "UseHand",
                                  "style": "text-align:center"
                              }
            }, {
                field: "description",
                title: "Description",
                width: "120px",
                format: '{0:dd/MM/yyyy}',
                attributes:
                              {
                                  "class": "UseHand",
                                  "style": "text-align:center"
                              }


            }, {
                field: "created_date_time",
                title: "Created Date",
                width: "120px",
                format: '{0:dd/MM/yyyy}',
                attributes:
                              {
                                  "class": "UseHand",
                                  "style": "text-align:right"
                              }
            },
            {
                field: "start_date_time",
                title: "Start Date",
                width: "120px",
                format: '{0:dd/MM/yyyy}',
                attributes:
                              {
                                  "class": "UseHand",
                                  "style": "text-align:right"
                              }
            },
            {
                field: "end_date_time",
                title: "End Date",
                width: "120px",
                format: '{0:dd/MM/yyyy}',
                attributes:
                              {
                                  "class": "UseHand",
                                  "style": "text-align:right"
                              }
            },
            {
                field: "add_reminder",
                title: "Add Reminder",
                width: "120px",
                attributes:
                              {
                                  "class": "UseHand",
                                  "style": "text-align:center"
                              }
            }]
        };

        $scope.AssignmentToGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl +"Contact/GetAssignTo/" + $scope.seletedCustomerId
                    // read:" https://dw-webservices-uat.azurewebsites.net/Contact/GetQuote/4a0ef2c4-09cc-46ba-abc3-8970f5eb6ee8"
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
                attributes:
                              {
                                  "class": "UseHand",
                                  "style": "text-align:right"
                              }
            }, {
                field: "project_id",
                title: "Project",
                width: "120px",
                attributes:
                              {
                                  "class": "UseHand",
                                  "style": "text-align:right"
                              }
            }, {
                field: "date",
                title: "User",
                width: "120px",
                attributes:
                              {
                                  "class": "UseHand",
                                  "style": "text-align:right"
                              }
            }]
        };


        $scope.DocumentGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl +"Contact/GetDocument/" + $scope.seletedCustomerId
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
                attributes:
                              {
                                  "class": "UseHand",
                                  "style": "text-align:center"
                              }
            }, {
                field: "Document_Category",
                title: "Category",
                width: "150px",
                attributes:
                              {
                                  "class": "UseHand",
                                  "style": "text-align:center"
                              }
            }, {
                field: "Date_Modified",
                title: "Last Modified",
                width: "120px",
                format: '{0:dd/MM/yyyy}',
                attributes:
                              {
                                  "class": "UseHand",
                                  "style": "text-align:right"
                              }
            }, {
                template: "<div><a href='#= Attachment_URL#'>" +
                "#if(Attachment_Type !== null) { #<img class='fileType' src='assets/images/fileTypes/#=Attachment_Type#.ico' alt='Unknown file type'/>#}" +
                "else{# <img class='fileType' src='assets/images/fileTypes/unknown.ico' alt='Unknown file type'/> #}#" +
                "</a></div>",
                title: "Attachment",
                width: "80px"

            }]
        };
    }]);