var BASE_URL = "https://powerkioskapp.com";
var BASE_DIRECT_URL = "https://powerkioskdirect.com";
var BASE_TEST_URL = "http://test.powerkioskapp.com";
var BASE_GRAPHQL_URL = "http://graphqltest.powerkiosk.com/graphql";
var BASE_API_URL = BASE_TEST_URL + "/api/";
var BASE_GRAPHQL_URL = "@@basegraphqlurl";
var BASE_DIRECT_API_URL = BASE_DIRECT_URL + "/api2/";
var BASE_TEST_API_URL = BASE_TEST_URL + "/api/";
var BASE_VALIDATE_ADDRESS_API_URL = BASE_API_URL + "serviceObjects/addressValidation.json";

var ENROLLMENT_AUTH = "Basic ZGF0YWdlYXJib3g6RGV3aXQyaXQ0IQ==";

var MONTH_HASH = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var ELECTRIC_SERVICE_ID = '297ed5063d424e7b013d429edf0d0006';
var GAS_SERVICE_ID = '297ed5063d424e7b013d429f0e850007';

var AUCTION_TEXT = "We couldn't find any published rate for your account. We can publish it for all suppliers to bid on it. Click here to start your auction.";
var RATE_ERROR_TEXT = "We were not able to find any plans matching your criteria. Try a Different Request.";

var CANADA_COUNTRYID = 39;
var CANADA_DEFAULT_GAS = 20000;

var DEFAULT_CUSTOMER_COMPANY = "Power Kiosk";
var DEFAULT_SUPPLIER_COMPANY = "Power Kiosk";
var DEFAULT_AGENT_DOMAIN_ALIAS = "http://powerkioskapp.com";
var DEFAULT_SSN = "000-00-0000";
var RESIDENTIAL_ANNUAL_USUAGE_DEFAULT_ELECTRIC = 20000;
var RESIDENTIAL_ANNUAL_USUAGE_DEFAULT_GAS = 1000;
var BASE_RATE_AVG_DEFAULT = 0.12;
var FIXED_ALL_IN = "06EB47154025C24CB49C63C4754B2D53";

var NICOR_UTILITYID = "588f51ee4778cd6c014778f380f20003";
var AGL_UTILITYID = "58464f004dd10fe7014de99a5f790407";

var VIDEO_STEP1 = "//www.youtube.com/embed/62r5x-QG6vM?rel=0";
var VIDEO_STEP2 = "//www.youtube.com/embed/xm6-IjzR7Cs?rel=0";
var VIDEO_STEP3 = "//www.youtube.com/embed/81HIq0Sgxb8?rel=0";

var CONFIRMATION_MESSAGE_RESIDENTIAL = "We have sent a confirmation email to your email address. We will also contact you if we need additional information from you.";
var CONFIRMATION_MESSAGE_RESIDENTIAL2 = "Your new better rate is <strong>guaranteed</strong> by Power Kiosk over the term (duration) of the plan. <br><br> We've sent a confirmation email to your email address. We’ll also contact you if we happen to need any additional details.";
var CONFIRMATION_MESSAGE_BUSINESS = "We have sent a contract to your email address. For us to complete the enrollment we need you to use the link in the email and sign the contract electronically.";
var CONFIRMATION_MESSAGE_BUSINESS2 = "One last step: to secure your new better rate over the duration of the plan, we’ve sent an email to the address provided with a link to <strong>electronically sign</strong> the contract. (Emails can end up in the spam folder once in awhile, so please check that folder too.) <br><br>Once you’ve signed, you will receive a second email from Power Kiosk confirming your enrollment. We’ll also contact you if we happen to need any additional details.";
var BROWSE_AWAY_MESSAGE = "It is now safe to browse away or close your browser.";
var CONFIRMATION_MESSAGE_LARGE_BUSINESS = "We have sent a link to your email address to watch the competitive bidding process.";
var CONFIRMATION_MESSAGE_LARGE_BUSINESS2 = "Good news: due to a higher amount of energy usage, we’ve found that you can save <strong>significantly</strong> &mdash; more than small business or residential customers &mdash; on your energy bill. Your Power Kiosk representative will start a live auction to get you competitive bids from a large number of suppliers.";

var JUST_ENERGY_CONFIRMATION_MESSAGE = "<br><br><strong>Just Energy Contact Information</strong><br>Monday-Friday 9 am - 6 pm EST<br>Telephone: 1-866-587-8674<br>Email: contactus@justenergy.com<br>Just Energy is an alternative energy/gas supplier that has no affiliation with the consumer's public utility, with the government or any consumer group.<br>You will continue to receive bills only from your public utility and will continue to be charged by the utility for natural gas/electricity distribution in addition to the charges by Just Energy.<br>To cancel your agreement, contact Just Energy by calling 1-866-587-8674 or emailing contactus@justenergy.com<br>Just Energy would like to thank you for choosing them as your preferred energy supplier.";
var CONSTELLATION_CONFIRMATION_MESSAGE = "<br><br><strong>Your Account is not enrolled yet. Please call Constellation at **PHONE3** to complete Enrollment."

var SMALL_BUSINESS_TAB_MESSAGE = "(monthly bill <$10K)";
var LARGE_BUSINESS_TAB_MESSAGE = "(monthly bill >$10K)";

var TERMS_AND_CONDITIONS_HEADING_BUSINESS  = "Signature";
var TERMS_AND_CONDITIONS_HEADING_RESIDENTIAL = "Terms and Conditions";

var TERMS_AND_CONDITIONS_BODY_BUSINESS = "To e-sign, we'll send a separate email to the address you've provided.";
var TERMS_AND_CONDITIONS_BODY_RESIDENTIAL_SINGLE = "This checkbox constitutes your electronic signature. <br> In order to view the Terms and Conditions you must have Adobe PDF Reader.  Click <a target=\"_blank\" href=\"https://get.adobe.com/reader/\">here</a> to install.";
var TERMS_AND_CONDITIONS_BODY_RESIDENTIAL_MULTIPLE = "These checkboxes constitute your electronic signature. <br> In order to view the Terms and Conditions you must have Adobe PDF Reader.  Click <a target=\"_blank\" href=\"https://get.adobe.com/reader/\"><u>here</u></a> to install.";

var globalCustomerViewModel;
var globalVerificationViewModel;

var GET_RATES_TEXT = "Get Rates Now!";
var GETTING_RATES_TEXT = "Getting Rates...";