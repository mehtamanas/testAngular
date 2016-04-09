
var EditUserPopUpController = function ($scope, $state, $modalInstance, $cookieStore, $rootScope, apiService, $modal, $window, FileUploader, uploadService, PATTERNREGEXS) {
    //console.log("EditUserPopUpController");
    $scope.role_name = [];
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    $scope.emailRegex = PATTERNREGEXS.email;
    var orgID = $cookieStore.get('orgID');
    var uploader = $scope.uploader = new FileUploader({
        url: apiService.uploadURL,

    });

    $scope.selectOptions = {
        valuePrimitive: true,
        placeholder: "Select Roles...",
        dataTextField: "name",
        dataValueField: "id",
        autoBind: false,
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: function (options) {
                    apiService.getWithoutCaching("Role/Get/442aa5f4-4298-4740-9e43-36ee021df1e7").then(function (res) {
                        $scope.roles = res.data;
                        options.success($scope.roles);
                    }, function (err) {
                        options.error([]);
                    })
                }
            }
        }
    };
    console.log($scope.role_name + 'after load');


    if ($scope.seletedCustomerId !== '') {
        GetUrl = "User/GetUserDetails/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;
        apiService.getWithoutCaching(GetUrl).then(function (response) {
            $scope.params = response.data[0];
            $scope.choices1[0].account_email = response.data[0].account_email;
           
            $scope.choices[0].account_phone = response.data[0].account_phone;
            $scope.choices2[0].Street_1 = response.data[0].street_1;
            $scope.choices2[0].Street_2 = response.data[0].Street_2;
            $scope.params.role_name = response.data[0].role_id.split(',');
            $scope.role_name = response.data[0].role_id.split(',');
            //    $scope.state = $scope.data[0].state_id;
            //  $scope.city = $scope.data[0].city_id
            // $scope.street_1 = response.data[0].street_1;
            //     $scope.state = $scope.data[0].state;
            //   $scope.city = $scope.data[0].city;
            $scope.state1 = response.data[0].state_id;
            $scope.params.state = response.data[0].state_id;
            $scope.city1 = response.data[0].city_id;
            $scope.params.city = response.data[0].city_id;


        },
                   function (error) {
                       if (error.status === 400)
                           alert(error.data.Message);
                       else
                           alert("Network issue");
                   });
    }

    Url = "ElementInfo/GetElementInfo?Id=" + $scope.seletedCustomerId + "&&type=User";

    apiService.getWithoutCaching(Url).then(function (response) {
        data = response.data;
        a = 0, b = 0, c = 0;
        for (i = 0; i < data.length; i++) {
            if (data[i].element_type == "email_user") {
                if (a > 0) { $scope.choices1.push({ 'id': 'choice' + (a + 1) }); }
                $scope.choices1[a].account_email = data[i].element_info1;
                $scope.choices1[a].class_id = data[i].class_id;
                a++;
            }
            if (data[i].element_type == "phone_user") {
                if (b > 0) { $scope.choices.push({ 'id': 'choice' + (b + 1) }); }
                $scope.choices[b].account_phone = data[i].element_info1;
                $scope.choices[b].class_id = data[i].class_id;
                b++;
            }

        }

    },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });



    $scope.params =
        {
            first_name: $scope.first_name,
            last_name: $scope.last_name,
            account_email: $scope.account_email,
            account_phone: $scope.account_phone,
            role_name: $scope.role_name,
            Street_1: $scope.Street_1,
            // Street_2: $scope.Street_2,
            area: $scope.area,
            zip_code: $scope.zip_code,
            state: $scope.state,
            city: $scope.city,
            organization_id: $cookieStore.get('orgID'),
            User_ID: window.sessionStorage.selectedCustomerID,
        };



    $scope.choices = [{ id: 'choice1' }];





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

    //state and city functionality
    Url = "GetCSC/state";
    apiService.get(Url).then(function (response) {
        $scope.states = response.data;
    },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    });

    $scope.selectstate = function () {
        $scope.params.state = $scope.state1;
        $scope.city1 = "";

    };

    Url = "GetCSC/city";
    apiService.get(Url).then(function (response) {
        $scope.cities = response.data;
    },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    });

    $scope.selectcity = function () {
        $scope.params.city = $scope.city1;
    };

    ///filtering of state city
    $scope.filterExpression = function (city) {
        return (city.stateid === $scope.params.state);
    };




    //Url = "Role/Get/442aa5f4-4298-4740-9e43-36ee021df1e7";
    //apiService.get(Url).then(function (response) {
    //    $scope.roles = response.data;
    //},
    //function (error)
    //{
    //    if (error.status === 400)
    //        alert(error.data.Message);
    //    else
    //        alert("Network issue");
    //});

    $scope.selectrole = function () {
        $scope.params.role_name = $scope.role_name;
    };

    //end state and city functionality

    //cancel and reset functionality

    $scope.reset = function () {
        $scope.params = {};
    }

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    //end cancel and reset functionality
    $scope.addNew = function (isValid) {

        $scope.showValid = true;
        //   new OrgEdit($scope.params);
        if (isValid) {

            $scope.showValid = false;

        }
    };

    //uploader functionality
    // FILTERS
    uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            // return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;

            var im = '|jpg|png|jpeg|bmp|gif|'.indexOf(type);
            if (im === -1) {

                alert('You have selected inavalid file type');
            }
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    uploader.onErrorItem = function (fileItem, response, status, headers) {
        alert('Unable to upload file.');
    };

    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        $scope.showProgress = false;
    };


    uploader.onAfterAddingFile = function (fileItem, response, status, headers) {
        if (uploader.queue.length > 1) {
            uploader.removeFromQueue(0);
        }
    }

    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database
        // var uploadResult = response[0];
        $scope.params.media_url = response[0].Location;
        uploader_done = true;
        if (uploader_done == true) {
            $scope.showProgress = false;
            $scope.finalpost();
        }
    };



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

        var postData =
            {
                // media_name: uploadResult.media_name,
                media_url: $scope.params.media_url,
                class_type: "Organization",
                organization_id: $cookieStore.get('orgID'),
                User_ID: window.sessionStorage.selectedCustomerID,
                first_name: $scope.params.first_name,
                last_name: $scope.params.last_name,
                account_email: $scope.choices1[0].account_email,
                account_phone: $scope.choices[0].account_phone,
                role_name: $scope.params.role_name,
                Street_1: newadd.Street_1,
                Street_2: newadd.Street_2,
                area: $scope.params.area,
                //Street_2: newadd.Street_2,
                zip_code: $scope.params.zip_code,
                state: $scope.params.state,
                city: $scope.params.city
            };
        if ($scope.params.first_name != undefined && $scope.params.last_name != undefined && $scope.params.role_name != undefined) {
            apiService.post("User/Edit", postData).then(function (response) {
                var loginSession = response.data;                               
                $scope.openSucessfullPopup();
                $modalInstance.dismiss();
                $scope.getUserRole(postData.role_name);
            },
            function (error) {
                if (error.status === 400)
                    alert(error.data.Message);
                else
                    alert("Network issue");
            });

            var media = [];
            for (var i in $scope.choices1) {
                var postData_email =
                    {
                        id: $scope.choices1[i].class_id,
                        class_id: window.sessionStorage.selectedCustomerID,
                        class_type: "User",
                        element_type: "email_user",
                        element_info1: $scope.choices1[i].account_email,
                    }
                media.push(postData_email);
            }

            for (var i in $scope.choices) {
                var postData_phone =
                    {
                        id: $scope.choices[i].class_id,
                        class_id: window.sessionStorage.selectedCustomerID,
                        class_type: "User",
                        element_type: "phone_user",
                        element_info1: $scope.choices[i].account_phone,
                    }
                media.push(postData_phone);
            }


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

            var usersToBeAddedOnServer = [];

            for (var i in $scope.role_name) {
                var newMember = {};
                newMember.role_user_id = $scope.choices1[0].account_email;
                newMember.role_id = $scope.params.role_name[i];
                newMember.user_id = $cookieStore.get('userId');
                newMember.organization_id = $cookieStore.get('orgID');
                usersToBeAddedOnServer.push(newMember);
            }
            apiService.post("Mapping/UserToRoleEdit", usersToBeAddedOnServer).then(function (response) {
                var loginSession = response.data;


            },
           function (error) {
               if (error.status === 400)
                   alert(error.data.Message);
               else
                   alert("Network issue");
           });

           

        }

    }


    $scope.getUserRole=function(id)
    {
        $cookieStore.remove('UserRole');
        roles = [];
        for (i = 0; i < id.length;i++)
        roles.push(_.find($scope.roles, function (o) { return o.id == id[i]; }).name)
        $cookieStore.put('UserRole',roles);
    }

    $(document).on("click", ".remove-field", function () {
        var removedElement = $(this).parent().find('#edituser_mail').val();
        var removedElement1 = $(this).parent().find('#edituser_phno').val();

        for (var i in $scope.choices1) {
            if (removedElement == $scope.choices1[i].account_email) {
                $scope.choices1.splice(i, 1);
                fnd = 1;
            }

        }
        for (var i in $scope.choices) {
            if (removedElement1 == $scope.choices[i].account_phone) {
                $scope.choices.splice(i, 1);
                fnd = 1;
            }

        }

        $(this).parent().remove();
    });

    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/Edited.tpl.html',
            backdrop: 'static',
            controller: EditsucessfullController,
            size: 'sm',
            resolve: { items: { title: "User" } }
        });
        $rootScope.$broadcast('REFRESH', 'newuser');
    }

    $scope.CanceUpload = function () {
        uploader.cancelAll();
        console.log("UploadCancelled");

    }
    $scope.addNewUser = function (isValid) {

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


