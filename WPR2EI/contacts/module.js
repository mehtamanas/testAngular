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
            url: '/contactsdetails',
            templateUrl: 'contacts/detail/contactDetail.html',
            controller: 'ContactDetailControllerdm',
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
		 .state('app.lists', {
           	  url: '/lists',
           	  templateUrl: 'contacts/listController.html',
            	  controller: 'ListController',
            	  title: 'List'
         })
  }]);
