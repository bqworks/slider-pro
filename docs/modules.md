## Modules ##

Modules are optional blocks of code that extend the plugin's core, adding more capabilities. This modular architecture makes the code more organized and also allows you to include only the features you will use, resulting in an optimized file size and performance.

### 1. Fade ###

This module replaces the default slide/swipe transition with a fade transition.

Customizable properties: [fade](api.md#fade), [fadeOutPreviousSlide](api.md#fadeoutpreviousslide) and [fadeDuration](api.md#fadeduration).

---

### 2. Caption ###

Allows you to add captions to slides. Captions will be displayed one at a time, below the slides. The caption must be given the `sp-caption` class.

*Example:*

```html
<div class="sp-slide">
	<img class="sp-image" src="path/to/image.jpg"/>
	<p class="sp-caption">Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
</div>
```

Customizable properties: [fadeCaption](api.md#fadecaption) and [captionFadeDuration](api.md#captionfadeduration).

---

### 3. Full Screen ###

Allows you to view the slider in full-screen mode, in browsers where the HTML5 Full Screen API is supported. If full-screen is supported a button will be displayed in the top-right corner of the slider.

Customizable properties: [fullScreen](api.md#fullscreen) and [fadeFullScreen](api.md#fadefullscreen).

---

### 4. Lazy Loading ###

Enables the slider to load images (slide images and thumbnail images) only when they are in a visible area, thus saving bandwidth by not loading images that won't be viewed by the user. It also makes the initial load of the slider much faster.

*Example:*

```html
<div class="slider-pro">
	<div class="sp-slides">
		<div class="sp-slide">
			<img class="sp-image" src="path/to/blank.gif" data-src="path/to/image1.jpg"/>
		</div>

		<div class="sp-slide">
			<a href="http://bqworks.com">
				<img class="sp-image" src="path/to/blank.gif" data-src="path/to/image2.jpg"/>
			</a>
		</div>

		<div class="sp-slide">
			<img class="sp-image" src="path/to/blank.gif" data-src="path/to/image3.jpg"/>
		</div>
	</div>

	<div class="sp-thumbnails">
		<img class="sp-thumbnail" src="path/to/blank.gif" data-src="path/to/thumbnail1.jpg"/>
		<img class="sp-thumbnail" src="path/to/blank.gif" data-src="path/to/thumbnail2.jpg"/>
	</div>
</div>
```

The `src` attribute of the image will point to a placeholder image, and the actual image will be specified in the `data-src` attribute. When the image becomes visible, the placeholder image will be replaced by the actual image. You can use the placeholder image that comes with the slider, or you can create your own placeholder image. The bundled placeholder image is located in dist/css/images/blank.gif and it's a 1 pixel by 1 pixel blank image.

---

### 5. Retina ###

Allows you to specify an alternative image for screens with high PPI (pixels per inch), like the 'Retina' screens from Apple devices. Please note that this module will work for any screen that has high PPI, not only for the 'Retina' screens.

The high resolution image needs to be specified in the `data-retina` attribute, as seen below.

*Example:*

```html
<div class="slider-pro">
	<div class="sp-slides">
		<div class="sp-slide">
			<img class="sp-image" src="path/to/blank.gif" data-src="path/to/image1.jpg" data-src="path/to/image1@2x.jpg"/>
		</div>

		<div class="sp-slide">
			<a href="http://bqworks.com">
				<img class="sp-image" src="path/to/blank.gif" data-src="path/to/image2.jpg" data-retina="path/to/image2@2x.jpg"/>
			</a>
		</div>

		<div class="sp-slide">
			<img class="sp-image" src="path/to/blank.gif" data-src="path/to/image3.jpg" data-retina="path/to/image3@2x.jpg"/>
		</div>
	</div>

	<div class="sp-thumbnails">
		<img class="sp-thumbnail" src="path/to/blank.gif" data-src="path/to/thumbnail1.jpg" data-retina="path/to/thumbnail1@2x.jpg"/>
		<img class="sp-thumbnail" src="path/to/blank.gif" data-src="path/to/thumbnail2.jpg" data-retina="path/to/thumbnail2@2x.jpg"/>
	</div>
</div>
```

As can be seen above, the 'Retina' module can work together with the 'Lazy Loading' module.

---

### 6. Conditional Images ###

This modules allows you to specify different image sources for different screen sizes. So, instead of loading large images (suited for desktop screens) on mobile devices, there will be a set of images that will load for smaller screens.

For each image you can specify three different sources in addition to the default source.

*Example:*

```html
<div class="sp-slide">
	<img class="sp-image" src="path/to/blank.gif" 
		data-src="path/to/image_default.jpg"
		data-small="path/to/image_small.jpg"
		data-medium="path/to/image_medium.jpg"
		data-large="path/to/image_large.jpg"/>
</div>
```

The exact size represented by the `data-small`, `data-medium` and `data-large` attributes is given by the `smallSize`, `mediumSize` and `largeSize` properties. By default these are set to 480, 768 and 1024 pixels.

So, the image source specified in the `data-large` attribute will load when the slider's width is smaller than the value of the `largeSize` property (which is 1024, by default). The image source specified in the `data-medium` attribute will load when the slider's width is smaller than the value of the `mediumSize` property and the image source specified in the `data-small` attribute will load when the slider's width is smaller than the value of the `smallSize` property. If the slider's width is above any of these values, the default image source will be loaded.

If you want to specify separate images for Retina (high PPI) displays, you can use the `data-retinasmall`, `data-retinamedium` and `data-retinalarge` attributes (no space between `retina` and the screen size).

*Example:*

```html
<div class="sp-slide">
	<img class="sp-image" src="path/to/blank.gif" 
		data-src="path/to/image_default.jpg"
		data-small="path/to/image_small.jpg"
		data-medium="path/to/image_medium.jpg"
		data-large="path/to/image_large.jpg"
		data-retinasmall="path/to/image_retina_small.jpg"
		data-retinamedium="path/to/image_retina_medium.jpg"
		data-retinalarge="path/to/image_retina_large.jpg"/>
</div>
```

Customizable properties: [smallSize](api.md#smallsize), [mediumSize](api.md#mediumsize) and [largeSize](api.md#largesize).

---

### 7. Layers ###

Adds support for layers, which are blocks of text or HTML content that can easily be positioned, sized or animated.

*Example:*

```html
<div class="sp-slide">
	<img class="sp-image" src="path/to/image.jpg"/>

	<h3 class="sp-layer">
		Lorem ipsum dolor sit amet
	</h3>

	<p class="sp-layer">
		consectetur adipisicing elit
	</p>
</div>
```

As can be seen above, the layers need to have the `sp-layer` class, but they can be any HTML element: paragraphs, headings or just DIV elements.

Here is an example that adds some styling and animation parameters:

```html
<div class="sp-slide">
	<img class="sp-image" src="path/to/image.jpg"/>

	<h3 class="sp-layer sp-black"
		data-position="bottomLeft" data-horizontal="10%"
		data-show-transition="left" data-show-delay="300" data-hide-transition="right">
		Lorem ipsum dolor sit amet
	</h3>

	<p class="sp-layer sp-white sp-padding"
		data-width="200" data-horizontal="center" data-vertical="40%"
		data-show-transition="down" data-hide-transition="up">
		consectetur adipisicing elit
	</p>

	<div class="sp-layer sp-static">Static content</div>
</div>
```

There are several predefined classes that can be passed to layers in order to style them. The position, size and animations are set using data attributes.

Predefined classes:

##### sp-static #####

>Sets the layer to be visible all the time, not animated.

##### sp-black #####

>Adds a black and transparent background and makes the font color white.

##### sp-white #####

>Adds a white and transparent background and makes the font color black.

##### sp-padding #####

>Adds a 10 pixel padding to the layer.

##### sp-rounded #####

>Makes the layer's corners rounded.

Data attributes:

##### data-width #####

>Sets the width of the layer. Can be set to a fixed or percentage value. If it's not set, the layer's width will adapt to the width of the inner content.

##### data-height #####

>Sets the height of the layer. Can be set to a fixed or percentage value. If it's not set, the layer's height will adapt to the height of the inner content.

##### data-depth #####

>Sets the depth (z-index, in CSS terms) of the layer.

##### data-position #####

>Sets the position of the layer. Can be set to 'topLeft' (which is the default value), 'topCenter', 'topRight', 'bottomLeft', 'bottomCenter', 'bottomRight', 'centerLeft', 'centerRight' and 'centerCenter'.

##### data-horizontal #####

>Sets the horizontal position of the layer, using the value specified for data-position as a reference point. Can be set to a fixed or percentage value.

##### data-vertical #####

>Sets the vertical position of the layer, using the value specified for data-position as a reference point. Can be set to a fixed or percentage value.

##### data-show-transition #####

>Sets the transition of the layer when it appears in the slide. Can be set to 'left', 'right', 'up' or 'down', these values describing the direction in which the layer will move when it appears.

##### data-show-offset #####

>Sets an offset for the position of the layer from which the layer will be animated towards the final position when it appears in the slide. Needs to be set to a fixed value.

##### data-show-duration #####

>Sets the duration of the show transition.

##### data-show-delay #####

>Sets a delay for the show transition. This delay starts from the moment when the transition to the new slide starts.

##### data-hide-transition #####

>Sets the transition of the layer when it disappears from the slide. Can be set to 'left', 'right', 'up' or 'down', these values describing the direction in which the layer will move when it disappears.

##### data-hide-offset #####

>Sets an offset for the position of the layer towards which the layer will be animated from the original position when it disappears from the slide. Needs to be set to a fixed value.

##### data-hide-duration #####

>Sets the duration of the hide transition.

##### data-hide-delay #####

>Sets a delay for the hide transition.

##### data-stay-duration #####

>Sets how much time a layer will stay visible before being hidden automatically.

>The layers are animated using CSS3 transitions in most browsers. In IE9 and IE8 (where CSS3 transitions are not supported), the layers will only fade in/out, and in IE7 and older, the layers will appear without any animation.

Customizable properties: [waitForLayers](api.md#waitforlayers), [autoScaleLayers](api.md#autoscalelayers) and [autoScaleReference](api.md#autoscalereference).

---

### 8. Deep Linking ###

Provides the possibility to link to a specific slide in the slider. You can use this to have the slider opened at a specific slide when the page loads or to navigate to a specific slide at a later time.

The hash that needs to be appended to the URL consists of the 'id' attribute of the slider and the index of the slide separated by a slash character (/). For example, `http://domain.com/page#my-slider/0` will open the first slide (because slide indexes start with 0) in the slider that has the 'id' set to 'my-slider'.

It's also possible to specify the 'id' attribute of the slide instead of its index.

*Example:*

```html
<div id="my-slider" class="slider-pro">
	<div class="sp-slides">
		<div class="sp-slide">
			<img class="sp-image" src="path/to/image1.jpg"/>
		</div>

		<div id="my-slide" class="sp-slide">
			<img class="sp-image" src="path/to/image2.jpg"/>
		</div>

		<div class="sp-slide">
			<img class="sp-image" src="path/to/image3.jpg"/>
		</div>
	</div>
</div>
```

In order to open the second slide, you can use either `http://domain.com/page#my-slider/1` or `http://domain.com/page#my-slider/my-slide`.

Customizable properties: [updateHash](api.md#updatehash).

---

### 9. Autoplay ###

Adds autoplay functionality.

Customizable properties: [autoplay](api.md#autoplay), [autoplayDelay](api.md#autoplaydelay), [autoplayDirection](api.md#autoplaydirection) and [autoplayOnHover](api.md#autoplayonhover).

---

### 10. Touch Swipe ###

Adds touch-swipe functionality for the slides. The module also adds mouse drag functionality on non-touch screen devices.

Customizable properties: [touchSwipe](api.md#touchswipe) and [touchSwipeThreshold](api.md#touchswipethreshold).

---

### 11. Buttons ###

Adds navigation buttons below the slider.

Customizable properties: [buttons](api.md#buttons).

---

### 12. Arrows ###

Adds navigation arrows for the slides.

Customizable properties: [arrows](api.md#arrows) and [fadeArrows](api.md#fadearrows).

---

### 13. Keyboard ###

Adds keyboard navigation support. The arrow keys will move the slider to the next or previous slide, and the Enter key will open the link attached to the slide's main image.

Customizable properties: [keyboard](api.md#keyboard) and [keyboardOnlyOnFocus](api.md#keyboardonlyonfocus).

---

### 14. Thumbnails ###

This module adds support for thumbnails. Thumbnails can contain any HTML content, from simple images to more complex structures that include both text and images.

There are two possible variations for adding thumbnails:

- Add them separately from slides, in their own container, `sp-thumbnails`.

*Example:*

```html
<div class="slider-pro">
	<div class="sp-slides">
		...
	</div>

	<div class="sp-thumbnails">
		<img class="sp-thumbnail" src="path/to/thumbnail.jpg"/>

		<p class="sp-thumbnail">Thumbnail 2</p>

		<div class="sp-thumbnail">
			<img class="sp-thumbnail-image" src="path/to/thumbnail.jpg"/>
			<p class="sp-thumbnail-text">Tempor incididunt ut labore et dolore magna</p>
		</div>
	</div>
</div>
```

- Add each thumbnail in the `sp-slide` element to which it corresponds.

*Example:*

```html
<div class="slider-pro">
	<div class="sp-slides">
		<div class="sp-slide">
			<img class="sp-image" src="path/to/image1.jpg"/>

			<img class="sp-thumbnail" src="path/to/thumbnail.jpg"/>
		</div>

		<div id="my-slide" class="sp-slide">
			<img class="sp-image" src="path/to/image2.jpg"/>

			<p class="sp-thumbnail">Thumbnail 2</p>
		</div>

		<div class="sp-slide">
			<img class="sp-image" src="path/to/image3.jpg"/>

			<div class="sp-thumbnail">
				<img class="sp-thumbnail-image" src="path/to/thumbnail.jpg"/>
				<p class="sp-thumbnail-text">Tempor incididunt ut labore et dolore magna</p>
			</div>
		</div>
	</div>
</div>
```

You can use which variations you think is more semantic for your implementation.

Customizable properties: [thumbnailWidth](api.md#thumbnailwidth), [thumbnailHeight](api.md#thumbnailheight), [thumbnailsPosition](api.md#thumbnailsposition) and [thumbnailPointer](api.md#thumbnailpointer).

---

### 15. Thumbnail Touch Swipe ###

Adds touch swipe functionality for the thumbnails.

Customizable properties: [thumbnailTouchSwipe](api.md#thumbnailtouchswipe). 

---

### 16. Thumbnail Arrows ###

Adds navigation arrows for the thumbnails.

Customizable properties: [thumbnailArrows](api.md#thumbnailarrows) and [fadeThumbnailArrows](api.md#fadethumbnailarrows).

---

### 17. Video ###

Provides automatic control of the videos loaded inside the slider. For example, the video will pause automatically when another slide is selected, or, if the autoplay is running, it will be paused when a video starts playing.

The video types or providers supported by this module are: YouTube, Vimeo, HTML5, Video.js, SublimeVideo, and JW Player.

In order to have a video automatically controlled by the slider, the video must have the `sp-video` class. Also, there are some provider-specific requirements for the videos, as presented below.

Customizable properties: [reachVideoAction](api.md#reachvideoaction), [leaveVideoAction](api.md#leavevideoaction), [playVideoAction](api.md#playvideoaction), [pauseVideoAction](api.md#pausevideoaction) and [endVideoAction](api.md#endvideoaction).

##### Notes #####

>* Most of the videos will work correctly only if the page is on a server. It can be a local server or an online server.

>* iOS doesn't allow videos to play automatically, so an initial user action is required in order to play the video. After the initial action, the videos will be controlled automatically.

>* When pausing a YouTube video automatically, on iOS, the video will be stopped instead, because only pausing it makes the entire region that the video occupies unresponsive to user input. For example, if another video slides in over the YouTube video, we won't be able to play this video because the controls will be unresponsive. However, this doesn't occur if the YouTube video is stopped instead of paused.

##### YouTube #####

YouTube videos can be loaded in two ways: by using a poster image with a link to the YouTube video or by inserting directly the video iframe provided by YouTube.

*Example 1:*

```html
<a class="sp-video" href="//www.youtube.com/watch?v=oaDkph9yQBs">
    <img src="path/to/poster.jpg" width="500" height="300"/>
</a>
```

When using the second method, the videos will need to have the `enablejsapi=1` parameter appended to the URL of the video. It's also recommended to append the `wmode=opaque` parameter. The parameters need to be delimited by `&amp;`.

*Example 2:*

```html
<iframe class="sp-video" src="http://www.youtube.com/embed/msIjWthwWwI?enablejsapi=1&amp;wmode=opaque" width="500" height="350" frameborder="0" allowfullscreen></iframe>
```

##### Vimeo #####

Just like YouTube videos, Vimeo videos can also be loaded by using a poster image or by inserting directly the video iframe.

*Example 1:*

```html
<a class="sp-video" href="http://vimeo.com/109354891">
    <img src="path/to/poster.jpg" width="500" height="300"/>
</a>
```

When using the second method, the videos will need to have the `api=1` parameter appended to the URL of the video.

*Example 2:*

```html
<iframe class="sp-video" src="http://player.vimeo.com/video/109354891?api=1" width="500" height="300" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
```

##### HTML5 #####

Simple HTML5 videos don't need any preparations other than having the `sp-video` class.

*Example:*

```html
<video class="sp-video" poster="path/to/poster.jpg" width="500" height="350" controls="controls" preload="none">
	<source src="path/to/video.mp4" type="video/mp4"/>
	<source src="path/to/video.ogv" type="video/ogg"/>
</video>
```

##### Video.js #####

Each Video.js video must have a unique 'id' attribute. Also, because the Video.js library changes the HTML markup of the video, we'll create a container element and add the `sp-video` class to that element instead. Also, the container element must have the `data-video-id` attribute, which is used to specify the 'id' attribute of the video.

*Example:*

```html
<div class="sp-video" data-videojs-id="video1">
	<video id="video1" class="video-js vjs-default-skin" poster="path/to/poster.jpg" width="500" height="350" controls="controls" preload="none" data-setup="{}">
		<source src="path/to/video.mp4" type="video/mp4"/>
		<source src="path/to/video.ogv" type="video/ogg"/>
	</video>
</div>
```

Please note that, in order to use Video.js, you need to load the Video.js JavaScript and CSS files in your page. More information about how to use Video.js, in general, can be found on the [official Video.js page](http://www.videojs.com/). 

##### SublimeVideo #####

Each SublimeVideo instance must have a unique 'id' attribute.

*Example:*

```html
<video id="video2" class="sp-video sublime" poster="path/to/poster.jpg" width="500" height="350" controls="controls" preload="none">
	<source src="path/to/video.mp4" type="video/mp4"/>
	<source src="path/to/video.ogv" type="video/ogg"/>
</video>
```

Please note that, in order to use SublimeVideo, you will also need to load a script in your page which you need to download from the SublimeVideo page. More information about how to use SublimeVideo, in general, can be found on the [official SublimeVideo page](http://www.sublimevideo.net/).

### JW Player ###

Just like Video.js, JW Player videos modify the HTML markup and we need to use a container element to facilitate the integration with the Video Controller plugin. The container will have the `data-jwplayer-id` attribute which will indicate the `id` attribute of the video element.

```html
<div id="video-container" data-jwplayer-id="my-video">
	<div id="my-video">Loading the video...</div>
</div>
```

```javascript
$(document).ready(function() {
    jwplayer("my-video").setup({
        file: "http://bqworks.com/products/assets/videos/bbb/bbb-trailer.mp4",
        image: "http://bqworks.com/products/assets/videos/bbb/bbb-poster.jpg",
        width: 500,
        height: 350
    });


	$('#video-container').videoController();
});
```

It's also possible to not use a container element, but in that case the plugin needs to be instantiated after the video was set up.

```html
<div id="my-video">Loading the video...</div>
```

```javascript
var video;

$(document).ready(function() {
    jwplayer("my-video").setup({
        file: "http://bqworks.com/products/assets/videos/bbb/bbb-trailer.mp4",
        image: "http://bqworks.com/products/assets/videos/bbb/bbb-poster.jpg",
        width: 500,
        height: 350,
        events: {
        	onReady: function() {
        		// if the flash player is used, the set ID will be attributed to an object element. 
        		// However, we can't instantiate the plugin on an object element, 
        		// so we instantiate it on the object's wrapper instead
        		video = $('#my-video').is('object') ? $('#my-video').parent() : $('#my-video');
        		video.videoController();
        	}
        }
    });
});
```
