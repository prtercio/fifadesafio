// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('App', [
  'ionic',
  'App.CtrlTemporadas',
  'App.CtrlTempTorneio', 
  'App.CtrlTempTorneioJogo', 
  'App.CtrlTemporadasRankingJogos',
  'App.CtrlTemporadasRankingJogosDetalhe',
  'App.CtrlCopas',
  'App.dataServices', 
  'ngStorage', 
  'ngCordovaOauth', 
  'App.translations'])

.constant('Social', {
    facebookAppId: "1025234637591184",
    googleWebClientId: "86899339460-kqrko1uuhu9a532l9f0jdhf9tgnp8b00.apps.googleusercontent.com",
    twitterKey: "aJWByCgPhUgYZJMojyFeH2h8F",
    twitterSecret: "XxqKHi6Bq3MHWESBLm0an5ndLxPYQ2uzLtIDy6f9vgKKc9kemI"
  })
  //Constants for the Popup messages
  //For the icons, refer to http://ionicons.com for all icons.
  //Here you can edit the success and error messages on the popups.
  .constant('Popup', {
    delay: 3000, //How long the popup message should show before disappearing (in milliseconds -> 3000 = 3 seconds).
    successIcon: "ion-happy-outline",
    errorIcon: "ion-sad-outline",
    accountCreateSuccess: "Congratulations! Your account has been created. Logging you in.",
    emailAlreadyExists: "Sorry, but an account with that email address already exists. Please register with a different email and try again.",
    accountAlreadyExists: "Sorry, but an account with the same credential already exists. Please check your account and try again.",
    emailNotFound: "Sorry, but we couldn\'t find an account with that email address. Please check your email and try again.",
    userNotFound: "Sorry, but we couldn\'t find a user with that account. Please check your account and try again.",
    invalidEmail: "Sorry, but you entered an invalid email. Please check your email and try again.",
    notAllowed: "Sorry, but registration is currently disabled. Please contact support and try again.",
    serviceDisabled: "Sorry, but logging in with this service is current disabled. Please contact support and try again.",
    wrongPassword: "Sorry, but the password you entered is incorrect. Please check your password and try again.",
    accountDisabled: "Sorry, but your account has been disabled. Please contact support and try again.",
    weakPassword: "Sorry, but you entered a weak password. Please enter a stronger password and try again.",
    errorRegister: "Sorry, but we encountered an error registering your account. Please try again later.",
    passwordReset: "A password reset link has been sent to: ",
    errorPasswordReset: "Sorry, but we encountered an error sending your password reset email. Please try again later.",
    errorLogout: "Sorry, but we encountered an error logging you out. Please try again later.",
    sessionExpired: "Sorry, but the login session has expired. Please try logging in again.",
    errorLogin: "Sorry, but we encountered an error logging you in. Please try again later.",
    welcomeBack: "Welcome back! It seems like you should still be logged in. Logging you in now.",
    manyRequests: "Sorry, but we\'re still proccessing your previous login. Please try again later."
  })

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.platform.android.navBar.alignTitle('center');
    $ionicConfigProvider.platform.android.tabs.position("bottom");
  $stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'views/menu.html'
  })

  .state('app.inicio', {
    url: '/inicio',
    views: {
      'menuContent': {
        templateUrl: 'views/inicio.html'
      }
    }
  })

  .state('app.temporadas', {
      url: '/temporadas',
      views: {
        'menuContent': {
          templateUrl: 'views/temporadas/temporadas.html',
          controller:'CtrlTemporadas'
        }
      }
    })
  .state('app.temporadasTorneio', {
      url: '/temporadasTorneio/:torneioId',
      views: {
        'menuContent': {
          templateUrl: 'views/temporadas/temporadasTorneio.html',
          controller:'CtrlTempTorneio as idTorneio'
        }
      },
      resolve:{
        idTorneio: function($stateParams){
          return $stateParams.torneioId;
        }
      }
    })
  .state('app.temporadasTorneioJogo', {
    url: '/temporadasTorneioJogo/:jogoId',
    views: {
      'menuContent': {
        templateUrl: 'views/temporadas/temporadasTorneioJogo.html',
        controller: 'CtrlTempTorneioJogo as idJogo'
      }
    },
    resolve:{
      idJogo: function($stateParams){
        return $stateParams.jogoId;
      }
    }
  })
  .state('app.temporadasRankingJogos', {
    url: '/temporadasRankingJogos/:jogoId',
    views: {
      'menuContent': {
        templateUrl: 'views/temporadas/temporadasRankingJogos.html',
        controller: 'CtrlTemporadasRankingJogos as idJogos'
      }
    },
    resolve:{
      idJogos: function($stateParams){
        return $stateParams.jogoId;
      }
    }
  })
  .state('app.temporadasRankingJogosDetalhe', {
    url: '/temporadasRankingJogosDetalhe/:jogoId',
    views: {
      'menuContent': {
        templateUrl: 'views/temporadas/temporadasRankingJogosDetalhe.html',
        controller: 'CtrlTemporadasRankingJogosDetalhe as idJogoDetalhe'
      }
    },
    resolve:{
      idJogoDetalhe: function($stateParams){
        return $stateParams.jogoId;
      }
    }
  })
  .state('app.copas', {
      url: '/copas',
      views: {
        'menuContent': {
          templateUrl: 'views/copas/copas.html'
        }
      }
    })
    .state('app.login', {
      url: '/login',
      views: {
        'menuContent': {
          templateUrl: 'views/RegistroLogin/login/login.html',
          controller:'CtrlLogin'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/inicio');
});
