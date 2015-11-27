/**
 * Created by dwellarkaruna on 03/11/15.
 */

angular.module('common')
    .controller('HomeController', ['$scope', '$cookieStore', '$location', function ($scope, $cookieStore, $location) {

        $scope.logout = function () {
            $cookieStore.remove('currentUser');
            $cookieStore.remove('authToken');
            $cookieStore.remove('userId');
            $cookieStore.remove('orgID');
            $location.url('/app/index.html#');

        };

    }]);