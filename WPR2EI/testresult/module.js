angular.module('testresult', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.testresult', {
                url: '/testresult',
                templateUrl: 'testresult/testresult.html',
                controller: 'testresultController',
                title: 'Test_Result'
            })


    }]);