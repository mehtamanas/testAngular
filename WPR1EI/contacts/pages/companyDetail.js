
angular.module('contacts')
.controller('companyDetailController', function ($scope, $state, security, $cookieStore, apiService, $window, $modal, $rootScope) {
    console.log('companyDetailController');
    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;

  
    var userID = $cookieStore.get('userId');
    $rootScope.title = 'Dwellar./companyDetail';
    $scope.rate = 2;
    $scope.max = 5;
    $scope.isReadonly = false;

    $scope.hoveringOver = function (value) {
        $scope.overStar = value;
        $scope.percent = 100 * (value / $scope.max);
    }


    ////Audit log start															
    //    $scope.params =
    //        {
    //            device_os: $cookieStore.get('Device_os'),
    //            device_type: $cookieStore.get('Device'),
    //            device_mac_id: "34:#$::43:434:34:45",
    //            module_id: "Contact",
    //            action_id: "Contact View",
    //            details: "ContactDetailView",
    //            application: "angular",
    //            browser: $cookieStore.get('browser'),
    //            ip_address: $cookieStore.get('IP_Address'),
    //            location: $cookieStore.get('Location'),
    //            organization_id: $cookieStore.get('orgID'),
    //            User_ID: $cookieStore.get('userId')
    //        };

    //    AuditCreate = function (param) {
    //        apiService.post("AuditLog/Create", param).then(function (response) {
    //            var loginSession = response.data;
    //        },
    //   function (error) {

    //   });
    //    };
    //    AuditCreate($scope.params);

    ////end

    contactUrl = "Company/GetCompanySummary/" + $scope.seletedCustomerId; //f2294ca0-0fee-4c16-86af-0483a5718991";
    apiService.get(contactUrl).then(function (response) {
        $scope.main = response.data;
        $scope.company = $scope.main[0];

    },
function (error) {
    if (error.status === 400)
        alert(error.data.Message);
    else
        alert("Network issue");
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

        GetUrl = "Contact/GetContactSummary/" + $scope.seletedCustomerId;//0bcdb6a7-af0a-4ed0-b428-8faa23b7689f" ;
        apiService.get(GetUrl).then(function (response) {

            $scope.data = response.data;

            $scope.Contact_First_Name = $scope.data[0].Contact_First_Name;
            $scope.Contact_Last_Name = $scope.data[0].Contact_Last_Name;
            $scope.Contact_Email = $scope.data[0].Contact_Email;
            $scope.Contact_Phone = $scope.data[0].Contact_Phone;
            $scope.street1 = $scope.data[0].street1;
            $scope.Role = $scope.data[0].Role;
            $scope.zipcode = $scope.data[0].zipcode;
            $scope.State = $scope.data[0].State;
            $scope.City = $scope.data[0].City;

            if ($scope.data.contact_mobile !== '') {
                $scope.mobile = $scope.data.contact_mobile;
            }
            if ($scope.data.contact_email !== '') {
                $scope.email = $scope.data.contact_Email;
            }
        },
                    function (error) {
                        if (error.status === 400)
                            alert(error.data.Message);
                        else
                            alert("Network issue");
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
                  template: "<a id='btn_edit_contact' ng-click='openFollowUp(dataItem)' data-toggle='modal' style='cursor:pointer'>Follow Up</a> </div>",
                  width: "120px",
                  attributes:
                    {
                        "class": "UseHand",
                        "style": "text-align:center"
                    }
              },]

     };

    //popup functionality start

    $scope.openFollowUp = function (d) {
        var id = d.Contact_Id;
        window.sessionStorage.selectedCustomerID = id;
       // $cookieStore.put('ID', window.sessionStorage.selectedCustomerID);
        var modalInstance = $modal.open({

            animation: true,
            templateUrl: 'contacts/company/followUp.html',
            backdrop: 'static',
            controller: FollowUpController,
            size: 'md'

        });

    };

    function RefreshGrid() {
        setInterval(function () {
            $('peopleGrid').data("kendoGrid").dataSource.transport.read();
        }, refreshInterval);

    }

    $scope.myGridChangeFollowUp = function (dataItem) {
        // dataItem will contain the row that was selected
        window.sessionStorage.selectedCustomerID = dataItem.Contact_Id;
        $cookieStore.put('email', dataItem.Contact_Email);
        $cookieStore.put('phone', dataItem.Contact_Phone);
        $cookieStore.put('name', dataItem.Name);
       
      

    };

 


});