var output = {
  message: $('#message'),

  normalMessage: function (text) {
    this.clearMessage();
    this.message.fadeIn('fast');
    this.message.addClass('normalMessage').append(text);

    setTimeout(function () {
      output.message.fadeOut(2000, 'linear');
    }, 15000);
  },

  warningState: function (text) {
    var state = this.refreshState();
    state.fadeIn('fast');
    state.addClass('state misc bounce')
      .append(text);

    setTimeout(function () {
      state.fadeOut(2000, 'linear');
    }, 15000);
  },

  successState: function (text) {
    var state = this.refreshState();
    state.fadeIn('fast');
    state.addClass('state returnSuccess bounce')
      .append(text);

    setTimeout(function () {
      state.fadeOut(2000, 'linear');
    }, 15000);
  },

  refreshState: function () {
    this.message.prev('span').remove();
    this.message.before('<span></span>');

    return this.message.prev('span');
  },

  clearMessage: function () {
    this.message.removeClass().empty();
  },
};