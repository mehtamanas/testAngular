generateQuoteCtrl = function ($scope, $state, $cookieStore, apiService, $window, $modalInstance, $rootScope, contactData,$modal) {

    var orgID = $cookieStore.get('orgID');
    var userId = $cookieStore.get('userId');
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    $scope.subscription = [];
   
    $scope.contactData = contactData;

    $scope.preview = function () {
        var modalInstance = $modal.open({
            animation: true,
            template: $scope.params.htmlcontent,
            backdrop: 'static',
            size: 'lg'
        });

    }

    $scope.cancel = function () {
        $modalInstance.dismiss();
    }

    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'lg',
            resolve: { items: { title: "Quote" } }
        });
    }

    $scope.preview = function () {
        demoFromHTML();
        //$scope.showTemplate = false;
        //$scope.showPreview = true;
    }

    var demoFromHTML = function () {
        var pdf = new jsPDF('p', 'pt', 'letter')

        // source can be HTML-formatted string, or a reference
        // to an actual DOM element from which the text will be scraped.
        , source = $scope.params.htmlcontent

        // we support special element handlers. Register them with jQuery-style 
        // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
        // There is no support for any other type of selectors 
        // (class, of compound) at this time.
        , specialElementHandlers = {
            // element with id of "bypass" - jQuery style selector
            '#bypassme': function (element, renderer) {
                // true = "handled elsewhere, bypass text extraction"
                return true
            }
        }

        margins = {
            top: 80,
            bottom: 60,
            left: 40,
            width: 522
        };
        // all coords and widths are in jsPDF instance's declared units
        // 'inches' in this case
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
                //pdf.save('Test.pdf');
                var string = pdf.output('datauristring');
                pdf.save('Test.pdf');
                window.open(string);
                //pdf.output('datauri');
            },
            margins
        )
    }

    Url = "Offers/GetOfferProject?orgID=" + $cookieStore.get('orgID');
    apiService.get(Url).then(function (response) {
        $scope.offers = response.data;
    },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });

    projectUrl = "Quotation/GenerateQuoteId";
    apiService.getWithoutCaching(projectUrl).then(function (response) {
        $scope.params = response.data;
        //$cookieStore.put('Random_id', $scope.params.random_id);
    },
function (error) {
    if (error.status === 400)
        alert(error.data.Message);
    else
        alert("Network issue");
}
    );


    $scope.selectoffer = function () {
      offerType = JSON.parse($scope.offer1);
        if (isNaN(offerType.offer_value) == true) {
            $scope.offersvalue = offerType.offer_value
            $scope.params.offerDiscount = null;
      }
        else {
            $scope.params.offerDiscount = offerType.offer_value;
            $scope.offersvalue = null;
        }
        $scope.params.offers_id = offerType.offers_id;


    };

   

    Url = "project/Get/" + $cookieStore.get('orgID');
    apiService.get(Url).then(function (response) {
        $scope.projects = response.data;
    },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });

    $scope.selectproject = function () {
        $scope.params.project_id = $scope.project1;
    };



    Url = "Quotation/GetQuoteService/" + $cookieStore.get('orgID');
    apiService.get(Url).then(function (response) {
        $scope.services = response.data;
    },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });

    $scope.selectservice = function (index) {
        $scope.subscription[index].desc = (_.findWhere($scope.services, { project_services_id: $scope.subscription[index].id })).description;
        $scope.subscription[index].name = (_.findWhere($scope.services, { project_services_id: $scope.subscription[index].id })).service_name;
        if ((_.findWhere($scope.services, { project_services_id: $scope.subscription[index].id })).quantity == null) {
            $scope.subscription[index].quantity = '1';
        } else {
            $scope.subscription[index].quantity = (_.findWhere($scope.services, { project_services_id: $scope.subscription[index].id })).quantity;
        }
       
        $scope.subscription[index].price = (_.findWhere($scope.services, { project_services_id: $scope.subscription[index].id })).price;
        $scope.subscription[index].tax = (_.findWhere($scope.services, { project_services_id: $scope.subscription[index].id })).tax_value;
        if ($scope.subscription[index].tax === null) { 
            $scope.subscription[index].taxDisabled = false;
        }
        else{
            $scope.subscription[index].taxDisabled = true;
        }
        calculateQuote(index);
        

    };


    var finalPrice = function () {
        $scope.calculatedPrice = 0;
        $scope.calculatedQuantity = 0;
        $scope.calculatedTax = 0;
        for (j = 0; j < $scope.subscription.length; j++) {

            $scope.calculatedPrice = $scope.calculatedPrice + $scope.subscription[j].price;
            $scope.calculatedQuantity = parseInt($scope.calculatedQuantity) + parseInt($scope.subscription[j].quantity);
            $scope.calculatedTax = $scope.calculatedTax + $scope.subscription[j].tax;
        }

        //alert($scope.calculatedQuantity);
       // alert($scope.calculatedPrice);
      //  alert($scope.calculatedTax);
    }

    $scope.taxEnabled = function (index) {
        calculateQuote(index);
        calculateGrandTotal(index);
    }

  

    $scope.change = function (index) {
        calculateQuote(index);
        calculateGrandTotal(index);
    };
    $scope.finalTotal = function () {
        calculateQuote(index);
        calculateGrandTotal(index);
    };

    $scope.subTotal_cal = function (index) {
        calculateGrandTotal(index);
    };

    $scope.discountTotal = function () {
        calculateTotal();
    };

    var calculateTotal = function () {

        if ($scope.radiovalue == 'Flat Charge')
        {
            $scope.params.grandTotal = parseFloat($scope.params.subTotal) - parseFloat($scope.params.offerDiscount) - parseFloat($scope.params.additionalDiscount);
        }
        else if ($scope.radiovalue == 'Percent')
        {
            $scope.params.grandTotal = parseFloat($scope.params.subTotal) -(parseFloat($scope.params.subTotal) * (parseFloat($scope.params.offerDiscount)/100) )- parseFloat($scope.params.additionalDiscount);
        }


      
    }


    $scope.quotes = [{ id: 'choice1' }];

    $scope.quotes2 = [{ id: 'choice1' }];

    $scope.addNewquote2 = function (e) {
        var classname = e.currentTarget.className;
        if (classname == 'remove-field') {

            $scope.quotes2.pop();
        }
        else if ($scope.quotes2.length) {
            var newItemNo2 = $scope.quotes2.length + 1;
            $scope.quotes2.push({ 'id': 'choice' + newItemNo2 });
        }

    };

    var calculateQuote = function (index) { //for total calculation
        if ($scope.subscription[index].taxDisabled == true) {
            $scope.subscription[index].total = parseFloat($scope.subscription[index].price) * parseFloat($scope.subscription[index].quantity) + parseFloat($scope.subscription[index].tax);
            calculateGrandTotal(index);
        }
        else
            $scope.subscription[index].total = parseFloat($scope.subscription[index].price) * parseFloat($scope.subscription[index].quantity);
        calculateGrandTotal(index);
    }
    var calculateGrandTotal = function () {//for grand total calculation
        $scope.params.subTotal = 0;
        $scope.params.grandTotal = 0;
        
        $scope.offerType = JSON.parse($scope.offer1);
        $scope.offer_type_name = offerType.offer_type_name;

        for (i = 0; i < $scope.subscription.length; i++) {
            $scope.params.subTotal = parseFloat($scope.params.subTotal) + parseFloat($scope.subscription[i].total);
        }
        if ($scope.params.additionalDiscount == undefined) {
            $scope.params.additionalDiscount ='0';
        }
         if($scope.params.offerDiscount == undefined){
            $scope.params.offerDiscount ='0';
        }
         else if ($scope.params.offerDiscount == undefined && $scope.params.additionalDiscount == undefined) {
            $scope.params.additionalDiscount = '0';
            params.offerDiscount = '0';
        }
         if ($scope.offer_type_name == 'Percent')
         {
             $scope.params.grandTotal = (parseFloat($scope.params.subTotal) - parseFloat(($scope.params.subTotal) * ($scope.params.offerDiscount / 100))) - parseFloat($scope.params.additionalDiscount);
         }
         else if ($scope.offer_type_name == 'Flat Discount')
         {
             $scope.params.grandTotal = (parseFloat($scope.params.subTotal) - parseFloat($scope.params.offerDiscount)) - parseFloat($scope.params.additionalDiscount);
         }
         

         finalPrice();
    }

    $scope.ServicePost = function () {
        //var expDate = moment($scope.expiry_datetime, 'DD/MM/YYYY')._d;
        var dDate = moment($scope.params.expiry_datetime, "DD/MM/YYYY hh:mm A")._d;
      
        // TODO: Need to get these values dynamically
        var post = {

            contact_id: $scope.seletedCustomerId,
            project_id: $scope.project1,
            user_id: $cookieStore.get('userId'),
            organization_id: $cookieStore.get('orgID'),
            discount:$scope.params.offerDiscount,
            additional_discount: $scope.params.additionalDiscount,
            gross_amount: $scope.params.subTotal,
            final_amount: $scope.params.grandTotal,
            expiry_date: new Date(dDate).toISOString(),
            offer_id: $scope.params.offers_id,
            quotation_id:$scope.params.random_id
        };





        apiService.post("Quotation/Create", post).then(function (response) {
            var loginSession = response.data;
            AuditCreate();
            var quote = [];


            for (var i in $scope.quotes2) {
                var newquote = {};
                newquote.quote_id = loginSession.id;
                newquote.project_services_id = $scope.subscription[i].id;
                newquote.user_id = $cookieStore.get('userId'),
                newquote.organization_id = $cookieStore.get('orgID'),
                newquote.tax_value = $scope.subscription[i].tax
                newquote.quantity = $scope.subscription[i].quantity;
                newquote.price = $scope.subscription[i].price;
                quote.push(newquote);
            }
            apiService.post("Quotation/CreateQuoteTax", quote).then(function (response) {
                var loginSession = response.data;
                alert("Quote generated...");
                $rootScope.$broadcast('REFRESH', 'QuotesGrid');
                called = true;
                $modalInstance.dismiss();
                //$scope.openSucessfullPopup();

            },
            function (error) {
                if (error.status === 400)
                    alert(error.data.Message);
                else
                    alert("Network issue");
            });

            //  alert("Tower Done...");
            $modalInstance.dismiss();

        },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    });

    }

   
    $scope.openquotePreview = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'contacts/quotes/generateQuotePreview.html',
            backdrop: 'static',
            controller: quotePreviewCltr,
            size: 'lg',
            resolve: {
                previewData :{
                subscriptionData: $scope.subscription,
                otherFields: $scope.params,
                contactData:contactData,
                }
            }
        });
    };

    $scope.params = {
        price : $scope.price,
        quantity: $scope.quantity,
        tax_value: $scope.tax_value,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId'),
        project_services_id: $scope.project1,
        quotation_id: $scope.random_id
   
    };

  


};