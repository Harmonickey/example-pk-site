var RateClassViewModel = function(rc)
{
    var self = this;

    self.name = rc.name;
    self.description = rc.description;
    self.optionDisplay = self.name + " (" + self.description + ")";
    self.isDefault = rc.isDefault;
};