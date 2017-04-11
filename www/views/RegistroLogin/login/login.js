// login.js
// This is the controller that handles the logging in of the user either through Firebase or Social Logins.
// If the user is logged in through Social accounts, the user is then transfered to screen asking for their email address.
// The user is asked for their email address, because in some cases Social Login is not able to retrieve an email address or is not required by the service (such as Twitter).
// Afterwhich, an account will be saved on the Firebase Database which is independent from the Firebase Auth and Social Auth accounts.
// If the user is previously logged in and the app is closed, the user is automatically logged back in whenever the app is reopened.
'Use Strict';
angular.module('App').controller('CtrlLogin', function($scope, $state, $localStorage, Social, Utils, $cordovaOauth, Popup, $ionicPopup, $window, $ionicModal, dataService, $ionicLoading, $http) {
  $scope.$on('$ionicView.enter', function() {
    //Clear the Login Form.
    $scope.user = {
      email: '',
      password: ''
    };

    $scope.verLogout = true;
    var gtValido = false;
    var gamertag = "";
    var idXbox = "";
    var datosXboxRec = false;
    var imagenGt = "";
    var gamerscore = "";
    //Check if user is already authenticated on Firebase and authenticate using the saved credentials.
    if ($localStorage) {
      if ($localStorage.loginProvider) {
        Utils.message(Popup.successIcon, Popup.welcomeBack);
        //The user is previously logged in, and there is a saved login credential.
        if ($localStorage.loginProvider == "Firebase") {
          //Log the user in using Firebase.
          loginWithFirebase($localStorage.email, $localStorage.password);
        } else {
          //Log the user in using Social Login.
          var provider = $localStorage.loginProvider;
          var credential;
          switch (provider) {
            case 'Facebook':
              credential = firebase.auth.FacebookAuthProvider.credential($localStorage.access_token);
              break;
            case 'Google':
              credential = firebase.auth.GoogleAuthProvider.credential($localStorage.id_token, $localStorage.access_token);
              break;
            case 'Twitter':
              credential = firebase.auth.TwitterAuthProvider.credential($localStorage.oauth_token, $localStorage.oauth_token_secret);
              break;
          }
          loginWithCredential(credential, $localStorage.loginProvider);
        }
      } else if ($localStorage.isGuest) {
        //The user previously logged in as guest, entering as a new guest again.
        Utils.message(Popup.successIcon, Popup.welcomeBack);
        loginFirebaseGuest();
      }
    }
  })

  $scope.login = function(user) {
    if (angular.isDefined(user)) {
      Utils.show();
      loginWithFirebase(user.email, user.password);
    }
  };

  $scope.loginWithFacebook = function() {
    Utils.show();
    //Login with Facebook token using the appId from app.js
    $cordovaOauth.facebook(Social.facebookAppId, ["public_profile", "email"]).then(function(response) {
      var credential = firebase.auth.FacebookAuthProvider.credential(response.access_token);
      $localStorage.access_token = response.access_token;
      loginWithCredential(credential, 'Facebook');
    }, function(error) {
      //User cancelled login. Hide the loading modal.
      Utils.hide();
    });
  };

  $scope.loginWithGoogle = function() {
       
    //Login with Google token using the googleWebClientId from app.js
    $cordovaOauth.google(Social.googleWebClientId, ["https://www.googleapis.com/auth/userinfo.email"]).then(function(response) {
      var credential = firebase.auth.GoogleAuthProvider.credential(response.id_token,
        response.access_token);
      $localStorage.id_token = response.id_token;
      $localStorage.access_token = response.access_token;
      loginWithCredential(credential, 'Google');
    }, function(error) {
      //User cancelled login. Hide the loading modal.
      Utils.hide();
    });
  };

  $scope.loginWithTwitter = function() {
    Utils.show();
    //Login with Twitter token using the twitterKey and twitterSecret from app.js
    $cordovaOauth.twitter(Social.twitterKey, Social.twitterSecret).then(function(response) {
      var credential = firebase.auth.TwitterAuthProvider.credential(response.oauth_token,
        response.oauth_token_secret);
      $localStorage.oauth_token = response.oauth_token;
      $localStorage.oauth_token_secret = response.oauth_token_secret;
      loginWithCredential(credential, 'Twitter');
    }, function(error) {
      //User cancelled login. Hide the loading modal.
      Utils.hide();
    });
  };

  $scope.loginAsGuest = function() {
    Utils.show();
    loginFirebaseGuest();
  };

  //Function to login to Firebase using email and password.
  loginWithFirebase = function(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(function(response) {

        //Retrieve the account from the Firebase Database
        var userId = firebase.auth().currentUser.uid;
        console.log("Resp1:"+userId);
        firebase.database().ref('desafio/users').orderByChild('userId').equalTo(userId).once('value').then(function(accounts) {
          
          if (accounts.exists()) {
            accounts.forEach(function(account) {
              //Account already exists, proceed to home.
              Utils.hide();
              $localStorage.keyUser = account.key;
               firebase.database().ref('desafio/users/' + account.key).on('value', function(response) {
                var account = response.val();
                $localStorage.account = account;
              });
              window.localStorage.setItem('nuevoSocial', 0);
              $scope.verLogout = false;
            });
          } 
        });
        $localStorage.loginProvider = "Firebase";
        $localStorage.email = email;
        $localStorage.password = password;
      })
      .catch(function(error) {
        var errorCode = error.code;
        showFirebaseLoginError(errorCode);
      });
  }

  //Function to login to Firebase using a credential and provider.
  loginWithCredential = function(credential, provider) {
    firebase.auth().signInWithCredential(credential)
      .then(function(response) {
        //Check if account already exists on the database.
        checkAndLoginAccount(response, provider, credential);
        //Save social login credentials.
        $localStorage.loginProvider = provider;
        $localStorage.credential = credential;
      })
      .catch(function(error) {
        //Show error message.
        var errorCode = error.code;
        showSocialLoginError(errorCode);
      });
  };

  //Function to login guests to Firebase. Note that each attempt inserts a new user in your Firebase Auth User with their own userId.
  loginFirebaseGuest = function() {
    firebase.auth().signInAnonymously()
      .then(function(response) {
        Utils.hide();
        $localStorage.isGuest = true;
        $state.go('/tab/dash');
      })
      .catch(function(error) {
        var errorCode = error.code;
        showFirebaseLoginError(errorCode);
      });
  };

  //Check if the Social Login used already has an account on the Firebase Database. If not, the user is asked to complete a form.
  checkAndLoginAccount = function(response, provider, credential) {
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('desafio/users/').orderByChild('userId').equalTo(userId).once('value').then(function(accounts) {
      if (accounts.exists()) {
        accounts.forEach(function(account) {
          //Account already exists, proceed to home.
          Utils.hide();
          
          console.log(account.key);
          firebase.database().ref('desafio/users/' + account.key).on('value', function(response) {
            var account = response.val();
            $localStorage.account = account;
          });
          $scope.verLogout = false;
          //$state.go('/tab/dash');
        });
      } else {
        //No account yet, proceed to completeAccount.
        Utils.hide();
        $localStorage.provider = provider;
        $state.go('completeAccount');
      }
    });
  };

  //Shows the error popup message when using the Login with Firebase.
  showFirebaseLoginError = function(errorCode) {
    switch (errorCode) {
      case 'auth/user-not-found':
        Utils.message(Popup.errorIcon, Popup.emailNotFound);
        break;
      case 'auth/wrong-password':
        Utils.message(Popup.errorIcon, Popup.wrongPassword);
        break;
      case 'auth/user-disabled':
        Utils.message(Popup.errorIcon, Popup.accountDisabled);
        break;
      case 'auth/too-many-requests':
        Utils.message(Popup.errorIcon, Popup.manyRequests);
        break;
      default:
        Utils.message(Popup.errorIcon, Popup.errorLogin);
        break;
    }
  };

  //Shows the error popup message when using the Social Login with Firebase.
  showSocialLoginError = function(errorCode) {
    switch (errorCode) {
      case 'auth/account-exists-with-different-credential':
        Utils.message(Popup.errorIcon, Popup.accountAlreadyExists);
        break;
      case 'auth/invalid-credential':
        Utils.message(Popup.errorIcon, Popup.sessionExpired);
        break;
      case 'auth/operation-not-allowed':
        Utils.message(Popup.errorIcon, Popup.serviceDisabled);
        break;
      case 'auth/user-disabled':
        Utils.message(Popup.errorIcon, Popup.accountDisabled);
        break;
      case 'auth/user-not-found':
        Utils.message(Popup.errorIcon, Popup.userNotFound);
        break;
      case 'auth/wrong-password':
        Utils.message(Popup.errorIcon, Popup.wrongPassword);
        break;
      default:
        Utils.message(Popup.errorIcon, Popup.errorLogin);
        break;
    }
  };


   $scope.logout = function() {
    console.log("1 - l");
    if (firebase.auth()) {
      console.log("2 - l");
      firebase.auth().signOut().then(function() {
        //Clear the saved credentials.
        $localStorage.$reset();
        //Proceed to login screen.
        //$state.go('app.login');
        $state.go($state.current, {}, {reload: true});
      }, function(error) {
        //Show error message.
        Utils.message(Popup.errorIcon, Popup.errorLogout);
      });
    }
  };

  //------------------------------------------------------------------------------------------ Modal
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('views/RegistroLogin/register/register.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.loginRegister = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  //----------------------------------------------------------------------------------------- Register
  $scope.buscarGamertag = function(gt){
    gtValido = false;
     $ionicLoading.show({template:"Verificando Gamertag..."});
    var gtEspacio = String(gt);
    var espacio = "-";
    console.log(gtEspacio+" encontrou "+gtEspacio.indexOf(espacio));
    //if(gtEspacio.indexOf(espacio) != -1){
      var gtSemEspacio = String(gtEspacio.replace(/\s/g,'%20'));
      console.log("P1 - Buscando GT");
    //}    

     $http({
          url: 'https://xboxapi.com/v2/xuid/'+gtSemEspacio,
          method: 'GET',
          headers: {
                      'Access-Control-Allow-Origin': '*',                
                      'X-AUTH': '5056c2081205740a2d765ebe3ff5807dd4178a87', //Benbaodan
                      //'X-AUTH' : '5056c2081205740a2d765ebe3ff5807dd4178a87', // BenbaodanJr
                      //'X-Authorization':idXbl,
                      //'Access-Control-Allow-Methods': 'GET',
                      'Accept-Language':'es-ES',
                      'Content-Type':'application/json'
                    }
          }).then(function(respuesta) { 
            gtValido = true; 
            $scope.gtValido = gtValido; 

            idXbox = respuesta.data.xuid;
           
            $ionicLoading.hide(); 
            $ionicLoading.show({template:"Gamertag encontrado. Recuperando dados..."});
             console.log("P2 - GT encontrado");
                 $http({
                  url: 'https://xboxapi.com/v2/'+idXbox+'/profile',
                  method: 'GET',
                  headers: {
                              'Access-Control-Allow-Origin': '*',                
                              //'X-AUTH': '4a58d6c0d49e5884e43a756d729940c95c82cca7', //Benbaodan
                              'X-AUTH' : '5056c2081205740a2d765ebe3ff5807dd4178a87', // BenbaodanJr
                              //'X-Authorization':idXbl,
                              //'Access-Control-Allow-Methods': 'GET',
                              'Accept-Language':'es-ES',
                              'Content-Type':'application/json'
                            }
                  }).then(function(respuesta) {
                    console.log("P3 - Datos encontrado");
                    datosXboxRec = true;  
                    $ionicLoading.hide(); 
                    gamertag = respuesta.data.Gamertag;
                    imagenGt = respuesta.data.GameDisplayPicRaw;
                    gamerscore = respuesta.data.Gamerscore;
                    $scope.msg = "Este é o seu Gamertag?";
                    $scope.gamertag = gamertag;
                    $scope.imagenGt = imagenGt;  
                  }, function(err) { 
                    gtValido = false;
                    datosXboxRec = false;        
                    if(err.data.success == false){
                      $scope.msg = "Error."; 
                      $scope.gt = "";
                    }                 
                    $ionicLoading.hide();
                  }); 
          }, function(err) { 
            gtValido = false;
            $scope.gtValido = gtValido;        
            if(err.data.success == false){
              $scope.msg = "No found."; 
              $scope.gt = "";
            }                 
            $ionicLoading.hide();
          }); 
         
  }




  // ---- Registro
  $scope.register = function(user) {
    $localStorage.gamertag = gamertag;
    //Check if form is filled up.
    if (angular.isDefined(user)) {
      Utils.show();
      firebase.database().ref('desafio/users/').orderByChild('email').equalTo(user.email).once('value').then(function(accounts) {
        if (accounts.exists()) {
          Utils.message(Popup.errorIcon, Popup.emailAlreadyExists);
        } else {
          //Create Firebase account.
          firebase.auth().createUserWithEmailAndPassword(user.email, user.password)
            .then(function() {
              //Add Firebase account reference to Database. Firebase v3 Implementation.
              firebase.database().ref().child('desafio/users/').push({
                email: user.email,
                gamertag: gamertag,
                userId: firebase.auth().currentUser.uid,
                dateCreated: Date(),
                provider: 'Firebase',
                idXbox: idXbox,
                imagenGt: imagenGt,
                tipo:plus
              }).then(function(response) {
                //Account created successfully, logging user in automatically after a short delay.
                Utils.message(Popup.successIcon, Popup.accountCreateSuccess)
                  .then(function() {
                    getAccountAndLogin(response.key);
                    console.log(response.key);
                    $localStorage.account = response.key;
                  })
                  .catch(function() {
                    //User closed the prompt, proceed immediately to login.
                    getAccountAndLogin(response.key);
                    $localStorage.account = response.key;
                  });
                $localStorage.loginProvider = "Firebase";
                $localStorage.email = user.email;
                $localStorage.password = user.password;
              });
            })
            .catch(function(error) {
              var errorCode = error.code;
              var errorMessage = error.message;
              //Show error message.
              console.log(errorCode);
              switch (errorCode) {
                case 'auth/email-already-in-use':
                  Utils.message(Popup.errorIcon, Popup.emailAlreadyExists);
                  break;
                case 'auth/invalid-email':
                  Utils.message(Popup.errorIcon, Popup.invalidEmail);
                  break;
                case 'auth/operation-not-allowed':
                  Utils.message(Popup.errorIcon, Popup.notAllowed);
                  break;
                case 'auth/weak-password':
                  Utils.message(Popup.errorIcon, Popup.weakPassword);
                  break;
                default:
                  Utils.message(Popup.errorIcon, Popup.errorRegister);
                  break;
              }
            });
        }
      });
    }
  };

  //Function to retrieve the account object from the Firebase database and store it on $localStorage.account.
  getAccountAndLogin = function(key) {
    firebase.database().ref('accounts/' + key).on('value', function(response) {
      var account = response.val();
      $localStorage.account = account;
    });
    //$state.go('home');
    $scope.modal.hide();
    $state.go($state.current, {}, {reload: true});
  };

});
