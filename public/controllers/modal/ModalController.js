(function () {
    'use strict';
    angular.module('onlineProjectManagement')
            .controller('ModalController',
                    ['$scope', '$uibModal', '$log', '$document',
                        function ($scope, $uibModal, $log, $document) {
                            var $ctrl = this;
                            $ctrl.animationsEnabled = true;
                            $ctrl.open = function (size, parentSelector) {
                                var parentElem = parentSelector ?
                                        angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
                                var modalInstance = $uibModal.open({
                                    animation: $ctrl.animationsEnabled,
                                    ariaLabelledBy: 'modal-title',
                                    ariaDescribedBy: 'modal-body',
                                    templateUrl: '../../views/opmModalContent.html',
                                    controller: 'ModalInstanceCtrl',
                                    controllerAs: '$ctrl',
                                    size: size,
                                    appendTo: parentElem,
                                    resolve: {
                                        items: function () {
                                            return $ctrl.items;
                                        }
                                    }
                                });

                                modalInstance.result.then(function (selectedItem) {
                                    $ctrl.selected = selectedItem;
                                }, function () {
                                    $log.info('Modal dismissed at: ' + new Date());
                                });
                            };
                        }]);
})();