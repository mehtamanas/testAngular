angular.module('campaign_statistics')
.controller('CampaignStatController',
    function ($scope, $state, security, $cookieStore, $rootScope, apiService,$window) {
        console.log('CampaignStatController');
        campaignId = window.sessionStorage.selectedCustomerID;
        $scope.summary = {};
        $scope.goal = {};
        $scope.result = {};



        var callApi = function () {
            var pieData = [];


            apiService.get("CampaignEvent/GetByIdCampaignEvent/" + campaignId + "/" + $cookieStore.get('orgID')).then(function (response) {
                console.log($cookieStore.get('orgID'));
                campaignData = response.data[0];
                $scope.summary = {
                    name: campaignData.name,
                    budget: campaignData.budget
                }
                $scope.goal = {
                    leads: campaignData.no_of_leads,
                    sales: campaignData.sales
                }
                $scope.result = {
                    conversion_rate: campaignData.conversion_rate,
                    leads: campaignData.no_of_leads,
                    sales: campaignData.sales
                }
            });


            apiService.get('CampaignEmailTemplate/GetGridStat/' + campaignId).then(function (response) {
                $scope.emailStats = response.data[0];
                angular.forEach($scope.emailStats, function (value, key) {
                    if (key === 'blocks' || key === 'opens' || key === 'clicks' || key === 'unsubscribes' || key === 'unique_clicks' || key === 'bounces' || key === 'spam_reports')
                        pieData.push({
                            category: key,
                            value:value
                        });
                });
              
                pieData = [{
                    category: "Opens",
                    value: 60,
                    color: "#29C2A4",
                    visibleInLegend:false,
                }, {
                    category: "Unopend",
                    value: 15,
                    color: "#DF983C",
                    visibleInLegend: false,
                }, {
                    category: "Clicks",
                    color: "#34A853",
                    value: 10,
                    visibleInLegend: false,
                }, {
                    category: "Unique Clicks",
                    color: "#4D5DCE",
                    value: 10,
                    visibleInLegend: false,
                }, {
                    category: "Unsubscribe",
                    color: "#775A56",
                    value: 10,
                    visibleInLegend: false,
                },

                {
                    category: "Bounced",
                    color: "#4FA3AE",
                    value: 10,
                    visibleInLegend: false,
                },

                 {
                     category: "Spam Report",
                     color: "#E3563A",
                     value: 10,
                     visibleInLegend: false,
                 }


                ];
                createChart(pieData);
            });  }

        callApi();


        //$scope.pieSeries = [{
        //    type: 'pie',
        //    data: [{
        //        category: "Football",
        //        value: 35
        //    }, {
        //        category: "Basketball",
        //        value: 25
        //    }, {
        //        category: "Volleyball",
        //        value: 20
        //    }, {
        //        category: "Rugby",
        //        value: 10
        //    }, {
        //        category: "Tennis",
        //        value: 10
        //    }],
        //    field: 'value',
        //    categoryField: 'category',
        //    padding: 0,
        //    tooltip: {
        //        visible: true,
        //        template: "#= category # - #= kendo.format('{0:P}', percentage) #"
        //    },
        //    legend: {
        //        visible: true,
        //    },
            
        //}],

        var createChart = function (data) {
            //var totalEmail = $scope.emailStats.total_mails_sent;
            $("#chart").kendoChart({
                title: {
                    text: 10001+", total emails",
                    position: 'bottom',
                   
                },
                legend: {
                    position: "center",
                    padding: '1',
                    margin: '1',
                   
                    
                },
               
              
                series: [{
                    type: "pie",
                    data: data
                }],
                tooltip: {
                    visible: true,
                    template: "#= category # - #= kendo.format('{0:P}', percentage) #"
                }
            });
        }
        var chart = $("#chart").data("kendoChart");
        //to check the chart exist or not if exist then redraw it..
        if (chart) {
            chart.redraw();
        }

        //$scope.pieData = new kendo.data.DataSource({
        //    transport: {
        //        read: {
        //            url: 'http://demos.telerik.com/kendo-ui/content/dataviz/js/screen_resolution.json',
        //            dataType: "json"
        //        }
        //    },

        //});

        //$scope.pieTitle = { template: "<p>12112, Toltal Email Sent</p>", position: 'bottom' };
    }

);

