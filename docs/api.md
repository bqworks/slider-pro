## JavaScript API ##

### 1. Properties ###

Slider Pro can be customized using several properties which are described below. These properties must be passed to the slider when it's instantiated.

*Example:*

```js
$( '#my-slider' ).sliderPro({
	width: 960,
	height: 500,
	arrows: true,
	buttons: false,
	waitForLayers: true,
	fade: true,
	autoplay: false,
	autoScaleLayers: false
});
```

#### width ####

>Sets the width of the slide. Can be set to a fixed value, like 900 (indicating 900 pixels), or to a percentage value, like '100%'. It's important to note that percentage values need to be specified inside quotes. For fixed values, the quotes are not necessary. Also, please note that, in order to make the slider responsive, it's not necessary to use percentage values. More about this in the description of the 'responsive' property.

>*Default value:* 500

#### height ####

>Sets the height of the slide. The same rules available for the 'width' property also apply for the 'height' property.

>*Default value:* 300

#### responsive ####

>Makes the slider responsive. The slider can be responsive even if the 'width' and/or 'height' properties are set to fixed values. In this situation, 'width' and 'height' will act as the maximum width and height of the slides.

>*Default value:* true

#### aspectRatio ####

>Sets the aspect ratio of the slides. If set to a value different than -1, the height of the slides will be overridden in order to maintain the specified aspect ratio.

>*Default value:* -1

#### imageScaleMode ####

>Sets the scale mode of the main slide images (images added as background). 'cover' will scale and crop the image so that it fills the entire slide. 'contain' will keep the entire image visible inside the slide. 'exact' will match the size of the image to the size of the slide. 'none' will leave the image to its original size.

>*Default value:* 'cover'

>*Available values:* 'cover', 'contain', 'exact' and 'none'

#### centerImage ####

>Indicates if the image will be centered

>*Default value:* true

#### allowScaleUp ####

>Indicates if the image can be scaled up more than its original size

>*Default value:* true

#### autoHeight ####

>Indicates if height of the slider will be adjusted to the height of the selected slide.

>*Default value:* false

#### autoSlideSize ####

>Will maintain all the slides at the same height, but will allow the width of the slides to be variable if the orientation of the slides is horizontal and vice-versa if the orientation is vertical.

>*Default value:* false

#### startSlide ####

>Sets the slide that will be selected when the slider loads.

>*Default value:* 0

#### shuffle ####

>Indicates if the slides will be shuffled.

>*Default value:* false

#### orientation ####

>Indicates whether the slides will be arranged horizontally or vertically.

>*Default value:* 'horizontal'

>*Available value:* 'horizontal' and 'vertical'

#### forceSize ####

>Indicates if the size of the slider will be forced to full width or full window.

>Note: It's possible to make the slider full width or full window by giving it a width and/or height of '100%'. However, sometimes the slider might be inside other containers which are less than full width/window. The 'forceSize' property is useful in those situations because it will still enlarge the slider to fill the width or window by overflowing its parent elements.

>*Default value:* 'none'

>*Available value:* 'fullWidth', 'fullWindow' and 'none'.

#### loop ####

>Indicates if the slider will be loopable (infinite scrolling).

>*Default value:* true

#### slideDistance ####

> Sets the distance between the slides.

>*Default value:* 10

#### slideAnimationDuration ####

> Sets the duration of the slide animation.

>*Default value:* 700

#### heightAnimationDuration ####

> Sets the duration of the height animation.

>*Default value:* 700

#### visibleSize ####

>Sets the size of the visible area, allowing for more slides to become visible near the selected slide.

>*Default value:* 'auto'

#### centerSelectedSlide ####

>Indicates whether the selected slide will be in the center of the slider, when there are more slides visible at a time. If set to false, the selected slide will be in the left side of the slider.

>*Default value:* true

#### rightToLeft ####

>Indicates if the direction of the slider will be from right to left, instead of the default left to right.

>*Default value:* false

#### breakpoints ####

>Sets specific breakpoints which allow changing the look and behavior of the slider when the page resizes. 

>The 'breakpoints' property is assigned an object which contains certain browser window widths and the slider properties that are applied to those specific widths. This is very similar to CSS media queries. However, please note that these custom properties will not be inherited between different breakpoints. The slider's properties will reset to the original values before applying a new set of properties, so if you want a certain property value to persist, you need to set it for each breakpoint.

>*Default value:* null

*Example:*

```
$( '#my-slider' ).sliderPro({
	width: 960, 
	height: 400,
	orientation: 'horizontal',
	thumbnailPosition: 'right',
	breakpoints: {
		800: {
			thumbnailsPosition: 'bottom',
			thumbnailWidth: 270,
			thumbnailHeight: 100
		},
		500: {
			orientation: 'vertical',
			thumbnailsPosition: 'bottom',
			thumbnailWidth: 120,
			thumbnailHeight: 50
		}
	}
});
```

#### fade ####

>Indicates if fade will be used.

>*Default value:* 'false'

#### fadeOutPreviousSlide ####

>Indicates if the previous slide will be faded out (in addition to the next slide being faded in).

>*Default value:* true

#### fadeDuration ####

>Sets the duration of the fade effect.

>*Default value:* 500

#### autoplay ####

>Indicates whether or not autoplay will be enabled.

>*Default value:* true

#### autoplayDelay ####

>Sets the delay/interval (in milliseconds) at which the autoplay will run.

>*Default value:* 5000

#### autoplayDirection ####

>Indicates whether autoplay will navigate to the next slide or previous slide.

>*Default value:* 'normal'

>*Available values:* 'normal' and 'backwards'

#### autoplayOnHover ####

>Indicates if the autoplay will be paused or stopped when the slider is hovered.

>*Default value:* 'pause'

>*Available values:* 'pause', 'stop' and 'none'

#### arrows ####

>Indicates whether the arrow buttons will be created.

>*Default value:* false

#### fadeArrows ####

>Indicates whether the arrows will fade in only on hover.

>*Default value:* true

#### buttons ####

>Indicates whether the buttons will be created.

>*Default value:* true

#### keyboard ####

>Indicates whether keyboard navigation will be enabled.

>*Default value:* true

#### keyboardOnlyOnFocus ####

>Indicates whether the slider will respond to keyboard input only when the slider is in focus.

>*Default value:* false

#### touchSwipe ####

>Indicates whether the touch swipe will be enabled for slides.

>*Default value:* true

#### touchSwipeThreshold ####

>Sets the minimum amount that the slides should move.

>*Default value:* 50

#### fadeCaption ####

>Indicates whether or not the captions will be faded.

>*Default value:* true

#### captionFadeDuration ####

>Sets the duration of the fade animation.

>*Default value:* 500

#### fullScreen ####

>Indicates whether the full-screen button is enabled.

>*Default value:* false

#### fadeFullScreen ####

>Indicates whether the button will fade in only on hover.

>*Default value:* true

#### waitForLayers ####

>Indicates whether the slider will wait for the layers to disappear before going to a new slide.

>*Default value:* false

#### autoScaleLayers ####

>Indicates whether the layers will be scaled automatically.

>*Default value:* true

#### autoScaleReference ####

>Sets a reference width which will be compared to the current slider width in order to determine how much the layers need to scale down. By default, the reference width will be equal to the slide width. However, if the slide width is set to a percentage value, then it's necessary to set a specific value for 'autoScaleReference'.

>*Default value:* -1

#### smallSize ####

>If the slider size is below this size, the small version of the images will be used.

>*Default value:* 480

#### mediumSize ####

>If the slider size is below this size, the medium version of the images will be used.

>*Default value:* 768

#### largeSize ####

>If the slider size is below this size, the large version of the images will be used.

>*Default value:* 1024

#### updateHash ####

>Indicates whether the hash will be updated when a new slide is selected.

>*Default value:* false

#### reachVideoAction ####

>Sets the action that the video will perform when its slide container is selected.

>*Default value:* 'none'

>*Available values:* 'playVideo' and 'none'

#### leaveVideoAction ####

>Sets the action that the video will perform when another slide is selected.

>*Default value:* 'pauseVideo'

>*Available values:* 'stopVideo', 'pauseVideo', 'removeVideo' and 'none'

#### playVideoAction ####

>Sets the action that the slider will perform when the video starts playing

>*Default value:* 'stopAutoplay'

>*Available values:* 'stopAutoplay' and 'none'

#### pauseVideoAction ####

>Sets the action that the slider will perform when the video is paused.

>*Default value:* 'none'

>*Available values:* 'startAutoplay' and 'none'

#### endVideoAction ####

>Sets the action that the slider will perform when the video ends.

>*Default value:* 'none'

>*Available values:* 'startAutoplay', 'nextSlide', 'replayVideo' and 'none'

#### thumbnailWidth ####

>Sets the width of the thumbnail.

>*Default value:* 100

#### thumbnailHeight ####

>Sets the height of the thumbnail.

>*Default value:* 80

#### thumbnailsPosition ####

>Sets the position of the thumbnail scroller.

>*Default value:* 'bottom'

>*Available values:* 'top', 'bottom', 'right' and 'left'

#### thumbnailPointer ####

>Indicates if a pointer will be displayed for the selected thumbnail

>*Default value:* false

#### thumbnailArrows ####

>Indicates whether the thumbnail arrows will be enabled

>*Default value:* false

#### fadeThumbnailArrows ####

>Indicates whether the thumbnail arrows will be faded

>*Default value:* true

#### thumbnailTouchSwipe ####

>Indicates whether the touch swipe will be enabled for thumbnails

>*Default value:* true

---

## 2. Public methods ##

There are two ways of calling a public method.

The first way is by calling the `sliderPro` plugin on the slider element and passing the name of the method and additional arguments:

```js
$( '#my-slider' ).sliderPro( 'gotoSlide', 3 );
```

The first argument represents the name of the method and the second argument represents the value which will be applied. Some methods don't have a second argument:

```js
$( '#my-slider' ).sliderPro( 'nextSlide' );
```

The second way is by getting a reference to the SliderPro instance and calling the method on the instance:

```js
// get a reference to the SliderPro instance
var slider = $( '#my-slider' ).data( 'sliderPro' );

slider.gotoSlide( 2 );
```

Available public methods:

#### gotoSlide( index ) ####

>Scrolls to the slide at the specified index.

#### nextSlide() ####

>Scrolls to the next slide.

#### previousSlide() ####

>Scrolls to the previous slide.

#### getSlideAt( index ) ####

>Gets all the data of the slide at the specified index. Returns an object that contains all the data specified for that slide.
		
#### getSelectedSlide() ####

>Gets the index of the selected slide.

#### update() ####

>This is called by the plugin automatically when a property is changed. You can call this manually in order to refresh the slider after changing its HTML markup (i.e., adding or removing slides).

#### resize() ####

>This is called by the plugin automatically when the slider changes its size. You can also call it manually if you find it necessary to have the slider resize itself.

#### getTotalSlides() ####

>Gets the total number of slides.

#### on( eventType, callback ) ####

>Adds an event listener to the slider. More details about the use of this method will be presented in the 'Callbacks' chapter.

#### off( eventType ) ####

>Removes an event listener from the slider.

#### destroy() ####

>Destroys a slider by removing all the visual elements and functionality added by the plugin. Basically, it leaves the slider in the state it was before the plugin was instantiated.


## 3. Callbacks ##

Callbacks (or events) are used to detect when certain actions take place. The callbacks can be added when the slider is instantiated, or at a later time.

*Examples:*

```js
$( '#my-slider' ).sliderPro({
	width: 900, 
	height: 400,
	gotoSlide: function( event ) {
		console.log( event.index );
	},
	sliderResize: function() {
		console.log( 'slider is resized' );
	}
});

$( '#my-slider' ).on( 'gotoSlide', function( event ) {
	console.log( event.index );
})
```

As it can be noticed, the callback functions have an "event" parameter which contains some information about that event.

The list of available events:

#### init ####

>Triggered after the slider was created.

#### update ####

>Triggered when the 'update' method is called, either automatically or manually.

#### gotoSlide ####

>Triggered when a new slide is selected. Returned data:

>* index: the index of the selected slide
>* previousIndex: the index of the previously selected slide

#### gotoSlideComplete ####

>Triggered when the animation to the new slide is completed. Returned data:

>* index: the index of the opened slide

#### breakpointReach ####

>Triggered when a breakpoint is reached. Returned data:

>* size: the specified size that was reached
>* settings: the settings specified for the current size

#### videoPlay ####

>Triggered when a video starts playing.

#### videoPause ####

>Triggered when a video is paused.

#### videoEnd ####

>Triggered when a video ends.

#### showLayersComplete ####

>Triggered when all animated layers become visible.

#### hideLayersComplete ####

>Triggered when all animated layers become invisible.

#### thumbnailsUpdate ####

>Triggered when the thumbnails are updated.

#### gotoThumbnail ####

>Triggered when a new thumbnail is selected.

#### thumbnailsMoveComplete ####

>Triggered when the thumbnail scroller has moved.