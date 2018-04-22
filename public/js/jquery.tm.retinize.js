/**
*	Retina replacement Plugin
*	Version: 1.0
*	URL: @ThemeMountain
*	Description: Image replcement 
*	Requires: jQuery 1.10+
*	Author: ThemeMountain
*	Copyright: Copyright 2014 ThemeMountain
*	License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/

;(function ($) {

	'use strict';

	$.fn.retinizeImages = function ( options ) {
		
		// Defaults
		var settings = $.extend({
					retinaSupportMobile: false,					// Whether swap should occur on mobile devices, optionally use [data-retina-mobile] for individual swaps
					retinaSuffix: '@2x',						// Retina image suffix
			}, options );

		/**
		*	Image replacement
		*/

		var replaceImage = function(){

			var el = $( this );
			var src;

			// Check for img tag
			// or backgorund image
			if( el.is( 'img') ){
				src = el.attr( 'src' );
			}else if( el.css( 'background-image' ) !== 'none' ){
				src = el.css( 'background-image' ).replace( /^url\(["']?/, '' ).replace( /["']?\)$/, '' );
			}else if( el.is( '[data-2x]' )){
				src = el.data( '2x' );
			}else{
				return false;
			}

			// Check whether swap should occur on mobile or
			// if certain a class should be exluded
			if( mobile && !settings.retinaSupportMobile && !el.is( '[data-retina-mobile]' ) || el.is( '[data-no-retina]' ) || src.match( /\.(svg)/i ) || src.indexOf( settings.retinaSuffix ) >= 0 ) return false;
			
			// Swap if retina
			if( window.isRetinaDevice() ){

				// Swap
				var imgExt = src.substr( ( src.lastIndexOf( '.' ) ) );
				src = src.replace( imgExt, settings.retinaSuffix + imgExt );

				// Load it before swap so there is no flickering
				$.ajax({
					type: 'GET',
					url: src, 
					success: function(){
						$( '<img/>')
									.attr( 'src', src )
									.one( 'load', function(){
										if( el.is( 'img' ) ){
											el.attr( 'src', src );
										}else{
											el.css( 'background-image', 'url(' + src + ')' );
										}
						});
					}
				});
			}
		};
		
		/**
		*	Check if retina deivce
		*/

		window.isRetinaDevice = function(){
			var mediaQuery = '(-webkit-min-device-pixel-ratio: 1.5), (min--moz-device-pixel-ratio: 1.5), (-o-min-device-pixel-ratio: 3/2), (min-resolution: 1.5dppx)';
			if ( this.devicePixelRatio > 1 || this.matchMedia && this.matchMedia( mediaQuery ).matches ) return true;
			return false;
		};

		// Mobile Check
		var mobile = false;
		if( navigator.userAgent.match(/Android/i) || 
			navigator.userAgent.match(/webOS/i) ||
			navigator.userAgent.match(/iPhone/i) || 
			navigator.userAgent.match(/iPad/i) ||
			navigator.userAgent.match(/iPod/i) || 
			navigator.userAgent.match(/BlackBerry/i) || 
			navigator.userAgent.match(/Windows Phone/i) ){
				mobile = true;
		}

		// Iterate through each DOM element 
		// and return it
		return this.each( replaceImage );
	};
})( jQuery );