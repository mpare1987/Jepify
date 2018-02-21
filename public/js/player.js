
function renderPodiumLights() {
   function createLight() {
     var l = document.createElement('div');
     l.className = 'podium_light'
     return l;
   }

   var l = document.querySelector('.podium_lights');
   var h = $(l).height() * 2; // multiply by 2 for two sets of lights
   var lightHeight = 12 + 6; // 12px grid gap and 6px height
   var lightFrag = document.createDocumentFragment();
   var i = 0;
   var numLights = 0;

   while (i < h) {
     lightFrag.appendChild(createLight());

     i += lightHeight;
     numLights++;
   }

   // add a final light to complete the set if we ended up with an odd number
   if (numLights % 2) lightFrag.appendChild(createLight())

   l.appendChild(lightFrag);
}

function resetPodiumLights() {
   $('.podium_light').removeClass('is-blinking is-off is-out');
}

function countDown(cb) {
   var numLights = $('.podium_light').length;
   var $lightsOn = $('.podium_light').not('.is-out');
   var toBlinkOut;
   var max;
   var $range;
   // if there are only two lights left, we are on the final second of the countdown
   // NOTE: rename states later because they are confusing
   if ($lightsOn.length === 2) {
      $lightsOn.addClass('is-blinking');
      window.setTimeout(function() {
         $lightsOn.addClass('is-off');
         cb();
      },2300);
      return;
   }

   max = (Math.floor(numLights) / 4); // 4 seconds
   max = max % 2 ? max : max - 1; // make sure max is always even
   toBlinkOut = Math.min($lightsOn.length, max);

   // leave the final two lights on for the final iteration of countdown.
   if ($lightsOn.length - (toBlinkOut) <= 2) {
      toBlinkOut = $lightsOn.length  - 2;
   }

   $range = $lightsOn.slice($lightsOn.length - (toBlinkOut / 2), $lightsOn.length).add($lightsOn.slice(0,(toBlinkOut / 2)));

   $range.addClass('is-out');

   setTimeout(function() {countDown(cb)},1000);
}
// blink out lights

// on receive countdown event, start counting down.
// setTimeout(function(){
//   countDown(seconds);
// },1000);
