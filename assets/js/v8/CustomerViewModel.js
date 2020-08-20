var CustomerViewModel = function()
{
    var self = this;

    self.getHeader = function()
    {
        return $.ajaxSettings.headers && $.ajaxSettings.headers["API-Key"]
            ? { 'Authorization': 'Bearer ' + $.ajaxSettings.headers["API-Key"] }
            : { 'Authorization': 'Bearer ' + API_KEY };
    };

    self.isNotResidential = ko.observable(false);
    self.isGas = ko.observable(false);

    self.legalEntityName = ko.observable("").extend({
        required: {
            onlyIf: function() {
                return self.isNotResidential();
            }
        }
    });

    self.firstName = ko.observable("").extend({
        required: true
    });
    self.middleName = ko.observable("");
    self.lastName = ko.observable("").extend({
        required: true
    });
    self.fullName = ko.computed(function() {
        return self.firstName() + " " + (self.middleName() ? self.middleName() + " " : "") + self.lastName();
    });
    self.title = ko.observable("").extend({
        required: {
            onlyIf: function() {
                return self.isNotResidential();
            }
        }
    });

    self.phone = ko.observable("").extend({
        checkIsValidPhoneNumber: true
    });

    self.mobile = ko.observable("").extend({
        checkIsValidPhoneNumber: true
    });

    self.fax = ko.observable();
    self.email = ko.observable("").extend({
        checkIsValidEmail: true
    });

    self.bulkAccountNumberFile = ko.observable();
    self.hasMultipleAccountNums = ko.observable(false);

    self.accountNumberLabel = ko.observable("");
    self.accountNumberFormat = ko.observable("");
    self.accountNumberHelp = ko.observable("");
    self.aglAccountNumberHelp = ko.observable("");

    self.sampleBillAttachmentId = ko.observable();

    self.isOverrideTexas = ko.observable(false);

    // extra fields
    self.provider = ko.observable({});

    self.finNumberRequired = ko.observable(false);
	self.finNumber = ko.observable().extend({
        required: {
            onlyIf: function() {
                return self.finNumberRequired();
            }
        }
    });

    // reference for location init
    self.zipCode = ko.observable();
    self.citiesInZipCode = ko.observable();
    self.stateLong = ko.observable();
    self.stateShort = ko.observable();
    self.annualUsage = ko.observable();

	self.isTexas = ko.computed(function() {
        return self.stateLong() == "Texas";
    });

    self.isGeorgia = ko.computed(function() {
        return self.stateLong() == "Georgia";
    });

    self.isAGL = ko.computed(function() {
        return self.provider().utilityId == AGL_UTILITYID;
    });

    self.dwellingTypes = ko.observable(['Apartment', 'House']);
	self.dwellingType = ko.observable().extend({
        required: {
            onlyIf: function() {
                return self.isTexas() && !self.isNotResidential();
            }
        }
    });

    self.language = ko.observable("english");

    self.billingAddressShow = ko.observable(false);

    self.authorizedUser = ko.observable();

    /**** if self.billingAddressShow() == true then use these variables *****/
    self.billingAddressAddress = ko.observable().extend({
        required: {
            onlyIf: function() {
                return self.billingAddressShow();
            }
        }
    });
    self.billingAddressAddress2 = ko.observable();
    self.billingAddressZipCode = ko.observable().extend({
        required: {
            onlyIf: function() {
                return self.billingAddressShow();
            }
        }
    });
    self.billingAddressZipCodeEnabled = ko.observable(true);
    self.billingAddressZipCodeAlert = ko.observable();
    self.billingAddressCity = ko.observable().extend({
        required: {
            onlyIf: function() {
                return self.billingAddressShow();
            }
        }
    });
    self.billingAddressCitiesInZipCode = ko.observableArray();
    self.billingAddressStateLong = ko.observable().extend({
        required: {
            onlyIf: function() {
                return self.billingAddressShow();
            }
        }
    });
    self.billingAddressStateShort = ko.observable();
    self.billingAddressStateId = ko.observable();
    self.billingAddressShowCityState = ko.observable(false);

    /*******************************************************************/


    self.GetBillingAddressCitiesInZipCode = function()
    {
        $.ajax(
        {
            type: 'GET',
            beforeSend: function()
            {
                self.billingAddressShowCityState(false);
                self.billingAddressZipCodeEnabled(false);
            },
            url: BASE_API_URL + "/zip-codes/" + self.billingAddressZipCode(),
            headers: self.getHeader(),
            success: function(result)
            {
                if (result.message == null)
                {
                    self.billingAddressZipCodeAlert("Unable to Find Zip Code");
                }
                else
                {
                    self.billingAddressCitiesInZipCode(result.message.city);
                    self.billingAddressStateLong(result.message.stateLong);
                    self.billingAddressStateShort(result.message.stateShort);
                    self.billingAddressStateId(result.message.stateId);
                    self.billingAddressShowCityState(true);
                }
            },
            complete: function()
            {
                self.billingAddressZipCodeEnabled(true);
            }
        });
    };

    self.billingAddressZipCode.subscribe(function(value)
    {
        if (value.length == 5)
        {
            self.GetBillingAddressCitiesInZipCode();
        }
    }, 'afterChange', null); // only get the cities when self.billingAddressZipCode() has the new value already

    self.supplier = ko.observable(new RateViewModel({}, self.annualUsage()), self.isNotResidential(), null, self.isTexas(), self.isGeorgia(), self.isGas());

    // to set customer info we only really need the supplier and provider information
    self.initProviderInfo = function(provider, stateLong, stateShort, isNotResidential, zipCode, citiesInZipCode, annualUsage, isGas)
    {
        self.provider(provider);

        self.accountNumberFormat(provider.accountNumFormat);
        self.accountNumberLabel(provider.accountNumLabel);
        self.accountNumberHelp(provider.accountNumFormatHelp);
        if (self.isAGL() && !self.isNotResidential()) {
            self.aglAccountNumberHelp('If you are a new move-in customer in GA with no account number or a bill in hand, keep this field blank.');
        }

		// sample bill
        self.getSampleBill();

		// state references
        self.isNotResidential(isNotResidential);
        self.zipCode(zipCode);
        self.citiesInZipCode(citiesInZipCode);
        self.stateLong(stateLong);
        self.stateShort(stateShort);
        self.annualUsage(annualUsage);
        self.isGas(isGas);

        self.locations()[0].init(zipCode, citiesInZipCode, stateLong, stateShort, annualUsage,
            self.isNotResidential(), self.provider(), self.finNumberRequired(), self.finNumber(),
            self.isOverrideTexas(), self.isAGL());
    };

    self.initSupplierInfo = function(supplier, showTaxId, energyUnit, stateId, utilityId, rateClass)
    {
        self.supplier(supplier, self.annualUsage(), self.isNotResidential(), energyUnit, self.isTexas(), self.isGeorgia(), self.isGas());
        self.finNumberRequired(showTaxId && self.isNotResidential());

		// deprecated
		for (var i = 0; i < self.locations().length; i++)
		{
			self.locations()[i].finNumberRequired(showTaxId && self.isNotResidential());
        }
    };

    self.getSampleBill = function() {
      self.sampleBillAttachmentId("");
      $.ajax({
        type: 'GET',
        url: BASE_API_URL + "attachments?filter[where][utilityId]=" + self.provider().utilityId + "&filter[where][attachmentTypeId]=4028d1e43f4cd717013f54e709170056",
        headers: self.getHeader(),
        success: function(result) {
          if (result && result.message && result.message.length) {
            self.sampleBillAttachmentId((result.message[0].attachmentId ? BASE_URL + '/attachments/' + result.message[0].attachmentId + '/view?access_token=' + API_KEY : ""));
          }
        }
      });
    };

    self.locations = ko.observableArray([new LocationViewModel(self)]);

    self.AddLocation = function()
    {
        self.locations.push(new LocationViewModel(self));
        self.locations()[self.locations().length - 1].init(self.zipCode(), self.citiesInZipCode(), self.stateLong(), self.annualUsage(),
            self.isNotResidential(), self.provider(), self.finNumberRequired(), self.finNumber(),
            self.isOverrideTexas(), self.isAGL());
    };

    self.RemoveLocation = function(loc)
    {
        self.locations.remove(loc);
    };

    self.legalEntityName.subscribe(function() {
        globalCustomerViewModel.errors.showAllMessages(false);
    });

    self.title.subscribe(function() {
        globalCustomerViewModel.errors.showAllMessages(false);
    });

    self.firstName.subscribe(function() {
        globalCustomerViewModel.errors.showAllMessages(false);
    });

    self.lastName.subscribe(function() {
        globalCustomerViewModel.errors.showAllMessages(false);
    });

    self.billingAddressAddress.subscribe(function() {
        globalCustomerViewModel.errors.showAllMessages(false);
    });

    self.billingAddressZipCode.subscribe(function() {
        globalCustomerViewModel.errors.showAllMessages(false);
    });

	self.phone.subscribe(function() {
		globalCustomerViewModel.errors.showAllMessages(false);
    });

    self.mobile.subscribe(function() {
		globalCustomerViewModel.errors.showAllMessages(false);
	});

	self.email.subscribe(function() {
		globalCustomerViewModel.errors.showAllMessages(false);
	});

	self.dwellingType.subscribe(function() {
		globalCustomerViewModel.errors.showAllMessages(false);
	});

	self.finNumber.subscribe(function(newValue) {
		// deprecated
		for (var i = 0; i < self.locations().length; i++)
		{
			self.locations()[i].finNumber(newValue);
		}
    });

    self.isOverrideTexas.subscribe(function(newValue) {
        for (var i = 0; i < self.locations().length; i++)
		{
			self.locations()[i].isOverrideTexas(newValue);
		}
    });
};