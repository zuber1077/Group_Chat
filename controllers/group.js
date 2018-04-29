

module.exports = function(Users, async) {
	return {
		SetRouting: function (router) {
			router.get('/group/:name' ,this.groupPage);
			router.post('/group/:name', this.groupPostPage);
		},

		groupPage: function (req,res) {
			const name = req.params.name;

			async.parallel([
				function (callback) {
					Users.findOne({'username': req.user.username})
					.populate('request.userId')
					.exec((err,result) => {
						callback(err, result);
					})
				}
			], (err, results) => {
				const result1 = results[0];
				
				res.render('groupchat/group' ,{title: 'GPchat - Group ', user:req.user, groupName: name, data: result1});
			});
		},

		groupPostPage: function (req,res) {
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
				res.redirect('/group/'+req.params.name); 
			});
		}
	}
}