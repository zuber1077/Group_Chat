
class Users {
    constructor(){
        this.users = [];
    }
    // users online in group
    AddUserData(id, name, room){
        var users = {id, name, room}; //object disractury 
        this.users.push(users);
        return users;
    }
    GetUsersList(room){
        var users = this.users.filter((user) => user.room === room ); //all room in z array that muches z room name be added into new array 
        var namesArray = users.map((user) => {
            return name.name;
        });

        return namesArray;
    }
}

module.exports = { Users };