var ServiceTypeViewModel = function(name, serviceTypeId, defaultUsage, defaultUsageCanada, units) 
{
    var self = this;
    
    self.name = name;
    self.serviceTypeId = serviceTypeId;
    self.defaultUsage = defaultUsage;
    self.defaultUsageCanada = defaultUsageCanada;
    self.units = units;
    self.icon = ko.computed(function() 
    {
        if (serviceTypeId == GAS_SERVICE_ID) // gas
        {
            return "fa-fire";
        }
        else
        {
            return "fa-bolt";
        }
    });
};