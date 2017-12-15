const mainHost = require('../../../config').mainHost;

Page({
  data: {

  },

  onLoad: function () {
    console.log('onLoad')
    var that = this
  },

  bindFormSubmit: function(e) {
    console.log(e.detail.value.textarea);
  }
})