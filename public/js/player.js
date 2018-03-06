var _lightsOn = 48; // there are 48 total lights
var _cancelCountdown = false;

function resetPodiumLights() {
   _lightsOn = 48;
   $('.podium_light').removeClass('is-pulsing is-off');
}

function getActiveLights() {
   var left = $('.podium_lights--left').find('.podium_light').not('.is-off');
   var right = $('.podium_lights--right').find('.podium_light').not('.is-off');

   return [left,right];
}

function countDown(i, cb) {
   var arrLights = getActiveLights();
   var toBlinkOut;
   var max;
   var $range;

   if (_cancelCountdown) {
      _cancelCountdown = false;
      return
   }

   i = i || 1;

   // if there are only two lights left, we are on the final second of the countdown
   // NOTE: rename states later because they are confusing

   if (_lightsOn <= 4) {
      $range = $('.podium_light').not('.is-off');
      $range.addClass('is-pulsing');

      window.setTimeout(function() {
         $range.addClass('is-off');
         if (typeof cb === 'function') cb();
      },2500);

      return;
   }

   switch (i) {
      case 1:
      case 2:
         toBlinkOut = 4;
         break;
      case 3: toBlinkOut = 3;
   }

   arrLights.forEach(function($lights,i) {
      var len = $lights.length;
      $range = $lights.slice(len - toBlinkOut, len).add($lights.slice(0, toBlinkOut));
      $range.addClass('is-off');
   })

   _lightsOn -= toBlinkOut * 4;

   setTimeout(function() {countDown(i+1, cb)},1250);
}
