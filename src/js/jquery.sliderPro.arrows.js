// Arrows module for Slider Pro.
// 
// Adds arrows for navigating to the next or previous slide.
;(function( window, $ ) {

	"use strict";

	var NS = 'Arrows.' + $.SliderPro.namespace;

	var Arrows = {

		// Reference to the arrows container
		$arrows: null,

		// Reference to the previous arrow
		$previousArrow: null,

		// Reference to the next arrow
		$nextArrow: null,

		initArrows: function() {
			this.on( 'update.' + NS, $.proxy( this._arrowsOnUpdate, this ) );
			this.on( 'gotoSlide.' + NS, $.proxy( this._checkArrowsVisibility, this ) );
		},

		_arrowsOnUpdate: function() {
			var that = this;

			// Create the arrows if the 'arrows' option is set to true
			if ( this.settings.arrows === true && this.$arrows === null ) {
				this.$arrows = $( '<div class="sp-arrows"></div>' ).appendTo( this.$slidesContainer );
				
				this.$previousArrow = $( '<div class="sp-arrow sp-previous-arrow"></div>' ).appendTo( this.$arrows );
				this.$nextArrow = $( '<div class="sp-arrow sp-next-arrow"></div>' ).appendTo( this.$arrows );

				this.$previousArrow.on( 'click.' + NS, function() {
					that.previousSlide();
				});

				this.$nextArrow.on( 'click.' + NS, function() {
					that.nextSlide();
				});

				this._checkArrowsVisibility();
			} else if ( this.settings.arrows === false && this.$arrows !== null ) {
				this._removeArrows();
			}

			if ( this.settings.arrows === true ) {
				if ( this.settings.fadeArrows === true ) {
					this.$arrows.addClass( 'sp-fade-arrows' );
				} else if ( this.settings.fadeArrows === false ) {
					this.$arrows.removeClass( 'sp-fade-arrows' );
				}
			}
		},

		// Show or hide the arrows depending on the position of the selected slide
		_checkArrowsVisibility: function() {
			if ( this.settings.arrows === false || this.settings.loop === true ) {
				return;
			}

			if ( this.selectedSlideIndex === 0 ) {
				this.$previousArrow.css( 'display', 'none' );
			} else {
				this.$previousArrow.css( 'display', 'block' );
			}

			if ( this.selectedSlideIndex === this.getTotalSlides() - 1 ) {
				this.$nextArrow.css( 'display', 'none' );
			} else {
				this.$nextArrow.css( 'display', 'block' );
			}
		},
		
		_removeArrows: function() {
			if ( this.$arrows !== null ) {
				this.$previousArrow.off( 'click.' + NS );
				this.$nextArrow.off( 'click.' + NS );
				this.$arrows.remove();
				this.$arrows = null;
			}
		},

		destroyArrows: function() {
			this._removeArrows();
			this.off( 'update.' + NS );
			this.off( 'gotoSlide.' + NS );
		},

		arrowsDefaults: {

			// Indicates whether the arrow buttons will be created
			arrows: false,

			// Indicates whether the arrows will fade in only on hover
			fadeArrows: true
		}
	};

	$.SliderPro.addModule( 'Arrows', Arrows );

})( window, jQuery );