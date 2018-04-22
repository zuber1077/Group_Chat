/**
*	Preload Page Plugin
*	Version: 1.0
*	URL: @ThemeMountain
*	Description: Preload images in page. Simplified version of jPreLoader
*	Requires: jQuery 1.10+
*	License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/
(function($) {

	'use strict';

	var PreloadPage = function( element, options, callback ){

		// Settings
		if( options ) {
			$.extend( settings, options );
		}
		
		// Check loader type
		var loaderType = $( element ).is( '[data-loader-type]' ) ? $( element ).data( 'loader-type' ) : 'default';
		settings.showPercentage = $( element ).is( '[data-show-percentage]' ) ? true : settings.showPercentage;
		
		// Show body 
		$( element ).css({
			'visibility': 'visible'
		});

		// Callback
		if( typeof callback == 'function' ) {
			onComplete = callback;
		}

		// Check cookkie
		if( !( getCookie() ) ) {
			buildLoader( element, loaderType );
		}
		else {
			onComplete();
		}
	};
	
	/**
	*	Get/set Cookie
	*/
	var getCookie = function() {
		if( settings.onetimeLoad ) {
			var cookies = document.cookie.split( '; ' );
			for ( var i = 0, parts; ( parts = cookies[i] && cookies[i].split( '=' )); i++ ) {
				if ( ( parts.shift() ) === 'preloadPage' ) {
					return ( parts.join( '=' ) );
				}
			}
			return false;
		} else {
			return false;
		}
	};
	var setCookie = function( expires ) {
		if( settings.onetimeLoad ) {
			var exdate = new Date();
			exdate.setDate( exdate.getDate() + expires );
			var c_value = (( expires === null ) ? '' : 'expires=' + exdate.toUTCString());
			document.cookie = 'preloadPage=loaded; ' + c_value;
		}
	};
	
	/**
	*	Build Loader
	*/
	var buildLoader = function( element, loaderType ) {

		// Overlay
		var overlay = $( '<div />' )
		.attr( 'class', 'tm-pageloader-wrapper' )
		.css({
			position: 'fixed',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			zIndex: 9999999
		})
		.appendTo( element );
		
		// Loader wrapper
		var preloader = $( '<div />' ).attr( 'class', 'tm-pageloader' ).addClass( loaderType ).appendTo( overlay );
		
		// Progress Bar
		if( loaderType != 'none' ){
			var progressBar = $( '<div />' ).attr( 'id', 'tm-pl-bar' )
			.css({
				width: '0%',
				height: '100%'
			})
			.appendTo( preloader );
		}
		
		// Progress Counter
		if( settings.showPercentage ) {
			var progressCounter = $( '<div />' ).attr( 'id', 'tm-pl-percentage' ).appendTo( preloader );
		}

		// Get Images
		getImages( element );
	};
	
	/**
	*	Loop Through
	*/
	var getImages = function( element ) {
		$( element ).find( '*:not(script)' ).each( function() {
			var url = '';
			if ( $( this ).css( 'background-image' ).indexOf( 'none' ) == -1 && $( this ).css( 'background-image' ).indexOf( '-gradient' ) == -1 ) {
				url = $( this ).css( 'background-image' );
				if( url.indexOf( 'url' ) != -1 ) {
					var temp = url.match( /url\((.*?)\)/ );
					url = temp[1].replace( /\"/g, '' );
				}
			} else if ( $( this ).get(0).nodeName.toLowerCase() == 'img' && typeof( $( this ).attr( 'src' ) ) != 'undefined' ) {
				url = $( this ).attr( 'src' );
			}
			if ( url.length > 0 ) {
				items.push( url );
				preload( url );
			}
		});
	};
	
	/**
	* Preload Images
	*/
	var preload = function( url ) {
		var imgLoad = new Image();
		$( imgLoad )
					.one( 'error', function() {
						errors.push( $( this ).attr( 'src' ) );
						loaded();
					})
					.one( 'load', function() {
						loaded();
					})
					.attr( 'src', url );
	};
	var loaded = function() {

		current++;

		// Ref.
		var overlay = '.tm-pageloader-wrapper';
		var progressBar = '#tm-pl-bar';
		var progressCounter = '#tm-pl-percentage';

		// Calculate percentage
		var percent = Math.round( ( current / items.length ) * 100 );

		// Animate progress
		$( progressBar ).stop().animate({
			width: percent + '%'
		}, 500, 'linear' );
		if( settings.showPercentage ) {
			$( progressCounter ).text( percent + '%' );
		}
		
		// Once loaded
		if( current >= items.length ) {
			
			current = items.length;
			setCookie();
			
			if( settings.showPercentage ) {
				$( progressCounter ).text( '100%' );
			}

			// Callback
			$( progressBar ).stop().animate({
				width: '100%'
			}, 1000, 'linear', function() {
				deletePreloader( overlay );
			});	

			// Errors
			listErrors();
		}	
	};
	
	/**
	* Delete Loading Screen
	*/
	var deletePreloader = function( target ) {
		$( target ).delay( 100 ).fadeOut( 1000, function() {
			$( target ).remove();
			$( 'body' ).removeClass( 'preload-page' );
			settings.onComplete();
		});
	};
	
	/**
	* Errors
	*/
	var listErrors = function() {
		if( errors.length > 0 ) {
			var str;
			str += errors.length + ' image file/s can not be found. \n\r';	
			str += 'Please check:\n\r';
			for ( var i = 0; i < errors.length; i++ ) {
				str += '- ' + errors[i] + '\n\r';
			}

			// Display images missing
			console.log( str );

			return true;
		} else {
			return false;
		}
	};

	// Startup variables
	var items = [];
	var errors = [];
	var current = 0;
	
	// Defaults
	var settings = {
		showPercentage: false,
		onetimeLoad: false,
		onComplete: null
	};

	// Plugin
	$.fn.preloadPage = function( options, callback ) {
		
		// Iterate through each DOM element and return it
		return this.each( function() {

			// Pass options
			var preloader = new PreloadPage( this, options, callback );
		});
	};
})(jQuery);