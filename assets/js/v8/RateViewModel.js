var RateViewModel = function(rm, annualUsage, isNotResidential, energyUnit, isTexas, isGeorgia, isGas)
{
    var self = this;

    self.getHeader = function()
    {
        return $.ajaxSettings.headers && $.ajaxSettings.headers["API-Key"]
            ? { 'API-Key': $.ajaxSettings.headers["API-Key"] }
            : { 'API-Key': API_KEY };
    };

    self.formatPhone = function(phone)
    {
        if (!phone) return "";

        var splitPhone = String(phone).replace(/-/g, "").split("");

        return "(" + splitPhone[0] + splitPhone[1] + splitPhone[2] + ") "
                   + splitPhone[3] + splitPhone[4] + splitPhone[5] + "-"
                   + splitPhone[6] + splitPhone[7] + splitPhone[8] + splitPhone[9];
    };

    self.getPath = function(path)
    {
        if (!path) return '';

        return !path.includes('http')
            ? BASE_URL + path + '?access_token=' + API_KEY
            : path;
    };

	self.getEnergyUnit = function(rate, supplierId, unit)
	{
		if (supplierId == "58464f0057623df801577a9d9c7103df" && rate >= 50) {
			return "month";
		}
		else {
			return unit;
		}
    };

	self.parseExtraContent = function(extra)
    {
        try
        {
            if (typeof extra == "object")
            {
                return extra;
            }

            return JSON.parse(extra);
        }
        catch(e)
        {
            return null;
        }
    };

    // used for filtering
    self.show = ko.observable(true);
    self.rawRate = rm.supplierId ? rm : rm.rawRate;
	self.supplierId = rm.supplierId ? rm.supplierId : rm.supplierId;
    self.rate = rm.rate ? rm.rate : rm.rate;
    self.apiRateDisplay = rm.displayRate ? rm.displayRate : rm.apiRateDisplay;
    self.phone = String(rm.phone3 ? rm.phone3 : rm.phone);
    self.isConstellation = self.supplierId === "588f51ee45f198db0145f5dc2ed63247";
    self.isJustEnergy = self.supplierId === "588f51ee4b9fc5b6014bfb0a225e1b2f";
    self.isMajorEnergy = self.supplierId === "58464f0050cfb5da0150d627946f0153";
    self.isProviderPower = self.supplierId === "588f17956e00c5e7016e04a84dca0943";
    self.isSparkEnergy = self.supplierId === "588f51ee4602f43b01460540eaf93252";
    self.isVerdeEnergy = self.supplierId === "588f51ee45f198db0145f5e301c0324b";
    if (self.isConstellation) {
        if (self.phone) {
            var phoneSplit = self.phone.split("/");
            if (phoneSplit.length > 1)
            {
                var phoneSuffix = phoneSplit[1].split("-");
                self.phone = phoneSplit[0] + (isTexas ? phoneSuffix[0] : phoneSuffix[1]);
            }
        }
    }
    self.phoneDisplay = ko.computed(function() {
        return  (self.phone ? "or call " + self.formatPhone(self.phone) : "");
    });
    self.logo = self.getPath(rm.logo ? rm.logo : rm.logo);
    self.rateDisplay = self.apiRateDisplay;
	self.extra = self.parseExtraContent(rm.extra ? rm.extra : rm.extra);
	self.isPrepaid = self.extra && self.extra.isPrepaid ? self.extra.isPrepaid : undefined;
	self.isPrepaidDisplay = self.isPrepaid ? 'Yes' : 'No';
    self.dailyServiceFee = accounting.formatMoney(self.extra && self.extra.dailyServiceFee ? self.extra.dailyServiceFee : undefined);
    self.billingMethod = isTexas || isGeorgia ? "" : (rm.billingMethod ? rm.billingMethod : rm.billingMethod);
	if (self.billingMethod == "Single Bill")
	{
		self.billingMethod += " (Same utility bill. Only the supply portion on your bill changes.)"
    }
    self.supplierNote = ko.computed(function() {
        return isTexas && (self.isMajorEnergy || self.isSparkEnergy || self.isProviderPower || self.isVerdeEnergy)
            ? 'This supplier does not accept Priority Move In customers. If your customer needs power immediately, please select another supplier.'
            : '';
    });
    self.term = rm.term ? rm.term : rm.term;
    self.termDisplay = ko.computed(function() {
        return (self.term ? self.term + " month" : "Month-By-Month");
    });
    self.puct = rm.puct ? rm.puct : rm.puct;
    self.planName = rm.planName ? rm.planName : rm.planName;
	if (self.isPrepaid)
	{
		self.planName += " - PrePay";
	}
    self.planId = rm.planId ? rm.planId : rm.planId;
    self.productId = rm.productId ? rm.productId : rm.productId;
    self.rateCodeId = rm.rateCodeId ? rm.rateCodeId : rm.rateCodeId;
    self.supplierName = rm.name ? rm.name : rm.supplierName;

    self.bandwidthPercentage = rm.bandwidthPercentage ? rm.bandwidthPercentage : rm.bandwidthPercentage;
    self.popularity = rm.popularity ? rm.popularity : (rm.popularity ? rm.popularity : 0);
    self.bandwidthPercentageDisplay = ko.computed(function() {
        return self.bandwidthPercentage + "%";
    });
	self.bandwidthText = ko.computed(function() {
		if (self.bandwidthPercentageDisplay() == "100%" || self.bandwidthPercentageDisplay() == "undefined%")
		{
			return "Your rate stays fixed, no matter how much " + (isGas ? "natural gas" : "energy") + " you consume.";
		}

		return "Your rate stays fixed as long as monthly " + (isGas ? "natural gas" : "energy") + " consumption doesn't decrease by " + self.bandwidthPercentageDisplay() + " or increase by " + self.bandwidthPercentageDisplay() + " (double) over the past 12 months' avg. monthly usage.";
	});
	self.bandwidthTextHtml = ko.computed(function() {
		if (self.bandwidthPercentageDisplay() == "100%" || self.bandwidthPercentageDisplay() == "undefined%")
		{
			return "Your rate stays fixed, no matter how much " + (isGas ? "natural gas" : "energy") + " you consume.";
		}

		return "Your rate stays fixed as long as monthly " + (isGas ? "natural gas" : "energy") + " consumption doesn't <strong>decrease by " + self.bandwidthPercentageDisplay() + "</strong> or <strong>increase by " + self.bandwidthPercentageDisplay() + "</strong> (double) over the past 12 months' avg. monthly usage.";
	});
    self.salesTax = rm.salesTax ? rm.salesTax : rm.salesTax;
    self.salesTaxDisplay = ko.computed(function() {
        return (self.salesTax ? self.salesTax : "0") + "%";
    });
    self.greenPercentage = rm.greenPercentage ? rm.greenPercentage : rm.greenPercentage;
    self.greenPercentageDisplay = ko.computed(function() {
        return (self.greenPercentage ? self.greenPercentage : "0") + "%";
    });
    self.monthlyServiceFee = rm.monthlyServiceFee ? rm.monthlyServiceFee : rm.monthlyServiceFee;
    self.monthlyServiceFeeDisplay = ko.computed(function() {
        return accounting.formatMoney(self.monthlyServiceFee) + " per mo.";
    });
    self.cancellationFee = rm.cancellationPenaltyDesc ? rm.cancellationPenaltyDesc : rm.cancellationFee;
    self.tosPath = self.getPath(rm.tosPath ? rm.tosPath : rm.tosPath);
    self.disclaimerPath = self.getPath(rm.disclaimerPath ? rm.disclaimerPath : rm.disclaimerPath);
    self.eflPath = self.getPath(rm.eflPath ? rm.eflPath : rm.eflPath);
    self.yracPath = self.getPath(rm.yracPath ? rm.yracPath : rm.yracPath);
    self.originalTosPath = rm.tosPath;
    self.originalDisclaimerPath = rm.disclaimerPath;
    self.originalEflPath = rm.eflPath;
    self.originalYracPath = rm.yracPath;
    self.baseRate = rm.baseRate ? rm.baseRate : rm.baseRate;
    self.estSavings = rm.savings ? rm.savings : rm.estSavings;
    self.estSavingsDisplay = accounting.formatMoney(self.estSavings);
	self.estSavingsDisplayRaw = self.term ? self.estSavings / (self.term ? self.term : 12) : 0;
	self.estSavingsDisplayMonthly = accounting.formatMoney(self.estSavingsDisplayRaw);
    self.templateIndex = ko.observable(1);
    self.headingDisplay = ko.observable();
    self.energyUnit = ko.observable(self.getEnergyUnit(self.rate, self.supplierId, energyUnit));
    self.deliveryText = (isGas ? "Natural Gas" : "Energy") + " is always distributed and delivered through your local utility company, regardless of your plan.";
    self.showSignUpWarning = ko.observable(false);
    self.signUpWarningText = ko.observable("Please review the terms and conditions before signing up.");
    self.reviewedTos = ko.observable(false);
    self.tosText = ko.observable('Terms &amp; Conditions');
    self.hasExternalTos = self.originalTosPath ? self.originalTosPath.indexOf('http') !== -1 : false;
    self.effectiveDate = rm.effectiveDate ? rm.effectiveDate : rm.effectiveDate;
    self.requiresConspicuousTos = self.extra && self.extra.requiresConspicuousTos ? self.extra.requiresConspicuousTos : undefined;
    self.newMils = rm.newMils ? rm.newMils : rm.newMils;
    self.showDepositDisclaimer = rm.showDepositDisclaimer ? rm.showDepositDisclaimer : rm.showDepositDisclaimer;
    self.depositDisclaimerNote = rm.depositDisclaimerNote ? rm.depositDisclaimerNote : rm.depositDisclaimerNote;

    if (self.isPrepaid) {
        self.showDepositDisclaimer = false;
    }

    if (!self.showDepositDisclaimer) {
        self.showDepositDisclaimer = true;
        self.depositDisclaimerNote = 'Never requires a deposit';
    }

    if (isNotResidential) {
        self.showDepositDisclaimer = false;
        self.cancellationFee = '';
    }

    self.showRateDisplayTitleTooltip = ko.observable(false);
    self.rateDisplayTitleTooltip = ko.observable("");
    self.rateDisplayTitle = ko.observable("Rate per <span>" + self.energyUnit() + "</span>");
    self.rateDisplayTitle2 = ko.observable("Per <span>" + self.energyUnit() + "</span>");
    self.rateDisplayTitle3 = ko.observable("Rate (<span>" + self.energyUnit() + "</span>)");

    self.setupRateDisplays = function() {
        self.rateDisplayTitle("Rate per <span>" + self.energyUnit() + "</span>");
        self.rateDisplayTitle2("Per <span>" + self.energyUnit() + "</span>");
        self.rateDisplayTitle3("Rate (<span>" + self.energyUnit() + "</span>)");
        if (isTexas && !isNotResidential && !isGas) {
            self.rateDisplayTitle("1000 " + self.energyUnit() + " Rate");
            self.rateDisplayTitle2("1000 " + self.energyUnit() + " Rate");
            self.rateDisplayTitle3("1000 (<span>" + self.energyUnit() + " Rate</span>)");
            self.showRateDisplayTitleTooltip(true);
            self.rateDisplayTitleTooltip("This is the average price per " + self.energyUnit() + " with monthly usage at 1000 " + self.energyUnit() + 
            ". Your average price may vary depending on your usage and the plan details listed in the EFL.");
        }
    }

    self.hasReviewedTos = function() {
        self.reviewedTos(true);
        self.showSignUpWarning(false);
        return true;
    }

    self.showTos = function(index) {
        self.hasReviewedTos();
        if (!self.hasExternalTos) {
            $("#tosForm" + self.templateIndex() + index).submit();
            return false;
        } else {
            return true;
        }
    };

    self.getLowerCaseRate = function() {
        var plan =  {};
        if (self.rawRate) {
            plan.addDate = self.rawRate.addDate;
            plan.bandwidthPercentage = self.rawRate.bandwidthPercentage;
            plan.billingMethod = self.rawRate.billingMethod;
            plan.cancellationPenaltyDesc = self.rawRate.cancellationPenaltyDesc;
            plan.commission = self.rawRate.commission;
            plan.disclaimerPath = self.rawRate.disclaimerPath;
            plan.displayRate = self.rawRate.displayRate;
            plan.greenPercentage = self.rawRate.greenPercentage;
            plan.logo = self.rawRate.logo;
            plan.monthlyServiceFee = self.rawRate.monthlyServiceFee;
            plan.name = self.rawRate.name;
            plan.phone3 = self.rawRate.phone3;
            plan.planId = self.rawRate.planId;
            plan.planName = self.rawRate.planName;
            plan.popularity = self.rawRate.popularity;
            plan.premium = self.rawRate.premium;
            plan.rate = self.rawRate.rate;
            plan.rateAddDate = self.rawRate.rateAddDate;
            plan.rateClass = self.rawRate.rateClass;
            plan.salesTax = self.rawRate.salesTax;
            plan.savings = self.rawRate.savings;
            plan.supplierId = self.rawRate.supplierId;
            plan.supplierName = self.rawRate.name;
            plan.term = self.rawRate.term;
            plan.tosPath = self.rawRate.tosPath;
            plan.usageAdjustment = self.rawRate.usageAdjustment;
            plan.enRateDetail = self.rawRate.enRateDetail;
            plan.baseRate = self.rawRate.baseRate;
            plan.eflPath = self.rawRate.eflPath;
            plan.yracPath = self.rawRate.yracPath;
            plan.puct = self.rawRate.puct;
            plan.productId = self.rawRate.productId;
            plan.effectiveDate = self.rawRate.effectiveDate;
        }
        return JSON.stringify(plan);
    };

    self.tosPathMemento = self.getLowerCaseRate();
    self.setupRateDisplays();
};