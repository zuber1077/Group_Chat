
$(document).ready(function() {
    var socket = io();

     var room = $("#groupName").val();
     var sender = $("#sender").val();

    socket.on('connect', function() {
        //when request imit z resiver 
        var params = {
            sender: sender
        }

        socket.emit('joinRequest', params, function() {
           // console.log('Joined');
        });
    });

    socket.on('newFriendRequest', function(friend) {
        console.log(friend);
        
    });


   $('#add_friend').on('submit', function(e) { //adding event
       e.preventDefault();

        var receiverName = $("#receiverName").val(); //got reciverN from z  reciver input field (id)


        $.ajax({ //using ajax to post z data to db 
        url: '/group/'+room,
        type: 'POST',
        data: {
            receiverName: receiverName //only 
        },
        success: function () { //done
            socket.emit('friendRequest', { //emit new event friendRequest 
                receiver: receiverName,
                sender: sender
            }, function () {
                console.log("Request sent");
            })
        }
    })
   })

});