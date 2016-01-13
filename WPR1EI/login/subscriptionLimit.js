angular.module('app.guest.login')

     .config(function config($stateProvider) {
         $stateProvider
             .state('subscriptionLimit', {
                 url: '/subscriptionLimit',
                 templateUrl: 'login/subscriptionLimit.html',
                 controller: 'subscriptionLimitController',
                 data: { pageTitle: 'Subscription Limit' }
             });
     })

.controller('subscriptionLimitController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $http, $rootScope) {


        $rootScope.title = 'Dwellar./SubscriptionLimit';
         
        GetUrl_Sub = "Subscription/GetBySubscription/dd3aaef9-33f1-4306-bf38-b8af7ff17578";
        GetUrl_Subscription = "Subscription/GetBySubscription/4e8ccaef-8063-4e5a-8f9d-a46a63ae3d44";
        GetUrl_Subscription_Teams = "Subscription/GetBySubscription/c60e8070-07d7-4322-a1a2-757f805867e6";
        GetUrl_Subscription_Indivisual = "Subscription/GetBySubscription/be8d1791-118c-4a64-8743-aa33efc66c78";

          
        //var subCreate = "";
        //subCreate = 'OrgSubscription/Create';
        //$scope.subscription = {
        //    Subscription_Name:"DW1",
        //    organization_id: "6f65a61f-716c-43aa-8af1-068ee19d51c3"
           
        //};

        //apiService.post(subCreate,$scope.subscription).then(function (response) {         
        //    alert("Subscription has been Created..!!");

        //},
        //      function (error) {
        //          alert('Hi');
        //          alert("Error" + error.state);
        //      });

//basic(BR1)
        apiService.get(GetUrl_Sub).then(function (response) {
            $scope.subscriptions2 = response.data;
            angular.forEach($scope.subscriptions2, function (value, key) {
                $cookieStore.put('Subscription2_Name', value.Subscription_Name);
                $cookieStore.put('Subscription2_Price', value.Price);
                //alert(value.Subscription_Name);
            });
        },
       function (error) {
           deferred.reject(error);
           alert("not working");
       });
 
        //DW1
         apiService.get(GetUrl_Subscription).then(function (response) {
             $scope.subscriptionList1 = response.data;
             angular.forEach($scope.subscriptionList1, function (value, key) {
                 $cookieStore.put('Subscription1_Name', value.Subscription_Name);
                 $cookieStore.put('Subscription1_Price', value.Price);                
             });
         },
          function (error) {
          deferred.reject(error);
          alert("not working");
          });

        //teams
         apiService.get(GetUrl_Subscription_Teams).then(function (response) {
             $scope.subscriptionList3 = response.data;
             angular.forEach($scope.subscriptionList3, function (value, key) {
                 $cookieStore.put('Subscription3_Name', value.Subscription_Name);
                 $cookieStore.put('Subscription3_Price', value.Price);
             });
         },
                  function (error) {
                      deferred.reject(error);
                      alert("not working");
                  });
       
        //Indivisual
         apiService.get(GetUrl_Subscription_Indivisual).then(function (response) {
             $scope.subscriptionList4 = response.data;
             angular.forEach($scope.subscriptionList4, function (value, key) {
                 $cookieStore.put('Subscription4_Name', value.Subscription_Name);
                 $cookieStore.put('Subscription4_Price', value.Price);
             });
         },
                function (error) {
                    deferred.reject(error);
                    alert("not working");
                });


        //for DW1

          $scope.addPersonalInfo1 = function () {
          $scope.showValid = true;
         // alert("qqq" + $cookieStore.get('Subscription1_Name'));
          $cookieStore.put('Sub_Name', $cookieStore.get('Subscription1_Name'));
          $cookieStore.put('Sub_Price', $cookieStore.get('Subscription1_Price'));
          //$state.go("signup_free_account");
          };

          $scope.addPersonalInfo2 = function () {
              $scope.showValid = true;
            // alert($cookieStore.get('Subscription2_Name'));
             $cookieStore.put('Sub_Name', $cookieStore.get('Subscription2_Name'));
             $cookieStore.put('Sub_Price', $cookieStore.get('Subscription2_Price'));
             // $state.go("signup_free_account");
          };

        //for teams

          $scope.addPersonalInfo3 = function () {
              $scope.showValid = true;
              // alert("qqq" + $cookieStore.get('Subscription1_Name'));
              $cookieStore.put('Sub_Name', $cookieStore.get('Subscription3_Name'));
              $cookieStore.put('Sub_Price', $cookieStore.get('Subscription3_Price'));
             // $state.go("signup_free_account");
          };

          $scope.addPersonalInfo4 = function () {
              $scope.showValid = true;
              // alert("qqq" + $cookieStore.get('Subscription1_Name'));
              $cookieStore.put('Sub_Name', $cookieStore.get('Subscription4_Name'));
              $cookieStore.put('Sub_Price', $cookieStore.get('Subscription4_Price'));
             // $state.go("signup_free_account");
          };


          projectUrl = "Subscription/GetFeatureMatrix";

        // alert(param.name);
          apiService.get(projectUrl).then(function (response) {
              $scope.subscriptions= response.data;
             
          },
     function (error) {
         console.log("Error " + error.state);


     }
     );

});

