    angular.module('campaigns')
      
    .controller('AddNewcampaign', function ($scope, $state, $cookieStore, apiService, $modal, $rootScope, $window)
    {
        console.log("AddNewcampaign");

        //Audit log start               
        AuditCreate = function () {
            var postdata =
           {
               device_os: $cookieStore.get('Device_os'),
               device_type: $cookieStore.get('Device'),
               //device_mac_id: "34:#$::43:434:34:45",
               module_id: "Contact",
               action_id: "Contact View",
               details: $scope.params.name + "AddNewCampaign",
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

        Url = "project/Get/" + $cookieStore.get('orgID');
        apiService.get(Url).then(function (response) {
            $scope.projects = response.data;
        },
       function (error) {
      
       });

        $scope.selectproject = function () {
            $scope.params.project_id = $scope.project1;
        };

        $scope.user = function () {
       
            $state.go('app.campaigns');

        }
 
        $scope.params = {
            name: $scope.name,
            start_date1: $scope.start_date1,
            end_date: $scope.end_date,
            Street_1: $scope.Street_1,
            project_id: $scope.project1,
            organization_id: $cookieStore.get('orgID'),
            user_id: $cookieStore.get('userId'),
        };

    
  

        $scope.addNew = function (isValid) {
            $scope.showValid = true;
            if (isValid) {
                var date = moment($scope.params.start_date1, 'DD/MM/YYYY hh:mm A')._d
                 date = new Date(date).toISOString();
	     var Enddate = moment($scope.params.end_date, 'DD/MM/YYYY hh:mm A')._d
                 Enddate = new Date(Enddate).toISOString();
                $cookieStore.put('Name', $scope.params.name);
                $cookieStore.put('End_Date', Enddate );
                $cookieStore.put('Address', $scope.params.Street_1);
                $cookieStore.put('Start_Date', date);
                $cookieStore.put('project_id', $scope.project1);

                AuditCreate();
                $state.go('app.budget');
                $scope.showValid = false;

            }

        }

    });