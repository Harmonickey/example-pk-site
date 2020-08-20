var CustomerDisclosureStatementViewModel = function() {
    var self = this;

	self.show = ko.observable(false);

    self.heading = ko.observable();
	self.body = ko.observable();

    self.price = ko.observable();
    self.contractTermLength = ko.observable();
    self.contractEffectiveDate = ko.observable();
    self.contractEndDate = ko.computed(function() {
        if (self.contractEffectiveDate()) {
            var effectiveDate = self.contractEffectiveDate();
            var endDate = new Date(effectiveDate.setMonth(effectiveDate.getMonth() + self.contractTermLength()));
            return (endDate.getMonth() + 1) + "/" + endDate.getDate() + "/" + endDate.getFullYear();
        }
    });

    self.acknowledgements = ko.observableArray();
};