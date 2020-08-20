var LetterOfAuthorizationViewModel = function(show, heading, body)
{
    var self = this;
	self.show = ko.observable(show);

    self.name = ko.observable();
    self.phone = ko.observable();

    self.heading = ko.observable(heading);
	self.body = ko.observable(body);

	// for the signed date that goes into the request
    self.signedDateMonth = ko.observable();
    self.signedDateYear = ko.observable();
    self.signedDateContract = ko.computed(function() {
        var month = self.signedDateMonth() < 10 ? "0" + self.signedDateMonth() : self.signedDateMonth();

        return self.signedDateYear() + "-" + month + "-01";
    });
    self.signedDateSmall = ko.computed(function() {
        var month = self.signedDateMonth() < 10 ? "0" + self.signedDateMonth() : self.signedDateMonth();
        return self.signedDateYear() + "-" + month + "-01";
    });
    self.signedDate = ko.pureComputed({
        read: function() {
            return new Date(self.signedDateSmall() + 'T00:00:00');
        },
        write: function(date) {
            if (typeof date == "object") // only date objects
            {
                self.signedDateYear(date.getFullYear());
                self.signedDateMonth(date.getMonth() + 1); // must offset because of zero-index
            }
        }
    });
};