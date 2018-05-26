
(function(window, document, $) {
    'use strict';

    /************************************************************
    *               Social Cards Content Slider                 *
    ************************************************************/
    // RTL Support
    var rtl = false;
    if($('html').data('textdirection') == 'rtl'){
        rtl = true;
    }
    if(rtl === true){
        $(".tweet-slider").attr('dir', 'rtl');
        $(".fb-post-slider").attr('dir', 'rtl');
        $(".linkedin-post-slider").attr('dir', 'rtl');
    }

    // Tweet Slider
    $(".tweet-slider").unslider({
        autoplay: true,
        arrows: false,
        nav: false,
        infinite: true
    });

    // FB Post Slider
    $(".fb-post-slider").unslider({
        autoplay: true,
        delay: 3500,
        arrows: false,
        nav: false,
        infinite: true
    });

    // LinkedIn Post Slider
    $(".linkedin-post-slider").unslider({
        autoplay: true,
        arrows: false,
        nav: false,
        infinite: true
    });

})(window, document, jQuery);