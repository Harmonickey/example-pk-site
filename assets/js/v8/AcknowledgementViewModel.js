var AcknowledgementViewModel = function(acknowledgement) {
	var self = this;

	self.consumerBillOfRights = acknowledgement.consumerBillOfRights;
	self.termsOfServiceTop = acknowledgement.heading;
	self.termsOfServiceBottom = acknowledgement.footer;

	self.acknowledgedMessage = acknowledgement.acknowledgedMessage;
	self.unacknowledgedMessage = acknowledgement.unacknowledgeMessage;

	self.info = acknowledgement.body;
	self._acknowledged = ko.observable((!acknowledgement.requiresAcknowledgement ? true : false));
	self.acknowledged = ko.computed({
		read: function() {
			return (!acknowledgement.requiresAcknowledgement ? !self._acknowledged() : self._acknowledged());
		},
		write: function(newValue) {
			self._acknowledged(!acknowledgement.requiresAcknowledgement ? !newValue : newValue);
		}
	});
};