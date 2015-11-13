angular.module('starter.controllers', [])

        .controller('EmployeeListCtrl', function ($scope, EmployeeService, UserAuthService, ionPlatform, $cordovaPush) {
                    //alert('Anirban');

            // call to register automatically upon device ready
            ionPlatform.ready.then(function (device) {
                $scope.register();
            });


            // Register
            $scope.register = function () {
                var config = null;

                if (ionic.Platform.isAndroid()) {
                    config = {
                        "senderID": "YOUR_GCM_PROJECT_ID" // REPLACE THIS WITH YOURS FROM GCM CONSOLE - also in the project URL like: https://console.developers.google.com/project/434205989073
                    };
                }
                else if (ionic.Platform.isIOS()) {
                    config = {
                        "badge": "true",
                        "sound": "true",
                        "alert": "true"
                    }
                }

                $cordovaPush.register(config).then(function (result) {
                    console.log("Register success " + result);

                    //$cordovaToast.showShortCenter('Registered for push notifications');
                    $scope.registerDisabled = true;
                    // ** NOTE: Android regid result comes back in the pushNotificationReceived, only iOS returned here
                    if (ionic.Platform.isIOS()) {
                        $scope.regId = result;
                        EmployeeService.registerWithMCSNotifications(result).success(function (data) {
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
