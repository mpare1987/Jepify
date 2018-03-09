var _lightsOn = 48; // there are 48 total lights
window.countdownTimer = null;

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
   var toBlinkOut = 0;
   var max;
   var $range;

   if (_lightsOn <= 0) {
      return
   }

   i = i || 1;

   switch (i) {
      case 1:
      case 2:
      case 3:
         toBlinkOut = 3;
         break;
      case 4:
         toBlinkOut = 2;
         break;
      default:
         toBlinkOut = 1;
         break;
   }

   arrLights.forEach(function($lights,i) {
      var len = $lights.length;
      $range = $lights.slice(len - toBlinkOut, len).add($lights.slice(0, toBlinkOut));
      $range.addClass('is-off');
   });

   _lightsOn -= toBlinkOut * 4;

   window.countdownTimer = setTimeout(function() {countDown(i+1, cb)},1250);
}
