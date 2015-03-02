// Deep Linking module for Slider Pro.
// 
// Updates the hash of the URL as the user navigates through the slides.
// Also, allows navigating to a specific slide by indicating it in the hash.
;(function( window, $ ) {

	"use strict";

	var NS = 'DeepLinking.' + $.SliderPro.namespace;

	var DeepLinking = {

		initDeepLinking: function() {
			var that = this;

			// Parse the initial hash
			this.on( 'init.' + NS, function() {
				that._gotoHash( window.location.hash );
			});

			// Update the hash when a new slide is selected
			this.on( 'gotoSlide.' + NS, function( event ) {
				if ( that.settings.updateHash === true ) {

					// get the 'id' attribute of the slide
					var slideId = that.$slider.find( '.sp-slide' ).eq( event.index ).attr( 'id' );

					// if the slide doesn't have an 'id' attribute, use the slide index
					if ( typeof slideId === 'undefined' ) {
						slideId = event.index;
					}

					window.location.hash = that.$slider.attr( 'id' ) + '/' + slideId;
				}
			});

			// Check when the hash changes and navigate to the indicated slide
			$( window ).on( 'hashchange.' + this.uniqueId + '.' + NS, function() {
				that._gotoHash( window.location.hash );
			});
		},

		// Parse the hash and return the slider id and the slide id
		_parseHash: function( hash ) {
			if ( hash !== '' ) {
				// Eliminate the # symbol
				hash = hash.substring(1);

				// Get the specified slider id and slide id
				var values = hash.split( '/' ),
					slideId = values.pop(),
					sliderId = hash.slice( 0, - slideId.toString().length - 1 );

				if ( this.$slider.attr( 'id' ) === sliderId ) {
					return { 'sliderID': sliderId, 'slideId': slideId };
				}
			}

			return false;
		},

		// Navigate to the appropriate slide, based on the specified hash
		_gotoHash: function( hash ) {
			var result = this._parseHash( hash );

			if ( result === false ) {
				return;
			}

			var slideId = result.slideId,
				slideIdNumber = parseInt( slideId, 10 );

			// check if the specified slide id is a number or string
			if ( isNaN( slideIdNumber ) ) {
				// get the index of the slide based on the specified id
				var slideIndex = this.$slider.find( '.sp-slide#' + slideId ).index();

				if ( slideIndex !== -1 && slideIndex !== this.selectedSlideIndex ) {
					this.gotoSlide( slideIndex );
				}
			} else if ( slideIdNumber !== this.selectedSlideIndex ) {
				this.gotoSlide( slideIdNumber );
			}
		},

		// Destroy the module
		destroyDeepLinking: function() {
			this.off( 'init.' + NS );
			this.off( 'gotoSlide.' + NS );
			$( window ).off( 'hashchange.' + this.uniqueId + '.' + NS );
		},

		deepLinkingDefaults: {

			// Indicates whether the hash will be updated when a new slide is selected
			updateHash: false
		}
	};

	$.SliderPro.addModule( 'DeepLinking', DeepLinking );
	
})( window, jQuery );