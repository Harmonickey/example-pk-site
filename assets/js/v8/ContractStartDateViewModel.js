var ContractStartDateViewModel = function()
{
    var self = this;
    
    // for the effective date that goes into the request
    self.effectiveDateMonth = ko.observable();
    self.effectiveDateYear = ko.observable();
    self.effectiveDateContract = ko.computed(function() {
        var month = self.effectiveDateMonth() < 10 ? "0" + self.effectiveDateMonth() : self.effectiveDateMonth();
        
        return self.effectiveDateYear() + "-" + month + "-01T00:00:00";
    });
    self.effectiveDateSmall = ko.computed(function() {
        var month = self.effectiveDateMonth() < 10 ? "0" + self.effectiveDateMonth() : self.effectiveDateMonth();
        return self.effectiveDateYear() + "-" + month + "-01";
    });
    self.effectiveDate = ko.pureComputed({
        read: function() {
            return new Date(self.effectiveDateSmall() + 'T00:00:00');     
        },
        write: function(date) {
            if (typeof date == "object") // only date objects
            {
                self.effectiveDateYear(date.getFullYear());
                self.effectiveDateMonth(date.getMonth() + 1); // must offset because of zero-index
            }
        }
    });
    
    // for the verification page
    self.effectiveDateDisplay = ko.computed(function() {
        return self.effectiveDate().toDateString();
    });
    
    // for texas switch date
    self.switchDateDay = ko.observable();
    self.switchDateMonth = ko.observable();
    self.switchDateYear = ko.observable();
    self.switchDateContract = ko.computed(function() {
        var month = self.switchDateMonth() < 10 ? "0" + self.switchDateMonth() : self.switchDateMonth();
        return self.switchDateYear() + "-" + month + "-" + self.switchDateDay() + 'T00:00:00';
    });
    self.switchDateSmall = ko.computed(function() {
        var month = self.switchDateMonth() < 10 ? "0" + self.switchDateMonth() : self.switchDateMonth();
        return self.switchDateYear() + "-" + month + "-" + self.switchDateDay();
    });
    self.switchDate = ko.pureComputed({
        read: function() {
            return new Date(self.switchDateSmall() + 'T00:00:00');     
        },
        write: function(date) {
            if (typeof date == "object") // only date objects
            {
                self.switchDateYear(date.getFullYear());
                self.switchDateMonth(date.getMonth() + 1); // must offset because of zero-index
                self.switchDateDay(date.getDate());
            }
        }
    });
};