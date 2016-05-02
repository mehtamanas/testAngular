var OfferController = function ($scope, $state, $cookieStore, apiService, $modalInstance, FileUploader, uploadService, $window, $modal, $rootScope) {
    console.log('OfferController');

    $scope.dicountType = [];

    AuditCreate = function () {
        var postdata =
       {
           device_os: $cookieStore.get('Device_os'),
           device_type: $cookieStore.get('Device'),
           module_id: "Project",
           action_id: "ProjectOfferView",
           details: "AddOffer",
           application: "angular",
           browser: $cookieStore.get('browser'),
           ip_address: $cookieStore.get('IP_Address'),
           location: $cookieStore.get('Location'),
           organization_id: $cookieStore.get('orgID'),
           User_ID: $cookieStore.get('userId'),

       };


        apiService.post("AuditLog/Create", postdata).then(function (response) {
            var loginSession = response.data;
        },
    function (error) {
    });
    };
    AuditCreate();

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.reset = function () {
        $scope.params = {};
    }

    Url = "project/Get/" + $cookieStore.get('orgID');
    apiService.get(Url).then(function (response) {
        $scope.projects = response.data;
    },
   function (error) {

   });

    $scope.selectoffers = function (id, index)
    {
        $scope.dicountType[index].enable = true;
        //$scope.dicountType[index].value = id;
        for (i = 0; i < $scope.dicountType.length; i++)
        {
            $scope.dicountType[i].enable = false;
            $scope.dicountType[index].value = null;

        }
       // $scope.dicountType[index].value = null;
        $scope.dicountType[index].enable = true;
    }

    $scope.selectproject = function () {
        $scope.params.project_id = $scope.project1;

    };

    

        Url = "Offers/GetOfferTypes";
        apiService.get(Url).then(function (response) {
            $scope.offers = response.data;
          
        },
       function (error) {

       });


        $scope.save = function () {

        var postData =
        {
            offer_name: $scope.params.offer_name,
            description: $scope.params.description,
            offer_value:  (_.findWhere($scope.dicountType, { enable: true })).value,
            offer_type_id: (_.findWhere($scope.dicountType, { enable: true })).id,
            project_id: $scope.project1,
            organization_id: $cookieStore.get('orgID'),
            user_id: $cookieStore.get('userId')
        };

        apiService.post("Offers/Create", postData).then(function (response) {
            var loginSession = response.data;
            $modalInstance.dismiss();
            $scope.openSucessfullPopup();
            $rootScope.$broadcast('REFRESHOFFER', 'OfferGrid');
        });
    }

    $scope.params =
    {
        offer_name: $scope.offer_name,
        description: $scope.description,
        offer_value: $scope.offer_value,
        offer_type_id: $scope.offer_type_id,
        project_id: $scope.project_id,
        organization_id: $cookieStore.get('orgID'),
        user_id: $cookieStore.get('userId')
    };


    $scope.openSucessfullPopup = function () {
        var modalInstance = $modal.open({
            animation: true,
            templateUrl: 'newuser/sucessfull.tpl.html',
            backdrop: 'static',
            controller: sucessfullController,
            size: 'lg',
            resolve: { items: { title: "Offers" } }
        });


    }

    $scope.addNew = function (isValid)
    {
        $scope.showValid = true;
        if (isValid)
        {

            $scope.save();
            $scope.showValid = false;

        }

    }



};