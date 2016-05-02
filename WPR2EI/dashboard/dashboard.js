angular.module('dashboard')
.controller('DashboardController',
    function ($scope, $state, security, $cookieStore, $rootScope) {

        console.log('DashboardController');
        $("#sales-projects").kendoGrid({
            dataSource: {
                type: "table",
                pageSize: 5
            },
            groupable: false,
            sortable: true,
            pageable: {
                refresh: true,
                pageSizes: true,
                buttonCount: 5
            },
            columns: [{
                field: "project",
                title: "Project",
                width: 176
            }, {
                field: "units_sold",
                title: "Units Sold",
                width: 85
            }, {
                field: "potal_revenue",
                title: "Total Revenue",
                width: 85
            }, {
                field: "most_popular",
                title: "Most Popular",
                width: 85
            }]
        });
        var opts = {
            lines: 12, // The number of lines to draw
            angle: 0, // The length of each line
            lineWidth: 0.32, // The line thickness
            pointer: {
                length: 0.76, // The radius of the inner circle
                strokeWidth: 0.03, // The rotation offset
                color: '#000000' // Fill color
            },
            limitMax: 'false',   // If true, the pointer will not go past the end of the gauge
            colorStart: '#23AE89',   // Colors
            colorStop: '#23AE89',    // just experiment with them
            strokeColor: '#FFB61C',   // to see which ones work best for you
            generateGradient: true
        };

        var guage_setVal = 564;
        var guage_maxVal = 800;
        var target = document.getElementById('monthly_goals'); // your canvas element
        var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
        gauge.maxValue = guage_maxVal; // set max gauge value
        gauge.animationSpeed = 61; // set animation speed (32 is default value)
        gauge.set(guage_setVal); // set actual value

        $('#guage-val1').html(guage_maxVal);
        $('#guage-val2').html(guage_setVal);

        $('#salesByRegion').vectorMap({
            map: 'in_mill',
            backgroundColor: 'transparent',
            regionStyle: {
                initial: {
                    fill: '#8d8d8d'
                }
            }
        });


        $('.leads-list').mCustomScrollbar({
            theme: "minimal-dark",
            scrollInertia: 200,
            setHeight: 264,
            advanced: { autoExpandHorizontalScroll: true }
        });

        $('#content #main-content').mCustomScrollbar({
            theme: "minimal-dark",
            scrollInertia: 200,
            advanced: { autoExpandHorizontalScroll: true }
        });

        $('#content #sidebar').mCustomScrollbar({
            theme: "minimal-dark",
            scrollbarPosition: "outside",
            scrollInertia: 200,
            advanced: { autoExpandHorizontalScroll: true }
        });


       

    }
);

