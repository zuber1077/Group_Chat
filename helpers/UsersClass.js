
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
     //to remover from friend online list 
    RemoveUser(id){
        var user = this.GetUser(id);
        if(user){
            this.users = this.users.filter((user) => user.id !== id);
        }
        return user;
    }

    GetUser(id){
        var getUser = this.users.filter((userId)=> {
            //get all user id
            return userId.id === id;
        })[0];
        return getUser;
    }

    GetUsersList(room){
        var users = this.users.filter((user) => user.room === room ); //all room in z array that muches z room name be added into new array 
        var namesArray = users.map((user) => user.name );

        return namesArray;
    }
}

module.exports = {Users};