

module.exports = function(io, Global, _) {
    const clients = new Global();

    io.on('connection', (socket) => {
        socket.on('global room', (global) => {
            socket.join(global.room);

            clients.EnterRoom(socket.id, global.name, global.room, global.img);

            const nameProp = clients.GetRoomList(global.room);
            //using lodah doublicate free Array
            const arr = _.uniqBy(nameProp, 'name');
            //console.log(arr);

            io.to(global.room).emit('loggedInUser', arr);
        });

        //user to disconnect from friend online list //listener
        socket.on('disconnect', () => {
            const user = clients.RemoveUser(socket.id);
            if(user){
                var userData = clients.GetRoomList(user.room);
                const arr = _.uniqBy(userData, 'name');
                //remove the array from the list using lodash
                const removeData = _.remove(arr, {'name': user.name})
                io.to(user.room).emit('loggedInUser', arr);
            }
        })
    });
}