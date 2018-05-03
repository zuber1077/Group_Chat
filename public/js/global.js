
//this is for user or already friend online functionality
$(document).ready(function () {
    var socket = io();

    socket.on('connect', function() {

        var room = 'GlobalRoom';
        var name = $('#name-user').val();
        var img = $('#name-image').val();

        socket.emit('global room', {
            room: room,
            name: name,
            img: img
        });     
    });

    socket.on('loggedInUser', function (users) {
        var friends = $('.friend').text();
        var friend =  friends.split('@');
        
        var name = $('#name-user').val();
        var div = $('<div class="messaging-list-item"></div>');
        var arr = [];

        for(var i=0; i < users.length; i++){
            if(friend.indexOf(users[i].name) > -1){
                arr.push(users[i]);
                var list = '<a href="/chat">@' + users[i].name + '</a><span class="fa fa-circle online_friend"></span><div class="s1"><a href="/chat" class="avatar" href="javascript:void(0);"><img src="../assets/common/img/temp/avatars/1.jpg"></a></div><div class="s2"><small class="messaging-time">8:34PM</small><div class="messaging-list-title-name friend"></div></div>';
                div.append(list);
            }
        }

        $('#numOfFriends').text('('+arr.length+')');
        $('.messaging-list').html(div);
    });
});