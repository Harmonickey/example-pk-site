var FilterItemViewModel = function(name, value, isSelected)
{
    var self = this;
    
    self.name = name;
    self.value = value;
    self.isSelected = ko.observable(isSelected);
};