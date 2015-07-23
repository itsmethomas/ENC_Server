/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
		
	attributes: {
		name: {
			type: 'string',
			required: true
		},
		facebookId: {
			type: 'string',
			required: true,
		},
		email: {
			type: 'email', // Email type will get validated by the ORM
			required: true
		},
		deviceToken: {
			type: 'string',
			required:true,
		},
		photoUrls: {
			type: 'json'
		},
		bioWords: {
			type: 'json'
		},
		birthDate: {
			type: 'date'
		},
		gender: {
		},
		settings: {
			type: 'json'
		},
		isEducated: {
			type: 'string'
		},
		isEmployed: {
			type: 'string'
		},
		location: {
			type: 'json'
		},
		session_id: {
			type: 'string'
		},
		status: {
			type: 'string'
		}
	}
};