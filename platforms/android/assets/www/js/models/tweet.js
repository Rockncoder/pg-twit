(function() {
  "use strict";

  rnc.Models.Tweet = Backbone.Model.extend({

    // handling the parse since I want to clean up the model a bit (later)
    parse: function (response) {
      this.set(response);
    }
  });

  rnc.Models.tweet = new rnc.Models.Tweet();
}());
