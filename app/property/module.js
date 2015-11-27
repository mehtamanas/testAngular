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
    }]);