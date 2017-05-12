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
      userInputField: document.querySelector("#user-input-field"),
      searchForm: document.querySelector("#search-form"),
      searchFeedback: document.querySelector("#search-feedback"),
      randomPaintingTemplate: document.querySelector("#random-paintings-template"),
      randomPaintingOuput: document.querySelector("#random-paintings-output"),
      errorPage: document.querySelector("#error"),
      loader: document.querySelector('.loader')
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

  var sections = {
    loaderState(state) {
      if (state === 'show') {
        app.htmlElements.loader.classList.remove('hide')
      } else {
        app.htmlElements.loader.classList.add('hide');
      }
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
      sections.loaderState('show');
      var request = new window.XMLHttpRequest();
      var url = app.config.BASE_URL + app.config.SEARCH_QUERY + '' + app.config.API_KEY_QUERY;
			request.open("GET", url, true);
			request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          var data = JSON.parse(request.responseText);
          renderHandlebars.randomPaintings(data);

          setTimeout(function() {
            sections.loaderState('hide');
          }, 1000);
          // var collectionObject = Object.keys(data).map(function (key) {
          //   console.log(data);
          //
          //   return {
          //     title: data.artObjects[key].title,
          //   };
          //
          // });

          // app.cache.paintings.push(collectionObject);
          } else {
          // We reached our target server, but it returned an error
          sections.loaderState('hide');
        }

			};

			request.onerror = function() {
			   // There was a connection error of some sort
         sections.loaderState('hide');
         // Show error page
         app.htmlElements.errorPage.classList.remove('hide');
			};

			request.send();
    }
  };

  var renderHandlebars = {
    randomPaintings: function(all) {
      var rawTemplating = app.htmlElements.randomPaintingTemplate.innerHTML;
			var compiledTemplate = Handlebars.compile(rawTemplating);
			var ourGeneratedHTML = compiledTemplate(all);
      var outputData = app.htmlElements.randomPaintingOuput;
      outputData.innerHTML = ourGeneratedHTML;
    }
  };
  app.init();

})();
