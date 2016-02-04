/**
 * Created by karuna on 24/10/15.
 */
angular.module('contacts')
.controller('ContactDetailControllerdm', function ($scope, $state, security, $cookieStore, apiService, $window, $modal, $rootScope)
    {
        console.log('ContactDetailControllerdm');
        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
        

        $rootScope.title = 'Dwellar./ContactDetails';
     
        
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
        apiService.getWithoutCaching(contactUrl).then(function (response) {
            $scope.main = response.data;
            $scope.image = $scope.main[0];

        },
   function (error) {
       console.log("Error " + error.state);
   }
        );



        if ($scope.seletedCustomerId != "undefined") {

            //   GetUrl = "User/GetById/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;
            GetUrl = "Contact/GetContactSummary/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;
            //alert(GetUrl);

            apiService.getWithoutCaching(GetUrl).then(function (response) {

                $scope.data = response.data;
                // alert($scope.data);
                //   alert($scope.seletedCustomerId);


                $scope.Contact_First_Name = $scope.data[0].Contact_First_Name;
                $scope.Contact_Last_Name = $scope.data[0].Contact_Last_Name;
                $scope.Contact_Email = $scope.data[0].Contact_Email;
                $scope.Contact_Phone = $scope.data[0].Contact_Phone;
                $scope.street1 = $scope.data[0].street1;
                $scope.Role = $scope.data[0].Role;
                $scope.zipcode = $scope.data[0].zipcode;
                $scope.State = $scope.data[0].State;
                $scope.City = $scope.data[0].City;
                //$scope.media_url = $scope.data[0].media_url;
                // alert($scope.media_url);

                if ($scope.data.contact_mobile !== '') {
                    $scope.mobile = $scope.data.contact_mobile;
                }
                if ($scope.data.contact_email !== '') {
                    $scope.email = $scope.data.contact_Email;
                }
            },
                        function (error) {
                            deferred.reject(error);
                            alert("not working");
                        });
        }

      
      
        $scope.DocumentGrid = {
            dataSource:
                {
                    type: "json",
                    transport: {
                        read: apiService.baseUrl + "Contact/GetDocument/" + $scope.seletedCustomerId
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

                pageSize: 20
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
                field: "Document_Name",
                title: "Document Name",
                width: "150px",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
               
            }, {
                field: "Document_Category",
                title: "Category",
                width: "150px",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
              
            }, {
                field: "Date_Modified",
                title: "Last Modified ",
                width: "120px",
                format: '{0:dd/MM/yyyy}',
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
               
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
            // $scope.mainGridOptions = {


            dataSource: {
                type: "json",
                transport: {


                    read: apiService.baseUrl + "Contact/GetTowerunitpropertiesContact/" + $scope.seletedCustomerId
                },
                pageSize: 20

                //group: {
                //    field: 'sport'
                //}
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
            columns: [
                {
                    //template: "<img height='40px' width='40px' src='#= Project_image #'/>" +
                    //"<span style='padding-left:10px' class='property-photo'> </span>",
                    template: "<input type='checkbox' class='checkbox' ng-click='onClick($event)' />",
                    title: "",
                    width: "60px",
                    attributes: {
                        "class": "UseHand",
                        "style": "text-align:center"

                    }
                },

                {
                    template: "<img height='40px' width='40px' src='#= Image_Url_Unit1 #'/>" +
                    "<span style='padding-left:10px' class='property-photo'> </span>",
                    title: "Photo",
                    width: "120px",
                    attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                },

                {
                    field: "tower_name",
                    title: "Name",
                    width: "120px",
                    attributes:
    {
        "class": "UseHand",
        "style": "text-align:center"
       
    }
                },
             {
                 field: "floorno",
                 title: "Floor No",
                 width: "120px",
                 attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
   
}
             },
              {
                  field: "unitno",
                  title: "Unit No",
                  width: "120px",
                  attributes:
  {
      "class": "UseHand",
      "style": "text-align:center"
  }
              },
              {
                  field: "carpark",
                  title: "Car Park",
                  width: "120px",
                  attributes:
  {
      "class": "UseHand",
      "style": "text-align:center"
  }
              },
              {
                  field: "num_bedrooms",
                  title: "Bedrooms",
                  width: "120px",
                  attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
              },
            {
                field: "num_bathrooms",
                title: "Bathrooms",
                width: "120px",
                attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
            },
            {
                field: "super_built_up_area",
                type: "number",
                title: "Slb. Area",
                width: "120px",
                attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
            },
              {
                  field: "carpet_area",
                  type: "number",
                  title: "Crp Area",
                  width: "120px",
                  attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
              },
               {
                   field: "total_consideration",
                   title: "Price",
                   width: "120px",
                   attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
               },
                {
                    field: "project_name",
                    title: "Project",
                    width: "120px",
                    attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
                },
            {
                field: "available_status",
                title: "Status",
                width: "120px",
                attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
            }]

        };
        

        

       
        $scope.PaymentGrid = {
            dataSource: {

                type: "json",
                transport: {
                    read: apiService.baseUrl + "Payment/GetByPaymentId?contact_id=" + $scope.seletedCustomerId

                },

                pageSize: 20,

                schema: {
                    model: {
                        fields: {

                            duedate: { type: "date" },
                            datepaid: { type: "date" }


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
                field: "amount",
                title: "Amount",
                width: "120px",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }

            }, {
                field: "payment_type_id",
                title: "Type",
                width: "120px",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }

            }, {
                field: "duedate",
                title: "Due Required",
                width: "120px",
                format: '{0:dd/MM/yyyy}',
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }

            }]
        };
       
        $scope.TaskGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "ToDoItem/GetMultipleTaskById/" + $scope.seletedCustomerId

                },
                pageSize: 20,

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
                    read: apiService.baseUrl + "Contact/GetEngagement/" + $scope.seletedCustomerId
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
                    read: apiService.baseUrl + "Notes/GetByID/" + $scope.seletedCustomerId

                },
                pageSize: 20

                //group: {
                //    field: 'sport'
                //}
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
                    
                    read: apiService.baseUrl + "Contact/GetQuote/" + $scope.seletedCustomerId
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
                    read: apiService.baseUrl + "Contact/GetAssignToList?id=" + $scope.seletedCustomerId
                   
                },
                pageSize: 20

                //group: {
                //    field: 'sport'
                //}
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
                field: "first_name",
                title: " First Name",
                width: "120px",
                attributes: {
                    "class": "UseHand",

                }
            }, {
                field: "last_name",
                title: "Last Name ",
                width: "120px",
                
            }, {
                field: "contact_element_info_email",
                title: "Email",
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


        $scope.openNewDocument = function () {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/add_new_doc.tpl.html',
                backdrop: 'static',
                controller: AddNewDocumentController,
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

       
        $scope.$on('REFRESH', function (event, args) {
            if (args == 'PaymentGrid') {
                $('.k-i-refresh').trigger("click");
            }
        });

        $scope.$on('REFRESH', function (event, args) {
            if (args == 'DocumentGrid') {
                $('.k-i-refresh').trigger("click");
            }
        });

        $scope.$on('REFRESH', function (event, args) {
            if (args == 'AssignmentToGrid') {
                $('.k-i-refresh').trigger("click");
            }
        });



        $scope.$on('REFRESH', function (event, args) {

            setTimeout(function () {

                if (args == 'contactdetails') {


                    //   GetUrl = "User/GetById/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;
                    GetUrl = "Contact/GetContactSummary/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;
                    //alert(GetUrl);

                    apiService.getWithoutCaching(GetUrl).then(function (response) {

                        $scope.data = response.data;
                        // alert($scope.data);
                        //   alert($scope.seletedCustomerId);

                        $scope.main = response.data;
                        $scope.image = $scope.main[0];
                        //////////////////////////////////////
                        $scope.Contact_First_Name = $scope.data[0].Contact_First_Name;
                        $scope.Contact_Last_Name = $scope.data[0].Contact_Last_Name;
                        $scope.Contact_Email = $scope.data[0].Contact_Email;
                        $scope.Contact_Phone = $scope.data[0].Contact_Phone;
                        $scope.street1 = $scope.data[0].street1;
                        $scope.Role = $scope.data[0].Role;
                        $scope.zipcode = $scope.data[0].zipcode;
                        $scope.State = $scope.data[0].State;
                        $scope.City = $scope.data[0].City;
                        // alert($scope.media_url);

                        if ($scope.data.contact_mobile !== '') {
                            $scope.mobile = $scope.data.contact_mobile;
                        }
                        if ($scope.data.contact_email !== '') {
                            $scope.email = $scope.data.contact_Email;
                        }
                        $state.go('app.contactdetail', {}, { reload: false });
                    },
                                function (error) {
                                    deferred.reject(error);
                                    alert("not working");
                                });

                }

            }, 1000);
        });

    });