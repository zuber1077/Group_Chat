// import { Socket } from "net";
    // emiting serever side
module.exports = function(io, Users){

    const users = new Users();

    //listen 4 connection event //if user connect be able to see 
    io.on('connection', (Socket) => {
       // console.log('User Connec form boss');

        Socket.on('join', (params, callback) => {
            //join paticular channal //join takes z room name //
            Socket.join(params.room);

            users.AddUserData(Socket.id, params.name, params.room);
            //console.log(users);
            io.to(params.room).emit('usersList', users.GetUsersList(params.room));

            callback();
         });

        Socket.on('createMessage', (message, callback) => {
            console.log(message);
            io.to(message.room).emit('newMessage', { //passing an object with key text value //message.text // show message only for paticular channal
                text: message.text,
                room: message.room,
                from: message.sender,
                image: message.userPic
            });

            //clear message text
            callback();
        });

        Socket.on('disconnect', () => {
            var user = users.RemoveUser(Socket.id);

            if(user){
                io.to(user.room).emit('usersList', users.GetUsersList(user.room));

            }
        })
    });
}