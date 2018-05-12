

module.exports = function(Users, async, Message, FriendResult, Group) {
	return {
		SetRouting: function (router) {
			router.get('/group/:name' ,this.groupPage);
			router.post('/group/:name', this.groupPostPage);

			router.get("/logout", this.logout);
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
				},

				function(callback) {
					const nameRegex =  new RegExp("^" + req.user.username.toLowerCase(), "i");
					Message.aggregate(
						//math every doc thet has sender name and reciver name
						//{or} if doest find 1st data in the 1st obj use 2nd
						{$match:{$or:[{'senderName':nameRegex}, {'receiverName':nameRegex}]}},
						{$sort:{"createdAt":-1}},
						{
							$group:{'_id':{
								"last_message_between":{
									$cond:[//array {operator}
										{//obj
											$gt:[
												{$substr:["$senderName",0,1]},
												{$substr:["$receiverName",0,1]}]
										},
											{$concat:["$senderName"," and ","$receiverName"]},
											{$concat:["$receiverName"," and ","$senderName"]}
									]
								}
							}, "body": {$first:"$$ROOT"}
							}
						}, function(err, newResult) {
							//console.log(newResult);
							callback(err, newResult);
						}
					)
				},

			], (err, results) => {
				const result1 = results[0];
				const result2 = results[1];
				
				res.render('groupchat/group' ,{title: 'GPchat - Group ', user:req.user, groupName: name, data: result1, chat: result2});
			});
		},

		groupPostPage: function (req,res) {
			FriendResult.PostRequest(req, res, '/group/'+req.params.name);

			// saving group chat message in Db
			async.parallel([
				function (callback) {
					if(req.body.message){
						const group = new Group();
						group.sender = req.user._id;
						group.body = req.body.message;
						group.name = req.body.groupName
						group.createdAt = new Date();

						group.save((err, msg) => {
							console.log(msg);
							callback(err, msg);
						})
					}
				}
			], (err, results) => {
				res.redirect('/group/'+req.params.name);
			});
		},
		
		logout: function (req,res) {
          req.logout();
          req.session.destroy((err,) =>{
            res.redirect('/');
          });
      }
	}
}