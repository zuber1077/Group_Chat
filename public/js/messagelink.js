$(document).ready(function () {
    var socket = io();

    var paramOne = $.deparam(window.location.pathname);
    //console.log(paramOne);
    var newParam = paramOne.split('.');
    
    //console.log('1', newParam);
    swap(newParam, 0, 1);
    //console.log('2', newParam);
    var paramTwo = newParam[0]+'.'+newParam[1];

    socket.on('connect', function() {
        var params = {
            room1: paramOne,
            room2: paramTwo
        }

        socket.emit('join PM', params);
    });
    $(document).on('click', '#messageLink', function () {
        var chatId = $(this).data().value;

        $.ajax({
            url: '/chat/'+paramOne,
            type: 'POST',
            data: {chatId: chatId},
            success: function () {
                
            }
        })
    });
})