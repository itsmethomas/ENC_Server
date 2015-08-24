/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
		
	attributes: {
		matchId: {
			type: 'string',
		},
		ownerId: {
			type: 'string',
		},
		inviterId: {
			type: 'string',
		},
		ownerInfo: {
			type: 'json'
		},
		inviterInfo: {
			type: 'json'
		},
		flagTime: {
			type: 'string',
		},
		flagDoor: {
			type: 'string',
		},
		flagEnvironment: {
			type: 'string',
		},
		meetingDate: {
			type: 'date',
		},
		meetingLocation: {
			type: 'json',
		},
		status: {
			type: 'string',
		},
	}
};