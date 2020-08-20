var AgentViewModel = function()
{
    var self = this;
    
    self.getSplitPhone = function(phone)
    {
        return String(phone)
        .replace(/-|\.|\(|\)/g, "")
        .replace(/ /g, "")
        .split("");
    };

    self.formatPhone = function(phone)
    {
        if (!phone) return "";

        if (phone.match(/[a-z]/i)) {
            return phone;
        }
        
        var splitPhone = self.getSplitPhone(phone);
  
        return "+1 (" + splitPhone[0] + splitPhone[1] + splitPhone[2] + ") " 
                   + splitPhone[3] + splitPhone[4] + splitPhone[5] + "-" 
                   + splitPhone[6] + splitPhone[7] + splitPhone[8] + splitPhone[9];
    };
	
	self.formatPhoneTel = function(phone)
    {
        if (!phone) return "";
        
        var splitPhone = self.getSplitPhone(phone);
  
        return "+1-" + splitPhone[0] + splitPhone[1] + splitPhone[2] + "-" 
                   + splitPhone[3] + splitPhone[4] + splitPhone[5] + "-" 
                   + splitPhone[6] + splitPhone[7] + splitPhone[8] + splitPhone[9];
    };
	
    self.phoneNumber = ko.observable();
	
	self.phoneNumberTel = ko.observable();
    self.email = ko.observable();
    self.agentId = ko.observable();
    self.customerCompany = ko.observable();
    self.agentDomainAlias = ko.observable();
};