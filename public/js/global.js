
//this is for user or already friend online functionality
$(document).ready(function() {
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
        
        socket.on('message display', function() {
            $('#reload').load(location.href + ' #reload');
        });
    });

    socket.on('loggedInUser', function(users) {
        var friends = $('.friend').text();
        var friend =  friends.split('@');
        
        var name = $('#name-user').val().toLowerCase();
        var li = $('<li"></li>');
        var arr = [];

        for(var i = 0; i < users.length; i++){
            if(friend.indexOf(users[i].name) > -1){
                arr.push(users[i]);

                var userName = users[i].name.toLowerCase();


                var list = '<li><a href = "/chat/' + userName.replace(/ /g, "-") + '.' + name.replace(/ /g, "-") + '" title = "zuber" ><img src="http://placeholder.it/300x300" alt="" class="img-responsive profile-photo" /><span class="online-dot"><p>' + '@' + users[i].name +'</p></span></a></li>"';
                li.append(list);
            }
        }

        $('#numOfFriends').text('('+arr.length+')');
        $('.onlineFriends').html(li);
    });
});