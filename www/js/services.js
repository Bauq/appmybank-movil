angular.module('starter.services', [])
    .factory('Auth', function($firebaseAuth, $rootScope) {
        var usersRef = new Firebase("https//mybankatom.firebaseio.com/users");
        return {
            iniciarSesionGoogle: function() {
                usersRef.authWithOAuthPopup("google", function(error, authData) {
                    $rootScope.uid = authData.uid;
                    $rootScope.email = authData.google.email;
                    $rootScope.nombreUsuario = authData.google.displayName;
                    $rootScope.token = authData.token;
                    $rootScope.fotoPerfil = authData.google.profileImageURL;
                    var user = {
                        name: $rootScope.nombreUsuario,
                        email: $rootScope.email,
                        token : $rootScope.token
                    };
                    usersRef.child($rootScope.uid).once('value', function(snapshot) {
                        // if data exists
                        if (snapshot.exists()) {
                            snapshot.ref().update(user);
                        } else {
                            var payload = {};
                            payload[$rootScope.uid] = user;
                            snapshot.ref().parent().update(payload);
                        }
                    });

                }, {
                    remember: "sessionOnly",
                    scope: "email"
                });

            }
        }
    });
