
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
        var div = $('<div></div>');
        var li = $('<li></li>');
        var arr = [];

        for(var i = 0; i < users.length; i++){
            if(friend.indexOf(users[i].name) > -1){
                arr.push(users[i]);

                var userName = users[i].name.toLowerCase();

                var list = '<a id="val" href="/chat/' + userName.replace(/ /g, "-") + "." + name.replace(/ /g, "-") + '" class="media border-0"><div class="media-left pr-1" ><span class="avatar avatar-md avatar-online"><img class="media-object rounded-circle" src="../../../app-assets/images/portrait/small/avatar-s-3.png" alt="Generic placeholder image"><i></i></span></div><div class="media-body w-100"><h6 class="list-group-item-heading">' + "@" + users[i].name + '<span class="font-small-3 float-right primary">online</span></h6></div></a>';
                div.append(list);

                var list = ' <a class="dropdown-item" id="val" href="/chat/' + userName.replace(/ /g, "-") + "." + name.replace(/ /g, "-") + '" data-toggle="dropdown">' + "@ " + users[i].name + '<submenu class="name"></submenu></a >';
                li.append(list);
            }
        }

        $('#numOfFriends').text('('+arr.length+')');
        $('.onlineFriends').html(div);
        $('.onlineFriends2').html(li);
    });
});