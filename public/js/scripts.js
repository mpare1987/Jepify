var Game = function(id) {
  this.enabled = false;
  this.players = [];
  this.$field = $('.field');
  this.$respondent = $('.respondent')

  this.enable = function() {
    this.enabled = true;
    this.$field.addClass('open');
  };
  this.disable = function() {
    this.enabled = false;
    this.$field.removeClass('open');
  };

  this.setRespondent = function(name) {
    this.$respondent.text(name)
  }
  this.clearRespondent = function() {
    this.$respondent.text('');
  }

  this.init = function() {
    var that = this;

    // handle buzzer press
    $(document).on('click', '.buzz', function() {
      var $btn = $(this);

      if ($btn.hasClass('disabled') || $btn.hasClass('responded')) {
        // clicks are not allowed while disabled
        return;
      }

      if (that.enabled === false) {
        // disable buzzer for 250ms because the game is not open for responses yet
        $btn.addClass('disabled');
        setTimeout(function() {
            $btn.removeClass('disabled');
        }, 250);

        return;
      }

      // disable game while respondent's answer is evaluated
      that.disable();

      // show respondent's name to proctor
      that.setRespondent($btn.data().name);

      // add responded state to buzzer so player cannot buzz in again until game is cleared
      $btn.addClass('responded');
    });

    $(document).on('click', '.enable', function() {
        that.clearRespondent();
        that.enable();
    });

    $(document).on('click', '.clear', function() {
        that.clearRespondent();

        // disable game for next question
        that.disable();

        // clear 'responded' state from all buzzers
        $('.buzz').removeClass('responded');
    });
  };
};


$(function() {
   var game = new Game();
   game.init();
})
