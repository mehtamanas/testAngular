angular.module('report')
.controller('reportController',
    function ($scope, $state, security, $cookieStore, apiService, $modal, $rootScope) {
        $scope.duration="3";
        userId=$cookieStore.get('userId');
        $scope.startDate = moment(moment().subtract(3, 'months').calendar()).format('MM/DD/YYYY');
        $scope.endDate = moment().format('MM/DD/YYYY');
        $scope.YTD = moment(moment().startOf('year').calendar()).format("MMM D YYYY");
      
        
        //$(document).ready(function () {
        //    $('#select-dates2').searchableOptionList();
        //});

       
        var callApi = function () {
            //calling api for year
            var url = "Reports/GetTaskReportYear?id=" + $cookieStore.get('userId') + "&type=year&startDate=" + $scope.startDate + "&endDate=" + $scope.endDate;
            apiService.get(url).then(function (response) {
                $scope.taskByYear = response.data[0];

            },
                function (error) {
                    if (error.status === 400)
                        alert(error.data.Message);
                    else
                        alert("Network issue");
                })

            //calling api for quarters
            var url = "Reports/GetTaskReportYear?id=" + $cookieStore.get('userId') + "&type=quarter&startDate=" + $scope.startDate + "&endDate=" + $scope.endDate;
            apiService.get(url).then(function (response) {
                $scope.taskByQuarter = response.data[0];

            },
                function (error) {
                    if (error.status === 400)
                        alert(error.data.Message);
                    else
                        alert("Network issue");
                })
        }

        
        //change duration
        $scope.changeDuration = function () {
            if ($scope.duration == "3") {
                $scope.startDate = moment(moment().subtract(3, 'months').calendar()).format('MM/DD/YYYY');
                callApi();
            }
            else {
                $scope.startDate = moment(moment().subtract(6, 'months').calendar()).format('MM/DD/YYYY');
                callApi();
            }
        };


    });

