
angular.module('contacts')
.controller('companyDetailController', function ($scope, $state, security, $cookieStore, apiService, $window, $modal, $rootScope) {
    console.log('companyDetailController');
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

  
    var userID = $cookieStore.get('userId');
    $rootScope.title = 'Dwellar./companyDetail';
    //$scope.rate = 2;
    $scope.max = 5;
    $scope.isReadonly = false;

    $scope.hoveringOver = function (value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / $scope.max);
    }

    contactUrl = "Tags/GetTagsByCompanyId/" + $scope.seletedCustomerId;
    apiService.getWithoutCaching(contactUrl).then(function (response) {
        $scope.tags = response.data;


    },
function (error) {
    console.log("Error " + error.state);
}
    );

    //Audit log start               
 
    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
          // device_mac_id: "34:#$::43:434:34:45",
           module_id: "Contact",
           action_id: "Contact View",
           details: $scope.rate + "AddNewUser",
           application: "angular",
           browser: $cookieStore.get('browser'),
           ip_address: $cookieStore.get('IP_Address'),
           location: $cookieStore.get('Location'),
           organization_id: $cookieStore.get('orgID'),
           User_ID: $cookieStore.get('userId')
       };


        apiService.post("AuditLog/Create", postdata).then(function (response) {
            var loginSession = response.data;
        },
   function (error) {
       if (error.status === 400)
           alert(error.data.Message);
       else
           alert("Network issue");
   });
    };
  

    //end
    contactUrl = "Company/GetCompanySummary/" + $scope.seletedCustomerId; 
    apiService.getWithoutCaching(contactUrl).then(function (response) {
        $scope.main = response.data;
        $scope.company = $scope.main[0];
        $scope.rate = $scope.main[0].rating;
    },
function (error) {
   
}
    );
    $scope.saveRating = function () {
        console.log($scope.rate);
        var postData = {
            user_id: $cookieStore.get('userId'),
            organization_id: $cookieStore.get('orgID'),
            rating: $scope.rate,
            id: $scope.seletedCustomerId,
        }
        apiService.post("Company/UpdateRating", postData).then(function (response) {
            var loginSession = response.data;
            AuditCreate();
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();
             
            $rootScope.$broadcast('REFRESH', 'TaskGrid');
        },
    function (error) {
        if (error.status === 400)
            alert(error.data.Message);
        else
            alert("Network issue");
    })
    };




    if ($scope.seletedCustomerId != "undefined") {

        GetUrl = "Company/GetCompanySummary/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;

        apiService.getWithoutCaching(GetUrl).then(function (response) {

            $scope.data = response.data;

            $scope.company_name = $scope.data[0].company_name;
            $scope.area = $scope.data[0].area;
            $scope.description = $scope.data[0].description;          
            $scope.zipcode = $scope.data[0].zipcode;          
            //$scope.choices1[0].Contact_Email = response.data[0].Contact_Email;
            //$scope.choices[0].Contact_Phone = response.data[0].Contact_Phone;
            $scope.choices2[0].Street_1 = response.data[0].street1;
            if (response.data[0].street2 != undefined)
            { $scope.choices2.push({ 'Street_1': response.data[0].street2 }); }
            
            $scope.zip_code = $scope.data[0].zip_code;
            $scope.state = $scope.data[0].state;
            $scope.city = $scope.data[0].city;
            $scope.Title = $scope.data[0].Title;

            if ($scope.data.contact_mobile !== '') {
                $scope.mobile = $scope.data.contact_mobile;
            }
            if ($scope.data.contact_email !== '') {
                $scope.email = $scope.data.contact_Email;
            }
        },
                    function (error) {
                        deferred.reject(error);
                        //alert("not working");
                    });
    }


    $scope.companyGrid = {
         dataSource: {
             type: "json",
             transport: {

                 read: apiService.baseUrl + "Company/GetAllContactDetailsbycompany/" + userID + "/" + $scope.seletedCustomerId
             },
             pageSize: 5
         },
         schema: {
             model: {
                 fields: {
                     date_of_birth: { type: "date" }
                 }
             }
         },

         groupable: true,
         sortable: true,
         selectable: "multiple",
         reorderable: true,
         resizable: true,
         filterable: true,
         height: screen.height - 370,
         columnMenu: {
             messages: {
                 columns: "Choose columns",
                 filter: "Apply filter",
                 sortAscending: "Sort (asc)",
                 sortDescending: "Sort (desc)"
             }
         },
         pageable: {
             refresh: true,
             pageSizes: true,
             buttonCount: 5
         },
         columns: [
              {
                  template: "<img height='40px' width='40px'  class='user-photo' src='#= Contact_Image #'/>" +
                  "<span style='padding-left:10px' class='customer-name'> </span>",
                  width: "60px",
                  title: "Picture",
                  attributes:
                  {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
              }, {
                  field: "Contact_First_Name",
                  template: '<a ui-sref="app.contactdetail({id:dataItem.Contact_Id})" href="">#=Contact_First_Name#</a>',
                  title: "Name",
                  width: "120px",
                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
              }, {
                  field: "Contact_Phone",
                  title: "Phone",
                  width: "120px",
                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
              }, {
                  field: "Contact_Email",
                  title: "Email",
                  width: "120px",
                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:right"
                  }
              }, {
                  field: "notes",
                  title: "Note",
                  width: "120px",
                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
              }, {
                  field: "LastFollowup",
                  title: "Last Follow up",
                  width: "120px",
                  attributes:
                  {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }
              }, {
                  field: "NextAction",
                  title: "Next Action",
                  width: "120px",
                  attributes: {
                      "class": "UseHand",
                      "style": "text-align:center"
                  }           
              },
              {
                  title: "Action",
                  template: "<a id='followUp' class='btn btn-primary' ng-click='openFollowUp(dataItem)' data-toggle='modal'>Follow up </a> </div>",
                  width: "120px",
                  attributes:
                    {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }
              },]

     };

    //popup functionality start

    //$scope.openFollowUp = function (d) {
    //    var id = d.Contact_Id;
    //    window.sessionStorage.selectedCustomerID = id;
    //    var modalInstance = $modal.open({

    //        animation: true,
    //        templateUrl: 'contacts/company/followUp.html',
    //        backdrop: 'static',
    //        controller: FollowUpController,
    //        size: 'md'

    //    });

    //};

    $scope.openFollowUp = function (d) {
        var id = d.Contact_Id;
        window.sessionStorage.selectedCustomerID = id;
       // $cookieStore.put('company_name', d.company);
        $cookieStore.put('lead_name', d.Contact_First_Name);
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'contacts/company/followUp.html',
            backdrop: 'static',
            controller: FollowUpController,
            size: 'md'

        });

    };

    $scope.openEditCompanyPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'contacts/company/editCompany.html',
            backdrop: 'static',
            controller: EditCompanyController,
            size: 'md'
        });
    };

    $scope.openCompanyTagConfirmation = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'contacts/company/companytagremove.tpl.html',
            backdrop: 'static',
            controller: confirmationComapnyTagController,
            size: 'md'
        });
    };

    //end popup functionality
    $scope.$on('REFRESH', function (event, args) {
        if (args == 'company_summary') {

            contactUrl = "Company/GetCompanySummary/" + $scope.seletedCustomerId; //f2294ca0-0fee-4c16-86af-0483a5718991";
            apiService.getWithoutCaching(contactUrl).then(function (response) {
                $scope.main = response.data;
                $scope.company = $scope.main[0];
            },
            function (error) {

            }
            );
        }

    });

    $scope.$on('REFRESHTag', function (event, args) {
        if (args == 'Tag')
        {
            contactUrl = "Tags/GetTagsByCompanyId/" + $scope.seletedCustomerId;
            apiService.getWithoutCaching(contactUrl).then(function (response) {
                $scope.tags = response.data;


            },
        function (error) {
            console.log("Error " + error.state);
        }
            );
        }

    });

    function RefreshGrid() {
        setInterval(function () {
            $('peopleGrid').data("kendoGrid").dataSource.transport.read();
        }, refreshInterval);

    }

    $scope.myGridChangeFollowUp = function (dataItem) {
     
        window.sessionStorage.selectedCustomerID = dataItem.Contact_Id;
        $cookieStore.put('email', dataItem.Contact_Email);
        $cookieStore.put('phone', dataItem.Contact_Phone);
        $cookieStore.put('name', dataItem.Name);
        $state.go('app.contactdetail');
     
    };

    $scope.removeImage = function (index) {
        var id = $scope.tags[index].tag_id;

        var postdata =
            {
                id: id,
                company_id: window.sessionStorage.selectedCustomerID
            }

        $cookieStore.put('postdata', postdata);
        $scope.openCompanyTagConfirmation();

    }

});