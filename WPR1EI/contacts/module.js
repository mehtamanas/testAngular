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
            .state('app.contactdetail', {
                url: '/contactsdetails',
                templateUrl: 'contacts/detail/contactDetail.html',
                controller: 'ContactDetailControllerdm',
                title: 'Contact Details'
            })
    }]);