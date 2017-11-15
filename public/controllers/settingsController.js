(function () {
    'use strict';
    angular.module('onlineProjectManagement')
            .controller('SettingsController',
                    ['$scope', '$rootScope', '$uibModal', 'SettingsInquiry',
                        function ($scope, $rootScope, $uibModal, SettingsInquiry) {
                            $scope.categories = {};
                            $scope.dayOfWeeks = [
                                {
                                    value: 0,
                                    name: 'Sunday'
                                },
                                {
                                    value: 1,
                                    name: 'Monday'
                                }, {
                                    value: 2,
                                    name: 'Tuesday'
                                }, {
                                    value: 3,
                                    name: 'Wednesday'
                                }, {
                                    value: 4,
                                    name: 'Thursday'
                                }, {
                                    value: 5,
                                    name: 'Friday'
                                }, {
                                    value: 6,
                                    name: 'Saturday'
                                }
                            ];

                            SettingsInquiry.listPerCategory('EMAIL').then(function (categoryList) {
                                $scope.categoryList = categoryList.data;
                                angular.forEach(categoryList.data, function (category, key) {
                                    if (category.name === 'email.host') {
                                        $scope.smtpHost = category.value;
                                        $scope.categories['smtpHost'] = category;
                                    } else if (category.name === 'email.user') {
                                        $scope.smtpUsername = category.value;
                                        $scope.categories['smtpUsername'] = category;
                                    } else if (category.name === 'email.password') {
                                        $scope.smtpUserPw = category.value;
                                        $scope.categories['smtpUserPw'] = category;
                                    } else if (category.name === 'email.from') {
                                        $scope.fromEmail = category.value;
                                        $scope.categories['fromEmail'] = category;
                                    } else if (category.name === 'email.subject') {
                                        $scope.emailSubject = category.value;
                                        $scope.categories['emailSubject'] = category;
                                    } else if (category.name === 'email.body') {
                                        $scope.emailMessage = category.value;
                                        $scope.categories['emailMessage'] = category;
                                    } else if (category.name === 'email.schedule') {
                                        var scheduleVal = category.value.split(' ');
                                        $scope.dayOfTheWeek = scheduleVal[4];
                                        $scope.timeOfDay = new Date(1970, 0, 1, scheduleVal[1], scheduleVal[0], '00');
                                        $scope.categories['schedule'] = category;
                                    } else if (category.name === 'app.url') {
                                        $scope.appURL = category.value;
                                        $scope.categories['appURL'] = category;
                                    }

                                });
                            });
                            //  11 0 * * 6
                            $scope.saveEmailSettings = function () {

                                var smtpHost = $scope.categories['smtpHost'];
                                var smtpUsername = $scope.categories['smtpUsername'];
                                var smtpUserPw = $scope.categories['smtpUserPw'];
                                var fromEmail = $scope.categories['fromEmail'];
                                var emailSubject = $scope.categories['emailSubject'];
                                var emailMessage = $scope.categories['emailMessage'];
                                var appURL = $scope.categories['appURL'];
                                smtpHost.value = $scope.smtpHost;
                                smtpUsername.value = $scope.smtpUsername;
                                smtpUserPw.value = $scope.smtpUserPw;
                                fromEmail.value = $scope.fromEmail;
                                emailSubject.value = $scope.emailSubject;
                                emailMessage.value = $scope.emailMessage;
                                appURL.value = $scope.appURL;
                                SettingsInquiry.updateSetting(smtpHost).then(function (smtpHostresponse) {
                                    SettingsInquiry.updateSetting(smtpUsername).then(function (smtpUsernameresponse) {
                                        SettingsInquiry.updateSetting(smtpUserPw).then(function (smtpUserPwesponse) {
                                            SettingsInquiry.updateSetting(fromEmail).then(function (fromEmailresponse) {
                                                SettingsInquiry.updateSetting(emailSubject).then(function (emailSubjectresponse) {
                                                    SettingsInquiry.updateSetting(emailMessage).then(function (emailMessageresponse) {
                                                        SettingsInquiry.updateSetting(appURL).then(function (appURLresponse) {
                                                            gantt.message('Successfully saved Setting!');
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            };

                            //  11 0 * * 6
                            $scope.saveScheduleSettings = function () {
                                var emailSchedule = $scope.categories['schedule'];
                                emailSchedule.value =
                                        $scope.timeOfDay.getMinutes() +
                                        ' ' +
                                        $scope.timeOfDay.getHours() +
                                        ' * * ' +
                                        $scope.dayOfTheWeek;
                                SettingsInquiry.updateSetting(emailSchedule).then(function (response) {
                                    gantt.message('Successfully saved Setting!');
                                });
                            };
                        }]);
})();