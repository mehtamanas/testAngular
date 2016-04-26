angular.module('contacts')

.controller('propertyCustomizDue', function ($scope, $state, $cookieStore, apiService, $rootScope, $modal) {
    console.log('propertyCustomizDue');
    $rootScope.title = 'Dwellar-peopertyQuotes';
    var org_id =$cookieStore.get("organizationId");

    var UserId = $cookieStore.get("user_id");
   
    var project_id = $cookieStore.get("projectId");
    var customer_id = $cookieStore.get("customerId");
    var typeOfOffer = $cookieStore.get("OfferType");
    var towerDetalis = $cookieStore.get("Tower_id");
    var wingDetails = $cookieStore.get("wing_id");
    var floorDetails = $cookieStore.get("floor_id");
    var UnitDetail = $cookieStore.get("unitDescription");
    var radio_value = $cookieStore.get("discountType");
    var additionalDiscountValue = $cookieStore.get("additionaldiscountValue");
    var offerDiscount = $cookieStore.get("DiscountValue");
    var paymentScheduled = $cookieStore.get("PaymentScheduled");

    $scope.proprty_Details = $cookieStore.get("PropertyDetails");

    $scope.paymentSchemeName = $cookieStore.get("PaymentScheme");

    $scope.paymentschemeDetails = $cookieStore.get("PaymentDetails");

    $scope.govermentTaxDetails = $cookieStore.get("GovermentCharge");

    $scope.totalValue = $cookieStore.get("total");

    $scope.amountCalculation = function () {
        $scope.amountCalculationValue = [];

        var serviceTax = (_.findWhere($scope.govermentTaxDetails[0].chargeList, { charge_name_type: "Service Tax" })).charge_percentage;
        for (i = 0; i < $scope.paymentschemeDetails.length; i++) {
           
            $scope.amount = (parseFloat($scope.totalValue)) * (parseFloat($scope.paymentschemeDetails[i].percentage / 100));

            var serviceTaxValue = parseFloat($scope.amount) * parseFloat((serviceTax) / 100);

            serviceTaxValue.toFixed(2);
            
            $scope.amountCalculationValue.push({ description: $scope.paymentschemeDetails[i].description, percentage: $scope.paymentschemeDetails[i].percentage, amountTotal: $scope.amount, serviceTax: serviceTaxValue, });
            
        }
    
        $scope.finalServiceTax = 0;
        for (j = 0; j < $scope.amountCalculationValue.length; j++) {
           

            $scope.finalServiceTax = $scope.finalServiceTax + $scope.amountCalculationValue[j].serviceTax;
        }
    }

    var totalCinsideration = function (){

        var propertyConsidaration = [];
        //var propertyConsidarationTable = {};
        propertyConsidaration.push([{ text: 'Payment Scheme For 20:40:40', style: 'tableHeader', fillColor: '#efefef' }, { text: 'Percentage', style: 'tableHeader', fillColor: '#efefef' }, { text: 'Amount', style: 'tableHeader', fillColor: '#efefef' }, { text: 'Service Tax', style: 'tableHeader', fillColor: '#efefef' }, ]);
        for (i = 0; i < $scope.amountCalculationValue.length; i++) {
            propertyConsidaration.push({ text: $scope.amountCalculationValue[i].description, style: 'tableData' }, { text: $scope.amountCalculationValue[i].percentage, style: 'tableData' }, { text: ($scope.amountCalculationValue[i].amountTotal).toString(), style: 'tableData' }, { text: ($scope.amountCalculationValue[i].serviceTax).toString(), style: 'tableData' })

        }
        propertyConsidaration = {
            headerRows: 1,
            widths: [150, 67, 67, 67, 67, ],
            body: propertyConsidaration,
        }
        

        return propertyConsidaration;

    }


    $scope.preview = function () {
       // totalCinsideration()
        var docDefinition = {
            content: [
                {
                    margin: [0, 30, 0, 30],
                    table: totalCinsideration(),
                    layout: {


                        hLineWidth: function (i, node) {
                            return (i === 0 || i === node.table.body.length) ? .5 : .5;
                        },
                        vLineWidth: function (i, node) {
                            return (i === 0 || i === node.table.widths.length) ? 0 : 0;
                        },
                        hLineColor: function (i, node) {
                            return (i === 0 || i === node.table.body.length) ? '#ececec' : '#ececec';
                        },
                        vLineColor: function (i, node) {
                            return (i === 0 || i === node.table.widths.length) ? 'red' : 'gray';
                        },

                        paddingLeft: function (i, node) { return 10; },
                        paddingRight: function (i, node) { return 10; },
                        paddingTop: function (i, node) { return 10; },
                        paddingBottom: function (i, node) { return 10; }

                    },

                },


               { text: 'Terms and Condition', style: 'panNo', margin: [0, 0, 0, 10], },

		{
		    ul:

                [
				'This quotation is to be read along with other standard Terms and conditions of the Company',
				'Service Tax of 4.35% is applicable with every payment',
				'Government taxes will be extra and to be paid at actuals',
                'Maintenance, Society charges, Club House charges etc are applicable at the time of Possession',
                'Stamp duty, Registration and VAT is paid at the time of registration',
                ]
		},
            ],


            styles: {
                header: {
                    fontSize: 30,
                    bold: true,

                },
                panNo:
          {
              fontSize: 9,
              color: 'black',
              bold: true,
          },
                tableHeader:
            {
                fontSize: 9,
                color: '#383838',
                bold: true,
            },

                tableData:
           {
               fontSize: 9,
               color: '#717171',
               bold: false,
           },
             },
                defaultStyle: {
                fontSize: 8,
                color: '#717171',
                bold: false,

            },




        };



        pdfMake.createPdf(docDefinition).open();


        //demoFromHTML();
        //$scope.showTemplate = false;
        //$scope.showPreview = true;
    }

    Url = "PropertyQuotes/GetPropertyDetails/" + project_id;
    apiService.get(Url).then(function (response) {
        $scope.propertyDetails = response.data[0];

    },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });

    $scope.amountCalculation();

    $scope.propertyQuoteCreate = function () {

        var postData = {

            offer_id: typeOfOffer.offers_id,
            floor_id: floorDetails.floors_id,
            contact_id:customer_id,
            user_id:UserId,
            organization_id: org_id,
            project_id: project_id,
            payment_schedule_id:paymentScheduled,
            total_consideration:$scope.proprty_Details.total_considarationValue,
            discount: offerDiscount,
            additional_discount: additionalDiscountValue,
            additional_discount_type:radio_value,
            final_total:$scope.totalValue,
            unit_id: UnitDetail.unit_id,
            price_per_sq_ft:$scope.proprty_Details.Rps,
        }
        apiService.post("PropertyQuotes/CreateQuoteUnitCharge", postData).then(function (response) {
            var loginSession = response.data;
        });


        var quatationDetails = [];

        for (var i in $scope.paymentschemeDetails) {

            quatationDetails.push({ 'payment_scheme_id': $scope.paymentschemeDetails[i].payment_schedule_Detail_id, 'amount': $scope.amountCalculationValue[i].amountTotal, 'service_tax': $scope.amountCalculationValue[i].serviceTax, 'contact_id': customer_id, 'user_id': UserId, 'organization_id': org_id, 'offer_id': typeOfOffer.offers_id, 'unit_id': UnitDetail.unit_id, 'due_date': $scope.amountCalculationValue[i].due_date, 'charge_project_mapping_id': "", 'charge_id':""});

        }
        apiService.post("PropertyQuotes/UnitPaymentScheme", quatationDetails).then(function (response) {
            var loginSession = response.data;
        });

        alert("PropertyQuoteCreated");
        $state.go('app.contactdetail', { id: customer_id });

    };



   
});