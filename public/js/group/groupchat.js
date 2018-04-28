

//client event listemer
$(document).ready(function () {
    var socket = io();

    var room = $('#groupName').val();
    var sender = $('#sender').val();
    //io.emit  emit an event to all client including z sender


    //listen connect event
    socket.on('connect', function () {
        console.log('yes user conn');

        var params = {
            room: room,
            name: sender 
        }

        // 1st parameter z name of z event, 2nd object contain data, option call back //get notified
        socket.emit('join', params, function() {
            console.log('User join this g');
        });

    });

    socket.on('newMessage', function (data) {
        console.log(data);

        var template = $('#message-template').html();
        var message = Mustache.render(template, {
            text: data.text,
            sender: data.from
        });
        $('#messages').append(message);

    });

    $('#message-form').on('submit', function (e) {
        e.preventDefault();

        var msg = $('#msg').val();

        socket.emit('createMessage', {
            text: msg,
            room: room,
            sender: sender
        }, function () {
            $('#msg').val('');
        });
    })


});