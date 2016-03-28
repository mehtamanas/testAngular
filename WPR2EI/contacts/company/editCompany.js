
var EditCompanyController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $modal, $rootScope) {
    console.log('EditCompanyController');
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    $rootScope.title = 'Dwellar./Company';
    var orgID = $cookieStore.get('orgID');

    GetUrl = "Company/EditGet/" + $scope.seletedCustomerId; //f2294ca0-0fee-4c16-86af-0483a5718991";
    apiService.getWithoutCaching(GetUrl).then(function (response) {
        $scope.params = response.data[0];
        $scope.company_name = response.data[0].company_name;
        $scope.description = response.data[0].description;
        $scope.area = response.data[0].area;
        $scope.params.state = response.data[0].state_id;
        $scope.state1 = response.data[0].state_id;
        $scope.city1 = response.data[0].city_id;
        $scope.params.city = response.data[0].city_id;
        $scope.choices2[0].Street_1 = response.data[0].street_1;

        if (response.data[0].street_2 != undefined)
        { $scope.choices2.push({ 'Street_1': response.data[0].street_2 }); }

        //$scope.choices2[0].Street_1 = response.data[0].street_1;
       // $scope.choices2[0].Street_2 = response.data[0].street_2;
        $scope.choices[0].Company_Website = response.data[0].Company_Website;
       
       // $scope.params.State = response.data[0].Stateid;
        //$scope.state1 = response.data[0].Stateid;
        //$scope.city1 = response.data[0].cityid;
        //$scope.params.City = response.data[0].cityid;
    },
    function (error) {

    });





    Url = "ElementInfo/GetElementInfo?Id=" + $scope.seletedCustomerId + "&&type=Company";

    apiService.getWithoutCaching(Url).then(function (response) {
        data = response.data;
        a = 0, b = 0, c = 0, d = 0;
        for (i = 0; i < data.length; i++) {
           
            if (data[i].element_type == "Company_Website") {
                if (b > 0) { $scope.choices.push({ 'id': 'choice' + (b + 1) }); }
                $scope.choices[b].contact_element_website = data[i].element_info1;
                $scope.choices[b].class_id = data[i].class_id;
                b++;
            }
          
            if (data[i].element_type == "project_facebook") {
                $scope.facebook = data[i].element_info1;
                $scope.class_id = data[i].class_id;
            }
            if (data[i].element_type == "project_twitter") {
                $scope.twitter = data[i].element_info1;
                $scope.class_id = data[i].class_id;
            }
            if (data[i].element_type == "project_linkedin") {
                $scope.linkedin = data[i].element_info1;
                $scope.class_id = data[i].class_id;
            }

        }

    },
    function (error) {

    });

    var uploader = $scope.uploader = new FileUploader({
        url: apiService.uploadURL,
    });

    $scope.showProgress = false;

    // FILTERS
    uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            var im = '|jpg|png|jpeg|bmp|gif|'.indexOf(type);
            if (im === -1) {

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

    //Audit log start															
  
    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
           //device_mac_id: "34:#$::43:434:34:45",
           module_id: "Contact",
           action_id: "Contact View",
           details: $scope.params.first_name + "AddNewContact",
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


    // CALLBACKS
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
        //var uploadResult = response[0];
        $scope.media_url = response[0].Location;
        uploader_done = true;
        if (uploader_done == true) {
            $scope.showProgress = false;
            $scope.finalpost();
        }
    }
    var called = false;

    $scope.finalpost = function () {
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


        var postData = {
            user_id: $cookieStore.get('userId'),
            organization_id: $cookieStore.get('orgID'),
            media_url: $scope.media_url,
            company_id: window.sessionStorage.selectedCustomerID,
            //media_name: uploadResult.Name,
            company_name: $scope.params.company_name,
            //contact_element_website: $scope.choices[0].contact_element_website,
            state: $scope.params.state,
            city: $scope.city1,
            zip_code: $scope.params.zip_code,
            area: $scope.params.area,
            Street_1: newadd.Street_1,
            Street_2: newadd.Street_2,
            area: $scope.params.area,
            description:$scope.description,
            facebook: $scope.facebook,
            twitter: $scope.twitter,
            linkedin: $scope.linkedin,




        };

        apiService.post("Company/Edit", postData).then(function (response) {
            var loginSession = response.data;
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();
            AuditCreate();
            $rootScope.$broadcast('REFRESH', 'company_summary');


            var media = [];
            
            for (var i in $scope.choices) {
                var postData_phone =
                    {
                        //id: $scope.choices[i].class_id,
                        user_id: $cookieStore.get('userId'),
                        organization_id: $cookieStore.get('orgID'),
                        class_id: window.sessionStorage.selectedCustomerID,
                        class_type: "Company",
                        element_type: "Company_Website",
                        element_info1: $scope.choices[i].contact_element_website,
                    }
                media.push(postData_phone);
            }       
          
            var postData_fb =
                     {
                         user_id: $cookieStore.get('userId'),
                         organization_id: $cookieStore.get('orgID'),
                         class_id: window.sessionStorage.selectedCustomerID,
                         class_type: "Company",
                         element_type: "project_facebook",
                         element_info1: $scope.facebook,
                     }
            media.push(postData_fb);

            var postData_twitter =
                {

                    user_id: $cookieStore.get('userId'),
                    organization_id: $cookieStore.get('orgID'),
                    class_id: window.sessionStorage.selectedCustomerID,
                    class_type: "Company",
                    element_type: "project_twitter",
                    element_info1: $scope.twitter,
                }
            media.push(postData_twitter);

            var postData_linkedin =
               {
                   user_id: $cookieStore.get('userId'),
                   organization_id: $cookieStore.get('orgID'),
                   class_id: window.sessionStorage.selectedCustomerID,
                   class_type: "Company",
                   element_type: "project_linkedin",
                   element_info1: $scope.linkedin,
               }
            media.push(postData_linkedin);



            apiService.post("ElementInfo/Create", media).then(function (response) {
                var loginSession = response.data;
                called = true;
            },
           function (error) {
               if (error.status === 400)
                   alert(error.data.Message);
               else
                   alert("Network issue");

           });
        },
       function (error) {
           if (error.status === 400)
               alert(error.data.Message);
           else
               alert("Network issue");

       });


   
        var address = [];

        for (var i in $scope.choices2) {

            var newadd = {};
            newadd.Street_1 = $scope.choices2[i].Street_1;

            newadd.Street_2 = $scope.choices2[i].Street_2;
            address.push(newadd);
        }
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
            size: 'md',
            resolve: { items: { title: "Company" } }
        });
        $rootScope.$broadcast('REFRESH', 'company_summary');
    }
    var address = [];

    for (var i in $scope.choices2) {

        var newadd = {};
        newadd.Street_1 = $scope.choices2[i].Street_1;

        newadd.Street_2 = $scope.choices2[i].Street_2;
        address.push(newadd);
    }

    $scope.params = {
      media_url: $scope.media_url,
        company_id: window.sessionStorage.selectedCustomerID,
        //media_name: uploadResult.Name,
        company_name: $scope.company_name,       
        //contact_element_website: $scope.contact_element_website,
        state: $scope.state,    
        city: $scope.city,      
        zip_code: $scope.zip_code,      
        organization_id: $cookieStore.get('orgID'),
        User_ID: $cookieStore.get('userId'),
        street_1: $scope.street_1,
        street_2: $scope.street_2,
        area: $scope.area,
        facebook: $scope.facebook,
        twitter: $scope.twitter,
        linkedin: $scope.linkedin,
        description:$scope.description,
      
    };


    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.choices = [{ id: 'choice1' }];

    $(document).on("click", ".remove-field", function () {
        $(this).parent().remove();
    });

    $scope.choices = [{ id: 'choice1' }]; // remove code
    $scope.addNewChoice = function (e) {
        var classname = e.currentTarget.className;
        if (classname == 'remove-field') {

        }
        else if ($scope.choices.length) {
            var newItemNo = $scope.choices.length + 1;
            $scope.choices.push({ 'id': 'choice' + newItemNo });
        }

    };

 
    $scope.choices1 = [{ id: 'choice1' }]; // remove code
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

        Url = "GetCSC/state";
        apiService.get(Url).then(function (response) {
            $scope.states = response.data;
        },
        function (error) {
        alert("Error " + error.state);
        });

        $scope.selectstate = function (state) {
            $scope.params.state = $scope.state1;
           
        };

        Url = "GetCSC/city";
        apiService.get(Url).then(function (response) {
            $scope.cities = response.data;
        },
         function (error) {
        alert("Error " + error.cities);
        });

        $scope.filterExpression = function (city) {
            return (city.stateid === $scope.params.state);
        };

        $scope.selectcity = function () {
            $scope.params.city = $scope.city1;
        };

  

    $scope.addNewContact = function (isValid) {
        $scope.showValid = true;

        if (isValid) {
            if (uploader.queue.length != 0)
                uploader.uploadAll();
            if (uploader.queue.length == 0)
                $scope.finalpost();

            $scope.showValid = false;
        }
    }


};


