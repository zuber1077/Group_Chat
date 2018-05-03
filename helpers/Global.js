
class Global {
    constructor(){
        this.globalRoom = [];
    }
    // users online in group
    EnterRoom(id, name, room, img){
        var roomName = {id, name, room, img}; //object disractury 
        this.globalRoom.push(roomName);
        return roomName;
    }

    RemoveUser(id){
        var user = this.GetUser(id);
        if(user){
            this.users = this.globalRoom.filter(user => user.id !== id);
        }
        return user;
    }

    GetUser(id){
        var getUser = this.globalRoom.filter((userId)=> {
            //get all user id
            return userId.id === id;
        })[0];
        return getUser;
    }

    GetRoomList(room){
        var roomName = this.globalRoom.filter((user) => user.room === room ); //all room in z array that muches z room name be added into new array 
        var namesArray = roomName.map((user) => {
            return {
                name: user.name,
                img: user.img
            }
        });

        return namesArray;
    }
}

module.exports = {Global};