/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	login: function (req, res) {
		//console.log(User.create(req.body).done);
		var facebookId = req.body.facebookId;

		console.log (req.body);

		User.findOne({"facebookId":facebookId}, function(err, user) {
			if (err == null && user != null) {
				user.deviceToken = req.body.deviceToken;

				User.update({"id":user.id}, user).exec(function (err, result) {});
				res.end(JSON.stringify({success:true, userInfo:user}));
			} else {
				res.end(JSON.stringify({success:false, msg:"User does not exist."}));
			}
		});
	  },
	signup: function (req, res) {
		var userInfo = req.body.userInfo;
		var facebookId = userInfo.facebookId;

		console.log (req.body);

		User.findOne({"facebookId":facebookId}, function(err, user) {
			if (err == null && user != null) {
				res.end(JSON.stringify({success:true, userInfo:userInfo}));
			} else {
				var protocol = req.connection.encrypted?'https':'http';
				var baseUrl = protocol + '://' + req.headers.host + '/';
				userInfo.photoUrls = ['', '', ''];
				var fs = require('fs');

				for (var i=0; i<userInfo.photos.length; i++) {
					var filePath = './assets/photos/' + facebookId + '_' + i + '.jpg';
					fs.writeFile(filePath, userInfo.photos[i], 'base64', function (err) {
						console.log(err);
					});

					userInfo.photoUrls[i] = baseUrl + 'photos/' + facebookId + '_' + i + '.jpg';
				}
				
				User.create(userInfo, function(err, user) {
					if (err == null) {
						res.end(JSON.stringify({success:true, msg:user}));
					} else {
						console.log(err);
						res.end(JSON.stringify({success:false, msg:"Internal Server Error."}));
					}
				});
			}
		});
	  },
	fetchUserProfile: function (req, res) {
		  var userId = req.param('userId');
		  User.find ({"id":userId}, function(err, users) {
			if (users.length > 0) {
				res.end(JSON.stringify({success:"YES", userinfo:users[0]}));
			} else {
				res.end(JSON.stringify({success:"User does not exist."}));
			}
		});
	  },
	photos: function (req, res) {
		  var userId = req.param('userId');

		  UserPhotos.find({"userId":userId}, function(err, photos) {
			  if (err == null)
			  {
				  res.write('{"status":"ok", "photos":' + JSON.stringify(photos) + '}');
			  }
			  else
			  {
				  res.write('{"status":"error", "content":"' + err + '"}');
			  }
			  res.end();
		  });
	},
	explore: function (req, res) {
		var startDate = new Date();
		var endDate = new Date();
		startDate.setYear(startDate.getYear() - req.body.age[1]);
		endDate.setYear(endDate.getYear() - req.body.age[0]);

		console.log(req.body.location);
		var condition = {
			// location:{
			// 	$geoWithin:{
			// 		$centerSphere:[
			// 			[req.body.location[0][0],
			// 			req.body.location[0][1]
			// 			], req.body.location[1]
			// 		]
			// 	}
			// },
			birthDate: {$gte:startDate, $lt:endDate}
		}

		if (req.body.gender != 'all') {
			//condition.gender = req.body.gender;
		}

		console.log(req.body); 
		console.log(condition);
		User.find(condition).exec(function(err, users) {
			if (err == null){
				res.write('{"status":"ok", "users":' + JSON.stringify(users) + '}');
			} else {
				res.write('{"status":"error", "content":"' + err + '"}');
			}
			res.end();
		});
	},
	savePhoto: function (req, res) {
		var reqJSON = req.body;
		var photos = reqJSON.photos;
		var userId = reqJSON.userId;
		
		UserPhotos.destroy({"userId":userId}, function (err, result) {
			for (var i=0; i<photos.length; i++)
			{
				var photoItem = photos[i];
				photoItem.userId = userId;
			}
			UserPhotos.create(photos, function(err, photos) {
				if (err == null)
				{
					res.write('{"status":"ok", "photos":' + JSON.stringify(photos) + '}');
				}
				else
				{
					res.write('{"status":"error", "content":"' + err + '"}');
				}
				res.end();
			});
		});
	},
	saveSettings: function (req, res) {
		var reqJSON = req.body;
		var userId = reqJSON.userId;
		User.findOne({id:userId}, function (err, user) {
			if (user) {
				user.settings = reqJSON.settings;
				User.update({id:user.id}, user).exec(function (err, result){
					res.end(JSON.stringify({status:"ok"}));
				});
			}
		});
	},
	saveProfilePhoto: function (req, res) {
		var userId = req.body.userId;
		var photoUrl = req.body.photoUrl;
		User.findOne({"id":userId}, function(err, user) {
			console.log(err);
			if (err) {
				res.end('{"err":"failed"}');
			} else {
				user.photoUrl = photoUrl;
				User.update({"id":user.id}, user).exec(function (err, result) {
					res.end('{"success":"yes"}');
				});
			}
		});
	}
};
 
