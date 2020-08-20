var LocationViewModel = function(customer)
{
    var self = this;

    self.customer = customer;

    self.isNotResidential = ko.observable(false);
    self.finNumberRequired = ko.observable(false); // deprecated

    self.address = ko.observable().extend({
        required: true
    });
    self.address2 = ko.observable(""); // suite/unit/p.o. box
    self.city = ko.observable().extend({
        required: true
    });
    self.stateLong = ko.observable().extend({
        required: true
    });
    self.stateShort = ko.observable();
    self.zipCode = ko.observable();

    self.citiesInZipCode = ko.observable();

    self.isTexas = ko.computed(function() {
        return self.stateLong() == "Texas";
    });

    self.isAGL = ko.observable(false);

    self.isOverrideTexas = ko.observable(false);

    self.lastMonthBillFile = ko.observable();
    self.lastMonthBillFileName = ko.computed(function() {
        if (!self.lastMonthBillFile())
        {
            return "";
        }

        return self.lastMonthBillFile().name;
    });
    self.attachmentId = ko.observable();
    self.accountNumberFormat = ko.observable("");
	self.accountNumberHelp = ko.observable("");
    self.accountNumber = ko.observable().extend({
        checkIsValidAccountNumber: [self.accountNumberFormat, self.isTexas, self.isNotResidential, self.isOverrideTexas, self.isAGL]
    });
	self.accountNumberLabel = ko.observable("");

    self.showAccountNumberFields = ko.computed(function() {
        return ((!self.isTexas() || self.isOverrideTexas())) || self.isNotResidential();  // texas automatically grabs account numbers from address
    });

    self.showMeterNumber = ko.observable(false);
	self.meterNumFormat = ko.observable("");
	self.meterNumFormatHelp = ko.observable("");

    self.showNameKey = ko.observable(false);
	self.nameKeyFormat = ko.observable("");
	self.nameKeyFormatHelp = ko.observable("");

    self.showReferenceNumber = ko.observable(false);
	self.referenceNumFormat = ko.observable("");
	self.referenceNumberFormatHelp = ko.observable("");

    self.meterNumber = ko.observable().extend({
        checkIsValidReferenceNumber: [self.meterNumFormat, self.showMeterNumber]
    });
    self.nameKey = ko.observable().extend({
        checkIsValidReferenceNumber: [self.nameKeyFormat,self.showNameKey]
    });
    self.referenceNumber = ko.observable().extend({
        checkIsValidReferenceNumber: [self.referenceNumFormat, self.showReferenceNumber]
    });
	/*** Deprecated, no longer validating ***/
	self.finNumber = ko.observable();

    self.currentSupplier = ko.observable();
    self.annualUsage = ko.observable();

    self.init = function(zipCode, citiesInZipCode, stateLong, stateShort, annualUsage, isNotResidential, provider, showTaxId, finNumber, isOverrideTexas, isAGL)
    {
        self.isAGL(isAGL);
		self.isNotResidential(isNotResidential);
        self.zipCode(zipCode);
        self.citiesInZipCode(citiesInZipCode);
        self.stateLong(stateLong);
        self.stateShort(stateShort);
        self.annualUsage(annualUsage);
        self.isOverrideTexas(isOverrideTexas);

        self.accountNumberFormat(provider.accountNumFormat);
        if (self.isAGL() && !self.isNotResidential()) {
            self.accountNumberHelp('If you are a new move-in customer in GA with no account number or a bill in hand, keep this field blank. ' + provider.accountNumHelp);
        } else {
            self.accountNumberHelp(provider.accountNumHelp);
        }
        self.accountNumberLabel(provider.accountNumLabel);

		self.showMeterNumber(provider.showMeterNum);
		self.meterNumFormat(provider.meterNumFormat);
		self.meterNumFormatHelp(provider.meterNumFormatHelp);

        self.showNameKey(provider.showNameKey);
		self.nameKeyFormat(provider.nameKeyFormat);
		self.nameKeyFormatHelp(provider.nameKeyFormatHelp);

        self.showReferenceNumber(provider.showReferenceNum);
		self.referenceNumFormat(provider.referenceNumFormat);
        self.referenceNumberFormatHelp(provider.referenceNumFormatHelp);

		self.finNumberRequired(showTaxId); // deprecated
		self.finNumber(finNumber); // deprecated
    };

    self.address.subscribe(function() {
        globalCustomerViewModel.errors.showAllMessages(false);
    });

	self.accountNumber.subscribe(function() {
		globalCustomerViewModel.errors.showAllMessages(false);
    });
};