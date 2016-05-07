
angular.module('contacts')
.controller('ContactDetailControllerdm', function ($scope, $state, security, $cookieStore, apiService, $window, $modal, $rootScope, $stateParams, $localStorage)
{
    $scope.WHO_AM_I = $cookieStore.get('Who_Am_i');
    if (!$rootScope.contacts.write) {
        $('#btnSave').hide();
        $('#iconEdit').hide();
        $('#btnAdd').hide();
    }

    //var tabToActivate = $("contact_Quotes");
    //$("#contact_Quotes").kendoTabStrip().data("contact_Quotes").activateTab(tabToActivate);

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
                var dob = moment($scope.data.Date_Of_Birth);
                var age = moment().diff(dob, 'years');
                // ends


                $scope.main = response.data;
                $scope.image = $scope.main;
                $scope.gender = $scope.data.gender;
                $scope.Contact_First_Name = $scope.data.Contact_First_Name;
                $scope.Contact_Last_Name = $scope.data.Contact_Last_Name;
                $scope.zipcode = $scope.data.zipcode;
		        $scope.customerId = $scope.data.customer_id;
		        $scope.Street = $scope.data.street1;
		        $scope.Street2 = $scope.data.street2;
                $scope.area = $scope.data.area;
                $scope.age = age ? age : '';
                $scope.choices1[0].Contact_Email = response.data.Contact_Email;
                $scope.choices[0].Contact_Phone = response.data.Contact_Phone;
                $scope.choices2[0].Street_1 = response.data.street1;
                $scope.choices2[0].Street_2 = response.data.street2;
                $scope.Role = $scope.data.Role;
                $scope.zipcode = $scope.data.zip_code;
                $scope.State = $scope.data.state_name;
                $scope.City = $scope.data.City;
                $scope.Title = $scope.data.Title;
                $scope.Type = $scope.data.Type;
                $scope.Spouse_Name = $scope.data.Spouse_Name;
                $scope.No_Of_Cars_Owned = $scope.data.No_Of_Cars_Owned;
                $scope.leadsource = $scope.data.leadsource;
                $scope.Sources = $scope.data.Sources;
                $scope.Age_Group = $scope.data.Age_Group;
                $scope.Family_Type = $scope.data.Family_Type;
                $scope.income = $scope.data.income;
                $scope.company = $scope.data.company;
                $scope.Date_Of_Birth = $scope.data.Date_Of_Birth ? moment($scope.data.Date_Of_Birth).format('DD/MM/YYYY') : 'Not Specified';
                $scope.Anniversary_Date = $scope.data.Anniversary_Date ? moment($scope.data.Anniversary_Date).format('DD/MM/YYYY') : 'Not Specified';
                $scope.channel_partner_details = $scope.data.channel_partner_details;
             

              
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
        Url = "ElementInfo/GetElementInfo?Id=" + $scope.seletedCustomerId + "&&type=Person";

        apiService.getWithoutCaching(Url).then(function (response) {
            data = response.data;
            a = 0, b = 0, c = 0;
            for (i = 0; i < data.length; i++) {
                if (data[i].element_type == "email1_contact") {
                    $scope.secondaryEmail1 = data[i].element_info1;
                    $scope.class_id = data[i].class_id;
                }
                if (data[i].element_type == "email2_contact") {
                    $scope.secondaryEmail2 = data[i].element_info1;
                    $scope.class_id = data[i].class_id;
                }
                if (data[i].element_type == "mobile_contact") {
                    $scope.mobile_number = data[i].element_info1;
                    $scope.class_id = data[i].class_id;
                }
                if (data[i].element_type == "home_contact") {
                    $scope.home_number = data[i].element_info1;
                    $scope.class_id = data[i].class_id;
                }
                if (data[i].element_type == "office_contact") {
                    $scope.office_number = data[i].element_info1;
                    $scope.class_id = data[i].class_id;
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
                title: "Payement Name",

                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }

            }, {
                field: "Milestone",
                title: "Milestone",

                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }

            }, {
                field: "payment_scheme",
                title: "Payement Scheme",

                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }

            }, {
                field: "amount",
                title: "Amount",
              
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }

            }, {
                field: "duedate",
                title: "Due Date",

                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }

            }, {
                field: "datepaid",
                title: "Pay Date",                
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }
            }, {
                field: "demandletter",
                title: "Demand Letter",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }

            }, {
                field: "action",
                title: "Action",
                attributes: {
                    "class": "UseHand",
                    "style": "text-align:center"
                }

            }, ]
        };
       
        $scope.TaskGrid = {
            dataSource: {
                type: "json",
                transport: {
                    //read: apiService.baseUrl + "ToDoItem/GetMultipleTaskByContactId/" + $scope.seletedCustomerId
                    read: function (options) {
                        if ($localStorage.taskDataSource) {
                            taskData = _.find($localStorage.taskDataSource, function (o) {
                                return o.custId === $scope.seletedCustomerId;
                            })
                            if (taskData) { options.success(taskData.data); }
                            else {
                                apiService.getWithoutCaching("ToDoItem/GetMultipleTaskByContactId/" + $scope.seletedCustomerId).then(function (res) {
                                    data = res.data;
                                    $localStorage.taskDataSource.push({ 'custId': $scope.seletedCustomerId, 'data': data });
                                    options.success(data);
                                }, function (err) {
                                    options.error();
                                })
                            }
                        } else {
                            apiService.getWithoutCaching("ToDoItem/GetMultipleTaskByContactId/" + $scope.seletedCustomerId).then(function (res) {
                                data = res.data;
                                $localStorage.taskDataSource = [];
                                $localStorage.taskDataSource.push({ 'custId': $scope.seletedCustomerId, 'data': data });
                                options.success(data);
                            }, function (err) {
                                options.error();
                            })
                        }
                    }
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

                        //template: "<div class='checkbox c-checkbox needsclick'><label class='needsclick'><input type='checkbox' required='' name='checkbox' ng-model='checkbox' class='checkbox needsclick ng-dirty ng-valid-parse ng-touched ng-not-empty ng-valid ng-valid-required' data-id='#= task_id #',  ng-click='check()' style=''><span class='fa fa-check'></span></label></div>",
                        //title: "<div class='checkbox c-checkbox needsclick'><label class='needsclick'><input id='checkAll' type='checkbox' required='' name='checkbox' ng-model='checkbox' class='check-box needsclick ng-dirty ng-valid-parse ng-touched ng-not-empty ng-valid ng-valid-required'   ng-click='checkALL(TaskGrid)' style=''><span class='fa fa-check'></span></label></div>",
                        width: "50px",
                        attributes:
                       {
                           "class": "UseHand",
                           "style": "text-align:center"
                       }

                    }, {
                        field: "name",
                        title: "Task Name",
                        template: '#if (status!="Completed") {# <a ng-click="openEditTask(dataItem.task_id)" href="">#=name#</a> #} else {#<a ng-click="taskComplete()" href="">#=name#</a>#}#',
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

                    },
                    {
                        field: "created_by",
                        title: "Created By",
                        attributes:
                         {
                             "style": "text-align:center"
                         }

                    },
                    {
                        field: "task_code",
                        title: "Task Code",
                        attributes:
                         {
                             "style": "text-align:center"
                         }

                    }, {
                        field: "priority",
                        template: '<span id="#= priority #">#= priority #</span>',
                        title: "Priority",

                        attributes:
                      {
                          "style": "text-align:center"
                      }

                    }, {
                        field: "start_date_timeFormatted",
                        title: "Start Date",

                        format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                        attributes:
                      {
                          "style": "text-align:center"
                      }

                    }, {
                        field: "due_date_timeFormatted",
                        title: "Due Date",

                        format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                        attributes:
                      {
                          "style": "text-align:center"
                      }

                    },
   
           {
               field: "reminder_date_timeFormatted",
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

           }, {
               title: "postpone",
               template: '#if (status!="Completed") {# <a class="btn btn-primary" id="postpone_now" ng-click="openPostpone(dataItem)">Postpone</a> #}#',
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

        $scope.historyGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "Contact/GetAuditTrail/" + $scope.seletedCustomerId //1e230a69-d735-4219-8bae-555d55d0a03e
                },
                schema: {
                    model: {
                        fields: {
                            Name: { type: "string" },
                            OriginalValue: { type: "string" },
                            NewValue: { type: "string" }
                        }
                    }
                },
                pageSize: 20,
                //group: {
                //    field: "field_name"

                //},
            },
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
                template: '<div><table><tr><a href=" "><span>#=edited_by# made changes on </span></a><span>#=Changes_made_date#</span></tr><br>' +
                     '<thead> <th>field</br><span>#=field_name#</span><th><th>Original Value</br><span>#=original_value#</span><th><th>New Value</br><span>#=new_value#</span><th></thead></table></div>',
            }, {

                attributes:
               {
                   "style": "text-align:center"
               }
            }
            ]
        };

        $scope.NotesGrid = {
            dataSource: {
                type: "json",
                transport: {
                    read: apiService.baseUrl + "Notes/GetByID/" + $scope.seletedCustomerId + "/ToDo_Item_N_Notes"
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
                     template: "<span  ng-bind-html='dataItem.text | limitTo:200'></span>",

                     attributes:
                    {
                        "style": "text-align:center"
                    }
                 },
            {
                field: "date_Formatted",
                title: "Date",
                width: "200px",
                format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                attributes:
              {
                  "style": "text-align:center"
              }
            }, {
                field: "task_code",
                title: "Task_Code",
                template: '#if (task_code!=null){#<a ng-click="openEditTask(dataItem.task_id)" href="">#=task_code#</a> #}#',
                attributes:
              {
                  "style": "text-align:center"
              }

            }]
        };

        $scope.QuotesPropertyGrid = {
            dataSource: {
                type: "json",
                transport: {

                    read: apiService.baseUrl + "Quotation/GetQuoteGridWithAttachement/" + $scope.seletedCustomerId
                },
                pageSize: 5,

                schema: {
                    model: {
                        fields: {

                            careted_date: { type: "date" },
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
                    field: "quote_id",
                    title: "Quote Id",

                    attributes:
                           {
                               "class": "UseHand",
                               "style": "text-align:center"
                           }

                }, {
                    field: "Created_date",
                    title: "Date",
                    format: '{0:dd/MM/yyyy hh:mm:ss tt}',
                    attributes:
                           {
                               "class": "UseHand",
                               "style": "text-align:center"
                           }

                },
            //    {
            //    field: "created_by",
            //    title: "Created By",

            //    attributes:
            //           {
            //               "class": "UseHand",
            //               "style": "text-align:center"
            //           }

            //}, {
            //    field: "total_consideration",
            //    title: "Total Consideration",

            //    attributes:
            //           {
            //               "class": "UseHand",
            //               "style": "text-align:center"
            //           }

            //}, {
            //    field: "final_total",
            //    title: "Final Total",

            //    attributes:
            //           {
            //               "class": "UseHand",
            //               "style": "text-align:center"
            //           }


            //}, {
            //    field: "attachement",
            //    title: "Attachment",
            //    attributes:
            //           {
            //               "class": "UseHand",
            //               "style": "text-align:center"
            //           }

            //}, 
            {
                title: "Action",
                template: '<a class="btn btn-primary" ng-click="openBookNow(dataItem)" id="book_now">Book Now</a>',
                attributes:
                       {
                           "class": "UseHand",
                           "style": "text-align:center"
                       }

            }
            ]
        };

        $scope.QuotesServiceGrid = {
            dataSource: {
                type: "json",
                transport: {

                    read: apiService.baseUrl + "Quotation/GetQuoteGrid/" + $scope.seletedCustomerId
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

            }, {
                title: "Action",
                template: '<a class="btn btn-primary" id="book_now">Book Now</a>',
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


       

        $scope.openQuote = function () {

            if ($scope.WHO_AM_I == "Broker") {

                $scope.generateNewQuote();

           

            } else {

                $state.go('app.peoperty_quote');

            }
        }

        $scope.openBookNow = function (dataItem) {
           
            $state.go('app.bookingPreview', { quoteId: dataItem.quote_id });
        }


        $scope.generateNewQuote = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/quotes/generateQuote.html',
                backdrop: 'static',
                controller: generateQuoteCtrl,
                size: 'lg',
                resolve: {
                    contactData: $scope.image
                }
            });
        }

    //popup functionality start
        $scope.openEditContactPopup = function () {
            $state.go('app.editContact');
        };

        $scope.openPostpone = function (d) {
            $scope.taskID = d.task_id;
            window.sessionStorage.selectedCustomerID = $scope.taskID;
            $cookieStore.put('company_name', d.company_name);
            $cookieStore.put('contactID', d.contact_id);
            $cookieStore.put('lead_name', d.Contact_name);
            $cookieStore.put('task_name', d.name);
            $cookieStore.put('taskID', $scope.taskID);
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/postponed/taskpostponed.html',
                backdrop: 'static',
                controller: postponedController,
                size: 'lg'

            });

        };

        $scope.openNewPaymentPopup = function () {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/addpayment.tpl.html',
                backdrop: 'static',
                controller: PaymentUpController,
                size: 'lg'

            });

        };

        $scope.openNewDocument = function () {
            $state.go('app.documentAgreement');
        }

        //$scope.openNewDocument = function () {

        //    var modalInstance = $modal.open({
        //        animation: true,
        //        templateUrl: 'contacts/add_new_doc.tpl.html',
        //        backdrop: 'static',
        //        controller: AddNewDocumentController,
        //        size: 'md'

        //    });

        //};

        $scope.openAddNewTask = function () {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/add_new_task.tpl.html',
                backdrop: 'static',
                controller: AddNewTaskController,
                size: 'lg',
                resolve: { contactData: $scope.image }

            });

        };


        $scope.openAddNewNotes = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/add_new_notes.html',
                backdrop: 'static',
                controller: AddNewNotesController,
                size: 'lg'
            });
        };


        $scope.openEditNotesPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/edit_notes.html',
                backdrop: 'static',
                controller: EditNotesContactController,
                size: 'lg'
            });
        };

        $scope.openEventCampaignPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/addNewCampaign.tpl.html',
                backdrop: 'static',
                controller: AddNewEventContact,
                size: 'lg'
            });
        };

        $scope.openEditEventPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/edit_event.html',
                backdrop: 'static',
                controller: EditEventContact,
                size: 'lg'
            });
        };

        $scope.openEditTask = function (d) {
            window.sessionStorage.selectedTaskID = d;
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/edit_task.html',
                backdrop: 'static',
                controller: EditTaskController,
                size: 'lg',
                resolve: { contactData: $scope.image }

            });

        };

        $scope.openEditTaskPopUp = function (task_id) {
            window.sessionStorage.selectedTaskID = task_id;
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/edit_task.html',
                backdrop: 'static',
                controller: EditTaskController,
                size: 'lg',


            });
        };

        $scope.taskComplete=function()
        {
            alert("Task is Complete..You Can't Edit")
        }

        $scope.sendEmail = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/sendEmail.html',
                backdrop: 'static',
                controller: sendEmailCtrl,
                size: 'lg',
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
                size: 'lg',
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
                size: 'lg'

            });

        };

       
        $scope.AddTagPopup = function () {

            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/add_new_tag.html',
                backdrop: 'static',
                controller: AddTagController,
                size: 'lg'
            });
        };

        $scope.openConfirmationNotes = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/confirmnotes.tpl.html',
                backdrop: 'static',
                controller: confirmNotesController,
                size: 'sm',
                resolve: { items: { title: "Notes" } }

            });

        }

        $scope.openConfirmation = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/confirmtask.html',
                backdrop: 'static',
                controller: confirmTaskController,
                size: 'sm',
                resolve: { items: { title: "Task" } }

            });

        }

        $scope.openTagConfirmation = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'contacts/confirmremoverag.tpl.html',
                backdrop: 'static',
                controller: confirmationTagController,
                size: 'sm',
                resolve: { items: { title: "Tag" } }

            });

        }


        $scope.$on('REFRESHNOTE', function (event, args) {
            if (args == 'NotesGrid') {
                $('.k-i-refresh').trigger("click");
            }
            $scope.NotesAction = 'no_action';
        });

        //$scope.$on('REFRESH1', function (event, args) {
        //    if (args == 'NotesGrid') {
        //        $('.k-i-refresh').trigger("click");
        //    }
        //});

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

        var TaskGridRefresh = function () {
            apiService.getWithoutCaching("ToDoItem/GetMultipleTaskByContactId/" + $scope.seletedCustomerId).then(function (response) {
                data = response.data;
                $localStorage.taskDataSource = data;
                $('.k-i-refresh').trigger("click");
            })
        }

        $rootScope.$on('REFRESH', function (event, args) {

            if (args.name == 'TaskGrid') {
                if (args.action === 'complete') {
                    $localStorage.taskDataSource = [];
                    TaskGridRefresh();
                    $('.k-i-refresh').trigger("click");
                }                             
            }

        });

        $scope.$on('REFRESH', function (event, args) {
            if (args.name == 'TaskGrid') {
                _.remove($localStorage.taskDataSource, function (o) {
                    return o.custId == args.id;
                });
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

                           var dob = moment($scope.data.Date_Of_Birth);
                           var age = moment().diff(dob, 'years');
                      
                        $scope.main = response.data;
                        $scope.image = $scope.main;
                       
                     
                        $scope.Contact_First_Name = $scope.data.Contact_First_Name;
                        $scope.Contact_Last_Name = $scope.data.Contact_Last_Name;
                        $scope.zipcode = $scope.data.zipcode;
                        $scope.customerId = $scope.data.customer_id;
                        $scope.Street = $scope.data.street1;
                        $scope.Street2 = $scope.data.street2;
                        $scope.area = $scope.data.area;
                        $scope.age = age ? age : '';
                        $scope.choices1[0].Contact_Email = response.data.Contact_Email;
                        $scope.choices[0].Contact_Phone = response.data.Contact_Phone;
                        $scope.choices2[0].Street_1 = response.data.street1;
                        $scope.choices2[0].Street_2 = response.data.street2;
                        $scope.Role = $scope.data.Role;
                        $scope.zipcode = $scope.data.zip_code;
                        $scope.State = $scope.data.state_name;
                        $scope.City = $scope.data.City;
                        $scope.Title = $scope.data.Title;
                        $scope.Type = $scope.data.Type;
                        $scope.leadsource = $scope.data.leadsource;
                        $scope.Spouse_Name = $scope.data.Spouse_Name;
                        $scope.Age_Group = $scope.data.Age_Group;
                        $scope.Family_Type = $scope.data.Family_Type;
                        $scope.income = $scope.data.income;
                        $scope.company = $scope.data.company;
                        $scope.Date_Of_Birth = $scope.data.Date_Of_Birth ? moment($scope.data.Date_Of_Birth).format('DD/MM/YYYY') : 'Not Specified';
                        $scope.Anniversary_Date = $scope.data.Anniversary_Date ? moment($scope.data.Anniversary_Date).format('DD/MM/YYYY') : 'Not Specified';
                        $scope.channel_partner_details = $scope.data.channel_partner_details;
                        

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

                   
                Url = "ElementInfo/GetElementInfo?Id=" + $scope.seletedCustomerId + "&&type=Person";

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
        //$scope.myGridChange = function (dataItem) {

        //    contactUrl = "ToDoItem/EditGet/" + dataItem.task_id;
        //    apiService.getWithoutCaching(contactUrl).then(function (response) {
        //        $scope.params = response.data[0];

        //        var stat = $scope.params.status;
        //        if (stat == "Completed") {
        //            alert(" Completed task can not be edited...");
        //        }
        //        else {
        //            window.sessionStorage.selectedTaskID = dataItem.task_id;
        //            $scope.openEditTask();

        //        };
        //    },
        //     function (error) {

        //     });
        //};


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