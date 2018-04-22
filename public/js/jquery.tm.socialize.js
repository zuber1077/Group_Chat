/**
*	Socialize
*	Version: 1.0.0
*	URL: @ThemeMountain
*	Description: Get social!
*	Requires: jQuery 1.10+
*	Author: ThemeMountain
*	Copyright: Copyright 2013 ThemeMountain
*	License: Attribution-NonCommercial 3.0 (http://creativecommons.org/licenses/by-nc/3.0/)
*/

;(function( $, document, window, undefined ) {

	'use strict';

	var Socialize = function( element, options ){

		// Settings
		var settings = $.extend( {}, $.fn.socialize.tmsOpts, options );

		// jQuery el
		element = $( element );

		// Window
		var createWindow = function( url ){
			var topPos = ( $( window ).height()/2 ) - ( settings.winHeight/2 );
			var leftPos = ( $( window ).width()/2 ) - ( settings.winWidth/2 );
			window.open( url, '', 'width=' + settings.winWidth + ', height=' + settings.winHeight + ', top=' + topPos + ', left=' + leftPos );
		};

		// Create URL
		var createURL = function ( element, network ) {
			var url = socialNetworks[network].replace( /{url}/g , element.data( 'url' ) ).replace( /{title}/g , element.data( 'title' ) ).replace( /{description}/g , element.data( 'description' ) ).replace( /{image}/g , element.data( 'image' ) ).replace( /{user}/g , element.data( 'user' ) );
			createWindow( url );
		};

		// Networks
		var socialNetworks = {
			'pinterest': 'http://pinterest.com/pin/create/button/?url={url}&media={image}&description={description}',
			'facebook': 'https://www.facebook.com/sharer/sharer.php?u={url}',
			'twitter': 'https://twitter.com/share?url={url}&via={user}&text={description}',
			'googleplus': 'https://plus.google.com/share?url={url}',
			'linkedin': 'https://www.linkedin.com/shareArticle?url={url}&title={title}&summary={description}+&source={user}'
		};

		// Link Event
		element.on( 'click', function( event ){
			if( $( this ).data( 'network' ) == 'email' ){
				$( this ).attr( 'href', 'mailto:' + $( this ).data( 'email' ) + '?&subject=' + $( this ).data( 'subject' ) + '&body=' + $( this ).data( 'description' ) + ' - ' + $( this ).data( 'url' ) );
			}else{
				event.preventDefault();
				createURL( element, element.data( 'network') );
			}
		});	
	};

	// Plugin
	$.fn.socialize = function( options ) {

		// Iterate through each DOM element and return it
		return this.each(function() {

			// Element
			var element = $( this );

			// Return early if this element already has a plugin instance
			if ( element.data( 'socialize' ) ) return;

			// Pass options
			var socialize = new Socialize( this, options );

			// Store plugin object in this element's data
			element.data( 'socialize', socialize );

		});
	};

	// Default
	$.fn.socialize.tmsOpts = {
		winWidth: 800,
		winHeight: 600 
	};
})( jQuery, document, window );