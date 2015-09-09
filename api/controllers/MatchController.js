 /**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	like: function (req, res) {
		//console.log(User.create(req.body).done);
		var userId = req.body.userId;
		var partnerId = req.body.partnerId;
		var status = req.body.status;

		var userInfo = req.body.userInfo;

		// load Partner User Info
		User.findOne({id:partnerId}, function (err, partnerInfo) {
			if (partnerInfo == null) {
				res.end(JSON.stringify({success:false, msg:"User does not exist."}));
			} else {
				// Match Init...
				Match.findOne({$or:[{"ownerId":userId, "inviterId":partnerId}, {"ownerId":partnerId, "inviterId":userId}]}, function(err, match) {
					if (err == null && match != null) {
						// If Match already exist, update Match.
						var isOwner = partnerInfo.ownerId == userId;
						if (match.status == 'liked' && status == 'liked') {
							match.status = 'matched';
						} else {
							match.status = 'refused';
						}
						Match.update({id:match.id}, match).exec(function (err, result) {});
						res.end(JSON.stringify({success:true, msg:match}));

						// send a push notification.
						var friendName = null;
						var deviceToken = null;
						if (isOwner) {
							friendName = match.ownerInfo.name;
							deviceToken = match.inviterInfo.deviceToken;
						} else {
							friendName = match.inviterInfo.name;
							deviceToken = match.ownerInfo.deviceToken;
						}

						var pushMsg = "You & " + friendName + " have liked each other.";
						console.log(pushMsg);
						console.log(deviceToken);
						Message.sendPush(deviceToken, pushMsg);

					} else {
						if (err != null) {
							res.end(JSON.stringify({success:false, msg:"Server Error Occured."}));
						} else {
							// If match not exist, create.
							var matchInfo = {
								ownerId:userId,
								inviterId:partnerId,
								ownerInfo:userInfo,
								inviterInfo:partnerInfo,
								status:status
							};

							Match.create(matchInfo, function (err, resMatch) {
								if (err == null) {
									res.end(JSON.stringify({success:true, msg:resMatch}));
								} else {
									res.end(JSON.stringify({success:false, msg:"Server Error Occured."}));
								}
							});
						}
					}
				});
			}
		});
	},
	myMatches: function (req, res) {
	  	var userId = req.body.userId;
		Match.find({$or:[{"ownerId":userId}, {"inviterId":userId}], status:'matched'}, function(err, matches) {
			if (err == null) {
				res.end(JSON.stringify({success:true, msg:matches}));
			} else {
				res.end(JSON.stringify({success:false, msg:"Server Error Occured."}));
			}
		});
	}
};

