angular.module('Bookings')
.controller('bookingPreviewCtrl', ['$scope', '$state', '$cookieStore', 'bookingService', '$rootScope', 'apiService', '$modal', function ($scope, $state, $cookieStore, bookingService, $rootScope, apiService, $modal) {

    //$scope.bookingId = "12345";

    $scope.quoteId = $state.params.quoteId == null ? null : $state.params.quoteId;
    $scope.bookingId = $state.params.bookingId == null ? null : $state.params.bookingId;

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

    $scope.bookingPreviewInit = function () {

        if ($scope.quoteId != null) {
            bookingService.getBookingByQuoteId($scope.quoteId).then(function (response) {
           
                $scope.data = response.data;
                $scope.organizationName = $scope.data.Organization.name;
                $scope.organizationAddress = $scope.data.Organization.address;
                $scope.organizationEmail = $scope.data.Organization.email;
                $scope.organizationPhone_no = $scope.data.Organization.phone_no;
                $scope.organizationPhone_no = $scope.data.Organization.phone_no;
                $scope.organizationService_tax_no = $scope.data.Organization.service_tax_no;
                $scope.organizationPan_no = $scope.data.Organization.pan_no;

                $scope.contactName = $scope.data.ContactSummary.Name;
                $scope.contactStreet1 = $scope.data.ContactSummary.street1;
                $scope.contactStreet2 = $scope.data.ContactSummary.street2;
                $scope.contactCity = $scope.data.ContactSummary.City;
                $scope.contactZipcode = $scope.data.ContactSummary.zip_code;
                $scope.contactStateName = $scope.data.ContactSummary.state_name;
                $scope.Contact_Id = $scope.data.ContactSummary.Contact_Id;


                $scope.contactEstimate_no = $scope.data.Quote.estimate_no;
                $scope.contactExpirationDate = $scope.data.Quote.expiration_date;
                $scope.contactAdditionalDiscount = $scope.data.Quote.additional_discount;
                $scope.contactFinalTotal = $scope.data.Quote.final_total;
                $scope.contactDiscount = $scope.data.Quote.discount;

                $scope.contactTowerName = $scope.data.FloorDetails.tower_name;
                $scope.contactFloorNo = $scope.data.FloorDetails.floor_num;
                $scope.contactUnitNo = $scope.data.FloorDetails.unit_no;
                $scope.contactCarpetArea = $scope.data.FloorDetails.carpet_area;
                $scope.contactSaleable = $scope.data.FloorDetails.super_built_up_area;
                $scope.contactUnitTypeDesc = $scope.data.FloorDetails.unit_type_desc;
                $scope.contactcar_park_id = $scope.data.FloorDetails.car_park_id;
                $scope.contactcTotalConsideration = $scope.data.FloorDetails.total_consideration;
                $scope.contactcFloorRiseApplicable = $scope.data.FloorDetails.floor_rise_applicable;
                $scope.contactcServiceTax = [];
                $scope.quoteGovermentCharge = [];
                $scope.quoteOtherCharge = [];
                $scope.sumamount = 0;
                $scope.sumservice = 0.0;
                for (i = 0; i < $scope.data.UnitPaymentSchemes.length; i++)
                {
                    $scope.contactcServiceTax[i] = { service_tax: $scope.data.UnitPaymentSchemes[i].service_tax, amount: $scope.data.UnitPaymentSchemes[i].amount, due_date: $scope.data.UnitPaymentSchemes[i].due_date, paymentDescription: $scope.data.UnitPaymentSchemes[i].payment_description, percentage: $scope.data.UnitPaymentSchemes[i].percentage};
                    $scope.sumamount = $scope.sumamount + $scope.data.UnitPaymentSchemes[i].amount;
                    $scope.sumservice = $scope.sumservice + parseFloat($scope.data.UnitPaymentSchemes[i].service_tax);
                }

                for (i = 0; i < $scope.data.GovernmentCharges.length; i++)
                {
                    $scope.quoteGovermentCharge[i] = { govchargeName: $scope.data.GovernmentCharges[i].charge_name, chargeAmount: $scope.data.GovernmentCharges[i].Charge_amount };
                   
                }
                for (i = 0; i < $scope.data.OtherCharges.length; i++) {
                    $scope.quoteOtherCharge[i] = { otherchargeName: $scope.data.OtherCharges[i].charge_name, otherchargeAmount: $scope.data.OtherCharges[i].Charge_amount };

                }

            }, function (error) {
                alert(error.data.Message);
            });
        }
        else {
            //get bookingByBookingid
        }
    }

    $scope.bookNow = function () {
        var postData = {
            user_id: $cookieStore.get('userId'),
            organization_id: $cookieStore.get('orgID'),
            quote_id: $state.params.quoteId,
            contact_id: $scope.Contact_Id,
            booking_amount:$scope.contactFinalTotal,

        };

        apiService.post("Booking/Create", postData).then(function (response) {
            var loginSession = response.data;
            $scope.openSucessfullPopup();
            $state.go('app.bookings');

        },
        function (error) {
            if (error.status === 400)
                alert(error.data.Message);
            else
                alert("Network issue");
        });
    }


    $scope.openSucessfullPopup = function () {

        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'sm',
            resolve: { items: { title: "Booking" } }
        });
    }


    $scope.bookingPreviewInit();

    //Decline Popup Code//
    $scope.openDecline = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'booking/bookingdecline.html',
            backdrop: 'static',
            controller: bookingDeclineController,
            size: 'lg'
        });
    };

    $scope.decline = function ()
    {
        $scope.openDecline();
    }

}]);
