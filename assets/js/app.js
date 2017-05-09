(function() {
  'use strict';
  // Initialize the app with all basic data
  var app = {
    config: {
      BASE_URL: apibaseurl,
      SEARCH_QUERY: '?q=',
      API_KEY_QUERY: '&key=' + apikey + '&format=json'
    },
    cache: {
      paintings: [],
      paint: []
    },
    htmlElements: {
      userInputField: document.getElementById("user-input-field"),
      searchForm: document.getElementById("search-form"),
      searchFeedback: document.getElementById("search-feedback"),
      randomPaintingTemplate: document.getElementById("random-paintings-template"),
      randomPaintingOuput: document.getElementById("random-paintings-output")
    },
    init: function() {
      router.init();
    }
  };

  // Routie for the router handling
  var router = {
    init: function() {
      routie({
        '': function() {
          collection.get();
        },
        ':principalMakers': function(principalMakers) {

        }
      });
    }
  };

  var collection = {
    search: function() {
      // app.htmlElements.searchForm.addEventListener("submit", searchQuery)

      app.htmlElements.searchForm.addEventListener("submit", function() {
        var userInput = app.htmlElements.userInputField.value;
        console.log(userInput);
        collection.get(userInput);

        if (query.length > 0) {

        }

      });
    },
    get: function() {
      var request = new window.XMLHttpRequest();
      var url = app.config.BASE_URL + app.config.SEARCH_QUERY + '' + app.config.API_KEY_QUERY;
			request.open("GET", url, true);
			request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          var data = JSON.parse(request.responseText);
          console.log(data);
          renderHandlebars.randomPaintings(data);
          } else {
          // We reached our target server, but it returned an error
        }

			};

			request.onerror = function() {
			   // There was a connection error of some sort
			};

			request.send();
    }
  };

  var renderHandlebars = {
    randomPaintings: function(all) {
      var rawTemplating = app.htmlElements.randomPaintingTemplate.innerHTML;
			var compiledTemplate = Handlebars.compile(rawTemplating);
			var ourGeneratedHTML = compiledTemplate(all);
      var outputData = app.htmlElements.randomPaintingOutput;
      console.log(outputData);
      // outputData.innerHTML = ourGeneratedHTML;
    }
  }

  app.init();

})();