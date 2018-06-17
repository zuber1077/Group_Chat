
module.exports = {

    isEmpty: function(obj) {
        for(let Key in obj){
            if(obj.hasOwnProperty(Key)){
                return false;
            }
        }
        return true;
    }
};

