/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
		
	attributes: {
		ownerId: {
			type: 'string',
			required: true,
		},
		inviterId: {
			type: 'string',
			required: true
		},
		ownerInfo: {
			type: 'json'
		},
		inviterInfo: {
			type: 'json'
		},
		status: {
			type: 'string'
		},
		scheduled: {
			type: 'string'
		},
		meetingId: {
			type: 'string'	
		}
	}
};