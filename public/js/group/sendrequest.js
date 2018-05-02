
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
        //console.log(friend);
        //to load for notification automatically
        $('#reload').load(location.href + ' #reload'); //load data from server

        //accept friend with out refreshing the page
        $(document).on('click','#accept_friend', function() {
            var senderId = $('#senderId').val() ;
            var senderName = $('#senderName').val();
        
                $.ajax({
                    url: '/group/'+room,
                    type: 'POST',
                    data: {
                        senderId: senderId,
                        senderName: senderName
                    },

                    success: function() {
                        $(this).parent().eq(1).remove();
                    }
                });
                $('#reload').load(location.href + ' #reload'); //load data from server
        });

        //cancel friend req with out refrshing z page
        $(document).on('click','#cancel_friend', function() {
            var user_Id = $('#user_Id').val(); //get the method from inout
        
                $.ajax({
                    url: '/group/'+room,
                    type: 'POST',
                    data: {
                        user_Id: user_Id
                    },

                    success: function() {
                        $(this).parent().eq(1).remove();
                    }
                });
                $('#reload').load(location.href + ' #reload'); //load data from server
        });
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
            }, function() {
                console.log("Request sent");
            })
        }
    })    
   });

   $('#accept_friend').on('click', function() {
        var senderId = $('#senderId').val() ;
        var senderName = $('#senderName').val();
        
        $.ajax({
            url: '/group/'+room,
            type: 'POST',
            data: {
                senderId: senderId,
                senderName: senderName
            },

            success: function() {
                $(this).parent().eq(1).remove();
            }
        });
        $('#reload').load(location.href + ' #reload'); //load data from server
   });

//canceling f R
   $('#cancel_friend').on('click', function() {
       var user_Id = $('#user_Id').val(); //get the method from inout
        
        $.ajax({
            url: '/group/'+room,
            type: 'POST',
            data: {
                user_Id: user_Id
            },

            success: function() {
                $(this).parent().eq(1).remove();
            }
        });
        $('#reload').load(location.href + ' #reload'); //load data from server
   });
});