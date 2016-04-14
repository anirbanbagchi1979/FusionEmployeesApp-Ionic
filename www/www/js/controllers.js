angular.module('starter.controllers', [])

        .controller('EmployeeListCtrl', function ($scope, EmployeeService, UserAuthService, ionPlatform, $cordovaPush) {
            //alert('Anirban');

            // call to register automatically upon device ready
            ionPlatform.ready.then(function (device) {
                $scope.register();
            });


            // Register
            $scope.register = function () {
                var config = {
                    "badge": "true",
                    "sound": "true",
                    "alert": "true"
                }


                $cordovaPush.register(config).then(function (result) {
                    console.log("Register success " + result);

                    //$cordovaToast.showShortCenter('Registered for push notifications');
                    $scope.registerDisabled = true;
                    // ** NOTE: Android regid result comes back in the pushNotificationReceived, only iOS returned here
                    if (ionic.Platform.isIOS()) {
                        $scope.regId = result;
                        EmployeeService.registerWithMCSNotifications(result).success(function (data) {

                            console.log("Anirban Response" + data.data);
                            console.log("Anirban Response JSON" + JSON.stringify(data));
                            $scope.mcsRegistryMessage = data;
                        });

                        //Add MCS code to
                        //storeDeviceToken("ios");
                        //alert(result)
                    }
                }, function (err) {
                    console.log("Register error " + err)
                });
            }
            $scope.$on('$cordovaPush:notificationReceived', function (event, notification) {
                console.log(JSON.stringify([notification]));

                $cordovaPush.setBadgeNumber(notification.badge).then(function (result) {
                    // Success!
                }, function (err) {
                    // An error occurred. Show a message to the user
                });
                $scope.$apply(function () {
                    $scope.notifications.push(JSON.stringify(notification.alert));
                })

            });

            // IOS Notification Received Handler
            function handleIOS(notification) {
                // The app was already open but we'll still show the alert and sound the tone received this way. If you didn't check
                // for foreground here it would make a sound twice, once when received in background and upon opening it from clicking
                // the notification when this code runs (weird).
                if (notification.foreground == "1") {
                    // Play custom audio if a sound specified.
                    if (notification.sound) {
                        var mediaSrc = $cordovaMedia.newMedia(notification.sound);
                        mediaSrc.promise.then($cordovaMedia.play(mediaSrc.media));
                    }

                    if (notification.body && notification.messageFrom) {
                        $cordovaDialogs.alert(notification.body, notification.messageFrom);
                    }
                    else
                        $cordovaDialogs.alert(notification.alert, "Push Notification Received");

                    if (notification.badge) {
                        $cordovaPush.setBadgeNumber(notification.badge).then(function (result) {
                            console.log("Set badge success " + result)
                        }, function (err) {
                            console.log("Set badge error " + err)
                        });
                    }
                }
                // Otherwise it was received in the background and reopened from the push notification. Badge is automatically cleared
                // in this case. You probably wouldn't be displaying anything at this point, this is here to show that you can process
                // the data in this situation.
                else {
                    if (notification.body && notification.messageFrom) {
                        $cordovaDialogs.alert(notification.body, "(RECEIVED WHEN APP IN BACKGROUND) " + notification.messageFrom);
                    }
                    else
                        $cordovaDialogs.alert(notification.alert, "(RECEIVED WHEN APP IN BACKGROUND) Push Notification Received");
                }
            }

            $scope.searchKey = "";

            $scope.clearSearch = function () {
                $scope.searchKey = "";
                $scope.employees = EmployeeService.getEmployees();
            }

            $scope.search = function () {
                EmployeeService.getEmployeesByFirstName($scope.searchKey).success(function (data) {
                    $scope.employees = data.Employees;
                });

            }

            EmployeeService.getEmployees().success(function (data) {

                $scope.employees = data.Employees;
                //$scope.trainSteps = $scope.createTrainStops($scope.shopjobs);
            });
            $scope.userProfile = UserAuthService.getLoggedInUserProfile();
        })

        .controller('EmployeeDetailCtrl', function ($scope, $stateParams, EmployeeService, UserAuthService, $ionicModal) {
            //console.log('details');
            EmployeeService.getEmployeeDetailByID($stateParams.PersonId).success(function (data) {
                $scope.employee = data;
            });
            EmployeeService.getExpenseDetailsByExpenseID('300000115338121').success(function (data) {

                var graph_labels = new Array();
                var graph_data = new Array();
                for (var i = 0; i < data.Lines.length; i++) {
                    graph_labels.push(data.Lines[i].ExpenseTypeName);
                    graph_data.push(data.Lines[i].Amount);
                }
                //alert(graph_labels)
                //alert(graph_data)
                $scope.graph_labels = graph_labels;
                $scope.graph_data = graph_data;

            });
            EmployeeService.getExpenseImagesByExpenseID('W14154').success(function (data) {

                $scope.imageFiles = data;

            });
            $scope.userProfile = UserAuthService.getLoggedInUserProfile();
            /*
             $ionicModal.fromTemplateUrl('templates/expensesImagesModal.html', {
             scope: $scope
             }).then(function (modal) {
             $scope.modal = modal;
             }); 
             */

            $ionicModal.fromTemplateUrl('templates/expensesImagesModal.html', function ($ionicModal) {
                $scope.modal = $ionicModal;
            }, {
                // Use our scope for the scope of the modal to keep it simple
                scope: $scope,
                // The animation we want to use for the modal entrance
                animation: 'slide-in-up'
            });

            $scope.openModal = function (imageFile) {
                $scope.image = imageFile;
                $scope.modal.show();
            }

        })

        .controller('LoginController', function ($scope, $ionicModal, $timeout,
                $ionicPopover, $ionicHistory, UserAuthService) {
            // Form data for the login modal
            $scope.loginData = {};

            // Create the login modal that we will use later
            $ionicModal.fromTemplateUrl('templates/login.html', {
                scope: $scope,
                animation: 'slide-in'

            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.message = '';

            $scope.user = {
                username: null,
                password: null
            };

            $scope.login = function () {
                UserAuthService.login($scope.user.username, $scope.user.password);
            };

            $scope.logout = function () {
                UserAuthService.logout();

            };

            // Triggered in the login modal to close it
            $scope.closeLogin = function () {
                $scope.modal.hide();
            };

            $scope.$on('event:auth-loginRequired', function (e, rejection) {
                $scope.modal.show();
            });

            $scope.$on('event:auth-loginConfirmed', function () {
                $scope.username = null;
                $scope.password = null;
                $scope.modal.hide();

            });

            $scope.$on('event:auth-login-failed', function (e, status) {
                //console.log(status);
                var error = "Login failed.";
                console.log(status);
                if (status == 401) {
                    error = "Invalid Credentials ";
                }

                if (status == 403) {
                    error = "Access Denied";
                }

                $scope.message = error;

            });

        })


        .factory('localstorage', ['$window', function ($window) {
                return {
                    set: function (key, value) {
                        $window.localStorage[key] = value;
                    },
                    get: function (key, defaultValue) {
                        return $window.localStorage[key] || defaultValue;
                    },
                    setObject: function (key, value) {
                        $window.localStorage[key] = JSON.stringify(value);
                    },
                    getObject: function (key) {
                        return JSON.parse($window.localStorage[key] || '{}');
                    },
                    remove: function (key) {
                        $window.localStorage.removeItem(key);
                    }
                };
            }])
        ;
