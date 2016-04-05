angular.module('setting')
.controller('settingController',
    function ($scope, $state, security, $cookieStore,apiService, $modal, $rootScope) {
        console.log('settingController');
        $scope.inactive_time;

        $scope.WHO_AM_I = $cookieStore.get('Who_Am_i');

        var orgID = $cookieStore.get('orgID');
        $rootScope.title = 'Dwellar/Settings';


        if ($scope.showcontent == 1)
        {
            $scope.params.flag = "Show Content";

        }
         if ($scope.showprice == 1)
        {
             $scope.params.flag = "Show Pricing"
        }
         if ($scope.showavail == 1)
        {
             $scope.params.flag = "Show Availability"
        }

        $scope.params = {
            flag: $scope.flag1,
            organization_id: $cookieStore.get('orgID'),
            //resource_field_id: "71ae53c0-b0ae-4dc7-a4fb-8ee997fe1248"
        };

        //$scope.params1 = {
        //    organization_id: $cookieStore.get('orgID'),
        //    resource_field_id: "b85c271c-a53e-48b0-bbed-48ae71fbc114",
        //    inactive_time: $scope.inactive_time
        //};






        $scope.finalpost = function () {

            var schemeupdate = [];

            var newscheme = {};
            newscheme.user_id = $cookieStore.get('userId');
            newscheme.organization_id = $cookieStore.get('orgID');
            newscheme.resource_field_id = "0333f7d9-fe64-42bb-bdd4-fcc1394ae91f";
            newscheme.flag = $scope.showcontent;

            schemeupdate.push(newscheme);

            apiService.post("Settings/CreateKioskSetting", schemeupdate).then(function (response) {
                var loginSession = response.data;
                
            },
            function (error) {

            });

            var schemeupdate8 = [];

            var newscheme8 = {};
            newscheme8.user_id = $cookieStore.get('userId');
            newscheme8.organization_id = $cookieStore.get('orgID');
            newscheme8.resource_field_id = "0333f7d9-fe64-42bb-bdd4-fcc1394ae91f";
            newscheme8.flag = $scope.showprice;

            schemeupdate8.push(newscheme8);

            apiService.post("Settings/CreateKioskSetting", schemeupdate8).then(function (response) {
                var loginSession = response.data;
               
            },
            function (error) {

            });

            var schemeupdate1 = [];

            var newscheme1 = {};
            newscheme1.user_id = $cookieStore.get('userId');
            newscheme1.organization_id = $cookieStore.get('orgID');
            newscheme1.resource_field_id = "0333f7d9-fe64-42bb-bdd4-fcc1394ae91f";
            newscheme1.flag = $scope.showavail;

            schemeupdate1.push(newscheme1);

            apiService.post("Settings/CreateKioskSetting", schemeupdate1).then(function (response) {

                var loginSession = response.data;
              
                $scope.openSavePopup();
              
            },
            function (error) {

            });
        }

        $scope.openSavePopup = function () {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'setting/save.html',
                backdrop: 'static',
                controller: SaveController,
                size: 'lg',

            });


        }


      
        //console.log($cookieStore.get('userId'));
        //$scope.selectOptions = {
        //    placeholder: "Select products...",
        //    dataTextField: "name",
        //    dataValueField: "id",
        //    valuePrimitive: true,
        //    autoBind: false,
        //    dataSource: {
        //        type: "json",
        //        serverFiltering: true,
        //        transport: {
        //            read: {
        //                url: apiService.baseUrl + "project/Get/" + $cookieStore.get('orgID'),
        //            }
        //        }
        //    }
        //};




    });

