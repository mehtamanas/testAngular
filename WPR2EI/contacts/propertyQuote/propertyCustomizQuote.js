﻿angular.module('contacts')

.controller('propertyCustomizQuote', function ($scope, $state, $cookieStore, apiService, $rootScope, $modal) {
    console.log('propertyCustomizQuote');
    $rootScope.title = 'Dwellar-peopertyQuotes';
    var orgID = $cookieStore.get('orgID');
    var userId = $cookieStore.get('userId');

    var project_id = $cookieStore.get("projectId");
    var customer_id = $cookieStore.get("customerId");
    $scope.property_Details = $cookieStore.get("PropertyDetails");

    Url = "Organization/Get/" + $cookieStore.get('orgID');
    apiService.get(Url).then(function (response) {
        $scope.organization = response.data[0];
    },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });

    Url = "Contact/GetContactSummary/?Id=" + customer_id;
    apiService.get(Url).then(function (response) {
        $scope.contactDetail = response.data;

    },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });



    var prePDFCheck = function () {

        if ($scope.organization.name == null) $scope.organization.name = "";
        if ($scope.organization.street_1 == null) $scope.organization.street_1 = "";
        if ($scope.organization.street_2 == null) $scope.organization.street_2 = "";
        if ($scope.organization.city == null) $scope.organization.city = "";
        if ($scope.organization.state == null) $scope.organization.state = "";
        if ($scope.organization.zip_code == null) $scope.organization.zip_code = "";
        //if ($scope.organization.account_phone == null) $scope.organization.account_phone = "";
        //if ($scope.organization.account_email == null) $scope.organization.account_email = "";


        if ($scope.contactDetail.Name == null) $scope.contactDetail.Name = "";
        if ($scope.contactDetail.area == null) $scope.contactDetail.area = "";
        if ($scope.contactDetail.street1 == null) $scope.contactDetail.street1 = "";
        if ($scope.contactDetail.street2 == null) $scope.contactDetail.street2 = "";
        if ($scope.contactDetail.City == null) $scope.contactDetail.City = "";
        if ($scope.contactDetail.state_name == null) $scope.contactDetail.state_name = "";
        if ($scope.contactDetail.zip_code == null) $scope.contactDetail.zip_code = "";


    }

    //var subscriptionTable = function () {
    //    var subProduct = [];
    //    var productTable = {};
    //    subProduct.push([{ text: 'No', style: 'tableHeader', fillColor: '#efefef' }, { text: 'Products', style: 'tableHeader', fillColor: '#efefef' }, { text: 'Description', style: 'tableHeader', fillColor: '#efefef' }, { text: 'Qty', style: 'tableHeader', fillColor: '#efefef' }, { text: 'Rate', style: 'tableHeader', fillColor: '#efefef' }, { text: 'Amount', style: 'tableHeader', fillColor: '#efefef' }, ]);
    //    for (j = 0; j < $scope.subscription.length; j++) {
    //        subProduct.push([{ text: (j + 1).toString(), style: 'tableData' }, { text: $scope.subscription[j].name, style: 'tableData', }, { text: $scope.subscription[j].desc, style: 'tableData', }, { text: ($scope.subscription[j].quantity).toString(), style: 'tableData', }, { text: 'Rs.' + ($scope.subscription[j].price).toString(), style: 'tableData', }, { text: 'Rs.' + ($scope.subscription[j].total).toString(), style: 'tableData', }]);
    //    }
    //    productTable = {
    //        headerRows: 1,
    //        widths: [20, 110, 67, 67, 67, 67, ],
    //        body: subProduct
    //    }
    //    return productTable
    //}

   
    var chargesDetails = function () {
        //var othercharges = []
        //othercharges.push([{ text: 'Other Charges', style: 'tableHeader', fillColor: '#efefef' }, { text: '', style: 'tableHeader', fillColor: '#efefef' }, ]);
        //for (i = 0; i < $scope.otherChargesAfterCalculation.length; i++) {
        //    othercharges.push([{ text: $scope.otherChargesAfterCalculation[i].name, style: 'tableHeader' }, { text: $scope.otherChargesAfterCalculation[i].value, style: 'tableHeader' }])

        //}
      
        var govcharges = []
        govcharges.push([{ text: 'Goverment Charges', style: 'tableHeader', fillColor: '#efefef' }, { text: '', style: 'tableHeader', fillColor: '#efefef' }, ]);
        for (i = 0; i <$scope.govermentChargesAfterCalculation.length; i++) {
            govcharges.push([{ text: $scope.govermentChargesAfterCalculation[i].name, style: 'tableHeader' }, { text: $scope.govermentChargesAfterCalculation[i].value,style:'table Header'}])

        }

        govcharges = {
            headerRows: 1,
            widths: [410, 67, ],
            body: govcharges
        }
      
    }




    $scope.preview = function () {
        prePDFCheck();
        var docDefinition = {
            content: [


               { text: $scope.organization.name, style: 'BuilderName' },
               { text: $scope.organization.street_1 + $scope.organization.street_2, style: 'BuilderAddress', margin: [0, 5, 0, 0], },
               { text: $scope.organization.city, style: 'BuilderAddress' },
               { text: $scope.organization.state, style: 'BuilderAddress' },
               { text: $scope.organization.zip_code, style: 'BuilderAddress' },


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

                                 [{ text: $scope.contactDetail.Name, style: 'BuilderName', }, ],
                                 [{ text: $scope.contactDetail.area, style: 'BuilderAddress' }, ],
                                 [{ text: $scope.contactDetail.street1, style: 'BuilderAddress' }, ],
                                 [{ text: $scope.contactDetail.street2, style: 'BuilderAddress' }, ],
                                 [{ text: $scope.contactDetail.City, style: 'BuilderAddress' }, ],
                                 [{ text: $scope.contactDetail.state_name, style: 'BuilderAddress' }, ],
                                 [{ text: $scope.contactDetail.zip_code, style: 'BuilderAddress' }, ],
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
                                    [{ text: $scope.property_Details.towerName, style: 'configurationDetail', }],
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
                                    [{ text: $scope.property_Details.floorNo, style: 'configurationDetail', }],
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
                                    [{ text: $scope.property_Details.unitNo, style: 'configurationDetail', }],
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
                                    [{ text: $scope.property_Details.unitName, style: 'configurationDetail', }],
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
                                    [{ text: $scope.property_Details.salableArea, style: 'configurationDetail', }],
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
                                    [{ text: $scope.property_Details.CarpatArea, style: 'configurationDetail', }],
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
                                    [{ text: $scope.property_Details.CarePark, style: 'configurationDetail', }],
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


                 //total consideration start


         {
             margin: [0, 20, 0, 20],
             table: {
                 headerRows: 1,
                 widths: [410, 67, ],
                 body: [
                        [{ text: 'Total Consideration', style: 'tableHeader', fillColor: '#efefef' }, { text: '', style: 'tableHeader', fillColor: '#efefef' }, ],
                        [{ text: 'Rate per sq.ft', style: 'tableData', }, { text: $scope.property_Details.Rps, style: 'tableData', }, ],
                        [{ text: 'Floor Rise Applicable', style: 'tableData', }, { text: $scope.property_Details.Fra, style: 'tableData', }, ],

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
             margin: [0, 0, 0, 20],
             table:{
                 headerRows: 1,
                 widths: [410, 67, ],
                 body: [
                        [{ text: 'Goverment Charges', style: 'tableHeader', fillColor: '#efefef' }, { text: '', style: 'tableHeader', fillColor: '#efefef' }, ],
                        [{ text: 'Stamp Duty 5%', style: 'tableData', }, { text: '55,06,361', style: 'tableData', }, ],
                        [{ text: 'Registration Fee', style: 'tableData', }, { text: '30,000', style: 'tableData', }, ],
                        [{ text: 'Vat 1%', style: 'tableData', }, { text: '22,65,32', style: 'tableData', }, ],
                        [{ text: 'Service Tax 4.35%', style: 'tableData', }, { text: '98,54,142', style: 'tableData', }, ],

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
             pageBreak:'after'
         },

         


         // other charges

         {
             margin: [0, 0, 0, 20],
             table: {
                 headerRows: 1,
                 widths: [410, 67, ],
                 body: [
                        [{ text: 'Other Charges', style: 'tableHeader', fillColor: '#efefef' }, { text: '', style: 'tableHeader', fillColor: '#efefef' }, ],
                        [{ text: 'Corpus Fund', style: 'tableData', }, { text: '21,15,000', style: 'tableData', }, ],
                        [{ text: 'Condomonium Formation', style: 'tableData', }, { text: '25,000', style: 'tableData', }, ],
                        [{ text: 'Vat 1% (Gas, Water, Electric)', style: 'tableData', }, { text: '1,50,00', style: 'tableData', }, ],
                        [{ text: 'Advanced Maintainance for 24 Months', style: 'tableData', }, { text: '20,30,400', style: 'tableData', }, ],
                        [{ text: 'Legal', style: 'tableData', }, { text: '23,000', style: 'tableData', }, ],
                        [{ text: 'Club House', style: 'tableData', }, { text: '15,00,000', style: 'tableData', }, ],
                        [{ text: 'Infrastructure Charges', style: 'tableData', }, { text: '23,50,000', style: 'tableData', }, ],

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

        /// total

        {
            margin: [0, 0, 0, 35],
            table: {
                headerRows: 1,
                widths: [410, 67, ],
                body: [
                    [{ text: 'TOTAL', style: 'tableHeader', fillColor: '#efefef' }, { text: '', style: 'tableHeader', fillColor: '#efefef' }, ],
                       [{ text: 'Offer Discount', style: 'tableHeader', }, { text: '15%', style: 'tableHeader', }, ],
                       [{ text: 'Additional Charges', style: 'tableHeader', }, { text: $scope.additionalDiscount, style: 'tableHeader', }, ],
                        [{ text: 'TOTAL', style: 'tableHeader', }, { text: $scope.gTotal, style: 'tableHeader', }, ],


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
                    margin: [0, 30, 0, 30],
                    table: {
                        headerRows: 1,
                        widths: [150, 67, 67, 67, 67, ],
                        body: [
                               [{ text: 'Payment Scheme For 20:40:40', style: 'tableHeader', fillColor: '#efefef' }, { text: 'Percentage', style: 'tableHeader', fillColor: '#efefef' }, { text: 'Amount', style: 'tableHeader', fillColor: '#efefef' }, { text: 'Service Tax', style: 'tableHeader', fillColor: '#efefef' }, { text: 'Due On', style: 'tableHeader', fillColor: '#efefef' }, ],
                               [{ text: 'Current Due', style: 'tableData', }, { text: '20%', style: 'tableData', }, { text: '4,53,06,400', style: 'tableData', }, { text: '19,70,828.4', style: 'tableData', }, { text: '10/05/2016', style: 'tableData', }, ],
                               [{ text: 'Due on Completion of Super Structure', style: 'tableData', }, { text: '20%', style: 'tableData', }, { text: '4,53,06,400', style: 'tableData', }, { text: '19,70,828.4', style: 'tableData', }, { text: '10/05/2016', style: 'tableData', }, ],
                               [{ text: 'Due on Possession', style: 'tableData', }, { text: '20%', style: 'tableData', }, { text: '4,53,06,400', style: 'tableData', }, { text: '19,70,828.4', style: 'tableData', }, { text: '10/05/2016', style: 'tableData', }, ],
                               [{ text: 'Total', style: 'tableHeader', }, { text: '100%', style: 'tableHeader', }, { text: '22,65,32,000', style: 'tableHeader', }, { text: '98,54,142', style: 'tableHeader', }, { text: '10/05/2016', style: 'tableHeader', }, ],
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


    Url = "PropertyQuotes/GetAllCharges?id=" + project_id;
    apiService.get(Url).then(function (response) {
        $scope.taxes = response.data;
       
        $scope.govchargeList = _.filter($scope.taxes, { 'category_type_name': 'Government Charges' });
        $cookieStore.put("GovermentCharge", $scope.govchargeList);
            $scope.otherchargeList = _.filter($scope.taxes, { 'category_type_name': 'Other Charges' });
     
        
        $scope.otherChargesCalculations();
        $scope.govermentChargeCalculation();
        $scope.totalChargeCalculation();
        $scope.grandTotal();
        $scope.FinalTotal();
        

    },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });



    Url = "Offers/GetOfferProject?orgID=" + orgID;
    apiService.get(Url).then(function (response) {
        $scope.offers = response.data;
    },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });

   

    $scope.selectoffer = function () {
        offerType = JSON.parse($scope.offer1);

        $cookieStore.put("OfferType", offerType);
        if (isNaN(offerType.offer_value) == true)
        {
            $scope.offersvalue = offerType.offer_value
            $scope.offerDiscount = null;

        }
        else {
            $scope.offerDiscount = offerType.offer_value;
            $scope.offersvalue = null;
        }
        $scope.offers_id = offerType.offers_id;

        $scope.offerDiscountCalculation();
    };


    $scope.offerDiscountCalculation = function () {
   
        if ($scope.offerDiscount == null) {

            $scope.discountedValue = parseFloat($scope.grandTotalWithoutOffer)
        }
        else {
            $scope.discountedValue = parseFloat($scope.grandTotalWithoutOffer) - parseFloat($scope.offerDiscount)

            $cookieStore.put("DiscountValue", $scope.offerDiscount);
        }

        $scope.gTotal = $scope.discountedValue;
        
       
    }



    $scope.applyAdditionalDiscount = function () {

        if ($scope.radioValue == 'flat') {
            $cookieStore.put("discountType",$scope.radioValue);
            if ($scope.additionalDiscount == "") { $scope.additionalDiscount = 0 }
            $cookieStore.put("additionaldiscountValue", $scope.additionalDiscount);
            $scope.additionalDiscountValue = parseFloat($scope.grandTotalWithoutOffer) - parseFloat($scope.additionalDiscount);

        }
        else {
            $cookieStore.put("discountType", $scope.radioValue);
            if ($scope.additionalDiscount == "") { $scope.additionalDiscount = 100 }
            intermediateAdditionalOffer = parseFloat($scope.grandTotalWithoutOffer) * parseFloat(($scope.additionalDiscount / 100));

            $cookieStore.put("additionaldiscountValue", $scope.additionalDiscount);
            $scope.additionalDiscountValue = parseFloat($scope.grandTotalWithoutOffer) - parseFloat(intermediateAdditionalOffer);
        }
        $scope.gTotal = $scope.additionalDiscountValue;
    }

  
    var otherChargeIntermediateTotal = 0;
    $scope.otherChargesCalculations = function () {

        $scope.otherChargesAfterCalculation = [];
        for (i = 0; i < $scope.otherchargeList[0].chargeList.length; i++) {
            if (otherChargeIntermediateTotal == 0) { otherChargeIntermediateTotal = parseFloat($scope.property_Details.total_considarationValue) };//for i==0, otherChargeIntermediateTotal should be total consideration
            if ($scope.otherchargeList[0].chargeList[i].charge_type == "Flat Charge" && $scope.otherchargeList[0].chargeList[i].calculation_type == "Basic") {
                otherChargeIntermediateTotal = parseFloat(otherChargeIntermediateTotal) + parseFloat($scope.otherchargeList[0].chargeList[i].charge_percentage);
                $scope.otherChargesAfterCalculation.push({ name: $scope.otherchargeList[0].chargeList[i].charge_name_type, value: $scope.otherchargeList[0].chargeList[i].charge_percentage });
            }

            else if ($scope.otherchargeList[0].chargeList[i].charge_type == "Flat Charge" && $scope.otherchargeList[0].chargeList[i].calculation_type === "Previous Total") {
                otherChargeIntermediateTotal = parseFloat(otherChargeIntermediateTotal) + parseFloat($scope.otherchargeList[0].chargeList[i].charge_percentage);
                $scope.otherChargesAfterCalculation.push({ name: $scope.otherchargeList[0].chargeList[i].charge_name_type, value: $scope.otherchargeList[0].chargeList[i].charge_percentage });
            }
            else if ($scope.otherchargeList[0].chargeList[i].charge_type == "Percent" && $scope.otherchargeList[0].chargeList[i].calculation_type == "Basic") {
                var per_basic = parseFloat($scope.property_Details.total_considarationValue) * (parseFloat($scope.otherchargeList[0].chargeList[i].charge_percentage) / 100);
                otherChargeIntermediateTotal =parseFloat(otherChargeIntermediateTotal) + parseFloat(per_basic);
                $scope.otherChargesAfterCalculation.push({ name: $scope.otherchargeList[0].chargeList[i].charge_name_type, value: parseFloat(per_basic) });
            }

            else if ($scope.otherchargeList[0].chargeList[i].charge_type == "Percent" && $scope.otherchargeList[0].chargeList[i].calculation_type == "Previous Total") {
               
                var per_prevttl = parseFloat(otherChargeIntermediateTotal) * (parseFloat($scope.otherchargeList[0].chargeList[i].charge_percentage) / 100);
                otherChargeIntermediateTotal = parseFloat(otherChargeIntermediateTotal) + parseFloat(per_prevttl);
                $scope.otherChargesAfterCalculation.push({ name: $scope.otherchargeList[0].chargeList[i].charge_name_type, value: parseFloat(per_prevttl) });
            }
            else if ($scope.otherchargeList[0].chargeList[i].charge_type == "Per Sq") {
                var perSqr_basic = $scope.property_Details.salableArea * (parseFloat($scope.otherchargeList[0].chargeList[i].charge_percentage));
                otherChargeIntermediateTotal = parseFloat(otherChargeIntermediateTotal) + parseFloat(perSqr_basic);
                $scope.otherChargesAfterCalculation.push({ name: $scope.otherchargeList[0].chargeList[i].charge_name_type, value: parseFloat(perSqr_basic) });
            }
           
        }


        TotalValueOfOtherCharges = 0;
        for (j = 0; j < $scope.otherChargesAfterCalculation.length; j++) {

            TotalValueOfOtherCharges = parseFloat(TotalValueOfOtherCharges) + parseFloat($scope.otherChargesAfterCalculation[j].value);
        }

    }

    var govermentChargeIntermediateValue = 0;

    $scope.govermentChargeCalculation = function () {
        $scope.govermentChargesAfterCalculation = [];

        for (i = 0; i < $scope.govchargeList[0].chargeList.length; i++) {

            if (govermentChargeIntermediateValue == 0) { govermentChargeIntermediateValue = parseFloat($scope.property_Details.total_considarationValue) };//for i==0, otherChargeIntermediateTotal should be total consideration
            if ($scope.govchargeList[0].chargeList[i].charge_type == "Flat Charge" && $scope.govchargeList[0].chargeList[i].calculation_type == "Basic") {
                govermentChargeIntermediateValue = govermentChargeIntermediateValue + parseFloat($scope.govchargeList[0].chargeList[i].charge_percentage);
                $scope.govermentChargesAfterCalculation.push({ name: $scope.govchargeList[0].chargeList[i].charge_name_type, value: $scope.govchargeList[0].chargeList[i].charge_percentage });
            }

            else if ($scope.govchargeList[0].chargeList[i].charge_type == "Flat Charge" && $scope.govchargeList[0].chargeList[i].calculation_type === "Previous Total") {
                govermentChargeIntermediateValue = parseFloat(govermentChargeIntermediateValue) + parseFloat($scope.govchargeList[0].chargeList[i].charge_percentage);
                $scope.govermentChargesAfterCalculation.push({ name: $scope.govchargeList[0].chargeList[i].charge_name_type, value: $scope.govchargeList[0].chargeList[i].charge_percentage });
            }
            else if ($scope.govchargeList[0].chargeList[i].charge_type == "Percent" && $scope.govchargeList[0].chargeList[i].calculation_type == "Basic") {
                var per_basic_gov = parseFloat($scope.property_Details.total_considarationValue) * (parseFloat($scope.govchargeList[0].chargeList[i].charge_percentage) / 100);
                govermentChargeIntermediateValue = govermentChargeIntermediateValue + parseFloat(per_basic_gov);
                $scope.govermentChargesAfterCalculation.push({ name: $scope.govchargeList[0].chargeList[i].charge_name_type, value: parseFloat(per_basic_gov) });
            }

            else if ($scope.govchargeList[0].chargeList[i].charge_type == "Percent" && $scope.govchargeList[0].chargeList[i].calculation_type == "Previous Total") {

                var per_prevttl_gov = parseFloat(govermentChargeIntermediateValue) * (parseFloat($scope.govchargeList[0].chargeList[i].charge_percentage) / 100);
                govermentChargeIntermediateValue = govermentChargeIntermediateValue + parseFloat(per_prevttl_gov);
                $scope.govermentChargesAfterCalculation.push({ name: $scope.govchargeList[0].chargeList[i].charge_name_type, value: parseFloat(per_prevttl_gov) });
            }
            else if ($scope.govchargeList[0].chargeList[i].charge_type == "Per Sq") {
                var perSqr_basic_gov = $scope.property_Details.salableArea * (parseFloat($scope.govchargeList[0].chargeList[i].charge_percentage));
                govermentChargeIntermediateValue = parseFloat(govermentChargeIntermediateValue) + parseFloat(perSqr_basic_gov);
                $scope.govermentChargesAfterCalculation.push({ name: $scope.govchargeList[0].chargeList[i].charge_name_type, value: parseFloat(perSqr_basic_gov) });
            }

        }
       

        TotalValueOfGovermentCharges = 0;
        for (j = 0; j < $scope.govermentChargesAfterCalculation.length; j++) {

            TotalValueOfGovermentCharges = parseFloat(TotalValueOfGovermentCharges) + parseFloat($scope.govermentChargesAfterCalculation[j].value);
        }


    }

    $scope.totalChargeCalculation = function () {

        var totalCharge = 0;
        totalChargeValue = parseFloat(TotalValueOfOtherCharges) + parseFloat(TotalValueOfGovermentCharges);
    }



   $scope.grandTotal = function () {
        $scope.grandTotalWithoutOffer = 0;
        $scope.grandTotalWithoutOffer = parseFloat($scope.property_Details.total_considarationValue) + parseFloat(totalChargeValue);
        $scope.gTotal = $scope.grandTotalWithoutOffer;
        $cookieStore.put("total", $scope.gTotal);

    }

    $scope.FinalTotal = function () {
        
        if ($scope.offerDiscount == undefined && $scope.additionalDiscount == undefined) {
            
        }
        else if ($scope.offerDiscount != undefined && $scope.additionalDiscount == undefined) {
            $scope.grandTotalWithoutOffer = $scope.discountedValue;
        }
        else if ($scope.offerDiscount == undefined && $scope.additionalDiscount !== undefined) {
            $scope.grandTotalWithoutOffer = $scope.additionalDiscountValue;
        }
        else {
            $scope.grandTotalWithoutOffer = $scope.grandTotalWithoutOffer;
        }
    }


    $scope.addNew = function () {

        $state.go('app.property_CustomizDue');
    }


});
