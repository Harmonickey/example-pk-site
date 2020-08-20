/* Power Kiosk Direct theme specific actions */

var SMALL_SCREEN_THRESHOLD = 767;
var SCROLL_SPEED = 900;
var SMALL_SCREEN_SCROLL_THRESHOLD = 80;
var SWING_TOP_OFFSET_LARGE_SCREEN = 76;
var SWING_TOP_OFFSET_SMALL_SCREEN = 36;
var FADE_TOGGLE_SPEED = 200;
var ENTER_KEYCODE = 13;
var SCROLL_TOP_SPEED = 1000;
var BUTTON_POSITION_RANGE = 7;

var sections = ["#why-switch", "#faqs", "#testimonials", "#markets", "#contact", "#partners"];

// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

// global variable to help with clicking close on popovers
var popupReadyForClose = false;

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
  if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = preventDefault; // mobile
  document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}

function SetupToolTips()
{
	//*** Setup Tooltip ***//
    $('[rel=tooltip]').tooltip({
        placement: 'left',
        container: 'body',
		trigger: 'hover',
		html: true
    });

	$('[rel=popover]').popover({
        container: 'body',
		html: true
    });

	$('[rel=popover]').on('hidden.bs.popover', function () {
		popupReadyForClose = false;
	});

	$('[rel=popover]').on('shown.bs.popover', function () {
		popupReadyForClose = true;
	});

	$('[rel=popover]').on("click", function() {
		if ($(this).attr("aria-describedby") && popupReadyForClose)
		{
			$(this).popover('hide');
		}
		else if (!$(this).attr("aria-describedby") && !popupReadyForClose)
		{
			$(this).popover('show');
		}
	});
    //*** ***//
}

function ModalChangeAgentId()
{
    $("#promoCodeModal").modal('hide');

    if ($(".hamburger-box").parent().attr("aria-expanded") == "true")
    {
        $(".hamburger-box").click(); // close if on mobile
    }
};

function SetupLightBox()
{
    $(document).on('click', '*[data-toggle="lightbox"]', function(event) {
		event.preventDefault();
		if ($('.ekko-lightbox').length == 0) // only one lightbox at a time!
		{
			$(this).ekkoLightbox();
			$('.modal').on("hidden.bs.modal", function (e) {
				if($('.modal:visible').length)
				{
					$('.modal-backdrop').first().css('z-index', parseInt($('.modal:visible').last().css('z-index')) - 10);
					$('body').addClass('modal-open');
				}
			}).on("show.bs.modal", function (e) {
				if($('.modal:visible').length)
				{
					$('.modal-backdrop.in').first().css('z-index', parseInt($('.modal:visible').last().css('z-index')) + 10);
					$(this).css('z-index', parseInt($('.modal-backdrop.in').first().css('z-index')) + 10);
				}
			});
		}
    });
}

function NavigateToSection(target)
{
	var $target = $(target);

	if ($(window).width() <= SMALL_SCREEN_THRESHOLD) {
		$('html, body').stop().animate({'scrollTop': $target.offset().top + SWING_TOP_OFFSET_SMALL_SCREEN}, SCROLL_SPEED, 'swing', function () { location.hash = target; });
	} else {
		$('html, body').stop().animate({'scrollTop': $target.offset().top - SWING_TOP_OFFSET_LARGE_SCREEN}, SCROLL_SPEED, 'swing', function () { location.hash = target; });
	}
}

function InitResponsiveHandlersAndSkrollr()
{
	/*
    // Init Skrollr
    var s = skrollr.init({
        render: function(data) {}
    });
    var s = skrollr.init();
    if (s.isMobile()) {
        s.destroy();
    }
    */
    $('.navbar-nav a[href^="#"], .footer-info a[href^="#"]').not("#saveMoneyNow").on('click',function (e) {
		e.preventDefault();
		var target = this.hash;
		NavigateToSection(target);
	});
	/*
	if ($(window).height() <= SMALL_SCREEN_THRESHOLD) {
		$('.sticky-wrapper').css('margin-bottom','-22px');
	}
	$(window).scroll(function() {
		if ($(window).height() <= SMALL_SCREEN_THRESHOLD) {
			if($(window).scrollTop() > SMALL_SCREEN_SCROLL_THRESHOLD) {
				$('.sticky-wrapper').css('margin-bottom','0');
			}
			if ($(window).scrollTop() == 0) {
				$('.sticky-wrapper').css('margin-bottom','-22px');
			}
		}
	});
    */
    // Stick Navbar
    var stickyToggle = function(sticky, stickyWrapper, scrollElement) {
        var stickyHeight = sticky.outerHeight();
        var stickyTop = stickyWrapper.offset().top;
        //if (scrollElement.scrollTop() >= stickyTop){
            //stickyWrapper.height(stickyHeight);
			stickyWrapper.height('auto');
            sticky.addClass("is-sticky");
        //}
        //else{
        //    sticky.removeClass("is-sticky");
        //    stickyWrapper.height('auto');
        //}
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
    });

    $('.navbar-nav').click(function() {
        $('.hamburger').toggleClass('is-active');
    });

    $(".sort-plans [id^='sort-']").click(function() {
        $(this).find("span.fa").fadeToggle(FADE_TOGGLE_SPEED);
    });

    $(".accordion-toggle").on('click', function(e) {
        e.preventDefault();
        $(this).find(".caret").toggleClass("rotate90");
    });

    // if the user clicks enter without this, then odd submission behavior occurs
    $('#zipCode').keypress(function(event) {
		if (event.keyCode == ENTER_KEYCODE) {
			event.preventDefault();
		}
	});

	$('.socials a').on("touchstart", function(event) {
		window.location.href = $(event.target).attr('href');
	});

    SetupToolTips();

    try {
        $(".fancybox").fancybox();
    } catch(e) {
        console.log("Fancy Box Failure");
        console.log(e);
    }

    SetupLightBox();

	// prevent scroll from moving the number
	$(':input[type=number]').on('mousewheel', function(e){
		e.preventDefault();
    });

    setTimeout(function() {
        $(window).trigger('resize');
    }, 5000);

    InitOwlCarousel();
}

function ContainsSection(hash)
{
	for (var i = 0; i < sections.length; i++)
	{
		if (hash == sections[i])
		{
			return true;
		}
	}

	return false;
}

function CheckLocationParams(viewModel)
{
    viewModel.referenceId(getQueryVariable('referenceId'))
}

function getQueryVariable(variable)
{
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return '';
}

function CheckLocationHash(viewModel, shouldCheck)
{
	if (location.hash && shouldCheck)
    {
        if (location.hash.indexOf("step") == -1 && location.hash.indexOf("final") == -1)
        {
            var affinity = location.hash.replace("#", '');
            var pkpromo = Cookies.get('pk-promo');

            if (!affinity && pkpromo) {
                affinity = pkpromo;
                var image = Cookies.get("pk-promo-image");
                if (image)
                {
                    viewModel.logo("images/" + image);
                    viewModel.logo2("images/" + image);
                }
            }

            if (!affinity)
            {
                location.hash = "";
                Cookies.remove("pk-promo-image");
                viewModel.GetAgent(true);
            }
            else
            {
                $.ajax({
                    type: "GET",
                    url: location.pathname + "promo-codes.txt",
                    success: function(res)
                    {
                        var pairs = res.split("\n");
                        var found = false;

                        for (var i = 0; i < pairs.length; i++)
                        {
                            var pair = pairs[i].split(",");

                            if (pair.length > 1 && pair[0].toLowerCase() == affinity.toLowerCase())
                            {
                                viewModel.logo("images/" + pair[1]);
                                viewModel.logo2("images/" + pair[1]);
                                Cookies.set("pk-promo-image", pair[1]);
                                Cookies.set("pk-promo", affinity.toLowerCase());
                                viewModel.newPromoCodeFromAffinity(affinity);
                                viewModel.showPromoCode(false);
                                viewModel.showPromoCodeAffinityAlert(true);

                                found = true;
                                break;
                            }
                        }

                        if (!found) {
                            location.hash = "";
                            Cookies.remove("pk-promo-image");
                            viewModel.GetAgent(true, false, affinity.toLowerCase());
                        }
                    },
                    error: function() {
                        // had a problem getting the hash, so reset it
                        location.hash = "";
                        Cookies.remove("pk-promo-image");
                        if (affinity) {
                          viewModel.GetAgent(true, false, affinity.toLowerCase());
                        } else {
                          viewModel.GetAgent(true);
                        }
                    }
                });
            }
        }
        else
        {
            location.hash = "";
            Cookies.remove("pk-promo-image");
            viewModel.GetAgent(true);
        }
    }
    else
    {
        viewModel.GetAgent(true);
    }

	viewModel.getRatesShow.subscribe(function(newValue) {
        if (newValue == true && viewModel.showInputPage() == true && viewModel.shouldScrollForRatesButton() && $("#saveMoneyNow").offset())
        {
            if ($(window).scrollTop() + $(window).height() + SMALL_SCREEN_SCROLL_THRESHOLD > $("#saveMoneyNow").offset().top)
            {
                var target = ($(window).height() + $("#saveMoneyNow").offset().top) / BUTTON_POSITION_RANGE;
				disableScroll();
                $('html, body').animate({scrollTop: target }, SCROLL_TOP_SPEED, function() {
					enableScroll();
				});
            }
        }
    });
}

function InitOwlCarousel()
{
	$('.owl-carousel').owlCarousel({
        loop:true,
        nav:false,
		margin:20,
        autoplay: true,
        slideTransition: 'linear',
        autoplayTimeout: 0,
        autoplaySpeed: 3000,
        dots: false,
        lazyLoad: true,
		startPosition: 0,
		responsive:{
			0:{
				items:1
			},
			600:{
				items:3
			},
			1000:{
				items:5
			}
		}
	});
}