NEWSCHEMA('Contact').make(function(schema) {

	schema.define('id', 'String(20)');
	schema.define('firstname', 'Camelize(40)', true);
	schema.define('lastname', 'Camelize(40)', true);
	schema.define('email', 'Email', true);
	schema.define('body', String, true);
	schema.define('phone', 'Phone');
	schema.define('language', 'Lower(2)');
	schema.define('ip', 'String(80)');

	// Saves the model into the database
	schema.setSave(function(error, model, options, callback) {

		model.id = UID();
		model.datecreated = F.datetime;

		NOSQL('contactforms').insert(model.$clean());
		MODULE('webcounter').increment('contactforms');
		// This is required for avoid server responding with a http 408 (request timeout)
		callback(SUCCESS(true));

		F.emit('contact.save', model);

		// Sends email
		// var mail = F.mail(F.config.custom.emailcontactform, '@(Contact form #) ' + model.id, '=?/mails/contact', model, model.language || '');
		// mail.reply(model.email, true);
	});
});