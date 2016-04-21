angular.module('contacts')
.controller('EditContactPopUpController', function ($scope, $state, $cookieStore, apiService, FileUploader, $window, $localStorage, uploadService, $modal, $rootScope, PATTERNREGEXS) {
    console.log('EditContactPopUpController');
    $scope.loadingDemo = false;
    $scope.project_name = [];
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    $scope.emailRegex = PATTERNREGEXS.email;
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

        if (response.data.street2 != undefined)
        { $scope.choices2.push({ 'Street_1': response.data.street2 }); }
        $scope.params.State = response.data.Stateid;
        $scope.state1 = response.data.Stateid;
        $scope.city1 = response.data.cityid;
        $scope.params.City = response.data.cityid;
       
        $scope.user1 = response.data.assignto;
        $scope.params.mappinguser_id = response.data.assignto;
        $scope.project1 = response.data.project_id;
        $scope.project_id = response.data.project_id;
        $scope.people_type = response.data.people_type;
        $scope.gender1 = response.data.gender;
        $scope.salutation1 = response.data.salutation;
        $scope.sources = response.data.Sources;
        $scope.age_group = response.data.Age_Group;
        $scope.family_type = response.data.Family_Type;
        $scope.occupation = response.data.occupation
        $scope.params.income = response.data.income;
        $scope.params.interested_appartments = response.data.interested_appartments;
        $scope.params.Date_Of_Birth = moment(response.data.Date_Of_Birth).format('DD/MM/YYYY');
        $scope.params.Anniversary_Date = moment(response.data.Anniversary_Date).format('DD/MM/YYYY');
        },
        function (error) {
       
        }
      );

    Url = "ElementInfo/GetElementInfo?Id=" + $scope.seletedCustomerId + "&&type=Person";

    apiService.getWithoutCaching(Url).then(function (response) {
        data = response.data;
        a = 0, b = 0, c = 0, d = 0;
        
            $scope.params.primary_contact = (_.find(data, function (o) { return o.element_type == "primary_contact" })) ? (_.find(data, function (o) { return o.element_type == "primary_contact" })).element_info1 : null;
            $scope.params.primary_email = (_.find(data, function (o) { return o.element_type == "primary_email" })) ? (_.find(data, function (o) { return o.element_type == "primary_email" })).element_info1 : null;
            $scope.params.mobile_number = (_.find(data, function (o) { return o.element_type == "mobile_contact" })) ? (_.find(data, function (o) { return o.element_type == "mobile_contact" })).element_info1 : null;
            $scope.params.home_number = (_.find(data, function (o) { return o.element_type == "home_contact" })) ? (_.find(data, function (o) { return o.element_type == "home_contact" })).element_info1 : null;
            $scope.params.office_number = (_.find(data, function (o) { return o.element_type == "office_contact" })) ? (_.find(data, function (o) { return o.element_type == "office_contact" })).element_info1 : null;
            $scope.params.secondaryEmail1 = (_.find(data, function (o) { return o.element_type == "email1_contact" })) ? (_.find(data, function (o) { return o.element_type == "email1_contact" })).element_info1 : null;
            $scope.params.secondaryEmail2 = (_.find(data, function (o) { return o.element_type == "email2_contact" })) ? (_.find(data, function (o) { return o.element_type == "email2_contact" })).element_info1 : null;
            $scope.params.budget = (_.find(data, function (o) { return o.element_type == "Budget" })) ? (_.find(data, function (o) { return o.element_type == "Budget" })).element_info1 : null;

    },
    function (error) {
       
    });


    var GetSelectedProject=function(){
        $scope.selectedProjectId = [];
        var selectedProjects = _.filter($scope.projects, function (o) { return o.checkedd; });
        selectedProjectId = _.pluck(selectedProjects, 'id');
        var ProjectList = [];
        for (i = 0; i < selectedProjectId.length; i++) {
            ProjectList.push
                ({
                    project_id: selectedProjectId[i],
                   // user_id: $cookieStore.get('userId'),
                    //organization_id: $cookieStore.get('orgID'),

                })
        }
        return ProjectList;
      
    }

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
        $scope.anvDate = moment($scope.params.Anniversary_Date, "DD/MM/YYYY hh:mm A")._d;
        var postData =
       {
           contact_id: $scope.seletedCustomerId,
           user_id: $cookieStore.get('userId'),
           organization_id: $cookieStore.get('orgID'),
           class_type: "Person",
           media_url: $scope.params.Contact_Image,
           salutation: $scope.salutation1,          
           first_name: $scope.params.Contact_First_Name,
           last_name: $scope.params.Contact_Last_Name,
           middle_name: $scope.params.Contact_Middle_Name,
           people_type: $scope.people_type,
           project_id: $scope.project1,
           mappinguser_id: $scope.user1,
           company: $scope.params.company,
           designation: $scope.params.designation,
           interested_appartments: $scope.params.interested_appartments,
           occupation:$scope.occupation,
           street_1: $scope.params.street1,
           street_2: $scope.params.street2,
           area: $scope.params.area,
           state: $scope.params.State,
           state_id: $scope.state1,
           city: $scope.params.City,
           city_id: $scope.city1,
           zip_code: $scope.params.zip_code,
           sources: $scope.sources,
           Date_Of_Birth: new Date(dDate).toISOString(),
           gender: $scope.gender1,
           income: $scope.params.income,
           spouse_name: $scope.params.Spouse_Name,
           anniversary_date: new Date($scope.anvDate).toISOString(),
           age_group: $scope.age_group,
           family_type: $scope.family_type,
           no_of_family_members: $scope.params.No_Of_Family_Members,
           no_of_car_own: $scope.params.No_Of_Cars_Owned,
           interests: $scope.params.Interests,
           channel_type_details: $scope.params.Channel_Partner_Details,
           Remarks: $scope.params.Remarks,       
           contact_element_info_email: $scope.params.primary_email,
           contact_element_info_phone: $scope.params.primary_contact,
           ProjectList: GetSelectedProject()
        
           
       };

        apiService.post("Contact/Edit", postData).then(function (response) {
            var loginSession = response.data;
            var editedContact = response.data;
            AuditCreate();
            $scope.openSucessfullPopup();
            //$modalInstance.dismiss();
            $rootScope.$broadcast('REFRESH', 'Summary');
            $rootScope.$broadcast('REFRESH1', { name: 'contactGrid', data: editedContact, action: 'edit' });
            $rootScope.$broadcast('REFRESH2', { name: 'LeadGrid', data: editedContact, action: 'edit' });
            $rootScope.$broadcast('REFRESH3', { name: 'ClientContactGrid', data: editedContact, action: 'edit' });
            $scope.loadingDemo = false;

            var media = [];

            media.push({ class_id: loginSession.contact_id, class_type: "Person", element_type: "primary_contact", element_info1: $scope.params.primary_contact, });
            media.push({ class_id: loginSession.contact_id, class_type: "Person", element_type: "mobile_contact", element_info1: $scope.params.mobile_number, });
            media.push({ class_id: loginSession.contact_id, class_type: "Person", element_type: "home_contact", element_info1: $scope.params.home_number, });
            media.push({ class_id: loginSession.contact_id, class_type: "Person", element_type: "office_contact", element_info1: $scope.params.office_number, });
            media.push({ class_id: loginSession.contact_id, class_type: "Person", element_type: "primary_email", element_info1: $scope.params.primary_email, });
            media.push({ class_id: loginSession.contact_id, class_type: "Person", element_type: "email1_contact", element_info1: $scope.params.secondaryEmail1, });
            media.push({ class_id: loginSession.contact_id, class_type: "Person", element_type: "email2_contact", element_info1: $scope.params.secondaryEmail2, });
            media.push({ class_id: loginSession.contact_id, class_type: "Person", element_type: "Budget", element_info1: $scope.params.budget, });
           
            apiService.post("ElementInfo/Create", media).then(function (response) {
                var loginSession = response.data;
                called = true;              
                $rootScope.$broadcast('REFRESH1', 'elemeninfo');
                $rootScope.$broadcast('REFRESH', 'contactcount');
                $state.go('app.contactdetail', { id: editedContact.contact_id });
               
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
        user_id: $cookieStore.get('userId'),
        organization_id: $cookieStore.get('orgID'),
        media_url: $scope.Contact_Image,
        salutation: $scope.salutation1,
        first_name: $scope.Contact_First_Name,
        last_name: $scope.Contact_Last_Name,
        middle_name: $scope.Contact_Middle_Name,
        people_type: $scope.people_type,
        project_id: $scope.project1,
        mappinguser_id: $scope.user1,
        company: $scope.company,
        designation: $scope.designation,
        interested_appartments: $scope.interested_appartment,
        street_1: $scope.street1,
        street_2: $scope.street2,
        area: $scope.area,
        state: $scope.State,
        state_id: $scope.state1,
        city: $scope.City,
        city_id: $scope.city1,
        zip_code: $scope.zip_code,
        sources: $scope.sources,
        gender: $scope.gender1,
        income: $scope.income,
        spouse_name: $scope.Spouse_Name,
        age_group: $scope.age_group,
        family_type: $scope.family_type,
        no_of_family_members: $scope.No_Of_Family_Members,
        no_of_car_own: $scope.No_Of_Cars_Owned,
        interests: $scope.Interests,
        channel_type_details: $scope.Channel_Partner_Details,
        Remarks: $scope.Remarks,
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
        apiService.getWithoutCaching('Contact/GetContactProjectList/' + $scope.seletedCustomerId).then(function (res) {
            selectedProjects = _.pluck(res.data, 'project_id');
            for (i = 0; i < selectedProjects.length; i++) {
                if (_.find($scope.projects, function (o) { return o.id == selectedProjects[i] })) {
                    _.find($scope.projects, function (o) { return o.id == selectedProjects[i] }).checkedd = true;
                }
            }

        }, function (err) {

        })
    },
   function (error) {
       alert("Error " + error.state);
   });

    $scope.selectproject = function () {
        $scope.params.project_id = $scope.project1;
       
    };

    $scope.selectgender = function () {
        $scope.params.gender = $scope.gender1;
        
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

    $scope.EditContact = function (isValid) {
        if (isValid) {
            $scope.loadingDemo = true;
            if (uploader.queue.length != 0)
                uploader.uploadAll();
            if (uploader.queue.length == 0)
                $scope.finalpost();

            $scope.showValid = false;
        }
    }

});



