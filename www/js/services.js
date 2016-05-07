angular.module('starter.services', [])
    .factory('Auth', function($firebaseAuth, $rootScope, $state,$window,$http) {
        var usersRef = new Firebase("https//mybankatom.firebaseio.com/users");
        var user;
        var conexionLegacyApi = "http://mybank-legacy-api.herokuapp.com/api/";

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
                    $window.localStorage.uid = authData.uid;
                    $window.localStorage.email = authData.google.email;
                    $window.localStorage.nombreUsuario = authData.google.displayName;
                    $window.localStorage.token = authData.token;
                   $window.localStorage.fotoPerfil = authData.google.profileImageURL;
                    user = {
                        name: $window.localStorage.nombreUsuario,
                        email: $window.localStorage.email,
                        token: $window.localStorage.token
                    };
                    usersRef.child($window.localStorage.uid).once('value', function(snapshot) {
                        if (snapshot.exists()) {
                            snapshot.ref().update(user);
                        } else {
                            var payload = {};
                            payload[$window.localStorage.uid] = user;
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
            listarProductos : function(email,token){
                //return $http.get(conexionLegacyApi + '/product/getByEmail?email='+ email +'&token='+token);
                return $http.get('http://mybank-legacy-api.herokuapp.com/api/product/getByEmail?email=tinez7g@gmail.com&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ2IjowLCJkIjp7InVpZCI6InVuaXF1ZUlkMSIsInNvbWUiOiJhcmJpdHJhcnkiLCJkYXRhIjoiaGVyZSJ9LCJpYXQiOjE0NjI2NTQxMDV9.8bFpNa_oa2m2z85ZRkg59McHWXqXogm6B6p0kAiaDAo')
            }
        }
    });
