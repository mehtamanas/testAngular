angular.module('emailtransactions')
 .controller('emailTransactionController',
    function ($scope, $state, security, $cookieStore, apiService) {
        var orgID = $cookieStore.get('orgID');
        $scope.showDetail = function (index) {
            $scope.showEmailDetail = true;
            $scope.emailDetail = $scope.emailData[index];
        }

        var emailTransactionAPI = function () {
            apiService.getWithoutCaching('SendEmail/GetEmailTrans/'+$cookieStore.get('orgID')).then(function (res) {
                $scope.emailData = res.data;
            }, function (err) {
            })
        }
        emailTransactionAPI();
        //$(document).ready(function () {
        //    var newHeight = screen.height - 350;
        //    $('#emailContent').css({'height':newHeight });
           
        //});

    });
