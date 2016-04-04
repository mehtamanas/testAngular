
var EditContactPopUpController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, $window, uploadService, $modal, $rootScope) {
    console.log('EditContactPopUpController');
    $scope.project_name = [];
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

    var orgID = $cookieStore.get('orgID');
    $scope.date = new Date();
    $scope.myOptions = {
        max: $scope.date
    }
    var uploader = $scope.uploader = new FileUploader(
    {
        url: apiService.uploadURL,
    });

    $scope.showProgress = false;

    //Audit log start               
   
    var people_type = $cookieStore.get('people_type');

    if (people_type == "Contact") {
        $scope.title = 'contact';

    }
    else if (people_type == "Client") {
        $scope.title = 'client';

    }
    else if (people_type == "Lead") {
        $scope.title = 'lead';

    }
    else {
        $rootScope.title = '';
    }

   
    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
          // device_mac_id: "34:#$::43:434:34:45",
           module_id: "Contact",
           action_id: "Contact View",
           details: "Edited" + $scope.title +"- "+ $scope.params.Contact_First_Name,
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
       

    //end


    // FILTERS
    uploader.filters.push(
    {
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            var im = '|jpg|png|jpeg|bmp|gif|'.indexOf(type);
            if (im === -1)
            {

                alert('You have selected inavalid file type');
            }
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;

        }
    });

    uploader.onAfterAddingFile = function (fileItem, response, status, headers) {
        if (uploader.queue.length > 1) {
            uploader.removeFromQueue(0);
        }
    }

    contactUrl = "Contact/GetContactSummary/?Id=" + $scope.seletedCustomerId;//f2294ca0-0fee-4c16-86af-0483a5718991";
    apiService.getWithoutCaching(contactUrl).then(function (response) {
        $scope.params = response.data;

        $scope.choices1[0].Contact_Email = response.data.Contact_Email;
        $scope.choices[0].Contact_Phone = response.data.Contact_Phone;

        $scope.choices2[0].Street_1 = response.data.street1;

        if (response.data.street2 != undefined)
        { $scope.choices2.push({ 'Street_1': response.data.street2 }); }
        $scope.params.State = response.data.Stateid;
        $scope.state1 = response.data.Stateid;
        $scope.city1 = response.data.cityid;
        $scope.params.City = response.data.cityid;
       
        $scope.user1 = response.data.assignto;
        $scope.params.mappinguser_id = response.data.assignto;
        $scope.project1 = response.data.project_id;
        $scope.params.project_id = response.data.project_id;
        $scope.people_type = response.data.people_type;
        $scope.gender = response.data.gender;
        $scope.salutation1 = response.data.salutation;
        $scope.params.lead_source = response.data.lead_source;
        $scope.params.income = response.data.income;
        $scope.params.Date_Of_Birth = moment(response.data.Date_Of_Birth).format('DD/MM/YYYY');

    },
    function (error) {
       
    }
  );

    Url = "ElementInfo/GetElementInfo?Id=" + $scope.seletedCustomerId + "&&type=Person";

    apiService.getWithoutCaching(Url).then(function (response) {
        data = response.data;
        a = 0, b = 0, c = 0,d = 0;
        for (i = 0; i < data.length; i++)
        {
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
                $scope.params.class_id = data[i].class_id;
               
            }

            if (data[i].element_type == "PurchaseDuration")
            {

                $scope.buy1 = data[i].element_info1;
                $scope.params.class_id = data[i].class_id;

            }
         
            if (data[i].element_type == "InterestedProjects")
            {
                   
               ($scope.project_name).push(data[i].element_info1);
               $scope.params.class_id = data[i].class_id;
                   
            }
            
        }

    },
    function (error) {
       
    });

    // CALLBACKS
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
  
        $scope.params.Contact_Image = response[0].Location;
        uploader_done = true;
        if (uploader_done == true) {
            $scope.showProgress = false;
            $scope.finalpost();
        }
    };

    var called = false;

    $scope.finalpost = function ()
    {
        if (called == true) {
            return;
        }

        var address = [];

        var newadd = {};

        for (i = 0; i < $scope.choices2.length; i++) {
            if (i == 0) {
                if ($scope.choices2[0].Street_1 != undefined)
                    newadd.Street_1 = $scope.choices2[0].Street_1;
            }
            else if (i == 1) {
                if ($scope.choices2[1].Street_1 != undefined)
                    newadd.Street_2 = $scope.choices2[1].Street_1;
            }
        }
      
        var dDate = moment($scope.params.Date_Of_Birth, "DD/MM/YYYY hh:mm A")._d;
        var postData =
       {
           contact_id: $scope.seletedCustomerId,
           user_id: $cookieStore.get('userId'),
           organization_id: $cookieStore.get('orgID'),
           class_type: "Person",
           media_url: $scope.params.Contact_Image,
           Date_Of_Birth: new Date(dDate).toISOString(),
           gender: $scope.gender,
           people_type: $scope.people_type,
           first_name: $scope.params.Contact_First_Name,
           last_name: $scope.params.Contact_Last_Name,
           income: $scope.params.income,
           designation: $scope.params.designation,
           contact_element_info_email: $scope.choices1[0].Contact_Email,
           contact_element_info_phone: $scope.choices[0].Contact_Phone,
           state: $scope.params.State,
           project_id: $scope.params.project_id,
           city: $scope.params.City,
           zip_code: $scope.params.zip_code,
           Street_1: newadd.Street_1,
           Street_2: newadd.Street_2,
           area: $scope.params.area,
           city_id: $scope.city1,
           state_id: $scope.state1,
           mappinguser_id: $scope.params.mappinguser_id,
           company: $scope.params.company,
           salutation: $scope.params.salutation,
       };

        apiService.post("Contact/Edit", postData).then(function (response) {
            var loginSession = response.data[0];
            AuditCreate();
            $scope.openSucessfullPopup();
            $modalInstance.dismiss();
            $rootScope.$broadcast('REFRESH', 'Summary');
            $rootScope.$broadcast('REFRESH1', { name: 'contactGrid', data: loginSession });
            $rootScope.$broadcast('REFRESH2', { name: 'LeadGrid', data: loginSession });
            $rootScope.$broadcast('REFRESH3', { name: 'ClientContactGrid', data: loginSession });
           

            var media = [];
            for (var i in $scope.choices1) {
                var postData_email =
                    {
                        id: $scope.choices1[i].class_id,
                        class_id: window.sessionStorage.selectedCustomerID,
                        class_type: "Person",
                        element_type: "email_contact",
                        element_info1: $scope.choices1[i].Contact_Email,
                    }
                media.push(postData_email);
            }

            for (var i in $scope.choices) {
                var postData_phone =
                    {
                        id: $scope.choices[i].class_id,
                        class_id: window.sessionStorage.selectedCustomerID,
                        class_type: "Person",
                        element_type: "phone_contact",
                        element_info1: $scope.choices[i].Contact_Phone,
                    }
                media.push(postData_phone);
            }

            var postData_budget =
            {
                // id: $scope.choices[i].class_id,
                class_id: window.sessionStorage.selectedCustomerID,
                class_type: "Person",
                element_type: "Budget",
                element_info1: $scope.budget,
            }
            media.push(postData_budget);

            var postData_duration =
           {
               //id: $scope.choices[i].class_id,
               class_id: window.sessionStorage.selectedCustomerID,
               class_type: "Person",
               element_type: "PurchaseDuration",
               element_info1: $scope.buy,
           }
            media.push(postData_duration);

            for (var i in $scope.project_name) {
                var postData_project =
                    {
                        //id: $scope.choices[i].class_id,
                        class_id: window.sessionStorage.selectedCustomerID,
                        class_type: "Person",
                        element_type: "InterestedProjects",
                        element_info1: $scope.project_name[i],
                    }
                media.push(postData_project);
            }

            apiService.post("ElementInfo/Create", media).then(function (response) {
                var loginSession = response.data;
                called = true;
                
                $rootScope.$broadcast('REFRESH1', 'elemeninfo');
                $rootScope.$broadcast('REFRESH', 'contactcount');
               
            },
           function (error)
           {
               if (error.status === 400)
                   alert(error.data.Message);
               else
                   alert("Network issue");
           });

        },
       function (error)
       {
           if (error.status === 400)
               alert(error.data.Message);
           else
               alert("Network issue");

       });
    }

    uploader.onErrorItem = function (fileItem, response, status, headers) {
        alert('Unable to upload file.');
    };

    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        $scope.showProgress = false;
    };

    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/Edited.tpl.html',
            backdrop: 'static',
            controller: EditsucessfullController,
            size: 'sm',
            resolve: { items: { title: "Contact" } }
        });
        $rootScope.$broadcast('REFRESH', 'contactGrid');
        
    }

    $scope.params =
    {
        first_name: $scope.Contact_First_Name,
        last_name: $scope.Contact_Last_Name,
        contact_element_info_email: $scope.Contact_Email,
        contact_element_info_phone: $scope.Contact_Phone,
        state: $scope.State,
        city: $scope.City,
        Date_Of_Birth: $scope.Date_Of_Birth,
        gender: $scope.gender,
        zip_code: $scope.zip_code,
        people_type: $scope.people_type,
        designation: $scope.designation,
        organization_id: $cookieStore.get('orgID'),
        User_ID: $scope.user_id,
        Street_1: $scope.Street_1,
        Street_2: $scope.Street_2,
        area: $scope.area,
        project_id: $scope.project_id,
        company: $scope.company,
        salutation: $scope.salutation

    };



    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.choices = [{ id: 'choice1' }];

    $(document).on("click", ".remove-field", function () {
        var removedElement = $(this).parent().find('#editcontact_email').val();
        var removedElement1 = $(this).parent().find('#editcontact_phone').val();
        var fnd = 0;
        for (var i in $scope.choices1) {
            if (removedElement == $scope.choices1[i].Contact_Email) {
                $scope.choices1.splice(i, 1);
                fnd = 1;
            }

        }
        for (var i in $scope.choices) {
            if (removedElement1 == $scope.choices[i].Contact_Phone) {
                $scope.choices.splice(i, 1);
                fnd = 1;
            }

        }
        $(this).parent().remove();
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

    Url = "project/Get/" + $cookieStore.get('orgID');
    apiService.get(Url).then(function (response) {
        $scope.projects = response.data;
    },
   function (error) {
       alert("Error " + error.state);
   });

    $scope.selectproject = function () {
        $scope.params.project_id = $scope.project1;
       
    };

    $scope.selectgender = function () {
        $scope.params.gender = $scope.gender;
        
    };

    $scope.selectsalutation = function () {
        $scope.params.salutation = $scope.salutation1;
       
    };

    $scope.selecttype = function () {
        $scope.params.people_type = $scope.people_type;
    };

    Url = "user/Get/" + $cookieStore.get('orgID');
    apiService.get(Url).then(function (response) {
        $scope.users = response.data;
    },
   function (error) {
       alert("Error " + error.state);
   });

    $scope.selectuser = function () {
        $scope.params.mappinguser_id = $scope.user1;
        
    };

    Url = "GetCSC/state";
    apiService.get(Url).then(function (response) {
        $scope.states = response.data;
    },
    function (error) {
        alert("Error " + error.state);
    });

    $scope.selectstate = function (state) {
        $scope.params.State = $scope.state1;
        $scope.city1 = "";
    };

    Url = "GetCSC/city";
    apiService.get(Url).then(function (response) {
        $scope.cities = response.data;
    },
    function (error) {
        alert("Error " + error.cities);
    });

    $scope.filterExpression = function (city) {
        return (city.stateid === $scope.state1);
    };

    $scope.selectcity = function () {
        $scope.params.City = $scope.city1;
    };


    $scope.selectOptions = {
        valuePrimitive: true,
        placeholder: "Select Projects...",
        dataTextField: "name",
        dataValueField: "id",
        autoBind: false,
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: {
                    url: apiService.baseUrl + "project/Get/" + $cookieStore.get('orgID')
                }
            }
        }
    };
    console.log($scope.project_name + 'after load');

    $scope.selectProject = function () {
        $scope.project_name = $scope.project_name;
    };

    $scope.selectbudget = function () {
        $scope.budget = $scope.budget1;
    };

    $scope.selectbuy = function () {
        $scope.buy = $scope.buy1;
    };



    $scope.EditContact = function (isValid)
    {

        $scope.showValid = true;

        if (isValid) {

            if (uploader.queue.length != 0)
                uploader.uploadAll();
            if (uploader.queue.length == 0)
                $scope.finalpost();

            $scope.showValid = false;

        }
}

    Url = "Company/GetAllCompanies/" + orgID;
    apiService.get(Url).then(function (response) {
        $scope.companyList = response.data;
        $scope.companyList = _.pluck($scope.companyList, 'company_name');
    },
function (error) {
    alert("Error " + error.state);
});


    Url = "Company/GetAllDesignation/" + orgID;
    apiService.get(Url).then(function (response) {
        $scope.titleList = response.data;
        $scope.titleList = _.pluck($scope.titleList, 'title');
    },
function (error) {
    alert("Error " + error.state);
});

};



