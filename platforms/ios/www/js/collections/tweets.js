(function () {
  "use strict";

  // TODO: Get the Bearer token when the class get instantiated
  rnc.Collections.Tweets = Backbone.Collection.extend({
    model: rnc.Models.Tweet,
    numListing: 20,
    totalAvailable: 0,
    totalPages: 0,
    authorization: null,
    urlApiKey: "5PQ3jhFDO4SP6K7mqmDtKw",
    urlApiSecret: "noZJi9VHXe28BnpZ4t735LEsokdEow1hoJzU0fQ5Eo",
    twitterTokenURL: "https://api.twitter.com/oauth2/token",
    twitterStreamURL: "https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=",
    screenName: "therockncoder",
    authorizationReady: null,
    dataReady: null,

    initialize: function (callback) {
      this.authorizationReady = $.Deferred();
      this.getAuthorization();

      // we need to wait for the authorization to
      $.when(this.authorizationReady).then(function () {
        console.log("Tweets Authorized!");
        rnc.Event.trigger("rnc_tweets_authorized");
      });
      console.log("Tweets Collection Initialized!")
    },

    url: function () {
      return this.twitterStreamURL + this.screenName;
    },

    // PhoneGap apps don't have cross domain issues
    sync: function (method, model, options) {
      if (this.authorizationReady.state() === "resolved") {
        var that = this;
        var ajaxRead = function (model, options) {
          // Default JSON-request options.
          var params = _.extend({
            dataType: 'json',
            beforeSend: function (xhrObj) {
              xhrObj.setRequestHeader("Authorization", "Bearer " + that.authorization.access_token);
              xhrObj.setRequestHeader("Content-Type", "application/json");
            },
            type: 'GET',
            url: this.url()
          }, options);
          console.log("URL: " + params.url);
          return $.ajax(params);
        };

        switch (method) {
          case 'read':
            console.log("SYNC'ing!!!");
            return ajaxRead.call(this, model, options);
          default:
            // all other verbs can't be implemented since this is a read-only third party service
            break;
        }
      }
    },

    parse: function (response) {
      if (response && response.length) {
        return response;
      }
      return [];
    },

    getAuthorization: function () {
      // URL encode the consumer key and secret
      var base64Encoded,
        that = this,
      // Concatenate the encoded consumer key, a colon character, and the encoded consumer secret
        urlApiKey = encodeURIComponent(this.urlApiKey),
        urlApiSecret = encodeURIComponent(this.urlApiSecret),
        combined = urlApiKey + ":" + urlApiSecret;

      // Base64 encode the string
      base64Encoded = rnc.Base64.encode(combined);

      // Step 2: Obtain a bearer token
      $.ajax({
        beforeSend: function (xhrObj) {
          xhrObj.setRequestHeader("Authorization", "Basic " + base64Encoded);
          xhrObj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
        },
        type: "POST",
        url: this.twitterTokenURL,
        processData: true,
        data: {
          grant_type: 'client_credentials'
        },
        dataType: "json",
        success: function (auth) {
          that.authorization = auth;
          // resolve
          that.authorizationReady.resolve();
          // Applications should verify that the value associated with the
          // token_type key of the returned object is bearer
          if (auth && auth.token_type && auth.token_type === "bearer") {
            console.log(JSON.stringify(auth));
          }
        }
      });
    }
  });
}());
