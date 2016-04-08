/**
 * Created by dwellarkaruna on 20/10/15.
 */
angular.module('contacts', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.contacts', {
                url: '/contacts',
                templateUrl: 'contacts/contacts.html',
                controller: 'ContactListController',
                title: 'Contacts'
            })
            .state('app.leads', {
                url: '/leads',
                templateUrl: 'contacts/leads.html',
                controller: 'LeadListController',
                title: 'Leads'
            })
            .state('app.client', {
                url: '/client',
                templateUrl: 'contacts/client.html',
                controller: 'ClientListController',
                title: 'Clients'
            })
          

           .state('app.contactdetail', {
               url: '/contactsdetails?id',
               templateUrl: 'contacts/detail/contactDetail.html',
               controller: 'ContactDetailControllerdm',
               title: 'Contact Details'
           })

              .state('app.contactEmail', {
                  url: '/contactEmail?id',
                  templateUrl: 'contacts/activityEmail.html',
                  controller: 'activityEmailCtrl',
                  title: 'Contact Details'
              })


           .state('app.company', {
                   url: '/companyList',
                   templateUrl: 'contacts/company/companyList.html',
                   controller: 'CompanyListController',
                   title: 'Company'
               })

         .state('app.companyDetail', {
                 url: '/companyDetail',
                 templateUrl: 'contacts/company/companyDetail.html',
                 controller: 'companyDetailController',
                 title: 'companyDetail'
             })

		 .state('app.addList', {
		     url: '/addList',
		     templateUrl: 'contacts/list/addList.html',
		     controller: 'addListCtrl',
		     title: 'Add List'
		 })

         .state('app.list', {
             url: '/list',
             templateUrl: 'contacts/list/list.html',
             controller: 'listCtrl',
             data: { pageTitle: 'List' }
         })

         .state('app.listSummary', {
             url: '/listSummary',
             templateUrl: 'contacts/list/listSummary.html',
             controller: 'listSummaryCtrl',
             data: { pageTitle: 'list Summary' }
         })
           .state('app.tagList', {
               url: '/tagList',
               templateUrl: 'contacts/list/tagList.html',
               controller: 'tagListCtrl',
               data: { pageTitle: 'Tag List' }
           })

          .state('app.tagpeople', {
                url: '/tagpeople?id',
                templateUrl: 'contacts/tag_people.html',
                controller: 'tagpeopleController',
                title: 'Tag_People Details'
          })

        .state('app.documentAgreement', {
            url: '/documentAgreement',
            templateUrl: 'contacts/generateAgreement/documentAgreement.html',
            controller: 'documentAgreementCtrl',
            title: 'Document Agreement Details'
        })

         .state('app.agent', {
             url: '/agent',
             templateUrl: 'contacts/agent/agent.html',
             controller: 'agentCtrl',
             title: 'agent'
         })
        .state('app.peoperty_quote', {
            url: '/peopertyQuotes',
            templateUrl: 'contacts/propertyQuote/propertyQuote.html',
            controller: 'peopertyQuote',
            data: { pageTitle: 'peopertyQuote' }
        })


        .state('app.property_CustomizQuote', {
            url: '/peopertyCustomizQuotes',
            templateUrl: 'contacts/propertyQuote/propertyCustomizQuote.html',
            controller: 'propertyCustomizQuote',
            data: { pageTitle: 'peopertyQuote' }
        })

        .state('app.property_CustomizDue', {
            url: '/peopertyCustomizDue',
            templateUrl: 'contacts/propertyQuote/property_CustomizDue.html',
            controller: 'propertyCustomizDue',
            data: { pageTitle: 'peopertyQuote' }
        });


    }]);
