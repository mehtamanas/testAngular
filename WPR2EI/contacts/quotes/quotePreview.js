quotePreviewCltr = function ($scope, $state, $cookieStore, apiService, $window, $modalInstance, $rootScope, $modal, previewData) {
    
    var orgID = $cookieStore.get('orgID');
    var userId = $cookieStore.get('userId');

    $scope.perviewchargeName = [];
    perviewchargeName = $cookieStore.get('chargeName');
    $scope.perviewchargePercent = [];
    perviewchargePercent = $cookieStore.get('chargePercentage');
    $scope.previewtotalTax = [];
    previewtotalTax = $cookieStore.get('totalTax');

    var previewService = []
    

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    $scope.subscription = previewData.subscriptionData;
    $scope.params = previewData.otherFields;
    $scope.contactData = previewData.contactData;
    GetUrl = "Organization/Get/" + orgID;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;
    //alert(GetUrl);

    apiService.getWithoutCaching(GetUrl).then(function (response) {

        $scope.address = response.data;
    });


    GetUrl = "Quotation/GetQuoteEstimate/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;
    //alert(GetUrl);

    apiService.getWithoutCaching(GetUrl).then(function (response) {

        $scope.companyEstimate = response.data;
    });

    $scope.cancel = function () {
        $modalInstance.dismiss();
    }

    $scope.getDatetime = function () {
        return (new Date).toLocaleFormat("%A, %B %e, %Y");
    };

    var prePDFCheck = function () {

        if ($scope.contactData.Contact_First_Name == null) $scope.contactData.Contact_First_Name = "";
        if ($scope.contactData.Contact_Last_Name == null) $scope.contactData.Contact_Last_Name = "";
        if ($scope.contactData.street1 == null) $scope.contactData.street1 = "";
        if ($scope.contactData.street2 == null) $scope.contactData.street2 = "";
        if ($scope.contactData.City == null) $scope.contactData.City = "";
        if ($scope.contactData.state_name == null) $scope.contactData.state_name = "";
        if ($scope.contactData.zipcode == null) $scope.contactData.zipcode = "";
        if ($scope.contactData.Contact_Phone == null) $scope.contactData.Contact_Phone = "";
        if ($scope.contactData.Contact_Email == null) $scope.contactData.Contact_Email = "";


        if ($scope.companyEstimate[0].company_name == null) $scope.companyEstimate[0].company_name = "";
        if ($scope.companyEstimate[0].area == null) $scope.companyEstimate[0].area = "";
        if ($scope.companyEstimate[0].street1 == null) $scope.companyEstimate[0].street1 = "";
        if ($scope.companyEstimate[0].street2 == null) $scope.companyEstimate[0].street2 = "";
        if ($scope.companyEstimate[0].city == null) $scope.companyEstimate[0].city = "";
        if ($scope.companyEstimate[0].state == null) $scope.companyEstimate[0].state = "";
        if ($scope.companyEstimate[0].zipcode == null) $scope.companyEstimate[0].zipcode = "";

        if ($scope.params.subTotal == null) $scope.params.subTotal = 0;
        if ($scope.params.offerDiscount == null) $scope.params.offerDiscount = 0;
        if ($scope.params.additionalDiscount == null) $scope.params.additionalDiscount = 0;
        if ($scope.params.grandTotal == null) $scope.params.grandTotal = 0;

        //if ($scope.subscription[0].desc == null) $scope.subscription[0].desc = "";
        //if ($scope.subscription[0].name == null) $scope.subscription[0].name = "";
        //if ($scope.subscription[0].quantity == null) $scope.subscription[0].quantity = "1";
        //if ($scope.subscription[0].price == null) $scope.subscription[0].price = "";
        //if ($scope.subscription[0].tax == null) $scope.subscription[0].tax = "";
        //if ($scope.subscription[0].total == null) $scope.subscription[0].total = "";



    }

    var subscriptionTable = function () {
        var subProduct = [];
        var productTable = {};
        subProduct.push([{ text: 'No', style: 'tableHeader', fillColor: '#efefef' }, { text: 'Products', style: 'tableHeader', fillColor: '#efefef' }, { text: 'Description', style: 'tableHeader', fillColor: '#efefef' }, { text: 'Qty', style: 'tableHeader', fillColor: '#efefef' }, { text: 'Rate', style: 'tableHeader', fillColor: '#efefef' }, { text: 'Amount', style: 'tableHeader', fillColor: '#efefef' }, ]);
        for (j = 0; j < $scope.subscription.length; j++) {
            subProduct.push([{ text: (j + 1).toString(), style: 'tableData' }, { text: $scope.subscription[j].name, style: 'tableData', }, { text: $scope.subscription[j].desc, style: 'tableData', }, { text: ($scope.subscription[j].quantity).toString(), style: 'tableData', }, { text: 'Rs.' + ($scope.subscription[j].price).toString(), style: 'tableData', }, { text: 'Rs.' + ($scope.subscription[j].total).toString(), style: 'tableData', }]);
        }
        productTable = {
            headerRows: 1,
            widths: [20, 110, 67, 67, 67, 67, ],
            body: subProduct
        }
        return productTable
    }

    $scope.preview = function () {
        prePDFCheck();
        var docDefinition = {
            content: [
               { text: $scope.contactData.Contact_First_Name + $scope.contactData.Contact_Last_Name, style: 'BuilderName' },
               { text: $scope.contactData.street1 + $scope.contactData.street2, style: 'BuilderAddress', margin: [0, 5, 0, 0], },
               { text: $scope.contactData.City, style: 'BuilderAddress' },
               { text: $scope.contactData.state_name, style: 'BuilderAddress' },
               { text: $scope.contactData.zipcode, style: 'BuilderAddress' },
               { text: $scope.contactData.Contact_Phone, style: 'BuilderAddress' },
               { text: $scope.contactData.Contact_Email, style: 'BuilderAddress' },



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
                              [{ text: '', style: 'tableHeader' }, { text: '', style: 'tableHeader' }, ],

                              [{ text: $scope.companyEstimate[0].company_name, style: 'BuilderName', }, { text: 'Estimate No.' + $scope.params.random_id, style: 'panNo' }, ],
                              [{ text: $scope.companyEstimate[0].area, style: 'BuilderAddress' }, { text: 'Date: ' + moment().format('DD/MM/YYYY'), style: 'BuilderAddress' }, ],
                              [{ text: $scope.companyEstimate[0].street1, style: 'BuilderAddress' }, { text: 'Expire Date: ' + moment($scope.params.expiry_datetime, 'DD/MM/YYYY hh:mm A').format('MM/DD/YYYY'), style: 'BuilderAddress' }, ],

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


                {
                    margin: [0, 30, 0, 30],
                    table: subscriptionTable(),
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

                 {
                     margin: [0, 0, 0, 35],
                     table: {
                         headerRows: 1,
                         widths: [327, 150, ],
                         body: [
                             [{ text: 'SUB TOTAL', style: 'tableHeader', fillColor: '#efefef' }, { text: 'Rs.' + ($scope.params.subTotal).toString(), style: 'tableHeader', fillColor: '#efefef' }, ],
                                [{ text: 'Offer', style: 'tableHeader', }, { text: ($scope.params.offerDiscount).toString(), style: 'tableHeader', }, ],
                                [{ text: 'Additional Discount', style: 'tableHeader', }, { text: 'Rs.' + ($scope.params.additionalDiscount).toString(), style: 'tableHeader', }, ],
                                 [{ text: 'TOTAL', style: 'tableHeader', }, { text: 'Rs.' + ($scope.params.grandTotal).toString(), style: 'tableHeader', }, ],


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

                 },//sub total


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

    }
};