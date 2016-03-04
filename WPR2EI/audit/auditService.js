/**
 * Created by dwellarkaruna on 27/10/15.
 */
angular.module('audit')
    .service('audit', ['$http',
        function ($http) {

            this.get = function(url){
              return $http.get(url);
            };

            this.getEngagements = function(){
                return $http.get('');
            };
        }]);