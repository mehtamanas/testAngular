/**
 * Created by dwellarkaruna on 20/10/15.
 */
angular.module('campaigns', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.campaignsEmail', {
                url: '/campaignsEmail',
                templateUrl: 'campaigns/emailCampaign/campaignsdetail.html',
                controller: 'campaignsDetailController',
                title: 'campaigns'
            })

            .state('app.campaignsEvent', {
                url: '/campaignsEvent',
                templateUrl: 'campaigns/campaignsEventDetail.html',
                controller: 'campaignsEventController',
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

        .state('app.summaryEvent',{
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

        .state('app.optionEmail', {
            url: '/optionEmail',
            templateUrl: 'campaigns/emailCampaign/optionEmail.tpl.html',
            controller: 'EmailTagController',
            data: { pageTitle: 'Tag Page' }

        })

         .state('app.addTemplate', {
                    url: '/addTemplate',
                    templateUrl: 'campaigns/emailCampaign/emailAddTemplate.tpl.html',
                    controller: 'emailAddTemplate',
                    data: { pageTitle: 'Add Template' }

         })

         .state('app.directCampaignsMail', {
             url: '/directCampaignsMail',
             templateUrl: 'campaigns/directCampaignEmail/directEmailController.html',
             controller: 'directEmailCampaignController',
             title: 'campaigns'
         })

        .state('app.addDirectMailCampaign', {
            url: '/addDirectMailCampaign',
            templateUrl: 'campaigns/directCampaignEmail/addDirectMailCampaign.html',
            controller: 'addDirectEmailCampaignController',
            title: 'campaigns'
        })

         .state('app.budgetDirectMailCampaign', {
             url: '/budgetDirectMailCampaign',
             templateUrl: 'campaigns/directCampaignEmail/directEmailBudget.html',
             controller: 'budgetDirectEmailCampaignController',
             title: 'campaigns'
         })

         .state('app.contactDirectMailCampaign', {
             url: '/contactDirectMailCampaign',
             templateUrl: 'campaigns/directCampaignEmail/contactlist.html',
             controller: 'contactDirectEmailCampaignController',
             title: 'campaigns'
         })

         .state('app.directMailType', {
             url: '/directMailType',
             templateUrl: 'campaigns/directCampaignEmail/selectDirectMailType.html',
             controller: 'directMailTypeCtrl',
             title: 'campaigns'
         })

          .state('app.summaryMailType', {
              url: '/summaryMailType',
              templateUrl: 'campaigns/directCampaignEmail/summaryMailType.html',
              controller: 'summaryMailTypeCtrl',
              title: 'campaigns'
          })
    }]);