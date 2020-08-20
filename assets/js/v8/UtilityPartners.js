var UtilityPartners = function()
{
	var self = this;
	
	self.partners = ko.observableArray();
	
	self.filteredPartners = ko.observableArray();
	
	self.filterQuery = ko.observable();
	if ((location.hostname == "powerkioskdirect.com" || location.hostname == "lbkstudios.net") && location.pathname.indexOf("utility") == -1 && location.pathname.indexOf("partners") == -1)
	{
		$.ajax({
			url: location.origin + location.pathname + "utility_partners.txt",
			type: "GET",
			success: function(res) {
				var pairs = res.split("\n");
						
				for (var i = 0; i < pairs.length; i++)
				{
					var pair = pairs[i].split(",");
					var name = pair[0];
					var path = pair[1];
					
					self.partners.push(new EntityViewModel(name, path));
				}
				
				self.partners.sort(function(a, b) {
					return (a.name < b.name ? -1 : 1);
				});
				
				self.filteredPartners(self.partners());
			}
		});
	}
	
	self.filterQuery.subscribe(function(query) {
		self.filteredPartners(ko.utils.arrayFilter(self.partners(), function(partner) {
			return partner.name.toLowerCase().match(query.toLowerCase()) != null;
		}));
	});
};