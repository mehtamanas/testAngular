
angular.module('contacts')
.controller('ContactDetailControllerdm', function ($scope, $state, security, $cookieStore, apiService, $window, $modal, $rootScope, $stateParams)
{
    $scope.WHO_AM_I = $cookieStore.get('Who_Am_i');
    if (!$rootScope.contacts.write) {
        $('#btnSave').hide();
        $('#iconEdit').hide();
        $('#btnAdd').hide();
    }
    var userId = $cookieStore.get('userId');
    var orgID = $cookieStore.get('orgID');

        console.log('ContactDetailControllerdm');
        $scope.seletedCustomerId = $stateParams.id;
        window.sessionStorage.selectedCustomerID = $scope.seletedCustomerId;
        var organization_id = $cookieStore.get('orgID');

        $scope.NotesAction = 'no_action';
        $scope.TaskAction = 'no_action';


        var people_type = $cookieStore.get('people_type');

        if (people_type == "Contact") {
            $rootScope.title = 'Dwellar-Contact Details';
        }
        else if (people_type == "Client") {
            $rootScope.title = 'Dwellar-Client Details';
        }
        else if (people_type == "Lead") {
            $rootScope.title = 'Dwellar-Lead Details';
        }
        else {
            $rootScope.title = '';
        }
     
  

        contactUrl = "Tags/GetTagsByContactId/" + $scope.seletedCustomerId;
        apiService.getWithoutCaching(contactUrl).then(function (response) {
            $scope.tags = response.data;


        },
   function (error) {
       console.log("Error " + error.state);
   }
        );

    //Audit log start               

        AuditCreate = function () {
            var postdata =
           {
               device_os: $cookieStore.get('Device_os'),
               device_type: $cookieStore.get('Device'),
               device_mac_id: "34:#$::43:434:34:45",
               module_id: "Contact",
               action_id: "Contact View",
               details: "ContactDetailView",
               application: "angular",
               browser: $cookieStore.get('browser'),
               ip_address: $cookieStore.get('IP_Address'),
               location: $cookieStore.get('Location'),
               organization_id: $cookieStore.get('orgID'),
               User_ID: $cookieStore.get('userId')
           };


            apiService.post("AuditLog/Create", postdata).then(function (response) {
                var loginSession = response.data;
            },
       function (error) {
           if (error.status === 400)
               alert(error.data.Message);
           else
               alert("Network issue");
       });
        };

        AuditCreate();
    //end

        if ($scope.seletedCustomerId != "undefined") {

            GetUrl = "Contact/GetContactSummary/?Id=" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;
          
            apiService.getWithoutCaching(GetUrl).then(function (response) {

                $scope.data = response.data;

                // Age Calculation starts
                $scope.data = response.data;
                var dDate = moment($scope.data.Date_Of_Birth).format('YYYY/MM/DD');
                //var convDate = new Date(dDate).toISOString();
                var birthdate = new Date(dDate);
                var cur = new Date();
                var diff = cur - birthdate;
                $scope.calage = Math.floor(diff / 31536000000);
                // ends


                $scope.main = response.data;
                $scope.image = $scope.main;
              
                $scope.Contact_First_Name = $scope.data.Contact_First_Name;
                $scope.Contact_Last_Name = $scope.data.Contact_Last_Name;
                $scope.zipcode = $scope.data.zipcode;
		        $scope.customerId = $scope.data.customer_id;
		        $scope.Street = $scope.data.street1;
		        $scope.Street2 = $scope.data.street2;
                $scope.area = $scope.data.area;
                $scope.age = $scope.calage;
                $scope.choices1[0].Contact_Email = response.data.Contact_Email;
                $scope.choices[0].Contact_Phone = response.data.Contact_Phone;
                $scope.choices2[0].Street_1 = response.data.street1;
                $scope.choices2[0].Street_2 = response.data.street2;
                $scope.Role = $scope.data.Role;
                $scope.zipcode = $scope.data.zip_code;
                $scope.State = $scope.data.state_name;
                $scope.City = $scope.data.City;
                $scope.Title = $scope.data.Title;
                $scope.income = $scope.data.income;
                $scope.company = $scope.data.company;
                $scope.Date_Of_Birth = moment($scope.data.Date_Of_Birth).format('YYYY/MM/DD');
                $scope.channel_partner_details = $scope.data.channel_partner_details;
                $scope.Age_Group = $scope.data.Age_Group;
              
                if ($scope.data.contact_mobile !== '') {
                    $scope.mobile = $scope.data.contact_mobile;
                }
                if ($scope.data.contact_email !== '') {
                    $scope.email = $scope.data.contact_Email;
                }
            },
                        function (error) {
                            deferred.reject(error);
                            //alert("not working");
                        });
        }
        Url = "ElementInfo/GetElementInfo?Id=" + $scope.seletedCustomerId + "&&type=Contact";

        apiService.getWithoutCaching(Url).then(function (response) {
            data = response.data;
            a = 0, b = 0, c = 0;
            for (i = 0; i < data.length; i++) {
                if (data[i].element_type == "email_contact") {
                    if (a > 0) { $scope.choices1.push({ 'id': 'choice' + (a + 1) }); }
                    $scope.choices1[a].Contact_Email = data[i].element_info1;
                    $scope.choices1[a].class_id = data[i].class_id;
                    a++;
                }
                if (data[i].element_type == "phone_contact") {
                    if (b > 0) { $scope.choices.push({ 'id': 'choice' + (b + 1) }); }
                    $scope.choices[b].Contact_Phone = data[i].element_info1;
                    $scope.choices[b].class_id = data[i].class_id;
                    b++;
                }
                if (data[i].element_type == "Budget") {

                    $scope.budget1 = data[i].element_info1;
                    $scope.class_id = data[i].class_id;

                }

                if (data[i].element_type == "PurchaseDuration") {

                    $scope.buy1 = data[i].element_info1;
                    $scope.class_id = data[i].class_id;

                }

                if (data[i].element_type == "InterestedProjects") {

                    ($scope.project_name).push(data[i].element_info1);
                    $scope.class_id = data[i].class_id;

                }
            }
        },
        function (error) {
           
        });

        $scope.choices = [{ id: 'choice1' }];
        $scope.addNewChoice = function (e) {
            var classname = e.currentTarget.className;
            if (classname == 'remove-field') {

            }
            else if ($scope.choices.length) {
                var newItemNo = $scope.choices.length + 1;
                $scope.choices.push({ 'id': 'choice' + newItemNo });
            }
        };
        $scope.choices1 = [{ id: 'choice1' }];

        $scope.addNewChoice1 = function (e) {
            var classname = e.currentTarget.className;
            if (classname == 'remove-field') {

            }
            else if ($scope.choices1.length) {
                var newItemNo = $scope.choices1.length + 1;
                $scope.choices1.push({ 'id': 'choice' + newItemNo });
            }
        };

        $scope.choices2 = [{ id: 'choice1' }];

        $scope.addNewChoice2 = function (e) {
            var classname = e.currentTarget.className;
            if (classname == 'remove-field') {
                var wrappedResult = angular.element(this);
                wrappedResult.parent().remove();
                $scope.choices2.pop();
            }
            else if ($scope.choices2.length < 2) {
                var newItemNo2 = $scope.choices2.length + 1;
                $scope.choices2.push({ 'id': 'choice' + newItemNo2 });
            }

        };
      
      
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
                field: "Document_Name",
                title: "Document Name",
               
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
               
            }, {
                field: "Document_Category",
                title: "Category",
             
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
              
            }, {
                field: "Date_Modified",
                title: "Last Modified ",
             
                format: '{0:dd/MM/yyyy}',
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
               
            }, {
                template: "<div ng-click='openDocument(dataItem)'><a href='#= Attachment_URL#'>" +
                "#if(Document_Category == 'PDF') { #<img class='fileType' src='images/pdf_icon.png' alt='Unknown file type'/>#}" +
                "else {# <img class='fileType' src='images/image_icon.png' alt='Unknown file type'/> #}#" +
                "</a></div>",
                title: "Attachment",
              
               
            }]
        };

        $scope.PropertyListGrid = {
          
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
                   
                    attributes:
                      {
                          "class": "UseHand",
                          "style": "text-align:center"
                      }
                },

                {
                    field: "tower_name",
                    title: "Name",
                   
                    attributes:
    {
        "class": "UseHand",
        "style": "text-align:center"
       
    }
                },
             {
                 field: "floorno",
                 title: "Floor No",
                
                 attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
   
}
             },
              {
                  field: "unitno",
                  title: "Unit No",
                 
                  attributes:
  {
      "class": "UseHand",
      "style": "text-align:center"
  }
              },
              {
                  field: "carpark",
                  title: "Car Park",
               
                  attributes:
  {
      "class": "UseHand",
      "style": "text-align:center"
  }
              },
              {
                  field: "num_bedrooms",
                  title: "Bedrooms",
                 
                  attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
              },
            {
                field: "num_bathrooms",
                title: "Bathrooms",
             
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
                
                  attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
              },
               {
                   field: "total_consideration",
                   title: "Price",
                
                   attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
               },
                {
                    field: "project_name",
                    title: "Project",
               
                    attributes:
{
    "class": "UseHand",
    "style": "text-align:center"
}
                },
            {
                field: "available_status",
                title: "Status",
            
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
                field: "amount",
                title: "Amount",
              
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }

            }, {
                field: "payment_type_id",
                title: "Type",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }

            }, {
                field: "duedate",
                title: "Due Required",
            
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
                    read: apiService.baseUrl + "ToDoItem/GetMultipleTaskByContactId/" + $scope.seletedCustomerId
                },
                pageSize: 20,

                schema: {
                    model: {
                        fields: {
                            due_date: { type: "date" },
                            start_date_time: { type: "date" },
                            reminder_time: { type: "date" },
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
            columns: [
                    {
                        template: " <input type='checkbox' , class='checkbox', data-id='#= task_id #', ng-click='check()'/>",
                        title: "<input id='checkAll', type='checkbox', class='check-box' ng-click='checkALL(TaskGrid)'/>",
                        width: "50px",

                    }, {
                        field: "name",
                        title: "Task Name",
                        width: "250px",
                        attributes:
                     {
                         "style": "text-align:center"
                     }

                    }, {
                        field: "project_name",
                        title: "Project",

                        attributes:
                     {
                         "style": "text-align:center"
                     }

                    }, {
                        field: "Contact_name",
                        title: "Contact",

                        attributes:
                     {
                         "style": "text-align:center"
                     }

                    }, {
                        field: "user_name",
                        title: "Assign To",

                        attributes:
                     {
                         "style": "text-align:center"
                     }

                    }, {
                        field: "company_name",
                        title: "Company",
                        attributes:
                         {
                             "style": "text-align:center"
                         }

                    }, {
                        field: "priority",
                        title: "Priority",

                        attributes:
                      {
                          "style": "text-align:center"
                      }

                    }, {
                        field: "start_date_time",
                        title: "Start Date",

                        format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                        attributes:
                      {
                          "style": "text-align:center"
                      }

                    }, {
                        field: "due_date",
                        title: "Due Date",

                        format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                        attributes:
                      {
                          "style": "text-align:center"
                      }

                    },

           {
               field: "reminder_time",
               title: "Reminder Date",

               format: '{0:dd/MM/yyyy hh:mm:ss tt}',
               attributes:
             {
                 "style": "text-align:center"
             }

           },
           {
               field: "text",
               title: "Notes",
               width: 200,
               attributes:
             {
                 "style": "text-align:center"
             }


           }, {
               field: "status",
               template: '<span id="#= status #"></span>',
               title: "Status",

               attributes:
             {
                 "style": "text-align:center"
             }

           }, ]
        };

        $scope.engagementGrid = {
            dataSource: {
                type: "json",
                transport: {

                    read: apiService.baseUrl + "Contact/GetPersonHistory/" + $scope.seletedCustomerId
                },
                pageSize: 20,
            },
            groupable: true,
            sortable: true,
            selectable: "multiple",
            reorderable: true,
            resizable: true,
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
                    template:
                    '<div><div class="DivActivityIcon"><a ui-sref="app.contactEmail({id:dataItem.id})" href=""><img src="#= media_url #"></a></div>' +
                    '<div class="DivActivitySummery"><span>#= description # </span>' +
                    '<span class="ActivityHistoryTime">#= time # </span></div></div>',
                    title: "Activity History",
                    format: '{yyyy-MM-dd HH:mm:ss Z}',
                    type: "date",
                    attributes:
                      {
                          "style": "text-align:left"
                      },

                }, ]
        };

        $scope.NotesGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "Notes/GetByID/" + $scope.seletedCustomerId
                },
                pageSize: 5,
                refresh: true,
                schema: {
                    model: {
                        fields: {
                            date: { type: "date" },
                            time: { type: "date" }
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
                     template: "<input type='checkbox', class='checkbox', data-id='#= id #',  ng-click='check()' />",
                     title: "<input id='checkAll', type='checkbox', class='check-box', ng-click='checkALL(NotesGrid)' />",
                     width: "60px",
                     attributes:
                {
                 "style": "text-align:center"
                }
                    
                 },
                 {
                     field: "user_name",
                     title: "User",

                     attributes:
                    {
                        "style": "text-align:center"
                    }

                 }, {
                     field: "attention",
                     title: "Attention",

                     attributes:
                    {
                        "style": "text-align:center"
                    }

                 }, {
                field: "text",
                title: "Notes",
               
                attributes:
               {
                   "style": "text-align:center"
               }

            },
            {
                field: "date",
                title: "Date",
                width: "200px",
                format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                attributes:
              {
                  "style": "text-align:center"
              }
            }, 
            ]
        };

        $scope.QuotesGrid = {
            dataSource: {
                type: "json",
                transport: {

                    read: apiService.baseUrl + "Quotation/GetQuoteGrid/" + organization_id
                },
                pageSize: 5,

                schema: {
                    model: {
                        fields: {

                            expiry_date: { type: "date" },



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
                field: "service_name",
                title: "Service Name",

                attributes:
                       {
                           "class": "UseHand",
                           "style": "text-align:center"
                       }

            }, {
                field: "description",
                title: "Description",

                attributes:
                       {
                           "class": "UseHand",
                           "style": "text-align:center"
                       }

            }, {
                field: "final_amount",
                title: "Price",

                attributes:
                       {
                           "class": "UseHand",
                           "style": "text-align:center"
                       }


            }, {
                field: "tax_value",
                title: "Tax",

                attributes:
                       {
                           "class": "UseHand",
                           "style": "text-align:center"
                       }

            }, {
                field: "expiry_date",
                title: "Date",

                format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                attributes:
                       {
                           "class": "UseHand",
                           "style": "text-align:center"
                       }

            },
            {
                field: "attachment",
                title: "Attachment",

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
                field: "first_name",
                title: " First Name",
               
                attributes:
           {
               "style": "text-align:center"
           }
            }, {
                field: "last_name",
                title: "Last Name ",
              
                attributes:
          {
              "style": "text-align:center"
          }
                
            }, {
                field: "contact_element_info_email",
                title: "Email",
              
                attributes:
          {
              "style": "text-align:center"
          }
              
               
            }]
        };

        $scope.EventGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "Event/GetEventCampaign/" + $scope.seletedCustomerId + "/Contact"
                },
                pageSize: 20,
                refresh: true,
                schema: {
                    model: {
                        fields: {
                            userevent_date: { type: "date" },
                            end_date: { type: "date" },
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
                title: "Event Name",
              
                attributes:
                {
                    "style": "text-align:center"
                }
            },
            {
                field: "conatct_name",
                title: " Name",
               
                attributes:
               {
                   "style": "text-align:center"
               }
            },
            {
                field: "location",
                title: "Location",
             
                attributes:
               {
                   "style": "text-align:center"
               }
            },
             {
                 field: "userevent_date",
                 title: "Start Date",
              
                 format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                 attributes:
               {
                   "style": "text-align:center"
               }
             },
             {
                 field: "end_date",
                 title: "End Date",
              
                 format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                 attributes:
               {
                   "style": "text-align:center"
               }
             },
             //{
             //    field: "start_date_time",
             //    title: "Start Time",
             //    width: "120px"
             //},
             //{
             //    field: "end_date_time",
             //    title: "End Time",
             //    width: "120px"
             //},
             {
                 field: " text",
                 title: "Note",
                 width: "200px",
                 attributes:
             {
                 "style": "text-align:center"
             }
             }]
        };

        $scope.EngagementGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "Engagement/GetEngagement?id=" + $scope.seletedCustomerId + "&&class_type=Contact"  //eea9b986-8561-4970-851b-7cfb38bb2b87"

                },
                pageSize: 5,
                refresh: true,
                schema: {
                    model: {
                        fields: {

                            start_date: { type: "date" },
                            end_date: { type: "date" },

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
                title: "Name",
            
            },
            {
                field: "type",
                title: "Type",
              
            }, {
                field: "assignedBy_name",
                title: "Contact",
              
            }, {
                field: "start_date",
                title: "Start Date",
             
                format: '{0:dd/MM/yyyy}'
            },
             {
                 field: "end_date",
                 title: "End Date",
            
                 format: '{0:dd/MM/yyyy}'
             }]
        };

        $scope.quotationGrid = {
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
                field: "Document_Name",
                title: "Document Name",
              
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }

            }, {
                field: "Document_Category",
                title: "Category",
              
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }

            }, {
                field: "Date_Modified",
                title: "Last Modified ",
              
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
               

            }]
        }


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


        $scope.openAddNewNotes = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/add_new_notes.html',
                backdrop: 'static',
                controller: AddNewNotesController,
                size: 'md'
            });
        };


        $scope.openEditNotesPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/edit_notes.html',
                backdrop: 'static',
                controller: EditNotesContactController,
                size: 'md'
            });
        };

        $scope.openEventCampaignPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/addNewCampaign.tpl.html',
                backdrop: 'static',
                controller: AddNewEventContact,
                size: 'md'
            });
        };

        $scope.openEditEventPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/edit_event.html',
                backdrop: 'static',
                controller: EditEventContact,
                size: 'md'
            });
        };

        $scope.openEditTask = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/edit_task.html',
                backdrop: 'static',
                controller: EditTaskController,
                size: 'md'

            });

        };

        $scope.sendEmail = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/sendEmail.html',
                backdrop: 'static',
                controller: sendEmailCtrl,
                size: 'md',
                resolve: {
                    emailData: $scope.image
                }
            });
        }


        //$scope.ActivityEmail = function () {
        //    var modalInstance = $modal.open({
        //        animation: true,
        //        templateUrl: 'contacts/activityEmail.html',
        //        backdrop: 'static',
        //        controller: activityEmailCtrl,
        //        size: 'md',
             
        //    });
        //}

        $scope.generateNewQuote = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/quotes/generateQuote.html',
                backdrop: 'static',
                controller: generateQuoteCtrl,
                size: 'md',
                resolve: {
                    contactData: $scope.image
                }
            });
        }

        $scope.openFollowUp = function ()
        {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/company/followUp.html',
                backdrop: 'static',
                controller: FollowUpController,
                size: 'md'

            });

        };

       
        $scope.AddTagPopup = function () {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/add_new_tag.html',
                backdrop: 'static',
                controller: AddTagController,
                size: 'md'
            });
        };

        $scope.openConfirmationNotes = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/confirmnotes.tpl.html',
                backdrop: 'static',
                controller: confirmNotesController,
                size: 'md',
                resolve: { items: { title: "Notes" } }

            });

        }

        $scope.openConfirmation = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/confirmtask.html',
                backdrop: 'static',
                controller: confirmTaskController,
                size: 'md',
                resolve: { items: { title: "Task" } }

            });

        }

        $scope.openTagConfirmation = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/confirmremoverag.tpl.html',
                backdrop: 'static',
                controller: confirmationTagController,
                size: 'md',
                resolve: { items: { title: "Tag" } }

            });

        }


        $scope.$on('REFRESH', function (event, args) {
            if (args == 'NotesGrid') {
                $('.k-i-refresh').trigger("click");
            }
            $scope.NotesAction = 'no_action';
        });

        $scope.$on('REFRESH1', function (event, args) {
            if (args == 'NotesGrid') {
                $('.k-i-refresh').trigger("click");
            }
        });

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
            if (args == 'TaskGrid') {
                $('.k-i-refresh').trigger("click");
            }
            $scope.TaskAction = 'no_action';
        });

        $scope.$on('REFRESH', function (event, args) {
            if (args == 'EventGrid') {
                $('.k-i-refresh').trigger("click");
            }
        });

        $scope.$on('REFRESH', function (event, args) {
            if (args == 'NotesGrid') {
                $('.k-i-refresh').trigger("click");
            }
            $scope.NotesAction = 'no_action';
        });

        $scope.$on('REFRESH', function (event, args) {
            if (args == 'QuotesGrid') {
                $('.k-i-refresh').trigger("click");
            }
        });

        $scope.$on('REFRESH', function (event, args) {



                if (args == 'contactGrid') {

                    
                    GetUrl = "Contact/GetContactSummary/?Id=" + $scope.seletedCustomerId;

                       apiService.getWithoutCaching(GetUrl).then(function (response) {
                        
                           $scope.data = response.data;

                           var dDate = moment($scope.data.Date_Of_Birth).format('YYYY/MM/DD');
                           //var convDate = new Date(dDate).toISOString();
                           var birthdate = new Date(dDate);
                           var cur = new Date();
                           var diff = cur - birthdate;
                           $scope.calage = Math.floor(diff / 31536000000);
                      
                        $scope.main = response.data;
                        $scope.image = $scope.main;
                       
                     
                        $scope.Contact_First_Name = $scope.data.Contact_First_Name;
                        $scope.Contact_Last_Name = $scope.data.Contact_Last_Name;
                        $scope.zipcode = $scope.data.zipcode;
                        $scope.customerId = $scope.data.customer_id;
                        $scope.Street = $scope.data.street1;
                        $scope.Street2 = $scope.data.street2;
                        $scope.area = $scope.data.area;
                        $scope.age = $scope.calage;
                        $scope.choices1[0].Contact_Email = response.data.Contact_Email;
                        $scope.choices[0].Contact_Phone = response.data.Contact_Phone;
                        $scope.choices2[0].Street_1 = response.data.street1;
                        $scope.choices2[0].Street_2 = response.data.street2;
                        $scope.Role = $scope.data.Role;
                        $scope.zipcode = $scope.data.zip_code;
                        $scope.State = $scope.data.state_name;
                        $scope.City = $scope.data.City;
                        $scope.Title = $scope.data.Title;
                        $scope.income = $scope.data.income;
                        $scope.company = $scope.data.company;
                        $scope.Date_Of_Birth = moment($scope.data.Date_Of_Birth).format('YYYY/MM/DD');
                        $scope.channel_partner_details = $scope.data.channel_partner_details;
                        $scope.Age_Group = $scope.data.Age_Group;

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
                                   // alert("not working");
                                });
                     

                  

                }

                //$scope.choices2 = [{ id: 'choice1' }];

                //$scope.addNewChoice2 = function (e) {
                //    var classname = e.currentTarget.className;
                //    if (classname == 'remove-field') {
                //        var wrappedResult = angular.element(this);
                //        wrappedResult.parent().remove();
                //        $scope.choices2.pop();
                //    }
                //    else if ($scope.choices2.length < 2) {
                //        var newItemNo2 = $scope.choices2.length + 1;
                //        $scope.choices2.push({ 'id': 'choice' + newItemNo2 });
                //    }

                //};

          
        });

        $scope.$on('REFRESH1', function (event, args) {

       

            if (args == 'elemeninfo')
                {

                   
                    Url = "ElementInfo/GetElementInfo?Id=" + $scope.seletedCustomerId + "&&type=Contact";

                    apiService.getWithoutCaching(Url).then(function (response) {
                        data = response.data;
                        a = 0, b = 0, c = 0;
                        for (i = 0; i < data.length; i++) {
                            if (data[i].element_type == "email_contact") {
                                if (a > 0) { $scope.choices1.push({ 'id': 'choice' + (a + 1) }); }
                                $scope.choices1[a].Contact_Email = data[i].element_info1;
                                $scope.choices1[a].class_id = data[i].class_id;
                                a++;
                            }
                            if (data[i].element_type == "phone_contact") {
                                if (b > 0) { $scope.choices.push({ 'id': 'choice' + (b + 1) }); }
                                $scope.choices[b].Contact_Phone = data[i].element_info1;
                                $scope.choices[b].class_id = data[i].class_id;
                                b++;
                            }


                            if (data[i].element_type == "Budget") {

                                $scope.budget1 = data[i].element_info1;
                                $scope.class_id = data[i].class_id;

                            }

                            if (data[i].element_type == "PurchaseDuration") {

                                $scope.buy1 = data[i].element_info1;
                                $scope.class_id = data[i].class_id;

                            }

                            if (data[i].element_type == "InterestedProjects") {

                                ($scope.project_name).push(data[i].element_info1);
                                $scope.class_id = data[i].class_id;

                            }
                        }
                    },
                    function (error) {

                    });

                    $scope.choices = [{ id: 'choice1' }];
                    $scope.addNewChoice = function (e) {
                        var classname = e.currentTarget.className;
                        if (classname == 'remove-field') {

                        }
                        else if ($scope.choices.length) {
                            var newItemNo = $scope.choices.length + 1;
                            $scope.choices.push({ 'id': 'choice' + newItemNo });
                        }
                    };
                    $scope.choices1 = [{ id: 'choice1' }];

                    $scope.addNewChoice1 = function (e) {
                        var classname = e.currentTarget.className;
                        if (classname == 'remove-field') {

                        }
                        else if ($scope.choices1.length) {
                            var newItemNo = $scope.choices1.length + 1;
                            $scope.choices1.push({ 'id': 'choice' + newItemNo });
                        }
                    };

                   

                }

          
        });

        $scope.$on('REFRESHTAG', function (event, args)
        {
            if (args == 'Tag')
            {
                contactUrl = "Tags/GetTagsByContactId/" + $scope.seletedCustomerId;
                apiService.getWithoutCaching(contactUrl).then(function (response) {
                    $scope.tags = response.data;


                },
           function (error) {
               console.log("Error " + error.state);
           }
                );
            }

        });
      

    // Kendo Grid on change
        $scope.myGridChange = function (dataItem) {

            contactUrl = "ToDoItem/EditGet/" + dataItem.task_id;
            apiService.getWithoutCaching(contactUrl).then(function (response) {
                $scope.params = response.data[0];

                var stat = $scope.params.status;
                if (stat == "Completed") {
                    alert(" Completed task can not be edited...");
                }
                else {
                    window.sessionStorage.selectedTaskID = dataItem.task_id;
                    $scope.openEditTask();

                };
            },
             function (error) {

             });
        };


    // Kendo Grid on change
        $scope.myGridChangeEvent = function (dataItem) {
            // dataItem will contain the row that was selected
            window.sessionStorage.selectedEventID = dataItem.id;
            //  alert(window.sessionStorage.selectedCustomerID);
            $scope.openEditEventPopup();
        };

    // Kendo Grid on change
        $scope.myGridChangeNote = function (dataItem) {
            // dataItem will contain the row that was selected
            window.sessionStorage.selectedNotesID = dataItem.id;
            //  alert(window.sessionStorage.selectedCustomerID);
            $scope.openEditNotesPopup();
        };
     
        $scope.chooseAction = function () {
            var allGridElements = $("#selectNotesGrid .checkbox").toArray();
            var allCheckedElement = _.filter(allGridElements, function (o)
            { return o.checked });
            allCheckedIds = (_.pluck(allCheckedElement, 'dataset.id'));
            $cookieStore.remove('checkedIds');
            $cookieStore.put('checkedIds', allCheckedIds);

            if (allCheckedIds.length > 0) {

                if ($scope.NotesAction === "no_action") {

                }
                else if ($scope.NotesAction === "add_tag") {
                    $state.go($scope.tagOptionPopup());
                }
                else if ($scope.NotesAction === "assign_to") {
                    $state.go($scope.assignToUpPopup());
                }
                else if ($scope.NotesAction === "delete") {
                    var notesDelete = [];
                    for (var i in allCheckedIds) {
                        var notes = {};
                        notes.id = allCheckedIds[i];
                        notes.organization_id = $cookieStore.get('orgID');
                        notesDelete.push(notes);
                    }
                    $cookieStore.put('notesDelete', notesDelete);
                    $scope.openConfirmationNotes();
                }
            }
        }

        $scope.taskAction = function () {
            var allGridElements = $("#selectTasksGrid .checkbox").toArray();
            var allCheckedElement = _.filter(allGridElements, function (o)
            { return o.checked });
            allCheckedIds = (_.pluck(allCheckedElement, 'dataset.id'));
            $cookieStore.remove('checkedIds');
            $cookieStore.put('checkedIds', allCheckedIds);

            if (allCheckedIds.length > 0) {

                if ($scope.TaskAction === "no_action") {

                }
                else if ($scope.TaskAction === "add_tag") {
                    $state.go($scope.tagOptionPopup());
                }
                else if ($scope.TaskAction === "assign_to") {
                    $state.go($scope.assignToUpPopup());
                }
                else if ($scope.TaskAction === "delete") {
                    var taskDelete = [];
                    for (var i in allCheckedIds) {
                        var task = {};
                        task.id = allCheckedIds[i];
                        task.organization_id = $cookieStore.get('orgID');
                        taskDelete.push(task);
                    }
                    $cookieStore.put('taskDelete', taskDelete);
                    $scope.openConfirmation();
                }
            }
        }

        $scope.checkALL = function (t) {

            if (t == $scope.TaskGrid) {
                if ($('.check-box:checked').length > 0)
                    $('#selectTasksGrid .checkbox').prop('checked', true);
                else
                    $('#selectTasksGrid .checkbox').prop('checked', false);
            }
            else if (t == $scope.NotesGrid) {
                if ($('.check-box:checked').length > 0)
                    $('#selectNotesGrid .checkbox').prop('checked', true);
                else
                    $('#selectNotesGrid .checkbox').prop('checked', false);
            }


        };


        $scope.check = function () {
            var allListElements = $(".checkbox").toArray();
            for (var i in allListElements) { // not all checked
                if (!allListElements[i].checked) {
                    $('#checkAll').prop('checked', false);
                    break;
                }
                if (i == allListElements.length - 1) // if all are checked manually
                    $('#checkAll').prop('checked', true);
            }
        }
        
        $scope.removeImage = function (index) {
            var id = $scope.tags[index].tag_id;

            var postdata =
                {
                    id: id,
                    contact_id: window.sessionStorage.selectedCustomerID
                }

            $cookieStore.put('postdata', postdata);
            $scope.openTagConfirmation();

        }

        $scope.myGridChangeactivity = function (dataItem) {
            // dataItem will contain the row that was selected
            window.sessionStorage.selectedCustomerID = dataItem.id;

            $state.go('app.contactEmail', { id: dataItem.id });
        };

        $scope.goToTagDetails = function (id) {
            url =$state.href('app.tagpeople', { id: id });
            window.open(url, '');
        }

        $scope.openDocument = function (data)
        {
            //$window.open("data:application/pdf;" + decodeURI(data.Attachment_URL));
            var string = pdf.output(data.Attachment_URL);
            window.open(string);
        }
    });