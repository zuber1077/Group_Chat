// import { Socket } from "net";
    // emiting serever side
module.exports = function(io){
    //listen 4 connection event //if user connect be able to see 
    io.on('connection', (Socket) => {
        console.log('User Connec form boss');

        Socket.on('join', (params, callback) => {
            //join paticular channal //join takes z room name //
            Socket.join(params.room);
            callback();
         });

        Socket.on('createMessage', (message, callback) => {
            console.log(message);

            io.to(message.room).emit('newMessage', { //passing an object with key text value //message.text
                text: message.text,
                room: message.room
            });
            
            //clear message text
            callback();
        });
    });
}