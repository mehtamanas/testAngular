﻿/**
 * Created by dwellarkaruna on 24/10/15.
 */
var PaymentUpController = function ($scope, $state, $cookieStore, apiService,FileUploader, $modalInstance,bookingService, $modal, $rootScope,$window) {
    console.log('PaymentUpController');
    $scope.loadingDemo = false;
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    var orgID = $cookieStore.get('orgID');
    //Audit log start															
    $scope.params =
        {
            device_os: $cookieStore.get('Device_os'),
            device_type: $cookieStore.get('Device'),
            device_mac_id: "34:#$::43:434:34:45",
            module_id: "Contact",
            action_id: "Contact View",
            details: "AddNewPayment",
            application: "angular",
            browser: $cookieStore.get('browser'),
            ip_address: $cookieStore.get('IP_Address'),
            location: $cookieStore.get('Location'),
            organization_id: $cookieStore.get('orgID'),
            User_ID: $cookieStore.get('userId')
        };

    AuditCreate = function (param) {
        apiService.post("AuditLog/Create", param).then(function (response) {
            var loginSession = response.data;
            $scope.loadingDemo = false;
        },
   function (error) {

   });
    };
    AuditCreate($scope.params);

    //end


    var uploader = $scope.uploader = new FileUploader({
        url: apiService.uploadURL,
    });

    $scope.showProgress = false;

    // FILTERS
    uploader.filters.push({
        name: 'imageFilter',
        fn: function (item /*{File|FileLikeObject}*/, options) {
            var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
            var im = '|jpg|png|jpeg|bmp|gif|pdf|docx|doc|txt|csv|ods|'.indexOf(type);
            if (im === -1) {

                alert('You have selected inavalid file type');
            }
            return '|jpg|png|jpeg|bmp|gif|pdf|docx|doc|txt|csv|ods|'.indexOf(type) !== -1;
        }
    });

    uploader.onAfterAddingFile = function (fileItem, response, status, headers) {
        if (uploader.queue.length > 1) {
            uploader.removeFromQueue(0);
        }
    }
    uploader.onSuccessItem = function (fileItem, response, status, headers) {
        // post image upload call the below api to update the database

        $scope.media_url = response[0].Location;
        uploader_done = true;
        if (uploader_done == true) {
            $scope.showProgress = false;
            $scope.finalpost();
        }

    };



    uploader.onErrorItem = function (fileItem, response, status, headers) {
        alert('Unable to upload file.');
    };

    uploader.onCompleteItem = function (fileItem, response, status, headers) {
        $scope.showProgress = false;
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }

    AuditCreate($scope.params);

    //end

    var called = false;

    $scope.finalpost = function ()
    {
        if (called == true) {
            return;
        }

        var dDate = moment($scope.params.duedate, "DD/MM/YYYY hh:mm A")._d;
        var postData = {
            user_id: $cookieStore.get('userId'),
            organization_id: $cookieStore.get('orgID'),
            payment_schedule_id: $scope.params.payment_type1,
            Amount: $scope.params.Amount,
            name: $scope.params.name,
            text: $scope.params.text,
            payment_schedule_detail_id:$scope.payementScheme,
            datepaid: $scope.params.datepaid,
            duedate: $scope.params.duedate,
            payment_term:$scope.params.payment_term,
            booking_id: $scope.bookingID,
            //duedate: new Date(dDate).toISOString(),
            contact_id: window.sessionStorage.selectedCustomerID,           
        };

        apiService.post("Payment/CreateAddNewPayment", postData).then(function (response) {
            var loginSession = response.data;
            $scope.openSucessfullPopup();
            $modalInstance.dismiss();
            $rootScope.$broadcast('REFRESH', 'PaymentGrid');
            called = true;
        },

     function (error) {

     });

        $scope.openSucessfullPopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'newuser/sucessfull.tpl.html',
                backdrop: 'static',
                controller: sucessfullController,
                size: 'sm',
                resolve: { items: { title: "Payment" } }
            });
        }

       
    }
   
    $scope.params = {
        //payment_schedule_id:$scope.payment_type1,
        payment_schedule_id: $scope.payment_type1,
        Amount: $scope.Amount,
        duedate: $scope.duedate,
        name: $scope.name,
        payment_term:$scope.payment_term,
        datepaid:$scope.datepaid,
        text:$scope.text,
        booking_id: $scope.booking_id,
        payment_schedule_detail_id: $scope.payment_schedule_detail_id,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),
        //contact_id: window.sessionStorage.selectedCustomerID,
    };

    var emp = {
        //  payment_type1: $scope.payment_type1,
        payment_schedule_id: $scope.payment_type1,
        Amount: $scope.Amount,
        duedate: $scope.duedate,
        name: $scope.name,
        payment_term: $scope.params.payment_term,
        datepaid: $scope.datepaid,
        text: $scope.text,
        payment_schedule_detail_id:$scope.payment_schedule_detail_id,
        booking_id: $scope.booking_id,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),
        contact_id: window.sessionStorage.selectedCustomerID,
    };

        Url = "Payment/GetPayment";

        apiService.get(Url).then(function (response) {
            $scope.payment = response.data;

        },
    function (error) {
        console.log("Error " + error.state);
    });

        $scope.selectpay = function () {
            $scope.params.payment_type1 = $scope.pay1;
            //alert($scope.params.user_id);
        };

        $scope.selectPayTerms = function () {
            $scope.params.payment_term = $scope.payTerms;
        }

        $scope.selectBooking = function () {
            bookingService.getBookingsByContactId($scope.seletedCustomerId).then(function (response) {
                $scope.booking = response.data;
            
        })
        };


        $scope.selectBookingScheme = function () {

            Url = "Booking/GetSchemeTerms/" + $scope.bookingID;
            apiService.get(Url).then(function (response) {
                $scope.bookingScheme = response.data;
            },
           function (error) {
               if (error.status === 400)
                   alert(error.data.Message);
               else
                   alert("Network issue");
           });
        }

        
        $scope.selectPayementScheme = function () {
            $scope.payementScheme = $scope.payementScheme;
        }
       

        $scope.addNewPayment = function (isValid)
        {
            $scope.showValid = true;
            if (isValid)
            {
                $scope.loadingDemo = true;
                $scope.finalpost();
                $rootScope.$broadcast('REFRESH', 'PaymentGrid');

            $scope.showValid = false;

            }

        }
        $scope.selectBooking();
};