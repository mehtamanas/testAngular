
angular.module('contacts')
.controller('ContactDetailControllerdm', function ($scope, $state, security, $cookieStore, apiService, $window, $modal, $rootScope)
{

    if (!$rootScope.contacts.write) {
        $('#btnSave').hide();
        $('#iconEdit').hide();
        $('#btnAdd').hide();
    }


        console.log('ContactDetailControllerdm');

        $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
        var organization_id = $cookieStore.get('orgID');

        $rootScope.title = 'Dwellar-ContactDetails';
     
        contactUrl = "Contact/GetContactSummary/" + $scope.seletedCustomerId;
        apiService.getWithoutCaching(contactUrl).then(function (response) {
            $scope.main = response.data;
            $scope.image = $scope.main[0];

        },
   function (error) {
       console.log("Error " + error.state);
   }
        );

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

            GetUrl = "Contact/GetContactSummary/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;
          
            apiService.getWithoutCaching(GetUrl).then(function (response) {

                $scope.data = response.data;
              
                $scope.Contact_First_Name = $scope.data[0].Contact_First_Name;
                $scope.area = $scope.data[0].area;
                $scope.Contact_Last_Name = $scope.data[0].Contact_Last_Name;
                $scope.zipcode = $scope.data[0].zipcode;
                $scope.area = $scope.data[0].area;
                $scope.choices1[0].Contact_Email = response.data[0].Contact_Email;
                $scope.choices[0].Contact_Phone = response.data[0].Contact_Phone;
                $scope.choices2[0].Street_1 = response.data[0].street1;
                if (response.data[0].street2 != undefined)
                { $scope.choices2.push({ 'Street_1': response.data[0].street2 }); }
                $scope.Role = $scope.data[0].Role;
                $scope.zipcode = $scope.data[0].zipcode;
                $scope.State = $scope.data[0].State;
                $scope.City = $scope.data[0].City;
                $scope.Title = $scope.data[0].Title;
              
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
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: [
                    {
                        template: " <input type='checkbox' , class='checkbox', data-id='#= name #', ng-click='taskSelected($event,dataItem)'  />",
                     title: "<input id='checkAll', type='checkbox', class='check-box' ng-click='submit(dataItem)'  />",
                     width: "60px",
                    
                 },{
                field: "name",
                title: "Task Name",
                width: "120px",
                attributes:
             {
                 "style": "text-align:center"
             }

            }, {
                field: "project_name",
                title: "Project",
                width: "120px",
                attributes:
             {
                 "style": "text-align:center"
             }

            }, {
                field: "Contact_name",
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

            },
           {
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
               format: '{0:dd/MM/yyyy hh:mm:ss}',
               attributes:
             {
                 "style": "text-align:center"
             }

           }, {
               field: "due_date",
               title: "Due Date",
               width: "120px",
               format: '{0:dd/MM/yyyy hh:mm:ss}',
               attributes:
             {
                 "style": "text-align:center"
             }

           },

           {
               field: "reminder_time",
               title: "Reminder Date",
               width: "120px",
               format: '{0:dd/MM/yyyy hh:mm:ss}',
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
               title: "Status",
               width: "120px",
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
                     field: "description",
                     title: "Description",
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
                 attributes:
{
    "class": "UseHand",
    "style": "text-align:center"

}
             },
              {
                  field: "time",
                  title: "Time",
                  width: "120px",
                  attributes:
  {
      "class": "UseHand",
      "style": "text-align:center"
  }
              },
              {
                  field: "status",
                  title: "Status",
                  width: "120px",
                  attributes:
  {
      "class": "UseHand",
      "style": "text-align:center"
  }
              }]

   };

        $scope.NotesGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "Notes/GetByID/" + $scope.seletedCustomerId + "/Person"
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
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: [
                 {
                     template: " <input type='checkbox' , class='checkbox', data-id='#= name #', ng-click='projectSelected($event,dataItem)'  />",
                     title: "<input id='checkAll', type='checkbox', class='check-box' ng-click='submit(dataItem)'  />",
                     width: "60px",
                    
                 },
                {
                field: "Contact_name",
                title: "Contact",
                width: "120px",
                attributes:
              {
                  "style": "text-align:center"
              }

            }, {
                field: "text",
                title: "Notes",
                width: "120px",
                attributes:
               {
                   "style": "text-align:center"
               }

            }, {
                field: "date",
                title: "Date",
                width: "120px",
                format: '{0:dd/MM/yyyy hh:mm:ss}',
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
                attributes:
           {
               "style": "text-align:center"
           }
            }, {
                field: "last_name",
                title: "Last Name ",
                width: "120px",
                attributes:
          {
              "style": "text-align:center"
          }
                
            }, {
                field: "contact_element_info_email",
                title: "Email",
                width: "120px",
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
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: [{
                field: "name",
                title: "Event Name",
                width: "120px",
                attributes:
                {
                    "style": "text-align:center"
                }
            },
            {
                field: "conatct_name",
                title: " Name",
                width: "120px",
                attributes:
               {
                   "style": "text-align:center"
               }
            },
            {
                field: "location",
                title: "Location",
                width: "120px",
                attributes:
               {
                   "style": "text-align:center"
               }
            },
             {
                 field: "userevent_date",
                 title: "Start Date",
                 width: "120px",
                 format: '{0:dd/MM/yyyy hh:mm:ss}',
                 attributes:
               {
                   "style": "text-align:center"
               }
             },
             {
                 field: "end_date",
                 title: "End Date",
                 width: "120px",
                 format: '{0:dd/MM/yyyy hh:mm:ss}',
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
                 width: "120px",
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
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: [{
                field: "name",
                title: "Name",
                width: "120px"
            },
            {
                field: "type",
                title: "Type",
                width: "120px"
            }, {
                field: "assignedBy_name",
                title: "Contact",
                width: "120px"
            }, {
                field: "start_date",
                title: "Start Date",
                width: "120px",
                format: '{0:dd/MM/yyyy}'
            },
             {
                 field: "end_date",
                 title: "End Date",
                 width: "120px",
                 format: '{0:dd/MM/yyyy}'
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




       
        $scope.$on('REFRESH', function (event, args) {
            if (args == 'NotesGrid') {
                $('.k-i-refresh').trigger("click");
            }
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
                        $scope.choices1[0].Contact_Email = response.data[0].Contact_Email;
                        $scope.choices[0].Contact_Phone = response.data[0].Contact_Phone;
                        $scope.choices2[0].Street_1 = response.data[0].street1;
                        if (response.data[0].street2 != undefined)
                        { $scope.choices2.push({ 'Street_1': response.data[0].street2 }); }
                        $scope.Role = $scope.data[0].Role;
                        $scope.zipcode = $scope.data[0].zipcode;
                        $scope.State = $scope.data[0].State;
                        $scope.City = $scope.data[0].City;
                        $scope.Title = $scope.data[0].Title;
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
                                   // alert("not working");
                                });


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

                        }

                    },
                    function (error) {
                      
                    });

                }

            }, 1000);
        });

    // Kendo Grid on change
        $scope.myGridChange = function (dataItem) {
            // dataItem will contain the row that was selected
            window.sessionStorage.selectedCustomerID = dataItem.task_id;
            //  alert(window.sessionStorage.selectedCustomerID);
            $scope.openEditTask();
        };


    // Kendo Grid on change
        $scope.myGridChangeEvent = function (dataItem) {
            // dataItem will contain the row that was selected
            window.sessionStorage.selectedCustomerID = dataItem.id;
            //  alert(window.sessionStorage.selectedCustomerID);
            $scope.openEditEventPopup();
        };

    // Kendo Grid on change
        $scope.myGridChangeNote = function (dataItem) {
            // dataItem will contain the row that was selected
            window.sessionStorage.selectedCustomerID = dataItem.id;
            //  alert(window.sessionStorage.selectedCustomerID);
            $scope.openEditNotesPopup();
        };


        $scope.projectSelected = function (e, data) {

            console.log(e);

            var allListElements = $(".checkbox").toArray();
            for (var i in allListElements) {
                if (!allListElements[i].checked) {
                    $('#checkAll').prop('checked', false);
                    break;
                }
                if (i == allListElements.length - 1)
                    $('#checkAll').prop('checked', true);
            }
            var element = $(e.currentTarget);
            var checked = element.is(':checked')
            row = element.closest("tr")
            var id = data.id;
            var fnd = 0;
            var allListElements = $(".checkbox");
            for (var i in $scope.checkedIds) {
                if (id == $scope.checkedIds[i]) {
                    $scope.checkedIds.splice(i, 1);
                    fnd = 1;
                }

            }
            if (fnd == 0) {
                $scope.checkedIds.push(id);
            }
            if (checked) {
                row.addClass("k-state-selected");
            } else {
                row.removeClass("k-state-selected");
            }


        }

        $scope.taskSelected = function (e, data) {

            console.log(e);

            var allListElements = $(".checkbox").toArray();
            for (var i in allListElements) {
                if (!allListElements[i].checked) {
                    $('#checkAll').prop('checked', false);
                    break;
                }
                if (i == allListElements.length - 1)
                    $('#checkAll').prop('checked', true);
            }
            var element = $(e.currentTarget);
            var checked = element.is(':checked')
            row = element.closest("tr")
            var id = data.task_id;
            var fnd = 0;
            var allListElements = $(".checkbox");
            for (var i in $scope.checkedIds) {
                if (id == $scope.checkedIds[i]) {
                    $scope.checkedIds.splice(i, 1);
                    fnd = 1;
                }

            }
            if (fnd == 0) {
                $scope.checkedIds.push(id);
            }
            if (checked) {
                row.addClass("k-state-selected");
            } else {
                row.removeClass("k-state-selected");
            }


        }

        $scope.GetValue = function (fruit) {

            var fruitId = $scope.ddlFruits;
            var fruitName = $.grep($scope.Fruits, function (fruit) {
                return fruit.Id == fruitId;
            })[0].Name;

            $cookieStore.put('Selected Text', fruitName);
            // $window.alert("Selected Value: " + fruitId + "\nSelected Text: " + fruitName);




        }


        $scope.addUser = function () {

            var usersToBeAddedOnServer = [];
            $cookieStore.remove('checkedIds');
            $cookieStore.put('checkedIds', $scope.checkedIds);
            // Add the new users
            for (var i in $scope.checkedIds) {
                var newMember = {};
                newMember.id = $scope.checkedIds[i];
                newMember.organization_id = $cookieStore.get('orgID');

                usersToBeAddedOnServer.push(newMember);
            }

            if (usersToBeAddedOnServer.length == 0) {
                return;
            }

            apiService.post("Notes/DeleteMultipleNotes", usersToBeAddedOnServer).then(function (response) {
                var loginSession = response.data;
                $scope.openSucessfullPopup();
                


            },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    });

            $scope.openSucessfullPopup = function () {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'newuser/delete.html',
                    backdrop: 'static',
                    controller: DeleteController,
                    size: 'md',
                    resolve: { items: { title: "Notes" } }

                });
                $rootScope.$broadcast('REFRESH1', 'NotesGrid');
            }
        }

        $scope.addTask = function () {

            var usersToBeAddedOnServer = [];
            $cookieStore.remove('checkedIds');
            $cookieStore.put('checkedIds', $scope.checkedIds);
            // Add the new users
            for (var i in $scope.checkedIds) {
                var newMember = {};
                newMember.id = $scope.checkedIds[i];
                newMember.organization_id = $cookieStore.get('orgID');

                usersToBeAddedOnServer.push(newMember);
            }

            if (usersToBeAddedOnServer.length == 0) {
                return;
            }

            apiService.post("ToDoItem/DeleteMultipleTask", usersToBeAddedOnServer).then(function (response) {
                var loginSession = response.data;
                $scope.openSucessfullPopup();



            },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    });

            $scope.openSucessfullPopup = function () {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'newuser/delete.html',
                    backdrop: 'static',
                    controller: DeleteController,
                    size: 'md',
                    resolve: { items: { title: "Task" } }

                });
                $rootScope.$broadcast('REFRESH', 'TaskGrid');
            }
        }


        $scope.Fruits = [{
            Id: 1,
            Name: 'DELETE'

        }];
        $scope.checkedIds = [];
        $scope.showCheckboxes = function () {


            for (var i in $scope.checkedIds) {

                // alert($scope.checkedIds[i]);
            }
        };




    });