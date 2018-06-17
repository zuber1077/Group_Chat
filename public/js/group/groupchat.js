
//client event listemer
$(document).ready(function () {
    var socket = io();

    var room = $('#groupName').val();
    var sender = $('#sender').val();

    var userPic = $('#name-image').val();
    //io.emit  emit an event to all client including z sender


    //listen connect event
    socket.on('connect', function () {
        //console.log('yes user conn');

        var params = {
            room: room,
            name: sender 
        }

        // 1st parameter z name of z event, 2nd object contain data, option call back //get notified
        socket.emit('join', params, function() {
            //console.log('User join this g');
        });
    });

    socket.on('usersList', function(users) {
        //console.log(users); 
        var div = $('<div class="online-users list-inline"></div>');

        for(var i = 0; i < users.length; i++){
            div.append('<img src="http://placehold.it/300x300" alt="" class="profile-photo-sm pull-left" /><div><form action="" method="post" id="add_friend"><input type = "hidden" name = "receiverName" id = "receiverName" value = "" ><input type="hidden" name="sender-name" id="sender-name" value="<%= user.username %>"><h5><a class="friend" data-toggle="modal" id="val" data-target="#myModals3">' + users[i] +'</a></h5><button type="submit" type="submit" id="friend-add" class="btn " value="accept" class="text-green">Add friend</button></div></form>');
        }

        $(document).on('click', '#val', function() {
            $('#name').text('@'+$(this).text()); //display on modal
            $("#receiverName").val($(this).text()); //name be added to input field
            $("#nameLink").attr("href", "/profile/" + $(this).text()); //href to specfic user profile
        });


        $('#numValue').text('('+users.length+')');
        $('#users').html(div);

    });


    socket.on('newMessage', function (data) {
       // console.log(data);
        //template for message desplaying
        var template = $('#message-template').html();
        var message = Mustache.render(template, {
            text: data.text,
            sender: data.from,
            userImage: data.image
        });
        $('#messages').append(message);

    });

    $('#message-form').on('submit', function(e) {
      e.preventDefault(); //to nor reload the form once the form submited

      var msg = $('#msg').val(); //get data from an input field

      socket.emit(
        'createMessage',{ 
          text: msg,
          room: room,
          sender: sender,
          userPic: userPic
        },
        function() {
          $('#msg').val('');
        });

        //ajax for saving message into db
      $.ajax({
        url: '/group/'+room,
        type: 'POST',
        data: {
          message: msg,
          groupName: room
        },
        success: function() {
          $('#msg').val('');
        }
      })
    });

});