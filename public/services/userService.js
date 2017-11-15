(function () {
    'use strict';
    angular.module('onlineProjectManagement')
            .factory('User', function ($resource) {
                return $resource('/api/users/:userId',
                        {
                            userId: '@userid'
                        },
                        {
                            update: {
                                method: 'PUT'
                            }
                        });
            });
})();