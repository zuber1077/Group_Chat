
(function(window, document, $) {
	'use strict';

	// Default
	$('.repeater-default').repeater();

	// Custom Show / Hide Configurations
	$('.file-repeater, .contact-repeater').repeater({
		show: function () {
			$(this).slideDown();
		},
		hide: function(remove) {
			if (confirm('Are you sure you want to remove this item?')) {
				$(this).slideUp(remove);
			}
		}
	});


})(window, document, jQuery);