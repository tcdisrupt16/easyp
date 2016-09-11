angular.module('starter.controllers', [])


.controller('WaitCtrl', function($scope) {
  var people;


  $.get("https://dweet.io/get/latest/dweet/for/easyp-queue", function( data ) {
    people = data["with"][0]["content"]["people"];

    $scope.people = people;
    $scope.status = "Occupied";

    $scope.$apply()
  });

  function queueDec(){
    var people;

    // get queue
    $.get("https://dweet.io/get/latest/dweet/for/easyp-queue", function( data ) {
      people = data["with"][0]["content"]["people"];

      $scope.people = Math.max((people-1),0)

      if (people == 1) {
        window.location = "#/tab/go"
      }
      $scope.$apply()

      // decrement
      $.get("https://dweet.io/dweet/for/easyp-queue?people=" + Math.max((people-1),0), function( data ) {

      });

    });
  }

  var prev_state = false;
  function poll(){


    $.get("https://dweet.io/get/latest/dweet/for/handy-camp", function( data2 ) {
      //alert(data["with"][0]["content"]["tilt_x"]);

      var state = data2["with"][0]["content"]["tilt_x"] > 20 //? 'open' : 'closed'

      console.log(state)
      console.log(prev_state)

      if (state != prev_state) {
        if (state) {
          queueDec();

          console.log("change open");
          $scope.status = "Vacant";
        } else {
          console.log("change close");

          $scope.status = "Occupied";
          $scope.$apply();
        }
      }

      prev_state = state


      //console.log(state)
    });
  }

    setInterval(function () {
      poll()
    }, 2000);
})

.controller('DashCtrl', function($scope, $state) {
  InFlight.initService('passenger_data/v1', function(PassengerData){
    PassengerData.getPassengerDataInfo(function(error, data) {
        // Process passenger data
        $scope.seat = data.travel_info.seat_number;
        $scope.first_name = data.pii.first_name;
        $scope.last_name = data.pii.last_name;
    });
  });

  $scope.go_wc = function() {
    $.get("https://dweet.io/dweet/for/easyp-queue?people=2", function( data ) {
      //alert(data["with"][0]["content"]["tilt_x"]);

      //var state = data["with"][0]["content"]["tilt_x"] > 20 ? 'open' : 'closed'
      $state.go("tab.wait");
    });
  };
})

  .controller('GoCtrl', function($scope) {
    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //
    //$scope.$on('$ionicView.enter', function(e) {
    //});


  })

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
