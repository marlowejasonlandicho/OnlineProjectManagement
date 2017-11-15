(function () {
    'use strict';
    angular.module('onlineProjectManagement')
            .service('CompletedTask', ['$http', '$resource', 'serviceURL',
                function ($http, $resource, serviceURL) {
                    this.getCompletedTasks = function () {
                        return $http.get('/api/completedtasks');
                    };
                    this.exportToExcel = function (completedTasks) {
                        return $http.post('/api/exportcompletedtasks',
                                completedTasks);
                    };
                }]);
})();