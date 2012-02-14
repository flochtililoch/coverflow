/*!
 * Inspiration from Addy Osmani - http://addyosmani.com/resources/coverflow/demo/demo.html
 * Cleanup / ajustments by Florent Bonomo flochtililoch@gmail.com
 * Addy Osmani, Paul Bakhaus, Nicolas Bonnicci
 * Dependencies :
 *  jquery (tested with 1.7.1)
 *  jquery.ui.core.js (tested with 1.8.17)
 *  jquery.ui.widget.js (tested with 1.8.17)
 *  
 *  jquery.ui.mouse.js  (optional, required if slider support needed)
 *  jquery.ui.slider.js (optional, required if slider support needed)
 *
 *  ui.coverflow.js
 *
 *  sylvester.js
 *  transformie.js
 *
 *  jquery.mousewheel.js
 */
$.extend(true, $.ui.coverflow.prototype, {

  options: { 
    keyboard: true,
    mousewheel: true,
    slider: false,
    item: 0,
    duration: 1500,
    offset: 0,
    sensitivity: 0.05
  },
    
  _init: function() {
    this.element.data('coverflow', this.element.data('betterCoverflow'));
    
    // Enabled only if Slider library present
    if(this.options.slider && $.fn.slider !== undefined) {
      this.initSlider(this.options.slider);
    }
    
    this.skipTo(this.options.offset);
    
    // Enabled only if Mousewheel library present
    if(this.options.mousewheel && $.fn.mousewheel !== undefined) {
      this.initMouseWheel();
    }
    
    if(this.options.keyboard) {
      this.initKeyboard();
    }
    
    return $.ui.coverflow;
  },

  initSlider: function(elt) {
    var self = this;
    elt.slider({
      min: 0,
      max: self.element.find(self.options.items).length - 1,
      slide: function(event, ui) {
        self.element.coverflow('select', ui.value, true);
      }
    });
  },
  
  initMouseWheel: function() {
    var self = this;
    $('body').mousewheel(function(event, delta) {
      var position = self.current,
          sensitivity = self.options.sensitivity,
          item = 0,
          length = self.element.find(self.options.items).length - 1,
          leftValue = 0;

      // Check the deltas to find out if the user has scrolled up or down
      if (delta > sensitivity && position > 0) {
        position -= 1;
      } else {
        if (delta < -(sensitivity) && position < length) {
          position += 1;
        }
      }
      leftValue = -((100 - position) * self.difference / 100);
      
      // Calculate the content top from the slider position
      if (leftValue > 0) {
        leftValue = 0;
      }
      
      // Stop the content scrolling down too much
      if (Math.abs(leftValue) > self.difference) {
        leftValue = ( - 1) * self.difference;
      }
      
      // Stop the content scrolling up beyond point desired
      item = Math.floor(position);
      self.skipTo(item);
      
      // Prevent history back and forth if there are still items
      if(item >= 0 && item <= length)
      {
        // Edge cases
        if(!(item === length && delta < 0 || item === 0 && delta > 0))
        {
          event.preventDefault();
        }
      }
    });
  },
  
  initKeyboard: function() {
    var self = this;
    $(document).keydown(function(e) {
      var current = self.current;
      if (e.keyCode == 37) {
        if (current > 0) {
          current--;
          self.skipTo(current);
        }
      } else {
        if (e.keyCode == 39) {
          if (current < self.element.find(self.options.items).length - 1) {
            current++;
            self.skipTo(current);
          }
        }
      }
    });
  },
  
  skipTo: function(itemNumber) {
    if(this.options.slider && $.fn.slider !== undefined) {
      this.options.slider.slider("option", "value", itemNumber);
    }
    this.element.coverflow('select', itemNumber, true);
  }
});


$('.demo #coverflow').coverflow({
  slider: $('.demo #slider'),
  offset: 4
});
