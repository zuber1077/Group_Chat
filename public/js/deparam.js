
(function($) {
    
    $.deparam = $.deparam || function(uri) {
        if(uri === undefined){ 
            uri = window.location.pathname;
        }

        var value1 = window.location.pathname;
        var value2 = value1.split('/'); //return an array
        var value3 = value2.pop(); // remove last element form array and return

        return value3;
    }

})(jQuery);