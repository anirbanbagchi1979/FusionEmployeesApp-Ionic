angular.module('starter.services', [])
        .factory('EmployeeService', function ($q, localstorage, UserAuthService, HostMcsUrl,
                MCSBackendID, $http) {
            return {
                getEmployees: function () {
                    // /alert("In get Expense report ")
                    var getUrl = HostMcsUrl + '/mobile/custom/getemployeesHCM/employees/';
                    var req = {
                        method: 'GET',
                        url: getUrl,
                        /* we should look automate this process here as well */
                        headers: {
                            'Content-Type': 'application/json',
                            'Oracle-Mobile-Backend-Id': MCSBackendID,
                            'Authorization': localStorage.getItem('authToken')
                        }
                        // data: 'grant_type=password&username=' + username + '&password=' + password
                        //data: 'grant_type=password&username=lynn&password=123456'
                    };
                    var resp = $http(req);
                    //alert("Anirban" + resp.data);
                    return resp;
                },
                getEmployeesByFirstName: function (firstName) {
                    //alert("In get WO")
                    var getUrl = HostMcsUrl + '/mobile/custom/getemployeesHCM/employees/' + firstName;
                    var req = {
                        method: 'GET',
                        url: getUrl,
                        /* we should look automate this process here as well */
                        headers: {
                            'Content-Type': 'application/json',
                            'Oracle-Mobile-Backend-Id': MCSBackendID,
                            'Authorization': localStorage.getItem('authToken')

                        }
                        // data: 'grant_type=password&username=' + username + '&password=' + password
                        //data: 'grant_type=password&username=lynn&password=123456'
                    };
                    //console.log("Anirban" + req);
                    var resp = $http(req);
                    //console.log("Anirban" + resp);
                    return resp;
                },
                getEmployeeDetailByID: function (personID) {
                    //alert("In get WO")
                    var getUrl = HostMcsUrl + '/mobile/custom/getemployeesHCM/employees/search/' + personID;
                    var req = {
                        method: 'GET',
                        url: getUrl,
                        /* we should look automate this process here as well */
                        headers: {
                            'Content-Type': 'application/json',
                            'Oracle-Mobile-Backend-Id': MCSBackendID,
                            'Authorization': localStorage.getItem('authToken')

                        }
                        // data: 'grant_type=password&username=' + username + '&password=' + password
                        //data: 'grant_type=password&username=lynn&password=123456'
                    };
                    //console.log("Anirban" + req);
                    var resp = $http(req);
                    //console.log("Anirban" + resp);
                    return resp;
                }
                ,
                getExpenseDetailsByExpenseID: function (expenseID) {
                    //alert("In get WO")
                    var getUrl = HostMcsUrl + '/mobile/custom/getexpenses/expenses/' + expenseID;
                    var req = {
                        method: 'GET',
                        url: getUrl,
                        /* we should look automate this process here as well */
                        headers: {
                            'Content-Type': 'application/json',
                            'Oracle-Mobile-Backend-Id': MCSBackendID,
                            'Authorization': localStorage.getItem('authToken')

                        }
                        // data: 'grant_type=password&username=' + username + '&password=' + password
                        //data: 'grant_type=password&username=lynn&password=123456'
                    };
                    //console.log("Anirban" + req);
                    var resp = $http(req);
                    //console.log("Anirban" + resp);
                    return resp;
                },
                getExpenseImagesByExpenseID: function (expenseID) {
                    //alert("In get WO")
                    var getUrl = HostMcsUrl + '/mobile/custom/ExpenseReportImages_AB/filesList/' + expenseID;
                    var req = {
                        method: 'GET',
                        url: getUrl,
                        /* we should look automate this process here as well */
                        headers: {
                            'Content-Type': 'application/json',
                            'Oracle-Mobile-Backend-Id': MCSBackendID,
                            'Authorization': localStorage.getItem('authToken')

                        }
                        // data: 'grant_type=password&username=' + username + '&password=' + password
                        //data: 'grant_type=password&username=lynn&password=123456'
                    };
                    //console.log("Anirban" + req);
                    var resp = $http(req);
                    //console.log("Anirban" + resp);
                    return resp;
                },
                
                registerWithMCSNotifications: function (deviceToken) {
                    //alert("In get WO")
                    var getUrl = HostMcsUrl + '/mobile/platform/devices/register' ;
                    
                            
                    
                    var req = {
                        method: 'POST',
                        url: getUrl,
                        /* we should look automate this process here as well */
                        headers: {
                            'Content-Type': 'application/json',
                            'Oracle-Mobile-Backend-Id': MCSBackendID,
                            'Authorization': localStorage.getItem('authToken')

                        },
                        data: {
                            'notificationToken' : deviceToken,
                            'mobileClient': {
                                    'id': 'com.oraclecorp.internal.ent3.fusionemployeesapp',
                                    'version': '1.0',
                                    'platform': 'IOS'
                                  }
                        }
                        
                    };
                    //console.log("Anirban" + req);
                    var resp = $http(req);
                    //console.log("Anirban" + resp);
                    return resp;
                }



            }
        })
        .factory('UserAuthService', ['$window', '$location', '$http', '$rootScope',
            'HostMcsUrl', 'MCSBackendID', '$ionicHistory', '$state', 'localstorage',
            function ($window, $location, $http, $rootScope, HostMcsUrl, MCSBackendID,
                    $ionicHistory, $state, localstorage) {
                return {
                    login: function (username, password) {

                        //var loginUrl = $location.protocol() + '://' + $location.host() + ':' + $location.port() + '/internals/login';
                        //var loginUrl = 'http://unit23586.oracleads.com:7778/ms_oauth/oauth2/endpoints/oauthservice/tokens';

                        // COMMENT OUT THE TWO LINES BELOW if you want to test authentication against MCS (Very SLOW right now)..
                        //var self = this;
                        //return self.login_dummy(username,password);

                        // this should be somewhere globbaly
                        var loginUrl = HostMcsUrl + '/mobile/custom/getemployeesHCM/employees';
                        var authHeader = 'Basic ' + btoa(username + ':' + password);
                        var req = {
                            method: 'GET',
                            url: loginUrl,
                            /* we should look automate this process here as well */
                            headers: {
                                'Content-Type': 'application/json',
                                'Oracle-Mobile-Backend-Id': MCSBackendID,
                                'Authorization': authHeader
                            }
                            // data: 'grant_type=password&username=' + username + '&password=' + password
                            //data: 'grant_type=password&username=lynn&password=123456'
                        };
//                        console.log(req);

                        $http(req)
                                .success(function (data) {
                                    //console.log(data);
                                    // if all good go to the latest page where you was, in our case remove the login

                                    localstorage.set('logged_in_user', username);
                                    localstorage.set('authToken', authHeader);
                                    localstorage.setObject('workOrders', data);
                                    $rootScope.$broadcast('event:auth-loginConfirmed');

                                    // find way to reset the controler
                                    //$state.go($state.current, {}, {reload: true});
                                    $state.transitionTo('search', {}, {
                                        location: true,
                                        inherit: true,
                                        relative: $state.$current,
                                        notify: true
                                    });

                                })
                                .error(function (keyValue) {
                                    console.log(keyValue);
                                    // DO NOT PUT ANYTHING HERE INSIDE, IT WILL BE HANDLED BY THE INTERCEPTOR
                                });

                        //return $http(req);
                    },
                    login_dummy: function (username, password) {
                        //alert("Dummy")
                        //console.log(data);
                        // if all good go to the latest page where you was, in our case remove the login

                        localstorage.set('logged_in_user', username);
                        localstorage.set('authToken', 'Basic TUNTREVNMDAwMV9NT0JJTEVQT1JUQUxTRVRSSUFMMTMwNERFVl9NT0JJTEVfQU5PTllNT1VTX0FQUElEOmR5Nm91NW5wX3RnbE5r');
                        $rootScope.$broadcast('event:auth-loginConfirmed');

                        // find way to reset the controler
                        //$state.go($state.current, {}, {reload: true});
                        $state.transitionTo('search', {}, {
                            location: true,
                            inherit: true,
                            relative: $state.$current,
                            notify: true
                        });

                    },
                    logout: function () {
                        if ($window.localStorage.getItem('logged_in_user')) {
                            localstorage.remove('logged_in_user');
                            $rootScope.$broadcast('event:auth-loginRequired');

                            // clear history, BUT this DOES NOT reset the CONTROLLERS
                            $ionicHistory.clearHistory();
                            $ionicHistory.clearCache();
                            alert("logout")
                            $state.transitionTo('login', {}, {
                                location: true,
                                inherit: true,
                                relative: $state.$current,
                                notify: true
                            });
                        }
                    },
                    isLoggedIn: function () {
                        console.log('Checking if user is logged in');
                        if ($window.localStorage.getItem('logged_in_user')) {
                            console.log('token exists in local storage');
                            return true;
                        } else {
                            console.log('token not found. user nt logged in');
                            return false;
                        }
                    },
                    getLoggedInUserProfile: function () {
                        console.log('Checking if user is a service Writer');
                        if ($window.localStorage.getItem('logged_in_user')) {
                            console.log('token exists in local storage');
                            var profile = {};
                            var username = $window.localStorage.getItem('logged_in_user');
                            if (username == 'helenMills') {
                                profile.username = username;
                                profile.name = 'Helen Mills';
                                profile.role = 'service_writer';
                            } else if (username == 'casey') {
                                profile.username = username;
                                profile.name = 'Casey Brown';
                                profile.role = 'technician';
                            } else if (username == 'angie') {
                                profile.username = username;
                                profile.name = 'Angie McGaha';
                                profile.role = 'service_writer';
                            }
                            return profile;
                        } else {
                            console.log('token not found. user not logged in');
                            return null;
                        }
                    }


                };
            }
        ])
        .factory('ionPlatform', function ($q) {
            var ready = $q.defer();

            ionic.Platform.ready(function (device) {
                ready.resolve(device);
            });

            return {
                ready: ready.promise
            }
        })
        .factory('Chats', function () {
            // Might use a resource here that returns a JSON array

            // Some fake testing data
            var chats = [{
                    id: 0,
                    name: 'Ben Sparrow',
                    lastText: 'You on your way?',
                    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
                }, {
                    id: 1,
                    name: 'Max Lynx',
                    lastText: 'Hey, it\'s me',
                    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
                }, {
                    id: 2,
                    name: 'Adam Bradleyson',
                    lastText: 'I should buy a boat',
                    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
                }, {
                    id: 3,
                    name: 'Perry Governor',
                    lastText: 'Look at my mukluks!',
                    face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
                }, {
                    id: 4,
                    name: 'Mike Harrington',
                    lastText: 'This is wicked good ice cream.',
                    face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
                }];

            return {
                all: function () {
                    return chats;
                },
                remove: function (chat) {
                    chats.splice(chats.indexOf(chat), 1);
                },
                get: function (chatId) {
                    for (var i = 0; i < chats.length; i++) {
                        if (chats[i].id === parseInt(chatId)) {
                            return chats[i];
                        }
                    }
                    return null;
                }
            };
        });
