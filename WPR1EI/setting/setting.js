angular.module('setting')
.controller('settingController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope) {
        console.log('settingController');
        $scope.inactive_time;
       
         var orgID = $cookieStore.get('orgID');



         if ($scope.yesradioValue == 1) {
             $scope.flag1 = "Yes";

         }
         else {
             $scope.flag1 = "No"
         };
        
         $scope.params = {
             flag: $scope.flag1,
             organization_id: $cookieStore.get('orgID'),
             resource_field_id: "71ae53c0-b0ae-4dc7-a4fb-8ee997fe1248"
         };

         $scope.params1 = {
             organization_id: $cookieStore.get('orgID'),
             resource_field_id: "b85c271c-a53e-48b0-bbed-48ae71fbc114",
             inactive_time: $scope.inactive_time
         };


         if ($scope.listradioValue == 3) {
             $scope.flag = "List View";
         }
         else if($scope.listradioValue == 4){
             $scope.flag = " Panel View"
         }
         else if ($scope.listradioValue == 5) {
             $scope.flag = "Map View"
         };

         $scope.finalpost = function () {

             var schemeupdate = [];

             var newscheme = {};
             newscheme.user_id = $cookieStore.get('userId');
             newscheme.organization_id = $cookieStore.get('orgID');
             newscheme.resource_field_id = "71ae53c0-b0ae-4dc7-a4fb-8ee997fe1248";
             newscheme.flag = $scope.yesradioValue;

             schemeupdate.push(newscheme);

             apiService.post("Settings/CreateKioskSetting", schemeupdate).then(function (response) {
                 var loginSession = response.data;

                 console.log("project done");
                 $modalInstance.dismiss();
                 $scope.openSucessfullPopup();
                 $rootScope.$broadcast('REFRESH', 'projectGrid');

             },
             function (error) {

             });

             var schemeupdate8 = [];

             var newscheme8 = {};
             newscheme8.user_id =$cookieStore.get('userId');
             newscheme8.organization_id = $cookieStore.get('orgID');
             newscheme8.resource_field_id = "b85c271c-a53e-48b0-bbed-48ae71fbc114";
             newscheme8.flag = $scope.inactive_time;

             schemeupdate8.push(newscheme8);

             apiService.post("Settings/CreateKioskSetting", schemeupdate8).then(function (response) {
                 var loginSession = response.data;

                 console.log("project done");
                 $modalInstance.dismiss();
                 $scope.openSucessfullPopup();
                 $rootScope.$broadcast('REFRESH', 'projectGrid');

             },
             function (error) {

             });

             var schemeupdate1 = [];

             var newscheme1 = {};
             newscheme1.user_id = $cookieStore.get('userId');
             newscheme1.organization_id =$cookieStore.get('orgID');
             newscheme1.resource_field_id = "044cc443-7bdd-48c0-a3f0-1f3642fb784a";
             newscheme1.flag = $scope.listradioValue;

             schemeupdate1.push(newscheme1);

             apiService.post("Settings/CreateKioskSetting", schemeupdate1).then(function (response) {

                 var loginSession = response.data;

                 console.log("project done");
                 $modalInstance.dismiss();
                 $scope.openSucessfullPopup();
                 $rootScope.$broadcast('REFRESH', 'projectGrid');

             },
             function (error) {

             });


             var schemeupdate2 = [];
             for (var i in $scope.project1) {
                 var newscheme2 = {};

                 newscheme2.user_id = $cookieStore.get('userId');
                 newscheme2.organization_id = $cookieStore.get('orgID');
                 newscheme2.resource_field_id = "9a232de4-84dd-46f8-a67c-20b3f6c0a309";
                 newscheme2.project_id = $scope.project1[i];
                 schemeupdate2.push(newscheme2);
             }

             apiService.post("Settings/CreateKioskSetting", schemeupdate2).then(function (response) {

                 var loginSession = response.data;

                 console.log("project done");
              
                 $scope.openSucessfullPopup();
                 $rootScope.$broadcast('REFRESH', 'projectGrid');

             },
           function (error) {

           });

             var schemeupdate3 = [];
             for (var i in $scope.project2) {
                 var newscheme3 = {};

                 newscheme3.user_id = $cookieStore.get('userId');
                 newscheme3.organization_id = $cookieStore.get('orgID');
                 newscheme3.resource_field_id = "4c1cf084-fdf6-42be-9cdf-0f42d8c2233e";
                 newscheme3.project_id = $scope.project2[i];
                 schemeupdate3.push(newscheme3);
             }

             apiService.post("Settings/CreateKioskSetting", schemeupdate3).then(function (response) {

                 var loginSession = response.data;

                 console.log("project done");

                
                 $rootScope.$broadcast('REFRESH', 'projectGrid');

             },
           function (error) {

           });

             var schemeupdate4 = [];
             for (var i in $scope.project3) {
                 var newscheme4 = {};

                 newscheme4.user_id = $cookieStore.get('userId');
                 newscheme4.organization_id = $cookieStore.get('orgID');
                 newscheme4.resource_field_id = "e30bba04-7338-4057-b0c1-912fbd8d862c";
                 newscheme4.project_id = $scope.project3[i];
                 schemeupdate4.push(newscheme4);
             }

             apiService.post("Settings/CreateKioskSetting", schemeupdate4).then(function (response) {

                 var loginSession = response.data;

                 console.log("project done");


                 $rootScope.$broadcast('REFRESH', 'projectGrid');

             },
           function (error) {

           });

             var schemeupdate5 = [];
             for (var i in $scope.project4) {
                 var newscheme5 = {};

                 newscheme5.user_id = $cookieStore.get('userId');
                 newscheme5.organization_id = $cookieStore.get('orgID');
                 newscheme5.resource_field_id = "3e4ac22a-27ab-4447-9682-c07ed29d157f";
                 newscheme5.project_id = $scope.project4[i];
                 schemeupdate5.push(newscheme5);
             }

             apiService.post("Settings/CreateKioskSetting", schemeupdate5).then(function (response) {

                 var loginSession = response.data;

                 console.log("project done");


                 $rootScope.$broadcast('REFRESH', 'projectGrid');

             },
           function (error) {

           });

             var schemeupdate6 = [];
             for (var i in $scope.project5) {
                 var newscheme6 = {};
                 newscheme6.user_id = $cookieStore.get('userId');
                 newscheme6.organization_id = $cookieStore.get('orgID');
                 newscheme6.resource_field_id = "ce869e06-e9f0-4936-9210-892374996275";
                 newscheme6.project_id = $scope.project5[i];
                 schemeupdate6.push(newscheme6);
             }

             apiService.post("Settings/CreateKioskSetting", schemeupdate6).then(function (response) {

                 var loginSession = response.data;

                 console.log("project done");


                 $rootScope.$broadcast('REFRESH', 'projectGrid');

             },
           function (error) {

           });

             var schemeupdate7 = [];
             for (var i in $scope.project6) {
                 var newscheme7 = {};

                 newscheme7.user_id = $cookieStore.get('userId');
                 newscheme7.organization_id = $cookieStore.get('orgID');
                 newscheme7.resource_field_id = "aa4ab8dc-87f4-48d4-9948-70944776a7e3";
                 newscheme7.project_id = $scope.project6[i];
                 schemeupdate7.push(newscheme7);
             }

             apiService.post("Settings/CreateKioskSetting", schemeupdate6).then(function (response) {

                 var loginSession = response.data;

                 console.log("project done");


                 $rootScope.$broadcast('REFRESH', 'projectGrid');

             },
           function (error) {

           });


         }


         Url = "project/Get/" + $cookieStore.get('orgID');
         apiService.get(Url).then(function (response) {
             $scope.projects = response.data;
         },
        function (error) {
            alert("Error " + error.state);
        });

         $scope.selectproject1 = function () {
             $scope.params.project_id = $scope.project1;
             //alert($scope.params.project_id);
         };

         $scope.selectproject2 = function () {
             $scope.params.project_id = $scope.project2;
             //alert($scope.params.project_id);
         };

         $scope.selectproject3 = function () {
             $scope.params.project_id = $scope.project3;
             //alert($scope.params.project_id);
         };

         $scope.selectproject4 = function () {
             $scope.params.project_id = $scope.project4;
             //alert($scope.params.project_id);
         };

         $scope.selectproject5 = function () {
             $scope.params.project_id = $scope.project5;
             //alert($scope.params.project_id);
         };

         $scope.selectproject6 = function () {
             $scope.params.project_id = $scope.project6;
             //alert($scope.params.project_id);
         };
         console.log($cookieStore.get('userId'));
        $scope.selectOptions = {
            placeholder: "Select products...",
            dataTextField: "name",
            dataValueField: "id",
            valuePrimitive: true,
            autoBind: false,
            dataSource: {
                type: "json",
                serverFiltering: true,
                transport: {
                    read: {
                        url: "https://dw-webservices-uat.azurewebsites.net/project/Get/" + $cookieStore.get('orgID'),
                    }
                }
            }
        };



        
    })

