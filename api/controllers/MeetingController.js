 /**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	myMeetings: function (req, res) {
		var userId = req.body.userId;
		var status = req.body.status;

		var condition = {};
		if (status == 'draft') {
			condition.status = 'draft';
			condition.ownerId = userId;
		} else if (status == 'scheduled') {
			condition.status = 'scheduled';
			condition.inviterId = userId;
		} else {
			condition = {
				$or:[{ownerId:userId}, {inviterId:userId}],
				status:status
			};
		}

		console.log(condition);

		Meeting.find(condition, function (err, meetings) {
			res.end(JSON.stringify({success:true, msg:meetings}));
		});
	},
	saveMeeting: function (req, res) {
	  	var meetingInfo = req.body;
	  	if (meetingInfo.id == null) {
	  		Meeting.create(meetingInfo, function (err, result) {
	  			Match.findOne({id:meetingInfo.matchId}, function (err, match) {
			  		match.scheduled = 'YES';
			  		match.meetingId = result.id;
			  		Match.update({id:match.id}, match).exec(function (err, match){});
			  	});
	  			res.end(JSON.stringify({success:true, msg:result}));
	  		});
	  	} else {
	  		Meeting.update({id:meetingInfo.id}, meetingInfo).exec(function (err, result) {
	  			Match.findOne({id:meetingInfo.matchId}, function (err, match) {
			  		match.scheduled = 'YES';
			  		match.meetingId = result.id;
			  		Match.update({id:match.id}, match).exec(function (err, match){});
			  	});
	  			res.end(JSON.stringify({success:true, msg:result}));
	  		});
	  	}
	},
	updateStatus: function (req, res) {
		var userId = req.body.userId;
		var meetingId = req.body.meetingId;
		var status = req.body.status;

		Meeting.findOne({id:meetingId}, function (err, meetingInfo) {
			meetingInfo.status = status;
			Meeting.update ({id:meetingInfo.id}, meetingInfo).exec(function(err, result) {
				res.end(JSON.stringify({success:true, msg:result[0]}));
			});
		})
	}
};

