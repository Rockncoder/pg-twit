(function () {

  rnc.Views.Main = Backbone.View.extend({
    initialize: function () {
      console.log("**** Main");
      rnc.Event.on('route:main', this.show, this);
    },

    show: function () {
      console.log('showing main view');
    }
  });
}());