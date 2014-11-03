// Retina module for Slider Pro.
// 
// Adds the possibility to load a different image when the slider is
// viewed on a retina screen.
;(function( window, $ ) {

	"use strict";
	
	var NS = 'Retina.' + $.SliderPro.namespace;

	var Retina = {

		initRetina: function() {
			var that = this;

			// Return if it's not a retina screen
			if ( this._isRetina() === false ) {
				return;
			}

			// Check if the Lazy Loading module is enabled and overwrite its loading method.
			// If not, replace all images with their retina version directly.
			if ( typeof this._loadImage !== 'undefined' ) {
				this._loadImage = this._loadRetinaImage;
			} else {
				this.on( 'update.' + NS, $.proxy( this._checkRetinaImages, this ) );

				if ( this.$slider.find( '.sp-thumbnail' ).length !== 0 ) {
					this.on( 'update.Thumbnails.' + NS, $.proxy( this._checkRetinaThumbnailImages, this ) );
				}
			}
		},

		// Checks if the current display supports high PPI
		_isRetina: function() {
			if ( window.devicePixelRatio >= 2 ) {
				return true;
			}

			if ( window.matchMedia && ( window.matchMedia( "(-webkit-min-device-pixel-ratio: 2),(min-resolution: 2dppx)" ).matches ) ) {
				return true;
			}

			return false;
		},

		// Loop through the slides and replace the images with their retina version
		_checkRetinaImages: function() {
			var that = this;

			$.each( this.slides, function( index, element ) {
				var $slide = element.$slide;

				if ( typeof $slide.attr( 'data-loaded' ) === 'undefined' ) {
					$slide.attr( 'data-loaded', true );

					$slide.find( 'img' ).each(function() {
						var image = $( this );
						that._loadRetinaImage( image, function( newImage ) {
							if ( newImage.hasClass( 'sp-image' ) ) {
								element.$mainImage = newImage;
								element.resizeMainImage( true );
							}
						});
					});
				}
			});
		},

		// Loop through the thumbnails and replace the images with their retina version
		_checkRetinaThumbnailImages: function() {
			var that = this;

			this.$thumbnails.find( '.sp-thumbnail-container' ).each(function() {
				var $thumbnail = $( this );

				if ( typeof $thumbnail.attr( 'data-loaded' ) === 'undefined' ) {
					$thumbnail.attr( 'data-loaded', true );
					that._loadRetinaImage( $thumbnail.find( 'img' ) );
				}
			});
		},

		// Load the retina image
		_loadRetinaImage: function( image, callback ) {
			var retinaFound = false,
				newImagePath = '';

			// Check if there is a retina image specified
			if ( typeof image.attr( 'data-retina' ) !== 'undefined' ) {
				retinaFound = true;

				newImagePath = image.attr( 'data-retina' );
				image.removeAttr( 'data-retina' );
			}

			// Check if there is a lazy loaded, non-retina, image specified
			if ( typeof image.attr( 'data-src' ) !== 'undefined' ) {
				if ( retinaFound === false ) {
					newImagePath = image.attr( 'data-src') ;
				}

				image.removeAttr('data-src');
			}

			// Return if there isn't a retina or lazy loaded image
			if ( newImagePath === '' ) {
				return;
			}

			// Create a new image element
			var newImage = $( new Image() );

			// Copy the class(es) and inline style
			newImage.attr( 'class', image.attr('class') );
			newImage.attr( 'style', image.attr('style') );

			// Copy the data attributes
			$.each( image.data(), function( name, value ) {
				newImage.attr( 'data-' + name, value );
			});

			// Copy the width and height attributes if they exist
			if ( typeof image.attr( 'width' ) !== 'undefined' ) {
				newImage.attr( 'width', image.attr( 'width' ) );
			}

			if ( typeof image.attr( 'height' ) !== 'undefined' ) {
				newImage.attr( 'height', image.attr( 'height' ) );
			}

			if ( typeof image.attr( 'alt' ) !== 'undefined' ) {
				newImage.attr( 'alt', image.attr( 'alt' ) );
			}

			if ( typeof image.attr( 'title' ) !== 'undefined' ) {
				newImage.attr( 'title', image.attr( 'title' ) );
			}

			// Add the new image in the same container and remove the older image
			newImage.insertAfter( image );
			image.remove();
			image = null;

			// Assign the source of the image
			newImage.attr( 'src', newImagePath );

			if ( typeof callback === 'function' ) {
				callback( newImage );
			}
		},

		// Destroy the module
		destroyRetina: function() {
			this.off( 'update.' + NS );
			this.off( 'update.Thumbnails.' + NS );
		}
	};

	$.SliderPro.addModule( 'Retina', Retina );
	
})( window, jQuery );