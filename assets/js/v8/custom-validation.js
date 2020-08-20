/* Custom Validation for Required Objects */
ko.validation.rules['checkIsZipCodeValid'] = {
    validator: function(val, needToCheck) {
        if (!needToCheck) return true;
        if (!val) return false;

        var zipCodeMatch = val.toUpperCase().match((new RegExp("^(\\d{5}?|[A-CEGHJ-NPRSTVXY]\\d[A-CEGHJ-NPRSTV-Z]?\\d[A-CEGHJ-NPRSTV-Z]\\d)$")));

        // need to match a single zip code
        return zipCodeMatch && zipCodeMatch.length >= 1 && (zipCodeMatch[0] == val.toUpperCase());
    },
    message: "Please enter a valid US or Canada zip code."
};

ko.validation.rules['checkIsValidSSN'] = {
    validator: function(val, needToCheck) {
        if (!needToCheck) return true;
        if (!val) return false;

        /*
        Valid Formats are...
        111-22-2456
        */

        return (val.match(/^\d{3}-\d{2}-\d{4}$/) !== null)
    },
    message: "Please enter a valid SSN (i.e. ###-##-####)"
};

ko.validation.rules['checkIsValidPhoneNumber'] = {
    validator: function (val, needToCheck) {
        if (!needToCheck) return true;
        if (!val) return false;

        /*
        Valid Formats are...
        (123) 456-7890
        123-456-7890
        123.456.7890
        1234567890
        075-635 4672
        */

       return (val.replace(/[^\w\.-\s\(\)]/g,'').match(/^(\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/) !== null);
    },
    message: 'Please enter a valid 10-digit phone number (i.e. ###-###-####)'
};

ko.validation.rules['checkIsValidEmail'] = {
   validator: function(val, needToCheck) {
        if (!needToCheck) return true;
        if (!val) return false;

        /* Valid Formats are...
            name@company.com
            name@sub.company.com
            x{infinity}@x{infinity}|{nothing}.xxx
        */

        var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(val);
   },
   message: 'Please enter a valid email address (i.e. name@example.com)'
};



ko.validation.rules['checkIsValidAccountNumber'] = {
    validator: function(val, input) {
        var pattern = input[0]();
        var isTexas = input[1]();
        var isNotResidential = input[2]();
        var isTexasOverride = input[3]();
        var isAGL = input[4]();
        if (isAGL && !isNotResidential && !val) return true;
        if (isAGL && !isNotResidential && val) return validateAccountNumber(pattern, val);
        if ((isTexas && !isTexasOverride) && !isNotResidential) return true;
        if (!val) return false;
        if (!pattern) return true; // if we do have an account number but no format, this is okay

        return validateAccountNumber(pattern, val);

        function validateAccountNumber(pattern, val) {
            // store regexp result
            val = val.replace(/-/g,'').replace(/,/g,'').replace(/\./g,'');
            var accountNumberMatch = val.match((new RegExp(pattern)));

            // our account number should have a single account number, AND match the account number format
            return accountNumberMatch && accountNumberMatch.length == 1 && (accountNumberMatch[0] == val);
        }
    },
    message: 'Please enter a valid value.'
};

ko.validation.rules['checkIsValidReferenceNumber'] = {
	validator: function(val, input) {
		var pattern = input[0]();
		var shouldShow = input[1]();
		if (!shouldShow) return true; // if we shouldn't show the reference, this is okay
        if (!val) return false; // no value? no pass
        if (!pattern) return true; // if we do have an account number but no format, this is okay

        // store regexp result
        val = val.replace(/-/g,'').replace(/,/g,'').replace(/\./g,'');
        var refNumberMatch = val.match((new RegExp(pattern)));

        // our account number should have a single account number, AND match the account number format
        return refNumberMatch && refNumberMatch.length == 1 && (refNumberMatch[0] == val);
    },
    message: 'Please enter a valid value.'
}

ko.validation.rules['checkIsValidLastMonthBillFile'] = {
    validator: function(val, needToCheck) {
        if (!needToCheck) return true;
        if (!val) return true;

        var ext = val.substr(-3).toLowerCase();

        //valid file type (i.e. pdf, jpg, gif, or png)
        return (ext == "png" || ext == "jpg" || ext == "gif" || ext == "pdf");
    },
    message: 'Please upload a valid file type (i.e. pdf, jpg, gif, or png).'
};

ko.validation.registerExtenders();