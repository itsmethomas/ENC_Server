/**
 * MessageController
 *
 * @description :: Server-side logic for managing Messages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	send: function (req, res) {
		var myId = req.body.userId;
		var myName = req.body.userName;
		var toId = req.body.friendId;
		var matchId = req.body.matchId;
		var message = req.body.msg;

		var msgInfo = {matchId:matchId, fromId:myId, toId:toId, message:message, isRead:'1'};
		console.log(msgInfo);
		Message.create(msgInfo, function (err, msg) {
			var socketId = sails.sockets.id(req.socket);
			sails.sockets.emit(socketId, 'message_sent', msg);

			Message.sendNotificationWithBadge(toId, 'message_sent', msg, myName + ": " + message, 1);
		});
	},
	messages: function(req, res) {
		var matchId = req.body.matchId;
		var createdDate = req.body.createdDate;

		var condition = {matchId:matchId};
		if (createdDate) {
			condition.createdAt = {'<' : createdDate};
		}

		console.log (condition);
		Message.find(condition).sort({createdAt:-1}).limit(20).exec(function (err, messages) {
			var socketId = sails.sockets.id(req.socket);
			sails.sockets.emit(socketId, 'message_fetched', {msg:messages});
		});
	}
};

