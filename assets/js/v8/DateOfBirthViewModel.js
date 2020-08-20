var DateOfBirthViewModel = function(showDOB)
{
    var self = this;
    
	self.showDOB = ko.observable(showDOB);
	
    self.day = ko.observable().extend({
        required: {
            onlyIf: function() {
                return self.showDOB();
            }
        }
    });
    self.month = ko.observable().extend({
        required: {
            onlyIf: function() {
                return self.showDOB();
            }
        }
    });
    self.year = ko.observable().extend({
        required: {
            onlyIf: function() {
                return self.showDOB();
            }
        }
    });
};