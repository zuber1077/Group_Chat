module.exports = function(async, Users, Message, FriendResult) {
    return {
        SetRouting: function (router) {
			router.get('/settings/userinfo', this.getUserInfoPage);
			router.post('/settings/userinfo', this.postUserInfoPage);
        },

        getUserInfoPage: function (req, res) {
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
				}

			], (err, results) => {
				const result1 = results[0];
				const result2 = results[1];
				
				res.render('user/userinfo' ,{title: 'GPchat - UserInfo ', user:req.user,data: result1, chat: result2});
			});
		},
		postUserInfoPage: function(req,res) {
			FriendResult.PostRequest(req, res, '/settings/userinfo');

			// hobby
			async.parallel([
				function (callback) {
					if(req.body.Hobby){
						Users.update({
							'_id':req.user._id,
							'Hobby.HobbyNames': {$ne: req.body.Hobby}
						}, 
						{
							$push: {Hobby: {
								HobbyNames: req.body.Hobby
							}}
						},(err, result1) => {
							console.log(result1);
							callback(err, result1);
						})
					}
				}
			], (err, results) => {
				res.redirect('/settings/userinfo');
			});

			// profecinal
			async.parallel([
				function (callback) {
					if(req.body.Profecinal){
						Users.update({
							'_id':req.user._id,
							'Profecinal.ProfecinalNames': {$ne: req.body.Profecinal}
						}, 
						{
							$push: {Profecinal: {
								ProfecinalNames: req.body.Profecinal
							}}
						},(err, result2) => {
							console.log(result2);
							callback(err, result2);
						})
					}
				},
			], (err, results) => {
				res.redirect('/settings/userinfo');
			});

			// FavGroup
			async.parallel([
				function (callback) {
					if(req.body.FavGroup){
						Users.update({
							'_id':req.user._id,
							'FavGroup.GroupName': {$ne: req.body.FavGroup}
						}, 
						{
							$push: {FavGroup: {
								GroupName: req.body.FavGroup
							}}
						},(err, result3) => {
							console.log(result3);
							callback(err, result3);
						})
					}
				},
			], (err, results) => {
				res.redirect('/settings/userinfo');
			});
		}
			
  }
}


