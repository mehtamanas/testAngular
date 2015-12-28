angular.module('newuser')//to chnage

      .config(function config($stateProvider) {
          $stateProvider
              .state('review', {
                  url: '/review',
                  templateUrl: 'newuser/review.html',
                  controller: 'ReviewController',
                  data: { pageTitle: 'Review Page' }
              });
      })


.controller('ReviewController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope) {
        console.log('ReviewController');
        $rootScope.title = 'Dwellar./newuser';


        var loginSession1;
        var orgID = $cookieStore.get('orgID');
        $scope.delete1 = function (id) {
            apiService.remove('team/Delete/' + id).then(function (response) {
                $scope.loginSession2 = response.data;
                //alert('Login Session : ' + loginSession.user_id);
                $state.go('loggedIn.modules.team');

            },
                  function (error) {
                      alert('Hi1');
                      // deferred.reject(error);
                      return deferred.promise;
                  });

        };

        var j = 0;
        $scope.editnew = function (id) {
            $cookieStore.put('teamid', id);
            apiService.get('team/Get?orgid=' + orgID).then(function (response) {
                $scope.loginSession2 = response.data;
                //alert('Login Session : ' + loginSession.user_id);
                $state.go('loggedIn.modules.team.add_new');

            },
             function (error) {
                 alert('Hi5');
                 // deferred.reject(error);
                 return deferred.promise;
             });
        };
        apiService.get('team/Get?orgid=' + orgID).then(function (response) {
            $scope.loginSession1 = response.data;
            //alert('Login Session : ' + loginSession.user_id);
        },




    function (error) {
        // alert('Hi3');
        // deferred.reject(error);
        return deferred.promise;
    });

        $scope.goAddNew = function () {
            $cookieStore.put('teamid', '');
            $state.go('loggedIn.modules.team.add_new');
        };
        $scope.goEdit = function () {
            $state.go('loggedIn.modules.team.update');
        };


        //Audit log start
        $scope.params = {

            device_os: "windows10",
            device_type: "mobile",
            device_mac_id: "34:#$::43:434:34:45",
            module_id: "team",
            action_id: "team View",
            details: "team detail",
            application: "angular",
            browser: $cookieStore.get('browser'),
            ip_address: $cookieStore.get('IP_Address'),
            location: $cookieStore.get('Location'),
            organization_id: $cookieStore.get('orgID'),
            User_ID: $cookieStore.get('userId')
        };


        AuditCreate = function (param) {

            apiService.post("AuditLog/Create", param).then(function (response) {
                var loginSession = response.data;

            },
       function (error) {

       });
        };
        AuditCreate($scope.params);

        //end

        // Kendo code
        $scope.mainGridOptions = {
            dataSource: {
                type: "json",
                transport: {
                    read: "https://dw-webservices-dev2.azurewebsites.net/Team/GetTeamDetails/" + orgID
                },
                pageSize: 5

                //group: {
                //    field: 'sport'
                //}
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
                               //template: "<img height='40px' width='40px' src='assets/images/image-2.jpg' />" +
                               //"<span style='padding-left:10px' class='customer-name'>#: first_name #</span>",
                               field: "Name",
                               title: " Name",
                               width: "120px",
                               attributes: {
                                   "class": "UseHand",

                               }
                           }, {
                               field: "User_Count",
                               title: "Users",
                               width: "120px",
                               attributes: {
                                   "class": "UseHand",

                               }

                           }, {
                               field: "Project_Count",
                               title: "Projects",
                               width: "120px",
                               attributes: {
                                   "class": "UseHand",

                               }

                           }, {
                               field: "Property_Count",
                               title: "Property Listings",
                               width: "120px",
                               attributes: {
                                   "class": "UseHand",

                               }

                           }, {
                               field: "People_Count",
                               title: "People",
                               width: "120px",
                               attributes: {
                                   "class": "UseHand",

                               }

                           }, {
                               field: "Task_Count",
                               title: "Tasks",
                               width: "120px",
                               attributes: {
                                   "class": "UseHand",

                               }

                           }]
        };



        $scope.summaryfun = function () {

            $state.go('summary');


        };
  

    }
);

