
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
        
        var name = $('#name-user').val().toLowerCase();
        var div = $('<div class="messaging-list"></div>');
        var arr = [];

        for(var i=0; i < users.length; i++){
            if(friend.indexOf(users[i].name) > -1){
                arr.push(users[i]);

                var userName = users[i].name.toLowerCase();

                var list = '<div class="messaging-list-item"><span class="donut donut-success online_friend"></span><div class="s1"><a class="avatar" href="/chat"><img href="/chat" src="../assets/common/img/temp/avatars/1.jpg"></a></div><div class="s2"><a href="/chat/'+userName.replace(/ /g, "-")+'.'+name.replace(/ /g, "-")+'"><div class="messaging-list-title-name">@' + users[i].name + "</div></a></div></div>";
                div.append($(list));
            }
        }

        $('#numOfFriends').text('('+arr.length+')');
        $('.messaging-list').html(div);
    });
});