/**
 * Created by dwellarkaruna on 20/10/15.
 */
angular.module('property', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.property', {
                url: '/property',
                templateUrl: 'property/property.html',
                controller: 'PropertyListingController',
                title: 'Properties'
            })
            .state('app.propertydetail', {
                url: '/property/details',
                templateUrl: 'property/detail/propertyDetail.html',
                controller: 'PropertyDetailController',
                title: 'Properties Details'
            })
         .state('app.brokerproperty', {
             url: '/property/broker',
             templateUrl: 'property/broker/add_broker_property.html',
             controller: 'brokerPropertyController',
             title: 'broker Properties'
         })

           .state('app.brokerpropertylist', {
               url: '/property/broker',
               templateUrl: 'property/broker/broker_property_list.html',
               controller: 'brokerPropertyListController',
               title: 'broker list'
           })
    }]);