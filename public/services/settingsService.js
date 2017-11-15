(function () {
    'use strict';
    angular.module('onlineProjectManagement')
            .factory('Settings', ['$http', '$resource', 'serviceURL',
                function ($http, $resource, serviceURL) {
                    return $resource(
                            'api/settings/:settingsId',
                            {
                                settingsId: '@settingsid'
                            },
                            {
                                update: {
                                    method: 'PUT'
                                }
                            });
                }])
            .service('SettingsInquiry', ['$http', '$resource', 'serviceURL',
                function ($http, $resource, serviceURL) {
                    this.listPerCategory = function (category) {
                        return $http.get('/api/settings?category=' + category);
                    };
                    this.listADUsers = function () {
                        return $http.get('/api/listUsersFromAD');
                    };
                    this.listADDepartments = function () {
                        return $http.get('/api/listDepartmentsFromAD');
                    };
                    this.updateSetting = function (setting) {
                        return $http.put('/api/updatesettings', setting);
                    };
                }]);
})();