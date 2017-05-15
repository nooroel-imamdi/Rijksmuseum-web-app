(function() {
  'use strict';
  // Initialize the app with all basic data
  var app = {
    config: {
      BASE_URL: apibaseurl,
      SEARCH_QUERY: '?q=',
      API_KEY_QUERY: 'key=' + apikey + '&format=json'
    },
    cache: {
      paintings: [],
      paint: []
    },
    htmlElements: {
      userInputField: document.querySelector('#user-input-field'),
      searchForm: document.querySelector('#search-form'),
      searchFeedback: document.querySelector('#search-feedback'),
      randomPaintingTemplate: document.querySelector('#random-paintings-template'),
      randomPaintingOuput: document.querySelector('#random-paintings-output'),
      detailPaintingTemplate: document.querySelector('#detail-painting-template'),
      detailPaintingOuput: document.querySelector('#detail-painting-output'),
      errorPage: document.querySelector('#error'),
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
          collection.getRandom();
        },
        'paint/:objectNumber': function(objectNumber) {
          collection.getDetail(objectNumber);
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
    },
    renderDetail(){
      app.htmlElements.searchForm.classList.add('hide');
      app.htmlElements.randomPaintingOuput.classList.add('hide');
    }

  };

  var collection = {
    // search: function() {
    //   // app.htmlElements.searchForm.addEventListener('submit', searchQuery)
    //
    //   app.htmlElements.searchForm.addEventListener('submit', function(e) {
    //    e.preventDefault()
    //     var userInput = app.htmlElements.userInputField.value;
    //     console.log(userInput);
    //     collection.getRandom(userInput);
    //
    //     if (query.length > 0) {
    //
    //     }
    //
    //   });
    // },
    getRandom: function() {
      sections.loaderState('show');
      var request = new window.XMLHttpRequest();
      var url = app.config.BASE_URL + app.config.SEARCH_QUERY + '' + '&' + app.config.API_KEY_QUERY;
			request.open('GET', url, true);
			request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          var data = JSON.parse(request.responseText);
          console.log(data);
          renderHandlebars.randomPaintings(data);

          setTimeout(function() {
            sections.loaderState('hide');
          }, 1000);
          var collectionObject = Object.keys(data.artObjects).map(function (key) {

            return {
              title: data.artObjects[key].title,
              paintUrl: data.artObjects[key].webImage.url,
              painter: data.artObjects[key].principalOrFirstMaker,
              objectNumber: data.artObjects[key].objectNumber
            };

          });
          // app.cache.paintings.push(collectionObject);
          // renderHandlebars.randomPaintings(collectionObject);

          // console.log(collectionObject);

          // var doubles = data.map(function(data) {
          //   console.log(data);
          //   // return title
          // });
          // console.log(doubles);
          // app.cache.paintings.push(collectionObject);
          } else {
          // We reached our targetRandom server, but it returned an error
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
    },
    getDetail: function(objectNumber) {
      sections.loaderState('show');
      sections.renderDetail();
      var request = new window.XMLHttpRequest();
      var url = app.config.BASE_URL + '/' + objectNumber + '?&' + app.config.API_KEY_QUERY;
			request.open('GET', url, true);
			request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          var data = JSON.parse(request.responseText);
          renderHandlebars.detailPainting(data);

          console.log(data);
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
          // We reached our targetRandom server, but it returned an error
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
      console.log(all);
      var data = app.cache.paintings;
      var rawTemplating = app.htmlElements.randomPaintingTemplate.innerHTML;
			var compiledTemplate = Handlebars.compile(rawTemplating);
			var ourGeneratedHTML = compiledTemplate(all);
      var outputData = app.htmlElements.randomPaintingOuput;
      outputData.innerHTML = ourGeneratedHTML;
    },
    detailPainting: function(detail) {
      var rawTemplating = app.htmlElements.detailPaintingTemplate.innerHTML;
			var compiledTemplate = Handlebars.compile(rawTemplating);
			var ourGeneratedHTML = compiledTemplate(detail);
      var outputData = app.htmlElements.detailPaintingOuput;
      outputData.innerHTML = ourGeneratedHTML;
    },
  };
  // console.log(app.cache.paintings);
  app.init();

})();
