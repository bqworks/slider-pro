;( function( window, $ ) {

    "use strict";

    var NS = 'MouseWheel.' + $.SliderPro.namespace;

    var MouseWheel = {

        mouseWheelEventType: '',

        initMouseWheel: function() {
            var that = this;

            if ( this.settings.mouseWheel === false ) {
                return;
            }

            // get the current mouse wheel event used in the browser
            if ( 'onwheel' in document ) {
                this.mouseWheelEventType = 'wheel';
            } else if ( 'onmousewheel' in document ) {
                this.mouseWheelEventType = 'mousewheel';
            } else if ( 'onDomMouseScroll' in document ) {
                this.mouseWheelEventType = 'DomMouseScroll';
            } else if ( 'onMozMousePixelScroll' in document ) {
                this.mouseWheelEventType = 'MozMousePixelScroll';
            }

            this.on( this.mouseWheelEventType + '.' + NS, function( event ) {
                event.preventDefault();

                var eventObject = event.originalEvent,
                    delta;

                // get the movement direction and speed indicated in the delta property
                if ( typeof eventObject.detail !== 'undefined' ) {
                    delta = eventObject.detail;
                }

                if ( typeof eventObject.wheelDelta !== 'undefined' ) {
                    delta = eventObject.wheelDelta;
                }

                if ( typeof eventObject.deltaY !== 'undefined' ) {
                    delta = eventObject.deltaY * -1;
                }

                if ( that.thumbnailsPosition + delta < 0 && that.thumbnailsPosition + delta > that.thumbnailsContainerSize - that.thumbnailsSize ) {
                   that._moveThumbnailsTo( that.thumbnailsPosition + delta, true );
                } else if ( that.thumbnailsPosition + delta >= 0 ) {
                    that._moveThumbnailsTo( 0, true );
                } else if ( that.thumbnailsPosition + delta < that.thumbnailsContainerSize - that.thumbnailsSize ) {
                    that._moveThumbnailsTo( that.thumbnailsContainerSize - that.thumbnailsSize, true );
                }
            });
        },

        destroyMouseWheel: function() {
            this.off( this.mouseWheelEventType + '.' + NS );
        },

        mouseWheelDefaults: {
            mouseWheel: false
        }
    };

    $.SliderPro.addModule( 'MouseWheel', MouseWheel );

})( window, jQuery );