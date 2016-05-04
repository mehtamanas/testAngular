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

    // Government and Other Charges Details//

    $scope.governmentCharges = [];
    $scope.otherCharges = [];

    $scope.propertyOrganization = $cookieStore.get('PropertyOrgDetails');

    $scope.propertyContactDetail = $cookieStore.get('PropertyContactDetails');

    $scope.governmentCharges = $cookieStore.get('govermentCharges');

    $scope.otherCharges = $cookieStore.get('otherCharges');

    // Ends Government and Other Charges Details//

    //Description Get//
    $scope.getDescriptionDetails = $cookieStore.get('propertyDescription');
    // From Start and End Date Get//
    $scope.getFromDateDetails = $cookieStore.get('propertyFromDate');
    $scope.getEndDateDetails = $cookieStore.get('propertyEndDate');

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

    // For Government Charges Calculation
    var chargesDetails = function () {
        var govcharges = []
        govcharges.push([{ text: 'Goverment Charges', style: 'tableHeader', fillColor: '#efefef' }, { text: '', style: 'tableHeader', fillColor: '#efefef' }, ]);
        for (i = 0; i < $scope.governmentCharges.length; i++) {
            govcharges.push([{ text: $scope.governmentCharges[i].name, style: 'tableData' }, { text: ($scope.governmentCharges[i].value).toString(), style: 'tableData' }])

        }

        govcharges = {
            headerRows: 1,
            widths: [410, 67, ],
            body: govcharges
        }
        return govcharges
    }

    // For Other Charges Calculation
    var otherChargeDetails = function () {
        var othercharges = []
        othercharges.push([{ text: 'Other Charges', style: 'tableHeader', fillColor: '#efefef' }, { text: '', style: 'tableHeader', fillColor: '#efefef' }]);
        for (i = 0; i < $scope.otherCharges.length; i++) {
            othercharges.push([{ text: $scope.otherCharges[i].name, style: 'tableData' }, { text: ($scope.otherCharges[i].value).toString(), style: 'tableData' }])

        }
        othercharges = {
            headerRows: 1,
            widths: [410, 67, ],
            body: othercharges
        }
        return othercharges
    }

    // For Payment Scheme
    var totalCinsideration = function (){

        var propertyConsidaration = [];
        //var propertyConsidarationTable = {};
        propertyConsidaration.push([{ text: 'Payment Scheme For 20:40:40', style: 'tableHeader', fillColor: '#efefef' }, { text: 'Percentage', style: 'tableHeader', fillColor: '#efefef' }, { text: 'Amount', style: 'tableHeader', fillColor: '#efefef' }, { text: 'Service Tax', style: 'tableHeader', fillColor: '#efefef' }, { text: 'Service Tax', style: 'tableHeader', fillColor: '#efefef' }]);
        for (i = 0; i < $scope.amountCalculationValue.length; i++)
        {
           
            propertyConsidaration.push([{ text: $scope.amountCalculationValue[i].description, style: 'tableData' }, { text: $scope.amountCalculationValue[i].percentage, style: 'tableData' }, { text: ($scope.amountCalculationValue[i].amountTotal).toString(), style: 'tableData' }, { text: ($scope.amountCalculationValue[i].serviceTax).toString(), style: 'tableData' }, { text: $scope.amountCalculationValue[i].due_date, style: 'tableData' }])

        }
        propertyConsidaration = {
            headerRows: 1,
            widths: [100, 67,67,67,67, ],
            body: propertyConsidaration,
        }
        

        return propertyConsidaration;

    }

    // Checking for any data for pdf being null
    var prePDFCheck = function () {

        if ($scope.propertyOrganization.name == null) $scope.propertyOrganization.name = "";
        if ($scope.propertyOrganization.street_1 == null) $scope.propertyOrganization.street_1 = "";
        if ($scope.propertyOrganization.street_2 == null) $scope.propertyOrganization.street_2 = "";
        if ($scope.propertyOrganization.city == null) $scope.propertyOrganization.city = "";
        if ($scope.propertyOrganization.state == null) $scope.propertyOrganization.state = "";
        if ($scope.propertyOrganization.zip_code == null) $scope.propertyOrganization.zip_code = "";
        //if ($scope.organization.account_phone == null) $scope.organization.account_phone = "";
        //if ($scope.organization.account_email == null) $scope.organization.account_email = "";


        if ($scope.propertyContactDetail.Name == null) $scope.propertyContactDetail.Name = "";
        if ($scope.propertyContactDetail.area == null) $scope.propertyContactDetail.area = "";
        if ($scope.propertyContactDetail.street1 == null) $scope.propertyContactDetail.street1 = "";
        if ($scope.propertyContactDetail.street2 == null) $scope.propertyContactDetail.street2 = "";
        if ($scope.propertyContactDetail.City == null) $scope.propertyContactDetail.City = "";
        if ($scope.propertyContactDetail.state_name == null) $scope.propertyContactDetail.state_name = "";
        if ($scope.propertyContactDetail.zip_code == null) $scope.propertyContactDetail.zip_code = "";
        if ($scope.getFromDateDetails == null) $scope.getFromDateDetails = "";
        if ($scope.getEndDateDetails == null) $scope.getEndDateDetails = "";
        if ($scope.getDescriptionDetails == null) $scope.getDescriptionDetails = "";


    }
    $scope.preview = function () {
        prePDFCheck();
        var docDefinition = {
            content: [


               { text: $scope.propertyOrganization.name, style: 'BuilderName' },
               { text: $scope.propertyOrganization.street_1 + $scope.propertyOrganization.street_2, style: 'BuilderAddress', margin: [0, 5, 0, 0], },
               { text: $scope.propertyOrganization.city, style: 'BuilderAddress' },
               { text: $scope.propertyOrganization.state, style: 'BuilderAddress' },
               { text: $scope.propertyOrganization.zip_code, style: 'BuilderAddress' },


               {
                   style: 'panNo',
                   margin: [0, 30, 0, 30],
                   table: {

                       widths: [150, 150, 150, ],
                       body: [


                           ['ST NO: AAECD6943NSD001', 'PAN NO: AAECD6943N', 'PAYMENT TERMS: 100% Advance'],
                       ]
                   },

                   layout: 'noBorders'
               },





                   {
                       table: {
                           headerRows: 1,
                           widths: [300, 220, ],
                           body: [
                                 [{ text: '', style: 'tableHeader' }],

                                 [{ text: $scope.propertyContactDetail.Name, style: 'BuilderName', }, ],
                                 [{ text: $scope.propertyContactDetail.area, style: 'BuilderAddress' }, ],
                                 [{ text: $scope.propertyContactDetail.street1, style: 'BuilderAddress' }, ],
                                 [{ text: $scope.propertyContactDetail.street2, style: 'BuilderAddress' }, ],
                                 [{ text: $scope.propertyContactDetail.City, style: 'BuilderAddress' }, ],
                                 [{ text: $scope.propertyContactDetail.state_name, style: 'BuilderAddress' }, ],
                                 [{ text: $scope.propertyContactDetail.zip_code, style: 'BuilderAddress' }, ],
                                 [{ text: $scope.getFromDateDetails, style: 'BuilderAddress' }, ],
                                 [{ text: $scope.getEndDateDetails, style: 'BuilderAddress' }, ],
                           ]
                       },
                       layout: {


                           hLineWidth: function (i, node) {
                               return (i === 0 || i === node.table.body.length) ? .5 : 0;
                           },
                           vLineWidth: function (i, node) {
                               return (i === 0 || i === node.table.widths.length) ? 0 : 0;
                           },
                           hLineColor: function (i, node) {
                               return (i === 0 || i === node.table.body.length) ? '#cfcfcf' : '#cfcfcf';
                           },
                           vLineColor: function (i, node) {
                               return (i === 0 || i === node.table.widths.length) ? 'red' : 'gray';
                           },

                           paddingLeft: function (i, node) { return 0; },
                           paddingRight: function (i, node) { return 0; },
                           paddingTop: function (i, node) { return 2; },
                           paddingBottom: function (i, node) { return 2; }

                       },
                   },

                { text: 'Project: DB Crwon', style: 'BuilderName', margin: [0, 30, 0, 10], },





         {


             table: {
                 headerRows: 1,


                 body: [
                        [{
                            table: {

                                widths: [40, ],
                                body: [
                                    [{ text: $scope.proprty_Details.towerName, style: 'configurationDetail', }],
                                    [{ text: 'Tower', style: 'configurationDetail2', }],
                                ]
                            },

                            layout: 'noBorders'

                        },

                        // tower a


                        {
                            table: {
                                widths: [40, ],
                                body: [
                                    [{ text: $scope.proprty_Details.floorNo, style: 'configurationDetail', }],
                                    [{ text: 'Floor', style: 'configurationDetail2', }],
                                ]
                            },

                            layout: 'noBorders'

                        },

                        // Floor

                        {
                            table: {
                                widths: [40, ],
                                body: [
                                    [{ text: $scope.proprty_Details.unitNo, style: 'configurationDetail', }],
                                    [{ text: 'Unit No.', style: 'configurationDetail2', }],
                                ]
                            },

                            layout: 'noBorders'

                        },

                        // unit no
                        {
                            table: {
                                widths: [40, ],
                                body: [
                                    [{ text: $scope.proprty_Details.unitName, style: 'configurationDetail', }],
                                    [{ text: 'BHK', style: 'configurationDetail2', }],
                                ]
                            },

                            layout: 'noBorders'

                        },

                        // bhk

                        {
                            table: {
                                widths: [80, ],
                                body: [
                                    [{ text: $scope.proprty_Details.salableArea, style: 'configurationDetail', }],
                                    [{ text: 'Saleable Area', style: 'configurationDetail2', }],
                                ]
                            },

                            layout: 'noBorders'

                        },

                        // saleable area

                        {
                            table: {
                                widths: [80, ],
                                body: [
                                    [{ text: $scope.proprty_Details.CarpatArea, style: 'configurationDetail', }],
                                    [{ text: 'Carpet Area', style: 'configurationDetail2', }],
                                ]
                            },

                            layout: 'noBorders'

                        },

                        // carpet area

                        {
                            table: {
                                widths: [40, ],
                                body: [
                                    [{ text: $scope.proprty_Details.CarePark, style: 'configurationDetail', }],
                                    [{ text: 'Car Park', style: 'configurationDetail2', }],
                                ]
                            },

                            layout: 'noBorders'

                        },

                        // car parking


                        ],





                 ]
             },
             layout: {


                 hLineWidth: function (i, node) {
                     return (i === 0 || i === node.table.body.length) ? .5 : .5;
                 },
                 vLineWidth: function (i, node) {
                     return (i === 0 || i === node.table.widths.length) ? .5 : .5;
                 },
                 hLineColor: function (i, node) {
                     return (i === 0 || i === node.table.body.length) ? '#cccccc' : '#cccccc';
                 },
                 vLineColor: function (i, node) {
                     return (i === 0 || i === node.table.widths.length) ? '#cccccc' : '#cccccc';
                 },

                 //paddingLeft: function (i, node) { return 5; },
                 // paddingRight: function (i, node) { return 5; },
                 // paddingTop: function (i, node) { return 5; },
                 // paddingBottom: function (i, node) { return 5; }

             },



         },


        //         //total consideration start


         {
             margin: [0, 20, 0, 20],
             table: {
                 headerRows: 1,
                 widths: [410, 67, ],
                 body: [
                        [{ text: 'Total Consideration', style: 'tableHeader', fillColor: '#efefef' }, { text: '', style: 'tableHeader', fillColor: '#efefef' }, ],
                        [{ text: 'Rate per sq.ft', style: 'tableData', }, { text: $scope.proprty_Details.Rps, style: 'tableData', }, ],
                        [{ text: 'Floor Rise Applicable', style: 'tableData', }, { text: $scope.proprty_Details.Fra, style: 'tableData', }, ],

                 ]
             },
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



         //Goverment chares

         {
             margin: [0, 20, 0, 20],
             table:chargesDetails(),
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
             pageBreak: 'after'
         },




         // other charges

         {
             margin: [0, 10, 0, 10],
             table: otherChargeDetails(),
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

        /// total

        {
            margin: [0, 0, 0, 35],
            table: {
                headerRows: 1,
                widths: [410, 67, ],
                body: [
                    [{ text: 'TOTAL', style: 'tableHeader', fillColor: '#efefef' }, { text: '', style: 'tableHeader', fillColor: '#efefef' }, ],
                       [{ text: 'Offer Discount', style: 'tableHeader', }, { text: '15%', style: 'tableHeader', }, ],
                       [{ text: 'Additional Charges', style: 'tableData', }, { text: additionalDiscountValue, style: 'tableData', }, ],
                        [{ text: 'TOTAL', style: 'tableData', }, { text: ($scope.totalValue).toString(), style: 'tableData', }, ],


                ]
            },
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


         { text: '', style: 'BuilderAddress' },

                {
                    margin: [0, 50, 0, 30],
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
                    pageBreak: 'after'
                },


               //{ text: 'Terms and Condition', style: 'panNo', margin: [0, 0, 0, 10], },

		{
		    margin: [0, 20, 0, 20],
		    table: {
		        headerRows: 1,
		        widths: [410, ],
		        body: [
                       [{ text: 'Terms And Condition', style: 'tableHeader', fillColor: '#efefef' }, ],
                       [{ text: $scope.getDescriptionDetails, style: 'tableData', }, ],
             

		        ]
		    },
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




            ],


            styles: {
                header: {
                    fontSize: 30,
                    bold: true,

                },

                BuilderName: {

                    fontSize: 13,
                    color: 'black',
                    bold: true,
                },



                BuilderAddress: {

                    fontSize: 9,
                    color: 'black',
                    bold: false,
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



                configurationDetail:
                {
                    alignment: 'center',
                    fontSize: 11,
                    bold: true,
                    color: '#626262',
                },

                configurationDetail2:
                {
                    alignment: 'center',
                    fontSize: 8,
                    bold: false,
                    color: '#626262',
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
            contact_id: customer_id,
            user_id: UserId,
            organization_id: org_id,
            project_id: project_id,
            payment_schedule_id: paymentScheduled,
            total_consideration: $scope.proprty_Details.total_considarationValue,
            discount: offerDiscount,
            additional_discount: additionalDiscountValue,
            additional_discount_type: radio_value,
            final_total: $scope.totalValue,
            unit_id: UnitDetail.unit_id,
            price_per_sq_ft: $scope.proprty_Details.Rps,
            estimate_no: null,
            estimate_date: $cookieStore.get('propertyFromDate'),
            expiration_date: $cookieStore.get('propertyEndDate'),
            description: $scope.getDescriptionDetails
        }

        apiService.post("PropertyQuotes/CreateQuoteUnitCharge", postData).then(function (response) {
            var quoteUnitCharge = response.data;
            var quatationDetails = [];

            for (var i in $scope.paymentschemeDetails) {

                quatationDetails.push({ 'payment_scheme_id': $scope.paymentschemeDetails[i].payment_schedule_Detail_id, 'amount': $scope.amountCalculationValue[i].amountTotal, 'service_tax': $scope.amountCalculationValue[i].serviceTax, 'contact_id': customer_id, 'user_id': UserId, 'organization_id': org_id, 'offer_id': typeOfOffer.offers_id, 'unit_id': UnitDetail.unit_id, 'due_date': $scope.amountCalculationValue[i].due_date, 'charge_project_mapping_id': "", 'charge_id': "", 'quote_id': quoteUnitCharge.quote_id });
            }

            apiService.post("PropertyQuotes/UnitPaymentScheme", quatationDetails).then(function (response) {
                var unitPaymentScheme = response.data;
                alert("PropertyQuoteCreated");
                $state.go('app.contactdetail', { id: customer_id });
            });


        });
    }
   
});