/**
 * Created by dwellarkaruna on 20/10/15.
 */
angular.module('setting', [])

    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('app.setting', {
                url: '/setting',
                templateUrl: 'setting/setting.tpl.html',
                controller: 'settingController',
                title: 'setting'
            })
       
      
    }]);