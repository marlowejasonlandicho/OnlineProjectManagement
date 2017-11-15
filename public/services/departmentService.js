(function () {
    'use strict';
    angular.module('onlineProjectManagement')
            .factory('Department', ['$http', '$resource', 'serviceURL',
                function ($http, $resource, serviceURL) {
                    return $resource(
                            'api/departments/:departmentId',
                            {
                                departmentId: '@departmentid'
                            },
                            {
                                update: {
                                    method: 'PUT'
                                }
                            });
                }]);
})();