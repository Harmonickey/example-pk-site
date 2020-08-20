var SpecialNoticeViewModel = function() {
  var self = this;

	self.show = ko.observable(false);
  self.heading = ko.observable();
	self.acknowledgements = ko.observableArray();
};