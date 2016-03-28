quotePreviewCltr = function ($scope, $state, $cookieStore, apiService, $window, $modalInstance, $rootScope, $modal, previewData) {
    
    var orgID = $cookieStore.get('orgID');
    var userId = $cookieStore.get('userId');
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

    $scope.preview = function () {
        //demoFromHTML();
        pdfToHTML();
        //$scope.showTemplate = false;
        //$scope.showPreview = true;
    }

    //var demoFromHTML = function () {
    //    var pdf = new jsPDF()

    //    var specialElementHandlers = {
    //        '#editor': function (element, renderer) {
    //            return true;
    //        }
    //    };

    //    pdf.fromHTML($('#quotePreview').get(0), 15, 15, {
    //        'width': 170,
    //        'elementHandlers': specialElementHandlers
    //    });

    //    pdf.save('TestHTMLDoc.pdf');

    //    //pdf.fromHTML(
    //    //    $('#quotePreview').html(), 15, 15, {
    //    //        'width': $('#quote').width,
    //    //        'elementHandlers': specialElementHandlers
    //    //    },
    //    //    function (dispose) {
    //    //        // dispose: object with X, Y of the last line add to the PDF 
    //    //        //          this allow the insertion of new lines after html
    //    //        //pdf.save('Test.pdf');
    //    //        var string = pdf.output('datauristring');
    //    //        pdf.save('Test.pdf');
    //    //        window.open(string);
    //    //        //pdf.output('datauri');
    //    //    },
    //    //    margins
    //    //)
    //}

    function pdfToHTML() {
        var pdf = new jsPDF('p', 'pt', 'letter');
        source = $('#quotePreview')[0];
        specialElementHandlers = {
            '#bypassme': function (element, renderer) {
                return true
            }
        }
        margins = {
            top: 50,
            left: 60,
            width: 545
        };
        pdf.fromHTML(
            source // HTML string or DOM elem ref.
            , margins.left // x coord
            , margins.top // y coord
            , {
                'width': margins.width // max width of content on PDF
                , 'elementHandlers': specialElementHandlers
            },
            function (dispose) {
                // dispose: object with X, Y of the last line add to the PDF
                //          this allow the insertion of new lines after html
                pdf.save('html2pdf.pdf');
            }
          )
    }
};