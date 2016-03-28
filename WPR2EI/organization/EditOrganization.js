﻿
var EditOrgPopUpController = function ($scope, $state, $modalInstance, $cookieStore,$rootScope, apiService, $modal, $window, FileUploader, uploadService) {
    console.info("EditOrgPopUpController");
  
    var orgID = $cookieStore.get('orgID');
    var uploader = $scope.uploader = new FileUploader({
       url: apiService.uploadURL,
      
    });

   

    uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
        }
    });

    uploader.onAfterAddingFile = function (fileItem, response, status, headers) {
        if (uploader.queue.length > 1) {
            uploader.removeFromQueue(0);
        }
    }


    $(document).ready(function () {
        $("#organization_address").kendoEditor();
    });



    if (orgID !== '') {
       
        GetUrl = "Organization/Get/" + orgID;
        apiService.getWithoutCaching(GetUrl).then(function (response) {

            $scope.data = response.data[0];

            $scope.name = $scope.data.name;
            $scope.organization_id = $scope.data.organization_id;
            $scope.description = $scope.data.description;
            $scope.name = $scope.data.name;
            //$scope.address = $scope.data.address;
            $scope.street_1 = $scope.data.street_1;
            $scope.street_2 = $scope.data.street_2;
           
            $scope.email = $scope.data.email;
            $scope.phone_no = $scope.data.phone_no;
            $scope.pan_no = $scope.data.pan_no;
            $scope.tan_no = $scope.data.tan_no;
            $scope.service_tax_no = $scope.data.service_tax_no;
            $scope.cin_no = $scope.data.cin_no;
            $scope.fiscal_year = $scope.data.fiscal_year;
            $scope.language = $scope.data.language;
            $scope.timezone = $scope.data.timezone;
            $scope.divisions = $scope.data.divisions;
            if ($scope.data.contact_mobile !== '') {
                $scope.mobile = $scope.data.contact_mobile;
            }
            
            $scope.choices1[0].email = $scope.data.email;           
            $scope.choices[0].phone_no = $scope.data.phone_no;

            $scope.month1 = response.data[0].first_month_of_financial_year_id;
            $scope.timezone1 = response.data[0].timezone_id

            $scope.country1 = response.data[0].country_id;
            
            $scope.state1 = response.data[0].state_id;
            $scope.params.state = response.data[0].state_id;
            $scope.city1 = response.data[0].city_id;
            $scope.params.city = response.data[0].city_id;
            $scope.zip_code = $scope.data.zip_code;
            $scope.directory1 = $scope.data.list_in_builder_directory;


        },
       function (error)
       { if (error.status === 400)
         alert(error.data.Message);
         else
         alert("Network issue");
         });
    }

   


    Url = "ElementInfo/GetElementInfo?Id=" + orgID + "&&type=Organization";

    apiService.getWithoutCaching(Url).then(function (response) {
        data = response.data;
        a = 0, b = 0;
        for (i = 0; i < data.length; i++) {
            if (data[i].element_type == "email_org") {
                if (a > 0) { $scope.choices1.push({ 'id': 'choice' + (a+1) }); }
                $scope.choices1[a].email = data[i].element_info1;
                $scope.choices1[a].class_id = data[i].class_id;
                a++;
            }
            if (data[i].element_type == "phone_org") {
                if (b > 0) { $scope.choices.push({ 'id': 'choice' + (b + 1) }); }
                $scope.choices[b].phone_no = data[i].element_info1;
                $scope.choices[b].class_id = data[i].class_id;
                b++;
            }
        }

    },
function (error)
{
    if (error.status === 400)
        alert(error.data.Message);
    else
        alert("Network issue");
});

 uploader.onSuccessItem = function (fileItem, response, status, headers)
    {
     $scope.data.media_url = response[0].Location;
        uploader_done = true;
        if (uploader_done == true)
        {
            $scope.showProgress = false;
            $scope.finalpost();
        }
    }

        // TODO: Need to get these values dynamically
       
       
        var called = false;

        $scope.finalpost = function ()
        {

            if (called == true)
            {
                return;
            }

            var postData = {

                media_url: $scope.data.media_url,
                class_type: "Organization",
                name: $scope.name,
                address: $scope.address,
                organization_id: $cookieStore.get('orgID'),
                userid: $cookieStore.get('userId'),
                Media_Type: "Organization_Logo",
                description: $scope.description,
                divisions: $scope.divisions,
                email: $scope.choices1[0].email,
                phone_no: $scope.choices[0].phone_no,
                language: $scope.language,
                list_in_builder_directory: $scope.directory1,
                pan_no: $scope.pan_no,
                tan_no: $scope.tan_no,
                service_tax_no: $scope.service_tax_no,
                cin_no: $scope.cin_no,
                first_month_of_financial_year: $scope.params.month,
                timezone: $scope.params.timezone,
                street_1: $scope.street_1,
                street_2: $scope.street_2,
                city: $scope.city1,
                state: $scope.state1,
                zip_code: $scope.zip_code,
                country: $scope.country1,
                first_month_of_financial_year: $scope.month1,
                timezone:$scope.timezone1



            };

            apiService.post("Organization/Edit", postData).then(function (response)
            {
                //alert("hi dude");
                var loginSession = response.data;
                var media = [];
                for (var i in $scope.choices1) {
                    var postData_email =
                        {
                            id: $scope.choices1[i].class_id,
                            class_id: $cookieStore.get('orgID'),
                            class_type: "Organization",
                            element_type: "email_org",
                            element_info1: $scope.choices1[i].email,
                        }
                    media.push(postData_email);
                }

                for (var i in $scope.choices) {
                    var postData_phone =
                        {
                            id: $scope.choices[i].class_id,
                            class_id: $cookieStore.get('orgID'),
                            class_type: "Organization",
                            element_type: "phone_org",
                            element_info1: $scope.choices[i].phone_no,
                        }
                    media.push(postData_phone);
                }

                apiService.post("ElementInfo/Create", media).then(function (response) {
                    var loginSession = response.data;
                    //called = true;
                },
               function (error) {
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

          
            $scope.openSucessfullPopup();
            $modalInstance.dismiss();
            $rootScope.$broadcast('REFRESH', 'organization');

        }

        uploader.onErrorItem = function (fileItem, response, status, headers) {
            alert('Unable to upload file.');
        };

        uploader.onCompleteItem = function (fileItem, response, status, headers) {
            $scope.showProgress = false;
        };
       
        $scope.params = {

            name: $scope.name,

            street_1: $scope.street_1,
            street_2: $scope.street_2,
            description: $scope.description,
            divisions: $scope.divisions,
            email: $scope.email,
            phone_no: $scope.phone_no,
            language: $scope.language,
            list_in_builder_directory: $scope.directory1,
            pan_no: $scope.pan_no,
            tan_no: $scope.tan_no,
            service_tax_no: $scope.service_tax_no,
            first_month_of_financial_year: $scope.first_month_of_financial_year,
            cin_no: $scope.cin_no,
            organization_id: $cookieStore.get('orgID'),
            User_ID: $cookieStore.get('userId'),
            city: $scope.city,
            state: $scope.state,
            zip_code: $scope.zip_code,
            country: $scope.country,

        };

        $scope.choices = [{ id: 'choice1' }];

        $(document).on("click", ".remove-field5", function () {
            $(this).parent().remove();
        });

        $scope.choices = [{ id: 'choice1' }];
        $scope.addNewChoice = function (e) {
            var classname = e.currentTarget.className;
            if (classname == 'remove-field5') {

            }
            else if ($scope.choices.length) {
                var newItemNo = $scope.choices.length + 1;
                $scope.choices.push({ 'id': 'choice' + newItemNo });
            }

        };



        $scope.choices1 = [{ id: 'choice1' }];
        $scope.addNewChoice1 = function (e) {
            var classname = e.currentTarget.className;
            if (classname == 'remove-field5') {

            }
            else if ($scope.choices1.length) {
                var newItemNo = $scope.choices1.length + 1;
                $scope.choices1.push({ 'id': 'choice' + newItemNo });
            }

        };
        Url = "GETCSC/GetTime";

        apiService.get(Url).then(function (response) {
            $scope.timezone = response.data;

        },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    });


        $scope.SelectTimezone = function () {
            $scope.params.timezone = $scope.timezone1;
            //alert($scope.params.timezone);
        };

        $scope.openSucessfullPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/Edited.tpl.html',
                backdrop: 'static',
                controller: EditsucessfullController,
                size: 'md',
                resolve: { items: { title: "Organization" } }
            });

        }

        Url = "GETCSC/GetMonth";

        apiService.get(Url).then(function (response) {
            $scope.month = response.data;

        },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    });

        $scope.selectmonth = function () {
            $scope.params.month = $scope.month1;
            //alert($scope.params.month);
        };




        $scope.selectbuilder = function () {
            $scope.params.list_in_builder_directory = $scope.directory1;
            //alert($scope.params.month);
        };


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
            //alert($scope.params.state);
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
            //alert($scope.params.city);
        };

        $scope.filterExpression = function (city) {
            return (city.stateid === $scope.params.state);
        };


        Url = "GetCSC/Country";

        apiService.get(Url).then(function (response) {
            $scope.countries = response.data;

        },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    });
        $scope.selectcountry = function () {
            $scope.params.country = $scope.country1;
            //alert($scope.params.country);
        };

       

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


