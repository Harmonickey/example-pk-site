var PowerKioskECommerce = function(agentId, agentCallback, shouldAutoSelect)
{
    var self = this;

    /*********************** Properties *********************/
    self.agentId = ko.observable(agentId);
    self.promoCodeId = ko.observable();
    self.innerStateChange = ko.observable(true);
    self.trackingId = ko.observable();
    self.isFirstTimeGettingRates = ko.observable(true);
    self.referenceId = ko.observable('');

	self.finishedServiceTypesInit = ko.observable(false);
	self.finishedAgentsInit = ko.observable(false);

    self.shouldScroll = ko.observable(true);

    self.isCopying = ko.observable(false);

    self.shouldAutoSelect = ko.observable(shouldAutoSelect === undefined || shouldAutoSelect === null ? true : shouldAutoSelect);

	self.utilityPartners = new UtilityPartners();

    /* View Model Utility Properties */
    self.loaderShow = ko.observable(false);
    self.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    self.utilityMapping = {};
    self.doneBuildingUtilities = ko.observable(true);
    self.gettingData = ko.observable(false);
    self.doneGettingData = ko.observable(false);
    self.shouldScrollForRatesButton = ko.observable(true);

    /* Logo */
    self.logo = ko.observable("assets/img/logo.png");
    self.logo2 = ko.observable("assets/img/navbar-logo.png");
    self.logo3 = ko.observable("/assets/img/logo.png");
    self.logo4 = ko.observable("/assets/img/navbar-logo.png");
    self.logoOriginal = self.logo();
    self.logo2Original = self.logo2();
    self.showPromoCodeAffinityAlert = ko.observable(false);
    self.showPromoCode = ko.observable(true);
    self.showPromoCodeModal = ko.observable(true);

    /* Service Types */
    self.serviceTypes = ko.observableArray();
	self.serviceTypeId = ko.observable().extend({
        required: true
    });
	self.serviceType = ko.pureComputed({
		read: function() {
			if (!self.serviceTypes() || !self.serviceTypeId())
			{
				return "";
			}

			return ko.utils.arrayFirst(self.serviceTypes(), function(item) {
				return item.serviceTypeId === self.serviceTypeId();
			});
        },
        write: function(value) {
			if (value && !self.gettingData())
			{
				self.serviceTypeId(value.serviceTypeId);
			}
        },
        owner: self
	});
    self.serviceName = ko.computed(function() {
        if (!self.serviceTypes() || !self.serviceTypeId())
        {
            return "";
        }

        var serviceType = ko.utils.arrayFirst(self.serviceTypes(), function(item) {
            return item.serviceTypeId === self.serviceTypeId();
        });

		if (serviceType)
		{
			return serviceType.name;
		}
		else
		{
			return "";
		}
    });
    self.isGas = ko.computed(function() {
        return self.serviceTypeId() == GAS_SERVICE_ID;
    });

    /* Zip Code */
    self.zipCode = ko.observable().extend({
        checkIsZipCodeValid: true
    });
    self.zipCodeEnabled = ko.computed(function()
    {
        return !self.gettingData(); //only enable if we're not getting rates
    });
    self.zipCodeShow = ko.computed(function()
    {
        return self.serviceTypes().length > 0;
    });

    /* Utilities */
    self.utilities = ko.observableArray();
    self.utilityId = ko.observable().extend({
        required: true
    });
    self.defaultUtilityId = ko.observable();
	self.utilitySelection = ko.pureComputed({
		read: function() {
			if (!self.utilities() || !self.utilityId())
			{
				return "";
			}

			return ko.utils.arrayFirst(self.utilities(), function(item) {
				return item.value === self.utilityId();
			});
        },
        write: function(value) {
			if (value && !self.gettingData())
			{
				self.utilityId(value.value);
			}
        },
        owner: self
	});
    self.utilityName = ko.computed(function() {
        if (!self.utilityId())
        {
            return "Your Utility Company";
        }

        var utility = ko.utils.arrayFirst(self.utilities(), function(item) {
            return item.value === self.utilityId();
        });

		if (utility)
		{
			return utility.name;
		}
		else
		{
			return "";
		}
    });
    self.utilityShow = ko.computed(function() {
        return !self.gettingData() && self.utilities().length > 0;
    });
    self.isNicor = ko.computed(function() {
        return self.utilityId() == NICOR_UTILITYID;
    });
    self.isAGL = ko.computed(function() {
        return self.utilityId() == AGL_UTILITYID;
    });
    self.isNipsco = ko.computed(function() {
        return self.utilityId() == NIPSCO_UTILITYID;
    });

    /* Zones */
    self.zones = ko.observableArray();
    self.zoneShow = ko.computed(function() {
        return !self.gettingData() && self.zones().length > 0;
    });
    self.zoneId = ko.observable().extend({
        required: {
            onlyIf: function() {
                return self.zoneShow();
            }
        }
    });
	self.zoneSelection = ko.pureComputed({
		read: function() {
			if (!self.zones() || !self.zoneId())
			{
				return "";
			}

			return ko.utils.arrayFirst(self.zones(), function(item) {
				return item.value === self.zoneId();
			});
        },
        write: function(value) {
			if (value && !self.gettingData())
			{
				self.zoneId(value.value);
			}
        },
        owner: self
	});
    self.zoneName = ko.computed(function() {
        if (!self.zoneId())
        {
            return 'Your Zone';
        }

        var zone = ko.utils.arrayFirst(self.zones(), function(item) {
            return item.value === self.zoneId();
        });

		if (zone)
		{
			return zone.name;
		}
		else
		{
			return "";
		}
    });
    self.defaultZone = ko.observable();

    /* City/State/Location */
    self.stateId = ko.observable().extend({
        required: true
    });
    self.countryId = ko.observable();
    self.stateLong = ko.observable();
    self.stateShort = ko.observable();
    self.citiesInZipCode = ko.observableArray();
	self.isTexas = ko.computed(function() {
        return self.stateLong() == "Texas";
    });
    self.isGeorgia = ko.computed(function() {
        return self.stateLong() == "Georgia";
    });
    self.isNewJersey = ko.computed(function() {
        return self.stateLong() == "New Jersey";
    });
    self.isIllinois = ko.computed(function() {
        return self.stateLong() == "Illinois";
    });

    /* Business Type */
    self.businessTypes = ko.observableArray();
    self.businessType = ko.observable().extend({
        required: true
    });
	self.businessTypeSelection = ko.pureComputed({
		read: function() {
			if (!self.businessTypes() || !self.businessType())
			{
				return "";
			}

			return ko.utils.arrayFirst(self.businessTypes(), function(item) {
				return item.value === self.businessType();
			});
        },
        write: function(value) {
			if (value && !self.gettingData())
			{
				self.businessType(value.value);
			}
        },
        owner: self
	});
	self.isRFQ = ko.computed(function() {
		return self.businessType() == "rfq";
	})
	self.isNotResidential = ko.computed(function() {
       return self.businessType() != "residential";
    });
    self.quoteStatus = ko.computed(function() {
        if (self.isRFQ())
        {
            return 97;
        }
        else
        {
            return 99;
        }
    });
	self.businessSupplementalText = ko.computed(function() {
		if (self.isRFQ())
		{
			return LARGE_BUSINESS_TAB_MESSAGE;
		}
		else if (self.isNotResidential())
		{
			return SMALL_BUSINESS_TAB_MESSAGE;
		}

		return SMALL_BUSINESS_TAB_MESSAGE;
    });
    self.isCanada = ko.computed(function() {
        return self.countryId() === CANADA_COUNTRYID;
    });

    /* Date References */
    self.contractStartDate = new ContractStartDateViewModel();
    self.contractStartDateShow = ko.observable(false);
    self.years = ko.observableArray();
    self.months = ko.observableArray();

    /* Rate Class */
    self.rateClasses = ko.observableArray();
    self.rateClassValue = ko.observable();
    self.rateClass = ko.pureComputed({
        read: function() {
            return (self.isNotResidential() && self.isGas() ? null : (self.isNotResidential() ? self.rateClassValue() : "rs"));
        },
        write: function(value) {
            self.rateClassValue(value);
        },
        owner: self
    });
    self.rateClassShow = ko.observable(false);

    /* Rates */
    self.rates = ko.observableArray();
    self.showRates = ko.observable(false);

    /* Rates Submission */
    self.getRatesShow = ko.computed(function()
    {
        return self.doneGettingData();
    });
    self.getRatesEnabled = ko.observable(true);
    self.getRatesText = ko.observable(GET_RATES_TEXT);

    /* Customer */
	self.accountInformationHeaderText = ko.computed(function() {
		var headerText = "We value your privacy: all information you enter below is security encrypted and shared only with your selected supplier.";

		return headerText;
	});
	self.accountInformationTitleText = ko.computed(function() {
		var titleText = "With the information you provide us, we’ll get the most competitive plan options for your business as quickly as possible.";

		return titleText;
	});
    self.customer = new CustomerViewModel();
    self.customerSubmitText = ko.observable("Next");
    self.customerSubmitEnabled = ko.observable(true);
    self.showCustomerPage = ko.observable(false);
    self.showFileUploadError = ko.observable(false);
    self.addressesValidList = [];
    self.addressesValid = ko.observable();

    /* Customer Supplier State */
	self.isJustEnergy = ko.computed(function() {
		return self.customer.supplier() && self.customer.supplier().supplierId === "588f51ee4b9fc5b6014bfb0a225e1b2f";
    });
    self.isConstellation = ko.computed(function() {
		return self.customer.supplier() && self.customer.supplier().supplierId === "588f51ee45f198db0145f5dc2ed63247";
    });
    self.isMajorEnergy = ko.computed(function() {
		return self.customer.supplier() && self.customer.supplier().supplierId === "58464f0050cfb5da0150d627946f0153";
    });
    self.isProviderPower = ko.computed(function() {
		return self.customer.supplier() && self.customer.supplier().supplierId === "588f17956e00c5e7016e04a84dca0943";
    });
    self.isSparkEnergy = ko.computed(function() {
		return self.customer.supplier() && self.customer.supplier().supplierId === "588f51ee4602f43b01460540eaf93252";
    });
    self.isVerdeEnergy = ko.computed(function() {
		return self.customer.supplier() && self.customer.supplier().supplierId === "588f51ee45f198db0145f5e301c0324b";
	});

    /* View Model State */
    self.quoteSubmitAction = ko.computed(function() {
        return BASE_URL + '/direct:' + (self.businessType() == 'rfq' ? 'rfq' : 'quote') + '/save';
    });
    self.showInputPage = ko.observable(true);
    self.showConfirmationPage = ko.observable(false);

    /* Rating Fields/Displays */
    self.annualUsageSet = ko.pureComputed({
        read: function() {
            return (self.isNotResidential() ? self.annualUsage() : self.annualUsageResidential());
        },
        write: function(value) {
            (self.isNotResidential()
                ? self.annualUsage(value)
                : (self.isGas()
                    ? self.annualUsageResidentialGas(value)
                    : self.annualUsageResidentialElectric(value)));
        },
        owner: self
    });
    self.annualUsageValue = ko.observable();
    self.annualUsage = ko.pureComputed({
        read: function() {
            return (self.isNotResidential() ? self.annualUsageValue() : "100");
        },
        write: function(value) {
            self.annualUsageValue(value);
        },
        owner: self
    });
    self.annualUsageResidentialElectric = ko.observable(RESIDENTIAL_ANNUAL_USUAGE_DEFAULT_ELECTRIC);
    self.annualUsageResidentialGas = ko.observable(RESIDENTIAL_ANNUAL_USUAGE_DEFAULT_GAS);
    self.annualUsageResidential = ko.computed(function() {
        return self.isGas() ? self.annualUsageResidentialGas() : self.annualUsageResidentialElectric();
    });
    self.estAnnualSpend = ko.computed(function() {
		if (self.customer.supplier().supplierId == "58464f0057623df801577a9d9c7103df" && self.customer.supplier().rate > 50)
		{
			return "$" + accounting.toFixed(self.customer.supplier().rate * 12, 2);
		}
		else
		{
			return "$" + accounting.toFixed(((self.isNotResidential() ? self.annualUsage() : self.annualUsageResidential()) * (self.customer.supplier().rate * 100)) / 100, 2);
		}
    });
    self.baseRateChanged = ko.observable(false);
    self.baseRates = ko.observableArray();
    self.baseRateValue = ko.observable(BASE_RATE_AVG_DEFAULT);
    self.baseRate = ko.pureComputed({
        read: function() {
            return self.baseRateValue();
        },
        write: function(value) {
            if (value != undefined && value != null) {
                self.baseRateValue(value);
            }
        },
        owner: self
    });
    self.baseRatePlaceholder = ko.observable("variable rate");
    self.leadTime = ko.observable();
	self.specialBaseRates = ko.observableArray();
    self.estSavings = ko.computed(function() {
        return Math.max.apply(Math, ko.utils.arrayMap(self.rates(), function(r) { return (isNaN(r.estSavings) ? 0 : r.estSavings); }));
    });
    self.estSavingsDisplay = ko.computed(function() {
		return self.estSavings() != -Infinity && self.estSavings() != Infinity && self.estSavings() > 0 ? accounting.formatMoney(self.estSavings()) : "";
    });
	self.estSavingsDisplayMonthly = ko.computed(function() {
		var savings = Math.max.apply(Math, ko.utils.arrayMap(self.rates(), function(r) { return (isNaN(r.estSavingsDisplayRaw) ? 0 : r.estSavingsDisplayRaw); }));
		return savings != -Infinity && savings != Infinity && savings > 0 ? accounting.formatMoney(savings) : "";
	});
    self.energyUnit = ko.observable("kWh");
    self.annualUsageSupplementalText = ko.computed(function() {
		return self.isRFQ() ? ' (Estimate)' : '';
	});

    /* Sales Code */
    self.promoCodeInput = ko.observable();
    self.newPromoCode = ko.observable();
	self.newPromoCodeFromAffinity = ko.observable();
    self.promoCodeAppliedSuccess = ko.observable(false);
    self.promoCodeAppliedError = ko.observable(false);

	/* Discount Fields */
	self.discountTextShow = ko.observable(false);
	self.discountText = ko.observable();

    /* Verfication Step */
    self.verification = new VerifyViewModel();
    self.showVerifyPage = ko.observable(false);

    /* Agent */
    self.agent = new AgentViewModel();
    self.familyAndFriendsLink = ko.observable();

    /* View Model Validation */
    self.rateRequestViewModel = ko.validatedObservable({
        P1: self.businessType,
        P2: self.serviceTypeId,
        P3: self.zipCode,
        P4: self.rateClassValue,
        P5: self.annualUsage,
        P6: self.zoneId
    });

    self.customerViewModel = ko.validatedObservable({
        P1: self.customer.firstName,
        P2: self.customer.lastName,
        P3: self.customer.legalEntityName,
        P4: self.customer.title,
        P5: self.customer.locations,
        P6: self.customer.finNumber,
        P7: self.customer.phone,
        P8: self.customer.email,
        P9: self.customer.billingAddressAddress,
        P10: self.customer.billingAddressZipCode,
        P12: self.customer.dwellingType,
        P13: self.customer.mobile
    }, { deep: true, live: true });

    self.verificationViewModel = ko.validatedObservable({
        P1: self.verification.ssn,
        P2: self.verification.switchOption,
        P3: self.verification.moveInType
    }, { deep: true, live: true, observable: true });

    /* View Model Validation Error Message Controllers */
    globalVerificationViewModel = self.verificationViewModel;
    globalCustomerViewModel = self.customerViewModel;

    /* Customer Current Supplier Info */
    self.currentSupplierInfoShow = ko.observable(false);
    self.currentSupplierName = ko.observable();
    self.currentSupplierLastMonthBillFile = ko.observable();
    self.currentSupplierHasMultipleAccountNumbers = ko.observable();
    self.currentSupplierMultiAccountNumbersFile = ko.observable();
    self.sampleUpload = BASE_URL + "/views/quote/sampleupload.xlsx";
    self.chooseSupplierEnabled = ko.observable(true);

    /* Sorting */
    self.sortMethod = ko.observable("displayRate");
    self.uniqueSuppliers = ko.observableArray();
    self.uniqueContracts = ko.observableArray();

    /* Alerts */
    self.serviceAlertShow = ko.observable(false);
    self.serviceAlertText = ko.observable("Bad Connection to API, Please Try Again Later");
    self.utilityAlertShow = ko.observable(false);
    self.utilityAlertText = ko.observable("");
    self.showRateError = ko.observable(false);
    self.rateErrorText = ko.observable();
    self.showAuctionButton = ko.observable(false);
    self.zoneErrorShow = ko.observable(false);
    self.zoneErrorText = ko.observable("Could Not Retrieve Zones");
    self.rateClassErrorShow = ko.observable(false);
    self.rateClassErrorText = ko.observable("Could Not Retrieve Rate Classes");
    self.verificationErrorShow = ko.observable(false);
    self.verificationErrorText = ko.observable("");
    self.customerErrorShow = ko.observable(false);
    self.customerErrorText = ko.observable("Please Fill in All Required Info to Proceed!");
    self.rateRequestViewModelErrorShow = ko.observable(false);
    self.rateRequestViewModelErrorText = ko.observable("Please Enter All Data Required to Get Rates!");

    /* Confirmation */
    self.confirmCustomerInformationButtonText = ko.observable("Next");
    self.enrollCustomerButtonEnabled = ko.observable(true);
    self.enrollCustomerButtonText = ko.observable("Submit");
    self.confirmationMessage = ko.computed(function () {
        if (self.isNotResidential())
        {
            return (self.isRFQ() ? CONFIRMATION_MESSAGE_LARGE_BUSINESS : CONFIRMATION_MESSAGE_BUSINESS);
        }
        else
        {
            return CONFIRMATION_MESSAGE_RESIDENTIAL;
        }
    });
    self.constellationConfirmationMessage = ko.computed(function() {
        return self.customer.supplier() && self.customer.supplier().phone ? CONSTELLATION_CONFIRMATION_MESSAGE.replace("**PHONE3**", self.customer.supplier().phone) : "";
    });
	self.confirmationMessage2 = ko.computed(function () {
        var extra = "";
        if (self.isJustEnergy()) {
            extra = JUST_ENERGY_CONFIRMATION_MESSAGE;
        } else if (self.isConstellation()) {
            extra = self.constellationConfirmationMessage();
        }

        if (self.isNotResidential())
        {
            return (self.isRFQ() ? CONFIRMATION_MESSAGE_LARGE_BUSINESS2 : CONFIRMATION_MESSAGE_BUSINESS2) + extra;
        }
        else
        {
            return CONFIRMATION_MESSAGE_RESIDENTIAL2 + extra;
        }
    });
    self.browseAwayMessage = ko.observable(BROWSE_AWAY_MESSAGE);
    self.creditCheckMessage = ko.observable();
    self.rejectMessage = ko.observable();
	self.confirmationTitle = ko.computed(function() {
		if (self.isNotResidential())
		{
			if (self.isRFQ())
			{
				return "Thanks &mdash; We’ll Follow Up";
			}
			else
			{
				return "Ready to Save? (Just E-Sign)";
			}
		}
		else
		{
			return "Your Plan is Confirmed";
		}
	});
	self.sharingMessage = ko.computed(function() {
		var msg = "Spread the word with family, co-workers and friends &mdash; you can even make some extra cash by signing up for our <strong>friends &amp; family referral program</strong>."

		if (self.isNotResidential())
		{
			msg = "Spread the word with family, co-workers and friends.";
		}

		return msg;
	});
	self.thankYouText = ko.computed(function() {
		if (self.isRFQ())
		{
			return "Large Business? Check. Let’s Cut Your Rates Big-Time.";
		}
		else
		{
			return "Thank You";
		}
	});

	self.enrollmentTimestampText = ko.observable();
	self.enrollmentConfirmationNumber = ko.observable();

    /* Affiliate */
    self.affiliateConfirmationSuccessShow = ko.observable();
    self.affiliateConfirmationErrorShow = ko.observable();
    self.affiliateConfirmationSuccessText = ko.observable();
    self.affiliateConfirmationErrorText = ko.observable();
    self.affiliateAgentText = ko.observable("Sign Me Up as a Referral Partner!");
	self.affiliateAgentButtonShow = ko.observable(true);
    self.affiliateAgentButtonVisible = ko.computed(function() {
		return self.affiliateAgentButtonShow() && !self.isNotResidential();
	});

    /********************** Helper Functions *********************/

    self.getHeader = function()
    {
        return $.ajaxSettings.headers && $.ajaxSettings.headers["API-Key"]
            ? { 'Authorization': 'Bearer ' + $.ajaxSettings.headers["API-Key"] }
            : { 'Authorization': 'Bearer ' + API_KEY };
    };

    self.fireTagEvent = function(event) {
        if (window.dataLayer && event) {
            dataLayer.push(event);
        }
    };

    /* helps to generate authentication string */
    self.b64EncodeUnicode = function(str)
    {
        return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1)
        {
            return String.fromCharCode('0x' + p1);
        }));
    };

    self.InitPowerKioskECommerce = function()
    {
        // init reference values
        self.InitBusinessTypes();
        self.InitMonths();
        self.InitYears();

        // get starting input values
        self.GetServiceTypes();
        self.GetAgent(false);

        // start with residential always
        self.rateClassValue("rs");
        self.isFirstTimeGettingRates(true);
    };

    self.InitBusinessTypes = function()
    {
        self.businessTypes.removeAll();
        self.businessTypes.push(new EntityViewModel("Residential", "residential"));
        self.businessTypes.push(new EntityViewModel("Small Business", "quote"));
        self.businessTypes.push(new EntityViewModel("Large Business", "rfq"));

        if (self.shouldAutoSelect()) {
            self.businessType("residential");
        }
    }

    self.InitMonths = function()
    {
        self.months.removeAll();

        for (var i = 1; i < 13; i++)
        {
            self.months.push(new EntityViewModel(MONTH_HASH[i - 1], i));
        }

        self.SetContractDate();
    }

    self.InitYears = function()
    {
        self.years.removeAll();
        var thisYear = new Date().getFullYear();

        for (var i = thisYear; i < thisYear + 5; i++)
        {
            self.years.push(new EntityViewModel(i, i));
        }
    }

    /* Called at the beginning, not part of rate flow */
    self.GetServiceTypes = function()
    {
        self.serviceTypes.removeAll();

        $.ajax(
        {
            type: 'GET',
            url: BASE_API_URL + "service-types?filter[where][isActive]=1&filter[order]=name",
            headers: self.getHeader(),
            beforeSend: function()
            {
                self.loaderShow(true);
            },
            success: function(result)
            {
                var serviceTypes = ko.utils.arrayMap(result.message, function(serviceType)
                {
                    return new ServiceTypeViewModel(serviceType.name, serviceType.serviceTypeId, serviceType.defaultUsage, serviceType.defaultUsageCanada, serviceType.units);
                });

                self.serviceTypes.push.apply(self.serviceTypes, serviceTypes);

                if (self.serviceTypes().length > 0)
                {
                    if (self.shouldAutoSelect()) {
                        self.serviceTypeId(self.serviceTypes()[0].serviceTypeId);
                    }
                }
            },
            error: function(res, err)
            {
                self.serviceAlertShow(true);
            },
			complete: function()
			{
				self.finishedServiceTypesInit(true);
			}
        });
    };

	self.reloadHash = ko.computed(function()
	{
		return "#" + (self.agentId().toLowerCase() == "pkec" ? "" : self.agentId().toLowerCase());
	});

	self.reloadPage = function()
	{
		self.innerStateChange(true); // make sure no effect happens to screen
		window.location.href = self.reloadHash();
		location.reload();
	};

    /* Called at the beginning, not part of rate flow */
    self.GetAgent = function(isFromHash, isFromPopup, slug)
    {
        if (agentCallback && !isFromHash)
        {
            agentCallback(self);
        }
        else
        {
            if (self.agentId())
            {
                if (!isFromPopup)
                {
                    // check for saved promo
                    var pkpromo = Cookies.get("pk-promo");
                    if (pkpromo && pkpromo != self.agentId()) {
                        self.agentId(pkpromo);
                        if (self.agentId().toLowerCase() != agentId.toLowerCase())
                        {
                            self.showPromoCode(false);
                            if (!isFromHash) {
                                self.showPromoCodeAffinityAlert(true);
                            }
                        }
                    }
                }

                if (slug)
                {
                    self.agentId(slug);
                }

                $.ajax({
                    type: "GET",
                    url: BASE_API_URL + "agents?filter[where][slug]=" + self.agentId().toLowerCase(),
                    headers: self.getHeader(),
                    success: function(result)
                    {
                        var agent = result.message && result.message.length > 0 ? result.message[0] : null;

                        if (agent)
                        {
                            if (!agent.showAffiliateUrl) {
                                self.affiliateAgentButtonShow(false);
                            } else {
                                self.affiliateAgentButtonShow(true);
                            }

                            // only do this if it's not the first time
                            if (self.agentId().toLowerCase() != agentId.toLowerCase())
                            {
                                self.showPromoCodeAffinityAlert(true);
                                self.showPromoCode(false);
                                self.promoCodeAppliedError(false);
                            }

                            self.agent.phoneNumber(self.agent.formatPhone(agent.phone));
                            self.agent.phoneNumberTel(self.agent.formatPhoneTel(agent.phone));
                            self.agent.email(agent.email);
                            self.agent.agentId(agent.agentId);
                            self.agent.customerCompany(agent.customerCompany);
                            self.agent.agentDomainAlias(agent.agentDomainAlias);

                            Cookies.set("pk-promo", self.agentId().toLowerCase());
                        }
                        else if (!isFromHash)
                        {
                            self.showPromoCodeAffinityAlert(false);
                            self.promoCodeAppliedError(true);
                        }
                        else
                        {
                            self.showPromoCodeAffinityAlert(false);
                            self.promoCodeAppliedError(true);
                        }
                    },
                    complete: function()
                    {
                        var image = Cookies.get("pk-promo-image");
                        if (image)
                        {
                            self.logo("images/" + image);
                            self.logo2("images/" + image);
                        }
                        self.finishedAgentsInit(true);
                    }
                });

                $.ajax({
                    type: "GET",
                    url: BASE_API_URL + "promo-codes?filter[where][slug]=" + self.agentId().toLowerCase(),
                    headers: self.getHeader(),
                    success: function(result)
                    {
                        var promoCode = result.message && result.message.length > 0 ? result.message[0] : null;
                        if (promoCode)
                        {
                            self.promoCodeId(promoCode.id);
                        }
                    }
                });
            }
        }
    };

    self.SetLocationAndDefaultZone = function(data)
    {
        self.stateId(data.stateId);
        self.countryId(data.state.countryId);
        self.citiesInZipCode(data.cities);
        self.stateLong(data.state.stateLong);
        self.stateShort(data.state.stateShort);

        if (data.defaultUtilityZone != null)
        {
            self.defaultZone(data.defaultUtilityZone);
        }
        else
        {
            self.defaultZone(undefined);
        }
    };

    self.ReturnToInputPage = function()
    {
        // reset pages
        self.showRates(false);
        self.showCustomerPage(false);
        self.showInputPage(true);
        self.showVerifyPage(false);
        self.showConfirmationPage(false);
        self.showAuctionButton(false);
        self.isFirstTimeGettingRates(true);

        // reset page state
        self.innerStateChange(true);

        // reset view models
        self.customerViewModel.errors.showAllMessages(false);
        self.customerErrorShow(false);
        self.verificationViewModel.errors.showAllMessages(false);
        self.verificationErrorShow(false);
        self.ResetFlow();
        self.zipCode("");
        self.doneGettingData(false);
		self.ResetFlow();

        // reset browser
        location.hash = "";
    };

	self.NavigateToRatesPage = function()
	{
		if (self.showCustomerPage() || self.showVerifyPage() || self.showConfirmationPage())
		{
			self.ReturnToRatesPage();
		}
	};

    self.ReturnToRatesPage = function()
    {
        if (self.isRFQ())
        {
            self.ReturnToInputPage();
        }
        else
        {
            self.showRates(true);
            self.showCustomerPage(false);
            self.showInputPage(false);
            self.showVerifyPage(false);
            self.innerStateChange(true);
            location.hash = "step1";
        }
    };

	self.NavigateToCustomerPage = function()
	{
		if (self.showVerifyPage())
		{
			self.ReturnToCustomerPage();
		}
    };

    self.ConvertToRFQ = function()
    {
        self.verification.loadingSwitchOptions(false);
        self.businessType("rfq");
        self.showRates(false);
        self.showCustomerPage(true);
        self.showInputPage(false);
        self.showVerifyPage(false);
        self.addressesValidList = [];
        self.innerStateChange(true);

        window.scrollTo(0,0);

		SetupToolTips();

        location.hash = "step2";
    };

    self.ReturnToCustomerPage = function()
    {
		if(self.showAuctionButton())
		{
            self.verification.loadingSwitchOptions(false);
			self.businessType("rfq");
		}

        self.showRates(false);
        self.showCustomerPage(true);
        self.showInputPage(false);
        self.showVerifyPage(false);
        self.addressesValidList = [];
        self.innerStateChange(true);

		SetupToolTips();

        location.hash = "step2";
    };

	self.ReturnToVerifyPage = function()
	{
		self.showVerifyPage(true);
        self.innerStateChange(true);
        self.verificationErrorShow(false);
        self.verificationErrorText('');
		location.hash = "step3";
	};

	self.DetermineDiscountText = function()
	{
		if (self.isNotResidential() && !self.isRFQ() && self.utilityId() && self.stateShort() && self.newPromoCode())
		{
			var utilityId = self.utilityId();
			var stateShort = self.stateShort();

			if ((utilityId == "1ac3bcc7155445d8a2efb94debbe9fea" && stateShort == "IL")  // ComEd Chicago
			 || (utilityId == "588f51ee4552d6a6014556f9cd470010" && stateShort == "TX") // Centerpoint Texas
			 || (utilityId == "693b700470e14259a07a99949636ec63" && stateShort == "NY"))  // ConEd New York
			{
				self.discountText("Congratulations, you have received a 15% discount on your rates below!");
				self.discountTextShow(true);
			}
			else if ((utilityId == "f4379132e6af49d09ea998060cbf5928" && stateShort == "OH") // AEP Columbus
				  || (utilityId == "588f51ee4552d6a6014556f912c8000e" && stateShort == "NH")) // Eversource Manchester
			{
				self.discountText("Congratulations, you have received a 15% discount on your rates below!");
				self.discountTextShow(true);
			}
			else
			{
				self.discountTextShow(false);
			}
		}
		else
		{
			self.discountTextShow(false);
		}
	};

    self.GetBestPlan = function(months)
    {
        var filteredItems = (months == "LongTerm" ?
            ko.utils.arrayFilter(self.rates(), function(rate) {
                return rate.term > 24;
            }) :
            ko.utils.arrayFilter(self.rates(), function(rate) {
                return rate.term == months;
            }));

        if (filteredItems.length > 0)
        {
            return filteredItems[0];
        }
        else
        {
            return null;
        }
    };

    self.buildBestPlan = function (plan, headingDisplay) {
        var rate = new RateViewModel(plan, (self.isNotResidential() ? self.annualUsage() : self.annualUsageResidential()), self.isNotResidential(), self.energyUnit(), self.isTexas(), self.isGeorgia(), self.isGas());
        rate.headingDisplay(headingDisplay);
        rate.templateIndex(0);
        return rate;
    };

    // computed dependent on definition of function above
    self.bestPlans = ko.computed(function()
    {
        var plans = [];

        var plan = self.GetBestPlan(12);
        if (plan)
        {
            plans.push(self.buildBestPlan(plan, "Best 12 Months Plan"));
        }
        plan = self.GetBestPlan(24);
        if (plan)
        {
            plans.push(self.buildBestPlan(plan, "Best 24 Months Plan"));
        }
        plan = self.GetBestPlan("LongTerm");
        if (plan)
        {
            plans.push(self.buildBestPlan(plan, "Best Long-Term Plan"));
        }

        return plans;
    });

    self.GetUtilities = function()
    {
        if (self.gettingData()) return;

        self.doneGettingData(false);
        self.gettingData(true);

        // clear out all fields
        self.ResetFlow();

        if (!self.serviceTypeId() ||  !self.zipCode())
        {
            self.gettingData(false);
            return;
        }

        self.GetZipCodeWithDefaultUtilities();
    }

    self.GetZipCodeWithDefaultUtilities = function()
    {
        // getZipCodeWithDefaultUtilities
        var body = JSON.stringify({
            "operationName":"GetZipCodeWithDefaultUtilities","variables":{
                "zipCode": self.zipCode(),
                "serviceTypeId": self.serviceTypeId()
            },"query":"query GetZipCodeWithDefaultUtilities($zipCode: String!, $serviceTypeId: String!) {\n  zipCode(zipCode: $zipCode) {\n    cities\n    stateId\n    defaultUtilityZone\n    state {\n    countryId\n    stateShort\n    stateLong\n    }\n    defaultUtilities(serviceTypeId: $serviceTypeId) {\n      utilityId\n      serviceTypeId\n    }\n  }\n}\n"});
        $.ajax(
        {
            type: 'POST',
            url: BASE_GRAPHQL_URL,
            headers: self.getHeader(),
            contentType: 'application/json',
            data: body,
            success: function(result)
            {
                self.SetLocationAndDefaultZone(result.data.zipCode);
                self.AssignAnnualUsage();

                if (result.data && result.data.zipCode && result.data.zipCode.defaultUtilities.length > 0)
                {
                    for (var i = 0; i < result.data.zipCode.defaultUtilities.length; i++)
                    {
                        var defaultUtility = result.data.zipCode.defaultUtilities[i];
                        if (defaultUtility.serviceTypeId != null && defaultUtility.utilityId != null
                            && self.utilityMapping[defaultUtility.serviceTypeId] == null)
                        {
                            self.utilityMapping[defaultUtility.serviceTypeId] = defaultUtility.utilityId;
                        }
                    }
                }

                self.LoadUtilitiesWithProperties();
            },
            error: function()
            {
                self.utilityAlertText("Could Not Load Utilities!");
                self.utilityAlertShow(true);
                self.gettingData(false);
            }
        });
    };

    self.LoadUtilitiesWithProperties = function()
    {
        if (!self.defaultUtilityId()) {
            self.utilityId(undefined);
        }
        self.utilities.removeAll();

        var body = JSON.stringify({
            "operationName":"GetQuoteUtilitiesWithProperties","variables":{
                "stateId": self.stateId(),
                "serviceTypeId": self.serviceTypeId()
            },"query":"query GetQuoteUtilitiesWithProperties($serviceTypeId: String!, $stateId: String!) {\n  utilities(criteria: {stateId: $stateId, serviceTypeId: $serviceTypeId, isActive: true, noChildren: true}, sort: \"name\") {\n    message {\n      utilityId\n      name\n      abbreviation\n      showNameKey\n      nameKeyFormat\n      nameKeyFormatHelp\n      showMeterNum\n      meterNumFormat\n      meterNumFormatHelp\n      showReferenceNum\n      referenceNumFormat\n      referenceNumFormatHelp\n      accountNumFormatHelp\n      accountNumLabel\n      accountNumFormat\n      baseRate\n      baseRate2\n      leadTime\n      mils\n      mils2\n      rateClasses(stateId: $stateId, isActive: true) {\n        name\n        description\n        isDefault\n      }\n      zones(stateId: $stateId, serviceTypeId: $serviceTypeId, isActive: true) {\n        name\n      }\n      baseRates(stateId: $stateId, serviceTypeId: $serviceTypeId, sort: \"effectiveDate desc\") {\n        baseRate\n        rateClass\n        zone\n      }\n      unit(stateId: $stateId, serviceTypeId: $serviceTypeId)\n    }\n  }\n}\n"});

        $.ajax(
        {
            type: 'POST',
            url: BASE_GRAPHQL_URL,
            headers: self.getHeader(),
            contentType: 'application/json',
            data: body,
            success: function(result)
            {
                if (!result.data || !result.data.utilities.message.length)
                {
                    self.utilityAlertText("No Available Utilities Found");
                    self.utilityAlertShow(true);
                    self.gettingData(false);
                }
                else
                {
                    // build up the objects first so as to not call the subscriber too much
                    var utilities = ko.utils.arrayMap(result.data.utilities.message, function(utility)
                    {
                        return new EntityViewModel(utility.name, utility.utilityId, utility);
                    });

                    // now push them all at once
                    if (result.data.utilities.message.length > 0)
                    {
                        self.utilities.push(new EntityViewModel(undefined, undefined));
                    }
                    self.utilities.push.apply(self.utilities, utilities);

                    // check for the default utility based on service type
                    var chosenUtility = ko.utils.arrayFirst(self.utilities(), function(utility) {
                        return (utility.value == self.utilityMapping[self.serviceTypeId()] && utility.value != undefined);
                    });

					if (!chosenUtility)
					{
						chosenUtility = self.utilities()[1];
					}

                    self.utilityId(chosenUtility.value);
                }
            },
            error: function()
            {
                self.utilityAlertText("Could Not Load Utilities!");
                self.utilityAlertShow(true);
                self.gettingData(false);
            }
        });
    };

    self.LoadUtilityProperties = function()
    {
        self.rateClass(undefined);
        self.zoneId(undefined);
        self.zones.removeAll();
        self.rateClasses.removeAll();
        self.baseRates.removeAll();
        self.baseRateChanged(false);

        var utility = ko.utils.arrayFirst(self.utilities(), function(utility)
        {
            return utility.entity && utility.entity.utilityId === self.utilityId();
        });

        if (utility) {
            self.LoadRateClasses(utility);
            self.LoadZones(utility);
            self.LoadUnits(utility);
            self.LoadBaseRates(utility);
        }

        self.gettingData(false);
        self.doneGettingData(true);
        self.getRatesEnabled(true);
    };

    self.LoadZones = function(utility)
    {
        // build up the object first
        var zones = ko.utils.arrayMap(utility.entity.zones, function(zone)
        {
            return new EntityViewModel(zone.name, zone.name);
        });

        // now push it all at once
        if (utility.entity.zones.length > 0)
        {
            self.zones.push(new EntityViewModel(undefined, undefined));
        }
        self.zones.push.apply(self.zones, zones);

        ko.utils.arrayForEach(self.zones(), function(zone)
        {
            if (zone.name == self.defaultZone() && self.defaultZone() != undefined)
            {
                self.zoneId(zone.name);
            }
        });

        if (self.zones().length >= 2 && !self.zoneId())
        {
            self.zoneId(self.zones()[1].name);
        }
    };

    self.LoadRateClasses = function(utility)
    {
        var rateClasses = ko.utils.arrayMap(utility.entity.rateClasses, function(rateClass)
        {
            return new RateClassViewModel(rateClass);
        });

        self.rateClasses.push.apply(self.rateClasses, rateClasses);

        // get the only, or get the default of the set
        var chosenRateClass = (self.rateClasses().length == 1
            ? self.rateClasses[0]
            : ko.utils.arrayFirst(self.rateClasses(), function(rateClass) {
                return rateClass.isDefault;
            }));

        if (chosenRateClass)
        {
            self.rateClass(chosenRateClass.name);
        }
    };

    self.LoadUnits = function(utility) 
    {
        self.energyUnit(utility.entity.unit);
    };

    self.LoadBaseRates = function(utility) 
    {
        if (!self.baseRateChanged())
        {
            var baseRates = ko.utils.arrayMap(utility.entity.baseRates, function(baseRate)
            {
                return new BaseRateViewModel(baseRate);
            });

            self.baseRates.push.apply(self.baseRates, baseRates);
    
            // get the base rate that matches the rate class
            var chosenBaseRate = ko.utils.arrayFirst(ko.utils.arrayFilter(self.baseRates(), function(baseRate) {
                return self.isNotResidential()
                    ? !baseRate.rateClass || baseRate.rateClass.toLowerCase() !== 'rs'
                    : baseRate.rateClass && baseRate.rateClass.toLowerCase() === 'rs';
            }), function(baseRate) {
                return (!self.rateClass() || (baseRate.rateClass && baseRate.rateClass.toLowerCase() === self.rateClass().toLowerCase()))
                    && (!self.zoneId() || (baseRate.zone && baseRate.zone.toLowerCase() === self.zoneId().toLowerCase()));
            });

            self.baseRate(chosenBaseRate
                ? chosenBaseRate.baseRate
                : self.isGas() ? utility.entity.baseRate2 : utility.entity.baseRate);

            if (!self.baseRate()) {
                self.baseRateValue("");
            }
            self.leadTime(utility.entity.leadTime / 2);

            self.CheckSpecialBaseRates();
        }
    };

    self.CopyVM = function(vm) {
        self.isCopying(true);
        Cookies.set("pk-promo", self.agentId().toLowerCase());
        self.agentId(vm.agentId());
        self.agent.agentId(vm.agent.agentId());
        self.agent.phoneNumber(vm.agent.phoneNumber());
        self.agent.phoneNumberTel(vm.agent.phoneNumberTel());
        self.agent.customerCompany(vm.agent.customerCompany());
        self.agent.agentDomainAlias(vm.agent.agentDomainAlias());
        self.agent.email(vm.agent.email());
        self.serviceTypeId(vm.serviceTypeId());
        self.utilities(vm.utilities());
        self.utilityId(vm.utilityId());
        self.rateClasses(vm.rateClasses());
        self.zipCode(vm.zipCode());
        self.rateClass(vm.rateClass());
        self.businessType(vm.businessType());
        self.citiesInZipCode(vm.citiesInZipCode());
        self.stateLong(vm.stateLong());
        self.stateShort(vm.stateShort());
        self.defaultZone(vm.defaultZone());
        self.stateId(vm.stateId());
        self.zones(vm.zones());
        self.zoneId(vm.zoneId());
        self.baseRate(vm.baseRate());
        self.annualUsage(vm.annualUsage());
        self.customer.initProviderInfo(vm.customer.provider(), self.stateLong(), self.stateShort(), self.isNotResidential(), self.zipCode(), self.citiesInZipCode(), self.annualUsage(), self.isGas());
        self.isCopying(false);
    };

    self.GetRates = function()
    {
        if (self.isFirstTimeGettingRates()) {
            self.isFirstTimeGettingRates(false);
            self.SetContractDate();
        }

        if (self.isRFQ()) // skip rates and go right to customer
        {
            self.verification.loadingSwitchOptions(false);
            self.ReturnToCustomerPage();
        }
        else if (self.rateRequestViewModel.isValid())
        {
            self.rates.removeAll();

            var utility = ko.utils.arrayFirst(self.utilities(), function(utility)
            {
                return utility.entity && utility.entity.utilityId === self.utilityId();
            });
            self.LoadBaseRates(utility);

            var request = {
                filter: {
                    where: {
                        agentId: self.agent.agentId(),
                        serviceTypeId: self.serviceTypeId(),
                        utilityId: self.utilityId(),
                        zipCode: self.zipCode(),
                        stateId: self.stateId(),
                        rateClass: self.rateClass() ? self.rateClass() : "",
                        usage: self.isNotResidential() ? self.annualUsage() : self.annualUsageResidential(),
                        zone: self.zoneId(),
                        effectiveDate: self.contractStartDate.effectiveDateSmall(),
                        baseRate: self.baseRate() ? self.baseRate() : undefined,
                        promoCodeId: self.promoCodeId()
                    }
                }
            };

            self.trackEvent(true);

            $.ajax({
                type: "GET",
                url: BASE_API_URL + "rate-matrixes/rates",
                headers: self.getHeader(),
                data: request,
                beforeSend: function()
                {
                    self.getRatesEnabled(false);
                    self.getRatesText(GETTING_RATES_TEXT);
                },
                success: function(result)
                {
                    self.showRateError(false);

                    var justNames = [];
                    var justContractLengths = [];
                    var rates = ko.utils.arrayMap(ko.utils.arrayFilter(result.message, function(item) {
                        return item.productId === FIXED_ALL_IN_ELEC || item.productId === FIXED_ALL_IN_GAS;
                    }), function(rate) {
                        justNames.push(rate.name);
                        justContractLengths.push(rate.term);
                        return new RateViewModel(rate, (self.isNotResidential() ? self.annualUsage() : self.annualUsageResidential()), self.isNotResidential(), self.energyUnit(), self.isTexas(), self.isGeorgia(), self.isGas());
                    });

                    self.rates.push.apply(self.rates, rates);

                    // sort asc by rate, and then by term if the rates are equal
                    self.rates.sort(function(a, b) {
                        return (a.rate < b.rate ? -1 : (a.rate != b.rate ? 1 : (a.term < b.term ? -1 : 1)));
                    });

                    if (result.message.length != 0)
                    {
                        self.uniqueSuppliers(ko.utils.arrayMap(ko.utils.arrayGetDistinctValues(justNames), function(item) {
                            return new FilterItemViewModel(item, item, true);
                        }));
                        self.uniqueContracts(ko.utils.arrayMap(ko.utils.arrayGetDistinctValues(justContractLengths), function(item) {
                            return new FilterItemViewModel(item, item, [6,12,18,24,36,42,48,60].indexOf(item) !== -1);
                        }));

                        self.FilterRates();
                    }
    
                    if (self.shouldScroll())
                    {
                        window.scrollTo(0,0);
                        self.showRates(true);
                        self.showInputPage(false);
                    }
                    self.shouldScroll(true); // reset if it was false
                    self.showInputPage(false);
                    self.innerStateChange(true);
                    self.innerStateChange.valueHasMutated();
                    location.hash = "step1";
                    self.fireTagEvent(window.pkEvents ? pkEvents['GetQuotes'] : null);
                    SetupToolTips();
                },
                complete: function()
                {
                    if (self.rates() && self.rates().length == 0)
                    {
                        self.showRateError(true);
                        self.rateErrorText((self.isNotResidential() ? AUCTION_TEXT : RATE_ERROR_TEXT));
                        if (self.isNotResidential())
                        {
                            self.showAuctionButton(true);
                        }
                    }

                    self.getRatesEnabled(true);
                    self.getRatesText(GET_RATES_TEXT);

                    self.DetermineDiscountText();
                }
            });
        }
        else
        {
            self.rateRequestViewModel.errors.showAllMessages();
            self.rateRequestViewModelErrorShow(true);
        }
    };

    self.Filter = function(rates, suppliers, contracts)
    {
        ko.utils.arrayForEach(rates(), function(rate) {
            // check suppliersToFilter
            var foundSupplier = ko.utils.arrayFirst(suppliers, function(supplier) {
                return supplier.name == rate.supplierName;
            }) != null;

            // check contractsToFilter
            var foundContract = ko.utils.arrayFirst(contracts, function(contract) {
                return contract.name == rate.term;
            }) != null;

            rate.show(!(foundSupplier || foundContract));
        });
    };

    self.FilterRates = function()
    {
        var suppliersToFilter = ko.utils.arrayFilter(self.uniqueSuppliers(), function(item) {
            return !item.isSelected();
        });

        var contractsToFilter = ko.utils.arrayFilter(self.uniqueContracts(), function(item) {
            return !item.isSelected();
        });

        self.Filter(self.rates, suppliersToFilter, contractsToFilter);
        self.Filter(self.bestPlans, suppliersToFilter, contractsToFilter);
    };

    self.SelectAllTerms = function()
    {
        ko.utils.arrayForEach(self.uniqueContracts(), function(item) {
            item.isSelected(true);
        });
    };

    self.ResetAllTerms = function()
    {
        ko.utils.arrayForEach(self.uniqueContracts(), function(item) {
            item.isSelected(false);
        });
    };

    self.SelectAllSuppliers = function()
    {
        ko.utils.arrayForEach(self.uniqueSuppliers(), function(item) {
            item.isSelected(true);
        });
    };

    self.ResetAllSuppliers = function()
    {
        ko.utils.arrayForEach(self.uniqueSuppliers(), function(item) {
            item.isSelected(false);
        });
    };

    self.ReRate = function()
    {
		self.shouldScroll(false);
		self.shouldScroll.valueHasMutated();
        self.GetRates();
    };

    self.ChooseSupplier = function(supplier)
    {
        if (supplier.requiresConspicuousTos && !supplier.reviewedTos()) {
            supplier.showSignUpWarning(true);
        } else {
            $('.modal').modal('hide');
            self.trackEvent(true);

            $.ajax(
            {
                type: 'GET',
                url: BASE_API_URL + "suppliers/rate-settings?filter[where][supplierId]=" + supplier.supplierId,
                headers: self.getHeader(),
                beforeSend: function() {
                    self.chooseSupplierEnabled(false);
                },
                success: function(result)
                {
                    var rateSetting = ko.utils.arrayFirst(result.message, function(supplierRateSetting) {
                        return supplierRateSetting.serviceTypeId === self.serviceTypeId()
                        && supplierRateSetting.stateId === self.stateId()
                        && supplierRateSetting.utilityId === self.utilityId();
                    });

                    var showTaxId = self.isNotResidential() && rateSetting && rateSetting.showTaxId;

                    // setup customer
                    self.customer.initSupplierInfo(supplier, showTaxId, self.energyUnit(), self.stateId(), self.utilityId(), self.rateClass());
                    // setup verification with customer meta info
                    self.showCustomerPage(true);
                    window.scrollTo(0,0);
                    self.showRates(false);
                    self.innerStateChange(true);
                    location.hash = "step2";
                    self.fireTagEvent(window.pkEvents ? pkEvents['ChoosePlan'] : null);
                    self.chooseSupplierEnabled(true);

                    SetupToolTips();
                }
            });
        }
    };

    self.CustomerSubmit = function()
    {
        self.trackEvent(true);

        self.customerErrorText("");
        self.customerErrorShow(false);
        self.customerSubmitText("Next");
        self.customerSubmitEnabled(true);

        self.ValidateCustomer();
    };

    self.ValidateCustomer = function()
    {
        self.customerSubmitText("Validating Customer...");
        self.customerSubmitEnabled(false);

        if (self.customerViewModel.isValid())
        {
            // we can find account number automatically in texas if we're also residential
            if ((self.customer.isTexas() && !self.customer.isOverrideTexas()) && !self.isNotResidential())
            {
                self.customerSubmitText("Getting Account Number...");
                self.customerSubmitEnabled(false);

                self.GetAccountNumbers();
            }
            else
            {
                self.UploadAttachments(0);
            }
        }
        else
        {
            self.customerErrorText("Please fill in all required fields above.");
            self.customerErrorShow(true);
            self.customerSubmitText("Next");
            self.customerSubmitEnabled(true);
            self.customerViewModel.errors.showAllMessages();
        }
    };

    self.VerificationInit = function()
    {
        self.customerSubmitText("Next");
        self.customerSubmitEnabled(true);
        self.customerErrorShow(false);

        self.verification.initVerification(self.customer, self.stateId(), self.serviceTypeId(), self.rateClass(), self.customer.locations()[0].accountNumber);
		self.verification.isNotResidential(self.isNotResidential());
        self.showVerifyPage(true);
        self.verificationErrorShow(false);
        self.verificationErrorText('');
        window.scrollTo(0,0);
        self.showCustomerPage(false);
        self.innerStateChange(true);
        location.hash = "step3";
        self.fireTagEvent(window.pkEvents ? pkEvents['SubmitCustomer'] : null);
    };

    self.ValidateAddresses = function()
    {
        for (var i = 0; i < self.customer.locations().length + (self.customer.billingAddressShow() ? 1 : 0); i++)
        {
            self.addressesValidList.push(undefined);
        }

        for (var i = 0; i < self.customer.locations().length; i++)
        {
            var location = self.customer.locations()[i];
            self.ValidateAddress(i, location.address(), location.address2(), location.city(), location.stateShort(), location.zipCode());
        }

        if (self.customer.billingAddressShow()) {
            self.ValidateAddress(self.customer.locations().length, self.customer.billingAddressAddress(), self.customer.billingAddressAddress2(), self.customer.billingAddressCity(),
                                        self.customer.billingAddressStateShort(), self.customer.billingAddressZipCode());
        }
    };

    self.GetAccountNumbers = function()
    {
        for (var i = 0; i < self.customer.locations().length; i++)
        {
            self.FindTexasAccountNumber(self.customer.locations()[i]);
        }
    };

    self.ValidateAddress = function(index, address, address2, city, stateShort, zipCode)
    {
        var query = "?address1=" + address + "&address2=" + address2 + "&city=" + city + "&state=" + stateShort + "&zip=" + zipCode;
        $.ajax(
        {
            type: "GET",
            url: BASE_VALIDATE_ADDRESS_API_URL + query,
            headers: self.getHeader(),
            success: function(result)
            {
                if (result.message.error || (result.message.length > 0 && result.message[0].hasError))
                {
                    self.customerErrorText("That address is not valid, please check your address.");
                    self.addressesValidList[index] = false;
                }
                else
                {
                    self.addressesValidList[index] = true;
                }
            },
            error: function()
            {
                self.customerErrorText("There was an issue validating your address.");
                self.addressesValidList[index] = false;
            },
            complete: function()
            {
                self.addressesValidCheck(self.addressesValidList);
            }
        });
    };

    self.FindTexasAccountNumber = function(loc)
    {
        var query = loc.address() + " " + loc.address2() + " " + loc.city() + " " + self.stateShort() + " " + self.zipCode();
        query = query.replace(/ +(?= )/g,''); // make everything single spaced
        $.ajax(
        {
            type: 'GET',
            url: BASE_API_URL + "utilities/account-numbers?filter[where][address]=" + query,
            headers: self.getHeader(),
            success: function(result)
            {
                if (result.message.accountNumber)
                {
                    loc.accountNumber(result.message.accountNumber);
                    self.addressesValid(true);

                    self.UploadAttachments(0);
                }
                else if (result.message.error)
                {
                    self.customerErrorText("We were unable to find your account number in our system, please enter your account number above.");
                    self.customerErrorShow(true);
                    self.customerSubmitText("Next");
                    self.customerSubmitEnabled(true);
                    self.customer.isOverrideTexas(true);
                    self.addressesValid(false);
                }
                else
                {
                    self.customerErrorText("We were unable to find your account number in our system, please enter your account number above.");
                    self.customerErrorShow(true);
                    self.customerSubmitText("Next");
                    self.customerSubmitEnabled(true);
                    self.customer.isOverrideTexas(true);
                    self.addressesValid(false);
                }
            },
            error: function()
            {
                self.customerErrorText("We were unable to find your account number in our system, please enter your account number above.");
                self.customerErrorShow(true);
                self.customerSubmitText("Next");
                self.customerSubmitEnabled(true);
                self.customer.isOverrideTexas(true);
                self.addressesValid(false);
            }
        });
    };

    self.UploadAttachments = function(index)
    {
        var lastMonthBillFileName = self.customer.locations()[index].lastMonthBillFileName();
        var lastMonthBillFile = self.customer.locations()[index].lastMonthBillFile();

        if (lastMonthBillFile != undefined)
        {
            var formData = new FormData();
            formData.append('file', lastMonthBillFile, lastMonthBillFileName);
            formData.append('attachmentTypeId', '4028d1e43f4cd717013f54e709170056');
            formData.append('description', lastMonthBillFileName);

            $.ajax(
            {
                type: "POST",
                url: BASE_API_URL + "attachments",
                headers: self.getHeader(),
                data: formData,
                cache: false,
                contentType: false,
                processData: false,
                success: function(result)
                {
                    self.customer.locations()[index].attachmentId(result.message.attachmentId);
                    if (self.customer.locations().length == index + 1)
                    {
                        self.VerificationInit();
                    }
                    else
                    {
                        self.UploadAttachments(index + 1);
                    }
                }
            });
        }
        else if (self.customer.locations().length == index + 1)
        {
            self.VerificationInit();
        }
        else
        {
            self.UploadAttachments(index + 1);
        }
    };

    self.FormatAccountNumber = function(accNum)
    {
        var isMoveIn = self.verification.switchOption() && self.verification.switchOption().switchTypeCode.toLowerCase().indexOf('move') !== -1;

        if (!accNum || (self.isAGL() && !self.isNotResidential() && isMoveIn)) return '';

        var formattedAccountNumber = accNum.trim();
        formattedAccountNumber = formattedAccountNumber.replace(/[-\.,]/g,'');

        if (self.isAGL()) {
            while(formattedAccountNumber.length < 10) {
                formattedAccountNumber = "0" + formattedAccountNumber;
            }
        }

        return formattedAccountNumber;
    };

    self.FormatMeterNumber = function(meterNum)
    {
        if (!meterNum || self.isNotResidential() || !self.isNipsco() || !self.isGas()) return meterNum;

        var formattedMeterNumber = meterNum.trim();

        while(formattedMeterNumber.length < 8) {
            formattedMeterNumber = formattedMeterNumber + "0";
        }

        return formattedMeterNumber;
    };

	self.ConfirmCustomerInformation = function()
	{
		if (self.verificationViewModel.isValid())
		{
			self.showVerifyPage(true);
			self.innerStateChange(true);
            self.verificationErrorShow(false);
            self.verificationErrorShow(false);
            self.verificationErrorText('');
			location.hash = "step3";
		}
		else
		{
			self.verificationErrorText("Please fill out all required information above.");
            self.verificationErrorShow(true);
            self.verificationViewModel.errors.showAllMessages();
		}
	};

    self.EnrollCustomer = function()
    {
        self.verificationErrorShow(false);
        self.verificationErrorText('');

        if (!self.isNotResidential()) {
            var isSwitch = self.verification.switchOption() && self.verification.switchOption().switchTypeCode.toLowerCase().indexOf('switch') !== -1;
            var accNum = self.customer.locations()[0].accountNumber();
            if ((!accNum || !accNum.trim()) && self.isAGL() && isSwitch) {
                self.verificationErrorShow(true);
                self.verificationErrorText('Your account number is required on the previous page.');
                return;
            }
        }

        if (self.verificationViewModel.isValid() && self.verification.allAcknowledged() && !self.verification.loadingAcknowledgements() && !self.verification.loadingSwitchOptions())
        {
            var attachmentIds = [];

            var locations = ko.utils.arrayMap(self.customer.locations(), function(loc) {
                if (loc.attachmentId())
                {
                    attachmentIds.push({id: loc.attachmentId()});
                }

                return {
                        annualUsage: self.annualUsage(),
                        address1: loc.address(),
                        address2: loc.address2(),
                        city: loc.city(),
                        zipCode: self.zipCode(),
                        utilityAccountNum: self.FormatAccountNumber(loc.accountNumber()),
                        utilityMeterNum: self.FormatMeterNumber(loc.meterNumber()),
                        utilityNameKey: loc.nameKey(),
                        utilityReferenceNum: loc.referenceNumber(),
                        rateClass: self.rateClass() ? self.rateClass() : undefined,
                        zone: self.zoneId(),
                        stateId: self.stateId(),
                        utilityId: self.utilityId()
                    };
            });

			// deprecated
			var finNumber = self.customer.finNumberRequired() ? self.customer.locations()[0].finNumber() : undefined;
			if (!finNumber)
			{
				finNumber = self.customer.finNumberRequired() ? self.customer.finNumber() : undefined;
			}

            var customer = {
                    dbaName: self.customer.legalEntityName() ? self.customer.legalEntityName() : self.customer.fullName(),
                    contactFname: self.customer.firstName(),
                    contactMiddle: self.customer.middleName(),
                    contactLname: self.customer.lastName(),
                    contactTitle: self.customer.title(),
                    address1: self.customer.locations()[0].address(),
                    address2: self.customer.locations()[0].address2(),
                    city: self.customer.locations()[0].city(),
                    stateId: self.stateId(),
                    zipCode: self.zipCode(),
                    billingAddress1: self.customer.billingAddressAddress() ? self.customer.billingAddressAddress() : self.customer.locations()[0].address(),
                    billingAddress2: self.customer.billingAddressAddress2() ? self.customer.billingAddressAddress2() : self.customer.locations()[0].address2(),
                    billingZipCode: self.customer.billingAddressZipCode() ? self.customer.billingAddressZipCode() : self.zipCode(),
                    billingCity: self.customer.billingAddressCity() ? self.customer.billingAddressCity() : self.customer.locations()[0].city(),
                    billingStateId: self.customer.billingAddressStateId() ? self.customer.billingAddressStateId() : self.stateId(),
                    phone: self.customer.phone(),
                    mobile: self.customer.mobile(),
                    email: self.customer.email(),
                    dob: self.verification.showDOB() ? self.verification.dobSmall() : undefined,
                    ssn: self.verification.showSSN() ? self.verification.ssn() : undefined,
                    language: self.customer.language(),
                    taxId: finNumber,
                    authorizedUser: self.customer.authorizedUser(),
                    referenceId: self.referenceId()
            };

            var contract = {
                planId: self.customer.supplier().planId,
                planName: self.customer.supplier().planName ? self.customer.supplier().planName.replace(" - PrePay", "") : "",
                productId: self.customer.supplier().productId,
                rateCodeId: self.customer.supplier().rateCodeId,
                rate: self.customer.supplier().rate,
                term: self.customer.supplier().term,
                status: self.quoteStatus(),
                agentId: self.agent.agentId(),
                switchTypeCode: self.verification.switchOption() ? self.verification.switchOption().switchTypeCode : 'Move-In',
                switchDate: (self.verification.showMoveInType() && (self.customer.isGeorgia() || self.customer.isTexas()))
                    ? self.verification.contractStartDate.switchDateContract()
                    : self.contractStartDate.effectiveDateContract(),
                effectiveDate: self.contractStartDate.effectiveDateContract(),
				taxExemptReason: self.verification.taxExemptReason(),
                customer: customer,
                locations: locations,
                attachments: attachmentIds,
                serviceTypeId: self.serviceTypeId(),
                supplierId: self.customer.supplier().supplierId,
				moveInType: self.verification.moveInType(),
                dwellingType: self.isNotResidential() ? "Commercial" : self.customer.dwellingType(),
                tosPath: self.customer.supplier().originalTosPath,
                disclaimerPath: self.customer.supplier().originalDisclaimerPath,
                eflPath: self.customer.supplier().originalEflPath,
                yracPath: self.customer.supplier().originalYracPath,
                promoCodeId: self.promoCodeId(),
                greenPercentage: self.customer.supplier().greenPercentage,
                commissionStatus: 1,
                submissionStatus: 2
            };

            if (self.customer.supplier().newMils > 0) {
                contract.mils = self.customer.supplier().newMils;
            }

            $.ajax(
            {
                type: "POST",
                url: BASE_API_URL + "contracts",
                headers: self.getHeader(),
                data: JSON.stringify(contract),
                processData: false,
                contentType: "application/json",
                dataType: "json",
                beforeSend: function()
                {
                    self.enrollCustomerButtonEnabled(false);
                    self.enrollCustomerButtonText("Submitting...");
                },
                success: function(result)
                {
                    self.creditCheckMessage(result.message.creditCheckMessage ? "Credit Check Message: " + result.message.creditCheckMessage + " Please check your email regarding your signup for more information on how to proceed." : result.message.creditCheckMessage);
                    self.rejectMessage(result.message.rejectReason);
                    var today = new Date().toLocaleString();
                    var parts = today.split(",");
                    if (self.rejectMessage()) {
                        self.enrollmentTimestampText("You've started the enrollment process on: " + parts[0] + " at" + parts[1]);
                    } else {
                        self.enrollmentTimestampText("You've been enrolled on: " + parts[0] + " at" + parts[1]);
                    }
                    if (result.message.contractNum)
                    {
                        self.trackEvent(true, result.message.contractId);
                        if (self.rejectMessage()) {
                            self.enrollmentConfirmationNumber("Your tracking number is: " + result.message.contractNum);
                        } else {
                            self.enrollmentConfirmationNumber("Your confirmation number is: " + result.message.contractNum);
                        }
                    }

                    self.showConfirmationPage(true);
                    window.scrollTo(0,0);
                    self.showVerifyPage(false);
                    self.innerStateChange(true);
                    self.enrollCustomerButtonText("Submit");
                    self.enrollCustomerButtonEnabled(true);
                    location.hash = "final";
                    self.fireTagEvent(window.pkEvents ? pkEvents['SubmitContract'] : null);
                },
                error: function(err, res)
                {
                    if (err.statusText)
                    {
                        self.verificationErrorText(err.statusText);
                        self.verificationErrorShow(true);
                        self.enrollCustomerButtonText("Submit");
                        self.enrollCustomerButtonEnabled(true);
                    }
                }
            });
        }
        else
        {
            if (!self.verification.allAcknowledged())
            {
                self.verificationErrorText("Please Agree to All Terms and Conditions Before Submission.");
                self.verificationErrorShow(true);
            }
            else
            {
                self.verificationErrorText("Please fill out all required information above.");
                self.verificationErrorShow(true);
                self.verificationViewModel.errors.showAllMessages();
            }
        }
    };

    self.SetupAffiliateAgent = function()
    {
        var afilliateAgent = {
            contactFname: self.customer.firstName(),
            contactMiddle: self.customer.middleName(),
            contactLname: self.customer.lastName(),
            contactTitle: self.customer.title(),
            address1: self.customer.locations()[0].address(),
            address2: self.customer.locations()[0].address2(),
            city: self.customer.locations()[0].city(),
            zipCode: self.zipCode(),
            phone: self.customer.phone(),
            email: self.customer.email(),
            ssn: (self.verification.showSSN() ? (self.verification.ssn() ? self.verification.ssn() : DEFAULT_SSN) : DEFAULT_SSN),
            name: self.customer.fullName(),
            legalTaxName: self.customer.fullName(),
            stateId: self.stateId(),
            isAffiliate: true,
            supplierCompany: 'Power Kiosk',
            promoCodes: [
                {
                    slug: self.customer.fullName().trim()
                        .replace(/[^a-zA-Z]/g, '')
                        .replace(/ /g, '')
                        .toLowerCase()
                }
            ]
        };

        $.ajax({
            type: 'POST',
            url: BASE_API_URL + 'affiliate-agents',
            headers: self.getHeader(),
            data: JSON.stringify(afilliateAgent),
            processData: false,
            contentType: "application/json",
            dataType: "json",
            beforeSend: function() {
                self.affiliateAgentText("Signing up...");
            },
            success: function(result) {
                self.affiliateConfirmationSuccessText("Great, we’ve sent an email to the address you provided on how the referral program works. (Be sure to check spam folder.)");
                self.affiliateConfirmationSuccessShow(true);
                self.affiliateAgentButtonShow(false);
                self.affiliateAgentText("Sign Me Up as a Referral Partner!");
            },
            error: function(err, res) {
				if (err.statusText)
                {
					if (err.statusText.indexOf("Email") != -1)
					{
						self.affiliateConfirmationErrorText("Your email address is already registered as an affiliate with Power Kiosk. If you have forgotten your code, you can give us a call and we will find that information for you.");
					}
					else
					{
						self.affiliateConfirmationErrorText(err.statusText);
					}
				}
				else
				{
					self.affiliateConfirmationErrorText("There was a problem signing up.  Please contact your agent.");
				}

				self.affiliateConfirmationErrorShow(true);
				self.affiliateAgentButtonShow(false);
				self.affiliateAgentText("Sign Me Up as a Referral Partner!");
            }
        });
    };

    self.ResetFlow = function()
    {
        if (!self.defaultUtilityId()) {
            self.utilityId(undefined);
        }
        self.utilities.removeAll();
        self.baseRate(undefined);
        self.leadTime(undefined);
        self.zoneId(undefined);
        self.zones.removeAll();
        self.addressesValidList = [];
        self.defaultZone(undefined);

        self.rateRequestViewModelErrorShow(false);
        self.affiliateConfirmationSuccessShow(false);
        self.affiliateConfirmationErrorShow(false);
        self.verificationErrorShow(false);
    };

    self.ClearAlerts = function()
    {
        self.utilityAlertShow(false);
        self.showRateError(false);
        self.serviceAlertShow(false);
        self.zoneErrorShow(false);
        self.rateClassErrorShow(false);
    };

    self.chooseServiceType = function(serviceType)
    {
        if (!self.gettingData())
        {
            self.serviceTypeId(serviceType.serviceTypeId);
        }
    };

    self.chooseUtility = function(utility)
    {
        if (!self.gettingData())
        {
            self.utilityId(utility.value);
        }
    };

    self.chooseZone = function(zone)
    {
        if (!self.gettingData())
        {
            self.zoneId(zone.value);
        }
    };

    self.chooseBusiness = function(business)
    {
        self.businessType(business.value);
    };

    self.ChangeAgentId = function()
    {
        self.newPromoCode(self.promoCodeInput());
    };

	self.CheckSpecialBaseRates = function()
	{
		if (self.specialBaseRates() && self.specialBaseRates().length > 0)
		{
			var specialUtilityWithBaseRate = ko.utils.arrayFirst(self.specialBaseRates(), function(utilityBaseRate) {
				return (utilityBaseRate.name == self.utilityName() && utilityBaseRate.name != undefined);
			});

			if (specialUtilityWithBaseRate)
			{
                self.baseRate(specialUtilityWithBaseRate.value);
                self.leadTime(specialUtilityWithBaseRate.entity.leadTime / 2);
			}
		}
    };

    self.ClearPromoCode = function()
    {
        Cookies.remove("pk-promo");
        Cookies.remove("pk-promo-image");
        location.hash = "";
        location.reload();
    };

    self.SetContractDate = function()
    {
        var month = 1;
        var year = (new Date()).getFullYear();

		if (self.businessType() != "residential")
        {
			var monthIncrease = 1;

			var testDate = new Date();
			var testMonth = testDate.getMonth();
			testDate.setDate(testDate.getDate() + (self.leadTime() ? self.leadTime() : 15));
			if (testDate.getMonth() != testMonth)
			{
				monthIncrease = 2;
			}

            var nextDate = new Date();
            nextDate.setMonth(nextDate.getMonth() + monthIncrease);
            month = nextDate.getMonth() + 1;
            if (month == 1 || (monthIncrease == 2 && month == 2))
            {
                year += 1;
            }
        }
        else
        {
            var today = new Date();
            var thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            thisMonth.setMonth(thisMonth.getMonth() + 1);
            month = thisMonth.getMonth() + 1;
            if (thisMonth == 1)
            {
                year += 1;
            }
        }

        self.contractStartDate.effectiveDateMonth(month);
		self.contractStartDate.effectiveDateYear(year);
    };

    self.trackEvent = function(isAsync, contractId) {
        var obj = {
            dbaName: self.customer.legalEntityName() ? self.customer.legalEntityName() : self.customer.fullName(),
            contactFname: self.customer.firstName(),
            contactMiddle: self.customer.middleName(),
            contactLname: self.customer.lastName(),
            contactTitle: self.customer.title(),
            address1: self.customer.locations()[0].address(),
            address2: self.customer.locations()[0].address2(),
            city: self.customer.locations()[0].city(),
            state: self.stateLong(),
            zipCode: self.zipCode(),
            phone: self.customer.phone(),
            email: self.customer.email(),
            language: self.customer.language(),
            rateClass: self.rateClass() ? self.rateClass() : "",
            annualUsage: self.isNotResidential() ? self.annualUsage() : self.annualUsageResidential(),
            term: self.customer.supplier() ? self.customer.supplier().term : undefined,
            zone: self.zoneId(),
            effectiveDate: self.contractStartDate.effectiveDateSmall(),
            baseRate: self.baseRate() ? self.baseRate() : undefined
        };

        if (self.agent.agentId()) {
            obj.agent = { agentId: self.agent.agentId() };
        }
        if (self.serviceTypeId()) {
            obj.serviceType = { serviceTypeId: self.serviceTypeId() };
        }
        if (self.utilityId()) {
            obj.utility = { utilityId: self.utilityId() };
        }
        if (self.stateId()) {
            obj.state = { stateId: self.stateId() };
        }
        if (self.customer.supplier().supplierId) {
            obj.supplier = { supplierId: self.customer.supplier().supplierId };
        }
        if (contractId) {
            obj.contract = { contractId: contractId };
        }

        var data = JSON.stringify(obj);
        $.ajax({
            type: (self.trackingId() != undefined ? 'PUT' : 'POST'),
            url: BASE_API_URL + 'customers/analytics' + (self.trackingId() != undefined ? '/' + self.trackingId() : ''),
            headers: self.getHeader(),
            data: data,
            async: isAsync,
            contentType: "application/json",
            dataType: "json",
            success: function(result) {
                if (self.trackingId() == undefined) {
                    self.trackingId(result.message.id);
                }
            }
        });
    };

    self.AssignAnnualUsage = function(serviceTypeId) {
        var serviceType = ko.utils.arrayFirst(self.serviceTypes(), function(serviceType) {
            return serviceType.serviceTypeId == (serviceTypeId ? serviceTypeId : self.serviceTypeId());
        });

        self.showRateError(false);
        if (serviceType)
        {
            if (self.isGas() && self.isCanada() && self.isNotResidential()) {
                self.annualUsage(serviceType.defaultUsageCanada);
            } else {
                self.annualUsage(serviceType.defaultUsage);
            }
        }
    };

    /************************ Subscriptions ********************/
    self.newPromoCode.subscribe(function(newValue)
    {
		if (newValue)
		{
			self.agentId(newValue);
			self.GetAgent(true, true);
		}
    });

	self.newPromoCodeFromAffinity.subscribe(function(newValue)
	{
		self.agentId(newValue);
		self.GetAgent(true);
    });

    self.businessType.subscribe(function(newValue)
    {
        self.isFirstTimeGettingRates(true);
        self.rateRequestViewModel.errors.showAllMessages(false);

        var chosenUtility = ko.utils.arrayFirst(self.utilities(), function(utility) {
            return (utility.value == self.utilityId() && utility.value != undefined);
        });

        if (chosenUtility)
        {
            var annualUsage = (self.isNotResidential() ? self.annualUsage() : self.annualUsageResidential());
            self.customer.initProviderInfo(chosenUtility.entity, self.stateLong(), self.stateShort(), self.isNotResidential(), self.zipCode(), self.citiesInZipCode(), annualUsage, self.isGas());
        }

        self.LoadUtilityProperties();
    });

    self.zipCode.subscribe(function(newValue)
    {
        if (!self.isCopying()) {
            self.ClearAlerts();

            // important to use this because it makes it so that it doesn't
            // show the validation message yet until the user actually clicks
            self.rateRequestViewModel.errors.showAllMessages(false);

            if ((!isNaN(newValue) && newValue.length == 5) ||
                (isNaN(newValue) && newValue.trim().indexOf(" ") === -1 && newValue.trim().length === 6) ||
                (isNaN(newValue) && newValue.trim().indexOf(" ") !== -1 && newValue.trim().length === 7))
            {
                if (isNaN(newValue) && newValue.trim().indexOf(" ") !== -1 && newValue.trim().length === 7) {
                    self.zipCode(self.zipCode().replace(/ /g, ""));
                } else {
                    // start quote flow
                    self.GetUtilities();
                }
            }
        }
    });

    self.rateClass.subscribe(function() {
        if (self.utilities() && self.utilityId()) 
        {
            var utility = ko.utils.arrayFirst(self.utilities(), function(utility)
            {
                return utility.entity && utility.entity.utilityId === self.utilityId();
            });
            if (utility) {
                self.LoadBaseRates(utility);
                self.baseRateChanged(false);
            }
        }
        self.rates.removeAll();
    });

    self.zoneId.subscribe(function() {
        if (self.utilities() && self.utilityId()) 
        {
            var utility = ko.utils.arrayFirst(self.utilities(), function(utility)
            {
                return utility.entity && utility.entity.utilityId === self.utilityId();
            });
            if (utility) {
                self.LoadBaseRates(utility);
                self.baseRateChanged(false);
            }
        }
        self.rates.removeAll();
    });

    self.serviceTypeId.subscribe(function() {
        self.rates.removeAll();
    });

    self.utilityId.subscribe(function(newValue)
    {
        if (!self.isCopying()) {
            self.rates.removeAll();
            self.rateRequestViewModel.errors.showAllMessages(false);

            if (newValue != undefined)
            {
                self.showRateError(false);

                var chosenUtility = ko.utils.arrayFirst(self.utilities(), function(utility) {
                    return (utility.value == newValue && utility.value != undefined);
                });

                if (chosenUtility)
                {
                    var annualUsage = (self.isNotResidential() ? self.annualUsage() : self.annualUsageResidential());
                    self.customer.initProviderInfo(chosenUtility.entity, self.stateLong(), self.stateShort(), self.isNotResidential(), self.zipCode(), self.citiesInZipCode(), annualUsage);
                }

                self.LoadUtilityProperties();
            }
        }
    });

    self.serviceTypeId.subscribe(function(newValue)
    {
        if (!self.isCopying()) {
            self.rateRequestViewModel.errors.showAllMessages(false);

            if (newValue != null && newValue != undefined)
            {
                self.AssignAnnualUsage(newValue);
            }

            if (self.zipCode() && self.zipCode().length >= 5)
            {
                self.GetUtilities();
            }
            else
            {
                self.ResetFlow();
            }
        }
    });

    self.baseRate.subscribe(function(newValue) {
        if (newValue !== undefined && !self.gettingData()) {
            self.baseRateChanged(true);
        }
    });

    self.verification.loadingAcknowledgements.subscribe(function(newValue) {
        if (newValue !== undefined) {
            self.enrollCustomerButtonEnabled(!newValue);
        }
    });

    // sorting goes as such
    // return -1 means 'a' comes first
    // return 1 means 'b' comes first
    self.sortMethod.subscribe(function(newValue)
    {
        switch(newValue)
        {
            case "-term":
                // sort desc by term, then sort by rate if terms are equal
                self.rates.sort(function(a, b) {
                    return (a.term > b.term ? -1 : (a.term != b.term ? 1 : (a.rate < b.rate ? -1 : 1)));
                });
                break;
            case "term":
                // sort asc by term, then sort by rate if terms are equal
                self.rates.sort(function(a, b) {
                    return (a.term < b.term ? -1 : (a.term != b.term ? 1 : (a.rate < b.rate ? -1 : 1)));
                });
                break;
            case "displayRate":
                // sort asc by rate, and then by term if the rates are equal
                self.rates.sort(function(a, b) {
                    return (a.rate < b.rate ? -1 : (a.rate != b.rate ? 1 : (a.term < b.term ? -1 : 1)));
                });
                break;
            case "-savings":
                // sort desc by savings, then sort by rate if savings are equal
                self.rates.sort(function(a, b) {
                    return (a.estSavings > b.estSavings ? -1 : (a.estSavings != b.estSavings ? 1 : (a.rate < b.rate ? -1 : 1)));
                });
                break;
            case "-popularity":
                // sort desc by popularity, then sort by rate if savings are equal
                self.rates.sort(function(a, b) {
                    return (a.popularity > b.popularity ? -1 : (a.popularity != b.popularity ? 1 : (a.rate < b.rate ? -1 : 1)));
                });
                break;
        }
    });

    self.addressesValidCheck = function(newValue) {
        var addressesValid = true;
        var allValuesReturned = true;

        for (var i = 0; i < newValue.length; i++) {
            if (newValue[i] == undefined) {
                allValuesReturned = false;
            }

            if (!newValue[i]) {
                addressesValid = false;
            }
        }

        if (allValuesReturned) {
            self.addressesValid(addressesValid);
            self.UploadAttachments(0);
        }
    };

    window.onbeforeunload = function()
    {
        if (self.showCustomerPage())
        {
            self.trackEvent(false);
        }
    };

	// handle all the browser back events only
    window.onhashchange = function()
    {
		try
		{
			ga('send', 'pageview', { 'page': location.pathname + location.search + location.hash});
		}
		catch(e)
		{
			// nothing to do
		}

        if (!self.innerStateChange())
        {
            switch(location.hash)
            {
                case "#step1":
                    self.ReturnToRatesPage();
                    break;
                case "#step2":
                    self.ReturnToCustomerPage();
                    break;
                case "#step3":
					self.ReturnToVerifyPage();
                case "#step4":
                case "":
                    self.ReturnToInputPage();
                    break;
            }
        }

        self.innerStateChange(false);
    };

    /************************ INIT *****************************/
    self.InitPowerKioskECommerce();
};