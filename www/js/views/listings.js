
(function () {

  rnc.Views.Listings = Backbone.View.extend({
    tagName: 'section',
    template: '#tweets-template',

    initialize: function () {
      console.log("**** Listings");
      rnc.Event.on('route:listings-article', this.show, this);
    },

    render: function () {
      var content = $(this.template).html();
      $(this.el).html(_.template(content, {shops: rnc.Collections.tweets.toJSON()}));
      return this;
    },

    show: function () {
      console.log("listing:view");
      $('#listings-article').html(this.render().el);
    }
  });
}());