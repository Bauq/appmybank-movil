angular.module('starter.services', [])
    .factory('Auth', function($firebaseAuth, $rootScope, $state) {
        var usersRef = new Firebase("https//mybankatom.firebaseio.com/users");
        var user;

        $rootScope.eliminarUsuarioFirebase = function(error) {
            usersRef.child($rootScope.uid).once('value', function(snapshot) {
                if (snapshot.exists()) {
                    snapshot.ref().remove(user);
                }
            });
        };

        $rootScope.iniciarSesionGoogle = function() {
            usersRef.authWithOAuthPopup("google", function(error, authData) {
                if (!error) {
                    $rootScope.uid = authData.uid;
                    $rootScope.email = authData.google.email;
                    $rootScope.nombreUsuario = authData.google.displayName;
                    $rootScope.token = authData.token;
                    $rootScope.fotoPerfil = authData.google.profileImageURL;
                    user = {
                        name: $rootScope.nombreUsuario,
                        email: $rootScope.email,
                        token: $rootScope.token
                    };
                    usersRef.child($rootScope.uid).once('value', function(snapshot) {
                        if (snapshot.exists()) {
                            snapshot.ref().update(user);
                        } else {
                            var payload = {};
                            payload[$rootScope.uid] = user;
                            snapshot.ref().parent().update(payload);
                        }
                    });
                    $state.go('app.main');
                }
            }, {
                remember: "sessionOnly",
                scope: "email"
            });
        };
        return {

        }
    });
