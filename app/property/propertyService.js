/**
 * Created by dwellarkaruna on 20/10/15.
 */

'use strict';

angular.module('property').service('propertyService', ['$http', 'appConstants'
    , function ($http, appConstants) {

        // get property details
        //e9c1a61c-a819-46f5-be24-6523d7944fab
        this.getPropertyDetail = function (propertyId) {
            return $http.get(appConstants.APIBaseURL + 'PropertyListing/GetbyPropertyID/' + propertyId);
        };

        this.getPropertyAddress = function (propertyId) {
            return $http.get(appConstants.APIBaseURL + 'PropertyListing/GetbyPropertyAddress/' + propertyId);
        };

        this.getPropertyImages = function (propertyId) {
            return $http.get(appConstants.APIBaseURL + 'MediaElement/GetMediaUrlByProperty/' + propertyId + '/Images');
        };
        this.getProperty2DImages = function (propertyId) {
            return $http.get(appConstants.APIBaseURL + 'MediaElement/GetMediaUrlByProperty/' + propertyId + '/2D_Floor_Plan');
        };
        this.getProperty3DImages = function (propertyId) {
            return $http.get(appConstants.APIBaseURL + 'MediaElement/GetMediaUrlByProperty/' + propertyId + '/3D_Floor_Plan');
        };

        //this.getPropertyImages = function (propertyId) {
        //    return $http.get(appConstants.APIBaseURL + 'MediaElement/GetMediaUrlByProperty/' + propertyId + '/Images');
        //};

        this.getLeads = function (propertyId) {
            return $http.get(appConstants.APIBaseURL + 'Contact/GetContactByProperty/' + propertyId);
        };

        this.getPropertyVideos = function (propertyId) {
            return $http.get(appConstants.APIBaseURL + 'MediaElement/GetMediaUrlByProperty/' + propertyId + '/Videos');
        };
        this.AuditCreate = function (param) {
            
            $http.post(appConstants.APIBaseURL + "AuditLog/Create", param).then(function (response) {
                     var loginSession = response.data;
                   
                 },
            function (error) {

            });
        };
    }]);

