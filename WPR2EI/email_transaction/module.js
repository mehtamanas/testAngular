angular.module('emailtransactions', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.emailtransactions', {
                url: '/emailtransactions',
                templateUrl: 'email_transaction/emailTransactions.html',
                controller: 'emailTransactionController',
                title: 'Email_Transactions'
            })


    }]);