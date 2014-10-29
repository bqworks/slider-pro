// Buttons module for Slider Pro.
// 
// Adds navigation buttons at the bottom of the slider.
;(function( window, $ ) {

	"use strict";
	
	var NS = 'Buttons.' + $.SliderPro.namespace;

	var Buttons = {

		// Reference to the buttons container
		$buttons: null,

		initButtons: function() {
			this.on( 'update.' + NS, $.proxy( this._buttonsOnUpdate, this ) );
		},

		_buttonsOnUpdate: function() {
			this.$buttons = this.$slider.find('.sp-buttons');
			
			// If there is more that one slide but the buttons weren't created yet, create the buttons.
			// If the buttons were created but their number differs from the total number of slides, re-create the buttons.
			// If the buttons were created but there are less than one slide, remove the buttons.s
			if ( this.settings.buttons === true && this.getTotalSlides() > 1 && this.$buttons.length === 0 ) {
				this._createButtons();
			} else if ( this.settings.buttons === true && this.getTotalSlides() !== this.$buttons.find( '.sp-button' ).length && this.$buttons.length !== 0 ) {
				this._adjustButtons();
			} else if ( this.settings.buttons === false || ( this.getTotalSlides() <= 1 && this.$buttons.length !== 0 ) ) {
				this._removeButtons();
			}
		},

		// Create the buttons
		_createButtons: function() {
			var that = this;

			// Create the buttons' container
			this.$buttons = $( '<div class="sp-buttons"></div>' ).appendTo( this.$slider );

			// Create the buttons
			for ( var i = 0; i < this.getTotalSlides(); i++ ) {
				$( '<div class="sp-button"></div>' ).appendTo( this.$buttons );
			}

			// Listen for button clicks 
			this.$buttons.on( 'click.' + NS, '.sp-button', function() {
				that.gotoSlide( $( this ).index() );
			});

			// Set the initially selected button
			this.$buttons.find( '.sp-button' ).eq( this.selectedSlideIndex ).addClass( 'sp-selected-button' );

			// Select the corresponding button when the slide changes
			this.on( 'gotoSlide.' + NS, function( event ) {
				that.$buttons.find( '.sp-selected-button' ).removeClass( 'sp-selected-button' );
				that.$buttons.find( '.sp-button' ).eq( event.index ).addClass( 'sp-selected-button' );
			});

			// Indicate that the slider has buttons 
			this.$slider.addClass( 'sp-has-buttons' );
		},

		// Re-create the buttons. This is calles when the number of slides changes.
		_adjustButtons: function() {
			this.$buttons.empty();

			// Create the buttons
			for ( var i = 0; i < this.getTotalSlides(); i++ ) {
				$( '<div class="sp-button"></div>' ).appendTo( this.$buttons );
			}

			// Change the selected the buttons
			this.$buttons.find( '.sp-selected-button' ).removeClass( 'sp-selected-button' );
			this.$buttons.find( '.sp-button' ).eq( this.selectedSlideIndex ).addClass( 'sp-selected-button' );
		},

		// Remove the buttons
		_removeButtons: function() {
			this.$buttons.off( 'click.' + NS, '.sp-button' );
			this.off( 'gotoSlide.' + NS );
			this.$buttons.remove();
			this.$slider.removeClass( 'sp-has-buttons' );
		},

		destroyButtons: function() {
			this._removeButtons();
			this.off( 'update.' + NS );
		},

		buttonsDefaults: {
			
			// Indicates whether the buttons will be created
			buttons: true
		}
	};

	$.SliderPro.addModule( 'Buttons', Buttons );

})( window, jQuery );