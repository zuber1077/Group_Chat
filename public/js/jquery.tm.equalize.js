/**
*	Equalize
*	Version: 1.0
*	URL: @ThemeMountain
*	Description: Equal Heights plugin
*	Requires: jQuery 1.10+
*	Author: ThemeMountain
*	Copyright: Copyright 2014 ThemeMountain
*	License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/

;(function ($) {

	'use strict';

	var EqualizeHeights = function( element, options ){

		// Settings
		var settings = $.extend( {}, $.fn.equalizeHeights.tmeOpts, options ); 

		// Object & jQuery el
		var el = $( element );
		var obj = this;

		// Startup variables
		var rowY = 0;
		var columnY = 0;
		var rowNumber = 0;
		var columns = [];
		var targetHeight = 0;
		var children = el.children();
		var leader = el.data( 'leader' );
		var followers = $( '[data-follow="' + leader + '"]' );

		/**
		*	Update height
		*/

		obj.updateHeights = function(){
			rowNumber = 0;
			if( settings.equalizeByGroup ){
				children.each( function(){	
					
					// Refresh columnY position
					columnY = $( this ).position().top;
						
					// Clear row class & height
					$( this )
							.attr( 'class',	
								function( i, rowClass ){
									return rowClass.replace( /row-\d+/, '' );
								}
							)
							.css({ height: 'auto' });
					
					// Break to new row
					if( columnY !== rowY ){

						// Count rows created
						rowNumber++;

						// Reset target height
						targetHeight = 0;

						// Clear array
						columns.length = 0;
					}

					// If there is only one row
					// reset height and set rowNumber
					if( rowNumber === 0 ){
						rowNumber = 1;
						targetHeight = 0;
					}

					// Push the new columns into the array
					columns.push( $( this ) );

					// Get target height
					targetHeight = targetHeight > $( this ).outerHeight() ? targetHeight : $( this ).outerHeight();
						
					// Loop through add row class and set height
					$.each( columns, function( i ){
						columns[i].addClass( 'row-' + rowNumber ).css({ height: targetHeight + 'px' });
					});

					// Update rowY reference
					rowY = columnY;
				});
			}else{
				// Clear height
				$( this ).css({ height: 'auto' });

				// Reset target height
				targetHeight = 0;
				targetHeight = el.outerHeight();

				// Set heights
				followers.css({ height: targetHeight + 'px' });
			}
		};

		/**
		*	Clear Heights
		*/

		obj.clearHeights = function(){
			if( settings.equalizeByGroup ){
				children.css({ height: 'auto' });
			}else{
				followers.css({ height: 'auto' });
			}
		};

		// Window Resize
		$( window ).on( 'resize', function(){
			if( !settings.updateOnResize ) return false;
			if( $( window ).width() > settings.clearUnder ){
				obj.updateHeights();
			}else{
				obj.clearHeights();
			}
		});

		obj.updateHeights();
	};

	// Plugin
	$.fn.equalizeHeights = function ( options ) {

		// Iterate through each DOM element and return it
		return this.each(function() {

			var element = $( this );

			// Return early if this element already has a plugin instance
			if ( element.data( 'equalizeHeights' ) ) return;

			// Pass options
			var equalize = new EqualizeHeights( this, options );

			// Store plugin object in this element's data
			element.data( 'equalizeHeights', equalize );

		});
	};

	// Default
	$.fn.equalizeHeights.tmeOpts = {
		equalizeByGroup: true,				// Boolean: Whether all children within a given group shoulde be equalized on a per row basis
		updateOnResize: true,				// Boolean: If heights should update on resize
		clearUnder: 479						// Integer: Breakpoint at which plugin should stop setting heights
	};
})( jQuery );