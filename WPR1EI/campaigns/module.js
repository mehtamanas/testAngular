/**
 * Created by dwellarkaruna on 20/10/15.
 */
angular.module('campaigns', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.campaigns', {
                url: '/campaigns',
                templateUrl: 'campaigns/campaignsdetail.html',
                controller: 'campaignsDetailController',
                title: 'campaigns'
            })
            .state('app.addNewCampaign', {
                url: '/addNewCampaign',
                templateUrl: 'campaigns/addNewCampaign.tpl.html',
                controller: 'AddNewcampaign',
                data: { pageTitle: 'Campaigns Page' }
            })

        .state('app.budget', {
            url: '/budget',
            templateUrl: 'campaigns/budget.html',
            controller: 'BudgetController',
            data: { pageTitle: 'Budget Page' }
        })

        .state('app.summaryEvent', {
            url: '/summaryEvent',
            templateUrl: 'campaigns/summaryEvent.html',
            controller: 'summaryEventController',
            data: { pageTitle: 'summary Page' }

        })

        .state('app.addEmailCampaign', {
            url: '/addEmailCampaign',
            templateUrl: 'campaigns/emailCampaign/addEmailCampaign.html',
            controller: 'addEmailCampaign',
            data: { pageTitle: 'Email Campaigns Page' }
        })

        .state('app.budgetEmail', {
            url: '/budgetEmail',
            templateUrl: 'campaigns/emailCampaign/budgetEmail.html',
            controller: 'budgetEmailController',
            data: { pageTitle: 'Budget Page' }
        })
         .state('app.summaryEmail', {
             url: '/summaryEmail',
             templateUrl: 'campaigns/emailCampaign/summaryEmail.html',
             controller: 'summaryEmailController',
             data: { pageTitle: 'summary Page' }

         })
        .state('app.option', {
            url: '/option',
            templateUrl: 'campaigns/emailCampaign/option.tpl.html',
            controller: 'EmailTagController',
            data: { pageTitle: 'Tag Page' }

        })

                .state('app.addTemplate', {
                    url: '/addTemplate',
                    templateUrl: 'campaigns/emailCampaign/emailAddTemplate.tpl.html',
                    controller: 'emailAddTemplate',
                    data: { pageTitle: 'Add Template' }

                })

    }]);