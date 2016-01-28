


/**
 * Created by dwellarkaruna on 24/10/15.
 */
var EditContactPopUpController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, $window, uploadService, $modal, $rootScope)
{
    console.log('EditContactPopUpController');

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

      //  alert($scope.seletedCustomerId);

        var uploader = $scope.uploader = new FileUploader(
        {
            url: apiService.uploadURL,
        });

        $scope.showProgress = false;

        // FILTERS
        uploader.filters.push(
        {
            name: 'imageFilter',
            fn: function (item /*{File|FileLikeObject}*/, options)
            {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        contactUrl = "Contact/GetContactSummary/" + $scope.seletedCustomerId;//f2294ca0-0fee-4c16-86af-0483a5718991";
        apiService.getWithoutCaching(contactUrl).then(function (response)
        {
            $scope.params = response.data[0];

            $scope.choices1[0].Contact_Email = response.data[0].Contact_Email;
            $scope.choices[0].Contact_Phone = response.data[0].Contact_Phone;

            $scope.choices2[0].street1 = response.data[0].street1;
            $scope.choices2[0].Street_2 = response.data[0].Street_2;
            $scope.params.State = response.data[0].Stateid;
            $scope.state1 = response.data[0].Stateid;
            $scope.city1 = response.data[0].cityid;
            $scope.params.City = response.data[0].cityid;



            $scope.user1 = response.data[0].Assigned_To;
            $scope.params.mappinguser_id = response.data[0].Assigned_To;
            $scope.project1 = response.data[0].projectid;
            $scope.params.project_id = response.data[0].projectid;
            $scope.people_type = response.data[0].people_type;
            //$scope.params.radioValue = response.data[0].gender;
            $scope.gender = response.data[0].gender;
        },
        function (error)
        {
            console.log("Error " + error.state);
        }
      );


        // CALLBACKS
        uploader.onSuccessItem = function (fileItem, response, status, headers)
        {
            // post image upload call the below api to update the database
            var uploadResult = response[0];

            // TODO: Need to get these values dynamically
            var postData =
            {
                contact_id: $scope.seletedCustomerId,
                user_id:$scope.params.user_id,
                organization_id: $cookieStore.get('orgID'),
                class_type: "Contact",
                media_name: uploadResult.Name,
                media_url: uploadResult.Location,
                age: $scope.params.age,
                gender: $scope.gender,
                people_type: $scope.people_type,
                first_name: $scope.params.Contact_First_Name,
                last_name: $scope.params.Contact_Last_Name,
                //people_type: $scope.params.Type,
                designation: $scope.params.Title,
                contact_element_info_email: $scope.choices1[0].Contact_Email,
                contact_element_info_phone: $scope.choices[0].Contact_Phone,
                state: $scope.params.State,
                project_id: $scope.params.projectid,
                city: $scope.params.City,
                zip_code: $scope.params.zipcode,
                Street_1: newadd.Street_1,
                Street_2: newadd.Street_2,
                city_id: $scope.city1,
                state_id: $scope.state1,
                mappinguser_id: $scope.params.mappinguser_id
          };

            apiService.post("Contact/Edit", postData).then(function (response)
            {
                var loginSession = response.data[0];
                $scope.openSucessfullPopup();
                $modalInstance.dismiss();

                var media = [];
                for (var i in $scope.choices1) {
                    var postData_email =
                        {
                            id: $scope.choices1[i].class_id,
                            class_id: window.sessionStorage.selectedCustomerID,
                            class_type: "Contact",
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
                            class_type: "Contact",
                            element_type: "phone_contact",
                            element_info1: $scope.choices[i].Contact_Phone,
                        }
                    media.push(postData_phone);
                }

               

                apiService.post("ElementInfo/Create", media).then(function (response) {
                    var loginSession = response.data;
                   
                },
               function (error)
               {

               });

            },
           function (error)
           {

           });


     

    };


        uploader.onErrorItem = function (fileItem, response, status, headers)
        {
            alert('Unable to upload file.');
        };

        uploader.onCompleteItem = function (fileItem, response, status, headers)
        {
            $scope.showProgress = false;
        };

        $scope.openSucessfullPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/Edited.tpl.html',
                backdrop: 'static',
                controller: EditsucessfullController,
                size: 'md',
                resolve: { items: { title: "Contact" } }
            });

        }

        $scope.params =
        {
            first_name: $scope.Contact_First_Name,
            last_name: $scope.Contact_Last_Name,
            contact_element_info_email: $scope.Contact_Email,
            contact_element_info_phone: $scope.Contact_Phone,
            state: $scope.State,
            city: $scope.City,
            age: $scope.age,
            gender: $scope.gender,
            zip_code: $scope.zip_code,
            people_type: $scope.people_type,
            designation: $scope.Title,
            organization_id: $cookieStore.get('orgID'),
            User_ID: $scope.user_id,
            street_1: $scope.street_1,
            street_2: $scope.street_2,
            project_id: $scope.project_id,
           
        };



        $scope.cancel = function ()
        {
            $modalInstance.dismiss('cancel');
        };

        $scope.reset = function ()
        {
            $scope.params = {};
        }

        $scope.choices = [{ id: 'choice1' }];

        $(document).on("click", ".remove-field", function ()
        {
            $(this).parent().remove();
        });

        $scope.choices = [{ id: 'choice1' }];
        $scope.addNewChoice = function (e)
        {
            var classname = e.currentTarget.className;
            if (classname == 'remove-field')
            {

            }
            else if ($scope.choices.length)
            {
                var newItemNo = $scope.choices.length + 1;
                $scope.choices.push({ 'id': 'choice' + newItemNo });
            }
        };
        $scope.choices1 = [{ id: 'choice1' }];

        $scope.addNewChoice1 = function (e)
        {
            var classname = e.currentTarget.className;
            if (classname == 'remove-field')
            {

            }
            else if ($scope.choices1.length)
            {
                var newItemNo = $scope.choices1.length + 1;
                $scope.choices1.push({ 'id': 'choice' + newItemNo });
            }
        };


    
        $scope.choices2 = [{ id: 'choice1' }];

        $scope.addNewChoice2 = function (e)
        {
                var classname = e.currentTarget.className;
                if (classname == 'remove-field')
                {
                    var wrappedResult = angular.element(this);
                    wrappedResult.parent().remove();
                    $scope.choices2.pop();
                }
                else if ($scope.choices2.length < 2)
                {
                    var newItemNo2 = $scope.choices2.length + 1;
                    $scope.choices2.push({ 'id': 'choice' + newItemNo2 });
                }

          };

        Url = "ElementInfo/GetElementInfo?Id=" + $scope.seletedCustomerId + "&&type=Contact";

        apiService.get(Url).then(function (response) {
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
                if (data[i].element_type == "address_contact") {
                    if (c > 0) { $scope.choices2.push({ 'id': 'choice' + (c + 1) }); }
                    $scope.choices2[c].street1 = data[i].element_info1;
                    $scope.choices2[c].class_id = data[i].class_id;
                    c++;
                }
            }

        },
        function (error)
        {
            alert("Error " + error.state);
        });

        Url = "project/Get/" + $cookieStore.get('orgID');
        apiService.get(Url).then(function (response)
        {
            $scope.projects = response.data;
        },
       function (error)
       {
           alert("Error " + error.state);
       });

        $scope.selectproject = function ()
        {
            $scope.params.project_id = $scope.project1;
            //alert($scope.params.project_id);
        };

        $scope.selectgender = function () {
            $scope.params.gender = $scope.gender;
            //alert($scope.params.month);
        };


        $scope.selecttype = function () {
            $scope.params.people_type = $scope.people_type;
            //alert($scope.params.month);
        };


        Url = "user/Get/" + $cookieStore.get('orgID');
        apiService.get(Url).then(function (response)
        {
            $scope.users = response.data;
        },
       function (error)
       {
           alert("Error " + error.state);
       });

        $scope.selectuser = function ()
        {
            $scope.params.mappinguser_id = $scope.user1;
            //alert($scope.params.user_id);
        };

        Url = "GetCSC/state";
        apiService.get(Url).then(function (response)
        {
            $scope.states = response.data;
        },
        function (error)
        {
            alert("Error " + error.state);
        });

        $scope.selectstate = function (state)
        {
            $scope.params.State = $scope.state1;
            //alert($scope.params.state);
        };


        Url = "GetCSC/city";
        apiService.get(Url).then(function (response)
        {
            $scope.cities = response.data;
        },
        function (error)
        {
        alert("Error " + error.cities);
        });

        $scope.filterExpression = function (city)
        {
            return (city.stateid === $scope.state1);
        };

        $scope.selectcity = function ()
        {
            $scope.params.City = $scope.city1;
            //alert($scope.params.city);
        };

        $scope.addNewContact = function (isValid)
        {
            $scope.showValid = true;

            if (isValid)
            {

                contactList.first_name = $scope.params.first_name;
                contactList.last_name = $scope.params.last_name;
                contactList.User_ID = $scope.params.User_ID;
                contactList.organization_id = $scope.params.organization_id;
                contactList.people_type = 'Lead';
                contactList.who_am_i = $scope.who_am_i;
                //                
                contactList.Android_SmartPhone_Version = $scope.Android_SmartPhone_Version;
                contactList.Android_Tablet_Version = $scope.Android_Tablet_Version;
                contactList.iPad_Version = $scope.iPad_Version;
                contactList.iPhone_Version = $scope.iPhone_Version;
                contactList.Kiosk_Version = $scope.Kiosk_Version;
                contactList.allPhone = $scope.params.all_phone;

                contactList.contact_mobile = $scope.params.mobile;
                contactList.contact_email = $scope.params.email;
                contactList.who_am_i = $scope.who_am_i;


                if (contactList.who_am_i == 'others')
                {
                    contactList.others = $scope.others;
                }

                new ContactCreate(contactList).then(function (response)
                {
                    console.log(response);
                    $scope.showValid = false;
                    $scope.params.first_name = "";
                    $scope.params.last_name = "";
                    $scope.params.email = "";
                    $scope.params.mobile = "";

                },
            function (error)
            {
                console.log(error);
            });

        }
            if (isValid)
            {
                $scope.showValid = false;
                console.log(isValid);
                if (isValid)
                {
                    $scope.showValid = false;
                } else
                {
                    $scope.showValid = true;
                }
            }


    }


};



