module.exports = function(async, Users, Message) {
    return {
        PostRequest: function(req, res, url) {
            	async.parallel([ 
				function (callback) {
					if(req.body.receiverName){ //if exist 
						Users.update({ 
							'username': req.body.receiverName, //look for doc whose username is equal
							'request.userId': {$ne:req.user._id}, //make sure request id exit
							'friendsList.friendId': {$ne: req.user._id} //
						},
						
						{ //if not exist
							$push: {request: { //push to request object 
								userId: req.user._id,
								username: req.user.username
							}},
							$inc: {totalRequest: 1} //value enqriment by 1
						},(err, count) => { //
							callback(err, count);
						})
					}
				},

				function (callback) { //sender
					if(req.body.receiverName){
						Users.update({
							'username': req.user.username,
							'sentRequest.username': {$ne: req.body.receiverName} //checking sent req
						},
						{ //if not
							$push: {sentRequest: { //update
								username: req.body.receiverName //not add 
							}}
						}, (err,count) => {
							callback(err,count);
						})
					}
				}

			], (err,results) => {
                res.redirect(url); //'/group/'+req.params.name
			});

			async.parallel([ //updating z friend list object aray //for reciver request
				function (callback) {
					//this function is for updated 4 z reciver of z friend request whrn it is accpted
					if(req.body.senderId){
						Users.update({ //check doc inside user collection 
							'_id': req.user._id,
							'friendsList.friendId': {$ne: req.body.senderId}
						}, {
							$push: {friendsList: {
								friendId: req.body.senderId,
								friendName: req.body.senderName
							}},
							//remove data from db //aray
							$pull: {request: {
								userId: req.body.senderId,
								username: req.body.senderName
							}},
							//total request value increce by 1
							$inc: {totalRequest: -1}
						}, (err, count) => {
							callback(err, count);
						});
					}
				},
				function (callback) {
					//this function is for updated 4 sender of z friend request whrn it is accpted by z receiver
					if(req.body.senderId){
						Users.update({ //update user doc inside user collection //reciver f R
							'_id': req.body.senderId,
							'friendsList.friendId': {$ne: req.user._id}
						}, { //push data to friend list 
							$push: {friendsList: {
								friendId: req.user._id,
								friendName: req.user.username
							}},
							//remove data from db //aray
							$pull: {sentRequest: {
								username: req.user.username
							}},
						}, (err, count) => {
							callback(err, count);
						});
					}
				},	

				function (callback) {
					if(req.body.user_Id){
						Users.update({ 
							'_id': req.user._id,
							'request.userId': {$eq: req.body.user_Id}
						}, { 
							//remove data from db //aray
							$pull: {request: {
								userId: req.body.user_Id
							}},
							$inc: {totalRequest: -1}
						}, (err, count) => {
							callback(err, count);
						});
					}
				},
				function (callback) {
			
					if(req.body.user_Id){
						Users.update({ 
							'_id': req.body.user_Id,
							'sentRequest.username': {$eq: req.user.username}
						}, { 
							//remove data from db //aray
							$pull: {sentRequest: {
								username: req.user.username
							}}
						}, (err, count) => {
							callback(err, count);
						});
					}
                },
                
                 function (callback) {
					if(req.body.chatId){
						Message.update({
							'_id': req.body.chatId
						},
						{
							"isRead": true
						}, (err, done) => {
							console.log(done);
							callback(err, done);
						})	
					}
				}

			], (err, results) => {
                res.redirect(url); //'/group/'+req.params.name
			});
        }
    }
}