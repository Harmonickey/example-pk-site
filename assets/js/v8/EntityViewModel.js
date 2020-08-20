var EntityViewModel = function(name, value, originalEntity)
{
    var self = this;
    
    self.name = name;
	self.nameDisplay = name;
    self.value = value;
    self.entity = (originalEntity ? originalEntity : null);
};