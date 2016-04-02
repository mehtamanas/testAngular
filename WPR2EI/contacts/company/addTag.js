﻿
var AddTagCompanyController= function ($scope, $state, $cookieStore, apiService, $rootScope, $modalInstance, $modal, $window) {
    console.log('AddTagCompanyController');

    $scope.seletedCustomerId = window.sessionStorage.selectedCustomerID;
    var orgID = $cookieStore.get('orgID');
    //Audit log start               

 
    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
          // device_mac_id: "34:#$::43:434:34:45",
           module_id: "Contact",
           action_id: "Contact View",
           details:"AddNewTag",
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
    AuditCreate();

    //end
    //API functionality start  
    Url = "Tags/GetAllTags?id=" + orgID
            apiService.get(Url).then(function (response) {
                $scope.tagList = response.data;
                $scope.tagList = _.pluck($scope.tagList, 'tag_name');
            },
        function (error) {
            alert("Error " + error.state);
        });
            $scope.checkedIds = null;
            $scope.checkedIds = $cookieStore.get('checkedIds');
          
            projectUrl = "Company/CompanyTagMapping";
            ProjectCreate = function (param) {
                var usersToBeAddedOnServer = [];
                for (var i in $scope.checkedIds) {
                    var newMember = {};
                    newMember.company_id = $scope.checkedIds[i];
                    newMember.tag_name = $scope.params.tag_name;
                    newMember.user_id = $cookieStore.get('userId');
                    newMember.organization_id = $cookieStore.get('orgID');
                    $cookieStore.put('tag_name', newMember.tag_name);
                    usersToBeAddedOnServer.push(newMember);
                }
                apiService.post(projectUrl, usersToBeAddedOnServer).then(function (response) {
                    var loginSession = response.data;
                    $modalInstance.dismiss();
                    $scope.openSucessfullPopup();
                    $rootScope.$broadcast('REFRESH', 'contactGrid');
                },
            function (error) {
                if (error.status === 400)
                    alert(error.data.Message);
                else
                    alert("Network issue");
            })
            };
           

            $scope.addNew = function (isValid) {
                $scope.showValid = true;
                if (isValid) {

                     new ProjectCreate().then(function (response) {
                        console.log(response);
                        $scope.showValid = false;
                        $state.go('guest.signup.thanks');
                    }, function (error) {
                        console.log(error);
                    });

                    $scope.showValid = false;

                }
            }

            $scope.openSucessfullPopup = function () {
                var modalInstance = $modal.open({
                    animation: true,
                    templateUrl: 'newuser/sucessfull.tpl.html',
                    backdrop: 'static',
                    controller: sucessfullController,
                    size: 'lg',
                    resolve: { items: { title: "Tag" } }
                });
            }
        };