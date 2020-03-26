"use strict";

/*
* ----------------------------------------------------------------------------------------
    Template Name: mr stater
   最新最全最好的Bootstrap模板：http://www.bootstrapmb.com
    Version: 1.0.0

* ----------------------------------------------------------------------------------------
*/
(function ($) {
  'use strict';

  jQuery(document).on("ready", function () {
    // full page activation
    if (document.getElementsByClassName("fullpage")) {
      $('#fullpage').fullpage({
        menu: '#mneu2, #menu',
        autoScrolling: false,
        scrollHorizontally: true,
        anchors: ['home',  'about', 'blog', 'portfolio', 'contact'],
        responsiveWidth: 1199.98,
        responsiveHeight: 600,
        lockAnchors: false,
        css3: true
      });
    } // tooltip activation


    $('[data-toggle="tooltip"]').tooltip();
    tippy.setDefaults({
      arrow: true,
      delay: 40,
      placement: 'right',
      animation: 'perspective',
      theme: 'light'
    }); // menu niye joto kahini ;)

    $(".menu-click").on("click", function () {
      $(".main-menu > ul").toggleClass('show');
      return false;
    }); //menu icon

    $(".menu-icon").on("click", function () {
      $(".menu-icon").toggleClass("open-menu");
      $(".menu-box").toggleClass("active");
    });
    $('.hikmaclose-menu').on("click", function () {
      $(".menu-icon").removeClass("open-menu");
      $(".menu-box").removeClass("active");
    });
    $(".has-child > a, .menu-item-has-children > a").on("click", function () {
      var element = $(this).parent("li");

      if (element.hasClass("open")) {
        element.removeClass("open");
        element.find("li").removeClass("open");
        element.find("ul").slideUp(500, "linear");
      } else {
        element.addClass("open");
        element.children("ul").slideDown();
        element.siblings("li").children("ul").slideUp();
        element.siblings("li").removeClass("open");
        element.siblings("li").find("li").removeClass("open");
        element.siblings("li").find("ul").slideUp();
      }
    });
    $('#mneu34 li > a, #sidemenuscoll ul li > a, .main-menu ul li > a').on("click", function (e) {
      var anchor = $(this);
      $('html, body').stop().animate({
        scrollTop: $(anchor.attr('href')).offset().top - 80
      }, 1200, 'easeInOutExpo');
      e.preventDefault();
    });

    var $winW = function $winW() {
      return $(window).width();
    };

    var $winH = function $winH() {
      return $(window).height();
    };

    var $screensize = function $screensize(element) {
      $(element).width($winW()).height($winH());
    };

    var screencheck = function screencheck(mediasize) {
      if (typeof window.matchMedia !== "undefined") {
        var screensize = window.matchMedia("(max-width:" + mediasize + "px)");

        if (screensize.matches) {
          return true;
        } else {
          return false;
        }
      } else {
        if ($winW() <= mediasize) {
          return true;
        } else {
          return false;
        }
      }
    }; 
    
    $(window).on('load', function() {
    
        $('.animated-row').each(function(){
            var $this = $(this);
            $this.find('.animate').each(function(i){
                var $item = $(this);
                var animation = $item.data('animate');
                var  AnimationDelay = $item.attr('data-animation-delay');
                $item.css({
                    '-webkit-animation-delay': AnimationDelay,
                    '-moz-animation-delay': AnimationDelay,
                    'animation-delay': AnimationDelay
                });
                $item.on('inview', function(event, isInView) {
                    if (isInView) {
                        setTimeout(function () {
                            $item.addClass('animated '+animation).removeClass('animate');
                        }, i*50);
                    }
                    else if (!screencheck(767)) {
                        $item.removeClass('animated '+animation).addClass('animate');
                    }
                });
            });
        });
    });
    
    // js tilt


    $('.js-tilt').tilt({
      glare: true,
      maxGlare: .5
    });
    $('.grid').imagesLoaded(function () {
      var $grid = $('.grid').isotope({
        itemSelector: '.grid-item',
        percentPosition: true,
        masonry: {
          // use outer width of grid-sizer for columnWidth
          columnWidth: 0
        }
      });
    }); //main filter activation

    $('.filter-menu').on('click', 'li', function () {
      $('.filter-menu li').removeClass('active');
      $(this).addClass('active');
      var filterValue = $(this).attr('data-filter');
      $('.grid').isotope({
        filter: filterValue
      });
      $(window).trigger('resize');
    }); // hikma testimonilas activation

    $('.hikmatestimonial-active').owlCarousel({
      loop: true,
      margin: 10,
      mouseDrag: true,
      responsive: {
        210: {
          items: 1
        },
        320: {
          items: 1
        },
        479: {
          items: 1
        },
        768: {
          items: 1
        },
        980: {
          items: 1
        },
        1199: {
          items: 1
        }
      }
    }); // slider activation

    $('.feature-blog-slideractive').owlCarousel({
      loop: true,
      margin: 0,
      autoplay: true,
      nav: true,
      navText: ['<i class="icofont-caret-left"></i>', '<i class="icofont-caret-right"></i>'],
      autoplayTimeout: 4000,
      responsive: {
        210: {
          items: 1
        },
        320: {
          items: 1
        },
        479: {
          items: 1
        },
        768: {
          items: 1
        },
        980: {
          items: 1
        },
        1199: {
          items: 1
        }
      }
    }); //custom scrollbar

    $(".menu-box").overlayScrollbars({
      className: "os-theme-round-light"
    }); //instargam feed

    if (document.getElementById("instragramslider_active")) {
      var getInstraDtata = document.getElementById("instragramslider_active");
      var getuserid = getInstraDtata.getAttribute("data-instra-id");
      var gettoken = getInstraDtata.getAttribute("data-instra-token");
      var feedFooter = new Instafeed({
        get: 'user',
        userId: getuserid,
        // your user id
        accessToken: gettoken,
        // your access token
        sortBy: 'most-liked',
        template: '<a class="instra-item" href="{{link}}" target="_blank"><img  src="{{image}}" /> <div class="instra-hover"><i class="icofont-link"></i></div></a>',
        target: getInstraDtata,
        limit: 9,
        resolution: 'low_resolution',
        after: function after() {
          $(getInstraDtata).owlCarousel({
            loop: true,
            margin: 0,
            nav: false,
            autoplay: true,
            autoplayTimeout: 3000,
            responsive: {
              210: {
                items: 1
              },
              320: {
                items: 1
              },
              479: {
                items: 1
              },
              768: {
                items: 1
              },
              980: {
                items: 1
              },
              1199: {
                items: 1
              }
            }
          });
        }
      });
      feedFooter.run();
    } // sticky menu


    $(window).on('scroll', function () {
      var scroll = $(window).scrollTop();

      if (scroll < 200) {
        $(".site-header.sticky-header .navbar").removeClass("sticky fadeInDown animated");
      } else {
        $(".site-header.sticky-header .navbar").addClass("sticky fadeInDown animated");
      }
    }); // menu menu active link

    $(".main-menu ul li").on("click", function () {
      $(".main-menu ul li").removeClass("active");
      $(this).addClass("active");
    }); // Cache selectors

    var lastId,
        topMenu = $(".main-menu"),
        topMenuHeight = topMenu.outerHeight() + 15,
        // All list items
    menuItems = topMenu.find("a"),
        // Anchors corresponding to menu items
    scrollItems = menuItems.map(function () {
      var item = $($(this).attr("href"));

      if (item.length) {
        return item;
      }
    }); // Bind click handler to menu items
    // so we can get a fancy scroll animation

    menuItems.on("click", function (e) {
      var href = $(this).attr("href"),
          offsetTop = href === "#" ? 0 : $(href).offset().top - topMenuHeight + 1;
      $('html, body').stop().animate({
        scrollTop: offsetTop
      }, 300);
      e.preventDefault();
    }); // Bind to scroll

    $(window).on("scroll", function () {
      // Get container scroll position
      var fromTop = $(this).scrollTop() + topMenuHeight; // Get id of current scroll item

      var cur = scrollItems.map(function () {
        if ($(this).offset().top < fromTop) return this;
      }); // Get the id of the current element

      cur = cur[cur.length - 1];
      var id = cur && cur.length ? cur[0].id : "";

      if (lastId !== id) {
        lastId = id; // Set/remove active class

        menuItems.parent().removeClass("active").end().filter("[href='#" + id + "']").parent().addClass("active");
      }
    }); // prelodere activation

    jQuery(window).load(function () {
      jQuery(".hikma-preloder").fadeOut(300);
    }); // scroll up

    $.scrollUp({
      scrollText: '<i class="fa fa-angle-up"></i>'
    }); // magnifypopup active

    $('.img-popup').magnificPopup({
      type: 'image',
      gallery: {
        enabled: true
      }
    });
  });
})(jQuery);