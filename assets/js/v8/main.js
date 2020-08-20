// Stick Navbar
var stickyToggle = function(sticky, stickyWrapper, scrollElement) {
	var stickyHeight = sticky.outerHeight();
	var stickyTop = stickyWrapper.offset().top;
	if (scrollElement.scrollTop() >= stickyTop){
		stickyWrapper.height(stickyHeight);
		sticky.addClass("is-sticky");
	}
	else{
		sticky.removeClass("is-sticky");
		stickyWrapper.height('auto');
	}
};

// Find all data-toggle="sticky-onscroll" elements
$('[data-toggle="sticky-onscroll"]').each(function() {
	var sticky = $(this);
	var stickyWrapper = $('<div>').addClass('sticky-wrapper'); // insert hidden element to maintain actual top offset on page
	sticky.before(stickyWrapper);
	sticky.addClass('sticky');

	// Scroll & resize events
	$(window).on('scroll.sticky-onscroll resize.sticky-onscroll', function() {
		stickyToggle(sticky, stickyWrapper, $(this));
	});

	// On page load
	stickyToggle(sticky, stickyWrapper, $(window));
});

$(".navbar-nav li a").click(function(event) {
  $(".navbar-collapse").removeClass('in');
});

var $hamburger = $(".hamburger");
$('.hamburger').on("click", function(e) {
 $(this).toggleClass("is-active");
 // Do something else, like open/close menu
});

$('.navbar-nav').click(function() {
	$('.hamburger').toggleClass('is-active');
});


