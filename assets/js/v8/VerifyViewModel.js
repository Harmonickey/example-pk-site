var VerifyViewModel = function()
{
	var self = this;

	self.getHeader = function()
    {
        return $.ajaxSettings.headers && $.ajaxSettings.headers["API-Key"]
            ? { 'Authorization': 'Bearer ' + $.ajaxSettings.headers["API-Key"] }
            : { 'Authorization': 'Bearer ' + API_KEY };
    };

	self.disclaimerErrorMessage = ko.observable();
	self.isNotResidential = ko.observable(false);
	self.customer = ko.observable();
	self.stateId = ko.observable();
	self.rateClass = ko.observable();
	self.serviceTypeId = ko.observable();
	self.utilityAccountNum = ko.observable();
	self.loadingAcknowledgements = ko.observable(false);

	self.isTexas = ko.computed(function() {
		return self.stateId() == "297ed5063d288ec7013d28a69726002c";
	});

	self.isGeorgia = ko.computed(function() {
			return self.stateId() == "297ed5063d288ec7013d28a696bf000b";
	});
	self.tosPathMemento = ko.observable();

	self.showMoveInType = ko.computed(function() {
		return (self.isTexas() || self.isGeorgia()) && !self.isNotResidential() && self.switchOption() && self.switchOption().switchTypeCode.toLowerCase().indexOf("switch") === -1;
	});

	self.moveInTypes = ko.observable(['Immediate', 'Future Start']);
	self.moveInType = ko.observable().extend({
			required: {
					onlyIf: function() {
							return self.showMoveInType();
					}
			}
	});

	self.contractStartDate = new ContractStartDateViewModel();

	self.supplierId = ko.observable();
	self.moveInMonth = ko.observable();
	self.moveInDay = ko.observable();
	self.moveInYear = ko.observable();
	self.moveInDate = ko.computed(function() {
		var month = self.moveInMonth() < 10 ? "0" + self.moveInMonth() : self.moveInMonth();
		var day = self.moveInDay() < 10 ? "0" + self.moveInDay() : self.moveInDay();

		return self.moveInYear() + "-" + month + "-" + day;
	});
	self.moveInDateSmall = ko.computed(function() {
		var month = self.moveInMonth() < 10 ? "0" + self.moveInMonth() : self.moveInMonth();
		var day = self.moveInDay() < 10 ? "0" + self.moveInDay() : self.moveInDay();

		return self.moveInYear() + "-" + month + "-" + day;
	});
	self.moveInDate = ko.pureComputed({
			read: function() {
					return new Date(self.moveInDateSmall() + 'T00:00:00');
			},
			write: function(date) {
					if (typeof date == "object") // only date objects
					{
						self.moveInYear(date.getFullYear());
						self.moveInMonth(date.getMonth() + 1); // must offset because of zero-index
						self.moveInDay(date.getDate());
					}
			}
	});

	self.showContractStartDate = ko.computed(function() {
			return (self.showMoveInType() && self.moveInType() === "Future Start") || (!self.isTexas() && !self.isGeorgia() && self.isNotResidential());
	});

	self.showMoveInDate = ko.computed(function() {
			return self.showContractStartDate();
	});

	self.loadingSwitchOptions = ko.observable(true);
	self.switchOptions = ko.observableArray();
	self.switchOption = ko.observable().extend({
		required: {
			onlyIf: function() {
				return self.switchOptions() && self.switchOptions().length > 0;
			}
		}
	});
	self.switchDates = ko.computed(function()
	{
			var dates = [];
			var today = new Date();
			var dateStr = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
			dates.push(new EntityViewModel(dateStr, dateStr));
			for (var i = 1; i < 31; i++) // general rule to just get the next 30 days, regardless of which month
			{
					today.setDate(today.getDate() + 1);
					var dateStr = (today.getMonth() + 1) + "/" + today.getDate() + "/" + today.getFullYear();
					dates.push(new EntityViewModel(dateStr, dateStr));
			}

			return dates;
	});

	self.switchOptionBusinessText = ko.observable("In case you are just switching to a supplier, you must upload a bill, otherwise the contract will be rejected.");
	self.switchOptionBusinessTextShow = ko.computed(function() {
			return self.isNotResidential() &&
					self.switchOption() &&
					self.switchOption().switchTypeCode &&
					self.switchOption().switchTypeCode.toLowerCase().indexOf("switch") !== -1;
	});

	self.acknowledgements = ko.observableArray();
	self.reasonType = ko.observable();

	self.taxExemptReasons = [new EntityViewModel("Personal Residence/Vacation home/Tenant","PERSONALRESIDENCEORVACATIONHOMEORTENANT"),
							 new EntityViewModel("Landlord","LANDLORD"),
							 new EntityViewModel("Commercial","COMMERCIAL"),
							 new EntityViewModel("Parent/Guardian","PARENTORGUARDIAN")];

	self.taxExemptReason = ko.observable("PERSONALRESIDENCEORVACATIONHOMEORTENANT");

	self.showSSN = ko.observable(false);
	self.showDOB = ko.observable(false);
	self.showTaxExemptReasons = ko.observable(false);
	self.showCreditInformation = function(showSsn, showDob)
	{
		self.showSSN(showSsn);
		self.showDOB(showDob);
	};
	self.ssn = ko.observable().extend({
			checkIsValidSSN: self.showSSN
	});
	self.dob = new DateOfBirthViewModel(self.showDOB());
	self.dobSmall = ko.computed(function() {
			return self.dob.month() + "/" + self.dob.day() + "/" + self.dob.year();
	});

	self.loa = ko.observable(new LetterOfAuthorizationViewModel());
	self.cds = ko.observable(new CustomerDisclosureStatementViewModel());
	self.specialNotice = ko.observable(new SpecialNoticeViewModel());

	self.buildAcknowledgements = function()
	{
		self.loadingAcknowledgements(true);
		self.acknowledgements.removeAll();
		self.disclaimerErrorMessage('');
		self.loa(new LetterOfAuthorizationViewModel());
		self.cds(new CustomerDisclosureStatementViewModel());
		self.specialNotice(new SpecialNoticeViewModel());
		self.showTaxExemptReasons(false);
		self.showCreditInformation(false, false);
		self.loa().name(self.customer().fullName());
    self.loa().phone(self.customer().phone());

		$.ajax({
			type: 'POST',
			url: BASE_API_URL + "disclaimers/sign-up-requirements",
			headers: self.getHeader(),
			cache: false,
			data: {
				filter: {
					where: {
						supplierId: self.customer().supplier().supplierId,
						utilityId: self.customer().provider().utilityId,
						stateId: self.stateId(),
						serviceTypeId: self.serviceTypeId(),
						rateClass: self.rateClass(),
						effectiveDate: self.customer().supplier().effectiveDate,
						term: self.customer().supplier().term,
						displayRate: self.customer().supplier().rateDisplay,
						tosPath: self.customer().supplier().originalTosPath,
						planName: self.customer().supplier().planName,
						email: self.customer().email(),
						switchTypeCode: self.switchOption() ? self.switchOption().switchTypeCode : undefined
					}
				}
			},
			success: function(res) {
				var disclaimer = res.message;

				if (!disclaimer) {
					self.disclaimerErrorMessage('Unable to generate the terms and conditions, please contact website support.');
				} else {
					if (self.isNotResidential() || (!self.isNotResidential() && self.supplierId() !== '58464f0050cfb5da0150d627946f0153')) {
						if (disclaimer.acknowledgements) {
							for (var i = 0; i < disclaimer.acknowledgements.length; i++) {
								self.acknowledgements.push(new AcknowledgementViewModel(disclaimer.acknowledgements[i]));
							}
						}
						if (disclaimer.letterOfAuthorization) {
							self.loa().heading(disclaimer.letterOfAuthorization.heading);
							self.loa().body(disclaimer.letterOfAuthorization.body);
							self.loa().show(true);
						}
						if (disclaimer.customerDisclosureStatement) {
							self.cds().heading(disclaimer.customerDisclosureStatement.heading);
							self.cds().body(disclaimer.customerDisclosureStatement.body);
							if (disclaimer.customerDisclosureStatement.acknowledgements) {
								for (var i = 0; i < disclaimer.customerDisclosureStatement.acknowledgements.length; i++) {
									self.cds().acknowledgements.push(new AcknowledgementViewModel(disclaimer.customerDisclosureStatement.acknowledgements[i]));
								}
							}
							self.cds().show(true);
						}
						if (disclaimer.specialNotice) {
							self.specialNotice().heading(disclaimer.specialNotice.heading);
							if (disclaimer.specialNotice.acknowledgements) {
								for (var i = 0; i < disclaimer.specialNotice.acknowledgements.length; i++) {
									self.specialNotice().acknowledgements.push(new AcknowledgementViewModel(disclaimer.specialNotice.acknowledgements[i]));
								}
							}
							self.specialNotice().show(true);
						}
					}
					self.showTaxExemptReasons(disclaimer.showTaxExemptReasons);
					self.showCreditInformation(disclaimer.showSsn, disclaimer.showDob);
				}
			},
			error: function(err) {
				self.disclaimerErrorMessage('Unable to generate the terms and conditions, please contact website support.');
			},
			complete: function() {
				self.loadingAcknowledgements(false);
			}
		})
	};

	self.initVerification = function(customer, stateId, serviceTypeId, rateClass, utilityAccountNum)
	{
		self.showCreditInformation(false, false);
		self.customer(customer);
		self.stateId(stateId);
		self.rateClass(rateClass);
		self.serviceTypeId(serviceTypeId);
		self.utilityAccountNum(utilityAccountNum);
		self.supplierId(customer.supplier().supplierId);

		self.initSwitchOptions();
	};

	self.initSwitchOptions = function()
	{
		self.switchOption(undefined);
		self.switchOptions.removeAll();
		self.loadingSwitchOptions(true);

		$.ajax({
				type: 'GET',
				url: BASE_API_URL + "suppliers/" + self.customer().supplier().supplierId + "/switch-types",
				data: {
					filter: {
						where: {
							stateId: self.stateId(),
							utilityId: self.customer().provider().utilityId,
							rateClass: self.rateClass(),
							utilityAccountNum: self.utilityAccountNum()
						}
					}
				},
				headers: self.getHeader(),
				success: function(result)
				{
						if (result.message && result.message.length > 0)
						{
								self.switchOptions(ko.utils.arrayMap(ko.utils.arrayFilter(result.message, function(option) {
										return (option.allowedDates || (option.AllowedDates && option.AllowedDates.dateTime && option.AllowedDates.dateTime.length > 0));
								}), function(item) {
										return {
												allowedDates: item.allowedDates
														? item.allowedDates.dateTime ? item.allowedDates.dateTime : item.allowedDates
														: item.AllowedDates.dateTime ? item.AllowedDates.dateTime : item.AllowedDates,
												switchTypeCode: item.switchTypeCode ? item.switchTypeCode : item.SwitchTypeCode,
												switchDescription: item.switchDescription ? item.switchDescription : item.SwitchTypeCode
										}
								}));

								if (self.switchOptions().length === 1) {
										self.switchOption(self.switchOptions()[0]);
								}
						}
						self.buildAcknowledgements();
				},
				complete: function() {
						self.loadingSwitchOptions(false);
				}
		});
	};

	self.enabledDates = ko.computed(function() {
		if (!self.switchOption()
				|| !self.switchOption().allowedDates
				|| self.switchOption().allowedDates.length == 0)
				return undefined;

		var allowedDates = self.switchOption().allowedDates;
		var minDate = new Date(allowedDates[0]);
		self.contractStartDate.switchDateDay(minDate.getDate());
		self.contractStartDate.switchDateMonth(minDate.getMonth() + 1);
		self.contractStartDate.switchDateYear(minDate.getFullYear());

		return ko.utils.arrayMap(allowedDates, function(allowedDate) {
			var date = new Date(allowedDate);
			return new Date(date.getFullYear(), date.getMonth(), date.getDate());
		});
	});

	self.minDate = ko.computed(function() {
		if (!self.switchOption()
				|| !self.switchOption().allowedDates
				|| self.switchOption().allowedDates.length == 0)
				return new Date();

		var allowedDates = self.switchOption().allowedDates;
		var minDate = new Date(allowedDates[0]);
		self.contractStartDate.switchDateDay(minDate.getDate());
		self.contractStartDate.switchDateMonth(minDate.getMonth() + 1);
		self.contractStartDate.switchDateYear(minDate.getFullYear());

		return new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
	});

	self.maxDate = ko.computed(function() {
		if (!self.switchOption()
				|| !self.switchOption().allowedDates
				|| self.switchOption().allowedDates.length == 0)
				return new Date(new Date().setMonth(new Date().getMonth() + 1));

		var allowedDates = self.switchOption().allowedDates;

		return new Date(allowedDates[allowedDates.length - 1]);
	});

	self.switchOption.subscribe(function(newValue) {
		if (newValue && self.switchOptions().length !== 1) {
			self.buildAcknowledgements();
		}
	});

	self.allAcknowledged = function()
	{
		if (self.acknowledgements().length == 0) return true;

		var loaFinished = self.getLOAStatus();
		var specialNoticeFinished = self.getSpecialNoticeStatus();
		var cdsStatus = self.getCDSStatus();

		return ko.utils.arrayFirst(self.acknowledgements(), function(item) {
				return !item._acknowledged();
		}) == null && loaFinished && specialNoticeFinished && cdsStatus;
	};

	self.getLOAStatus = function()
	{
		if (!self.loa().show()) return true;

		if (self.loa().name() && self.loa().signedDate() && self.loa().phone()) {
			return true;
		}

		return false;
	};

	self.getSpecialNoticeStatus = function()
	{
		if (!self.specialNotice().show()) return true;

		return ko.utils.arrayFirst(self.specialNotice().acknowledgements(), function(item) {
			return !item._acknowledged();
		}) == null;
	};

	self.getCDSStatus = function()
	{
		if (!self.cds().show()) return true;

		return ko.utils.arrayFirst(self.cds().acknowledgements(), function(item) {
			return !item._acknowledged();
		}) == null;
	};

	/* May be uneeded, check back with this */
	self.verificationYears = ko.computed(function()
	{
		var todayYear = new Date().getFullYear();
		var years = [];

		for (var i = todayYear; i >= todayYear - 100; i--) {
			years.push(new EntityViewModel(i, i));
		}

		return years;
	});

	self.termsAndConditionsHeading = ko.computed(function() {
		if (self.isNotResidential() || self.supplierId() === '58464f0050cfb5da0150d627946f0153')
		{
			return TERMS_AND_CONDITIONS_HEADING_BUSINESS;
		}
		else
		{
			return TERMS_AND_CONDITIONS_HEADING_RESIDENTIAL;
		}
	});

	self.termsAndConditionsBody = ko.computed(function() {
		if (self.isNotResidential() || self.supplierId() === '58464f0050cfb5da0150d627946f0153')
		{
			return TERMS_AND_CONDITIONS_BODY_BUSINESS;
		}
		else
		{
			if (self.acknowledgements().length == 1)
			{
				return TERMS_AND_CONDITIONS_BODY_RESIDENTIAL_SINGLE;
			}
			else
			{
				return TERMS_AND_CONDITIONS_BODY_RESIDENTIAL_MULTIPLE;
			}
		}
	});

	self.isLeapYear = function(year)
	{
			if (year % 4 == 0)
			{
					if (year % 100 == 0)
					{
							if (year % 400 == 0)
							{
									return true;
							}
							else
							{
									return false;
							}
					}
					else
					{
							return true;
					}
			}
			else
			{
					return false;
			}
	};

	self.verificationDaysOfMonth = ko.computed(function()
	{
		var days = 0;
		var retVal = [];
		switch(self.dob.month())
		{
			case 4:
			case 6:
			case 9:
			case 11:
					days = 30;
					break;
			case 1:
			case 3:
			case 5:
			case 7:
			case 8:
			case 10:
			case 12:
				days = 31;
				break;
			case 2:
				days = self.isLeapYear(self.dob.year()) ? 29 : 28;
				break;
		}

		for (var i = 1; i <= days; i++) {
			retVal.push(new EntityViewModel(i, i));
		}

		return retVal;
	});

	self.ssn.subscribe(function(newValue) {
		var val = newValue.replace(/\D/g, '');
		var newVal = '';
		if(val.length > 4) {
			newValue = val;
		}
		if((val.length > 3) && (val.length < 6)) {
			newVal += val.substr(0, 3) + '-';
			val = val.substr(3);
		}
		if (val.length > 5) {
			newVal += val.substr(0, 3) + '-';
			newVal += val.substr(3, 2) + '-';
			val = val.substr(5);
		}
		newVal += val;
		newValue = newVal;
		self.ssn(newValue);

		globalVerificationViewModel.errors.showAllMessages(false);
	});

	self.moveInType.subscribe(function(newValue) {
		if (newValue == "Immediate") {
			var newSwitchDate = new Date();
			if (newSwitchDate.getHours() > 13) {
				newSwitchDate.setDate(newSwitchDate.getDate() + 1);
			}
			self.contractStartDate.switchDate(newSwitchDate);
		}

		globalCustomerViewModel.errors.showAllMessages(false);
	});

	self.showTos = function() {
		if (!self.customer.supplier().hasExternalTos) {
			$("#verificationTos").submit();
			return false;
		}	else {
			return true;
		}
	};
};