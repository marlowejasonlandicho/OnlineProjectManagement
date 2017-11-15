(function () {
    'use strict';
    angular.module('onlineProjectManagement')
            .factory('Status', ['$http', '$resource', 'serviceURL',
                function ($http, $resource, serviceURL) {
                    return $resource(
                            'api/status/:statusId',
                            {
                                statusId: '@statusid'
                            },
                            {
                                update: {
                                    method: 'PUT'
                                }
                            });
                }]);
})();