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
      paintings: []
    },
    htmlElements: {
      userInputField: document.querySelector('#user-input-field'),
      searchForm: document.querySelector('#search-form'),
      searchFeedback: document.querySelector('#search-feedback'),
      randomPaintingTemplate: document.querySelector('#random-paintings-template'),
      randomPaintingOuput: document.querySelector('#random-paintings-output'),
      detailPaintingTemplate: document.querySelector('#detail-painting-template'),
      detailPaintingOuput: document.querySelector('#detail-painting-output'),
      painterTemplate: document.querySelector('#painter-template'),
      painterOutput: document.querySelector('#painter-output'),
      errorPage: document.querySelector('#error'),
      loader: document.querySelector('.loader')
    },
    init: function() {
      router.init();
      collection.search();
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
        },
        ':painter': function(painter) {
          collection.getPainter(painter);
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
    renderDetail() {
      app.htmlElements.searchForm.classList.add('hide');
      app.htmlElements.randomPaintingOuput.classList.add('hide');
      app.htmlElements.painterOutput.classList.add('hide');
    },
    renderPainter() {
      app.htmlElements.searchForm.classList.add('hide');
      app.htmlElements.randomPaintingOuput.classList.add('hide');
      app.htmlElements.detailPaintingOuput.classList.add('hide');
    }
  };

  var collection = {
    search: function() {
      // app.htmlElements.searchForm.addEventListener('submit', searchQuery)
        // console.log(app.htmlElements.searchForm.value);
        app.htmlElements.searchForm.addEventListener('submit', function(e) {
          e.preventDefault();

        });

        console.log(app.htmlElements.searchForm.value);



      // app.htmlElements.searchForm.addEventListener('submit', function(e) {
      //   e.preventDefault()
      //   var userInput = app.htmlElements.userInputField.value;
      //   console.log(userInput);
      //   collection.getRandom(userInput);
      //
      //   if (query.length > 0) {
      //
      //   }
      //
      // });
    },
    getRandom: function() {

      // clears cache by every request
      app.cache.paintings = [];

      sections.loaderState('show');
      var request = new window.XMLHttpRequest();
      var url = app.config.BASE_URL + app.config.SEARCH_QUERY + '' + '&' + app.config.API_KEY_QUERY;
			request.open('GET', url, true);
			request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          var data = JSON.parse(request.responseText);

          setTimeout(function() {
            sections.loaderState('hide');
          }, 1000);

          // Filter on availability of image
          var filterImage = data.artObjects.filter(function(obj) {
            if (obj.showImage === true && obj.principalOrFirstMaker !== 'anoniem') {
              return obj
            }
          });

          // Mapping objects to relevant values
          var collectionObject = Object.keys(filterImage).map(function (key) {
            return {
              title: filterImage[key].title,
              paintUrl: filterImage[key].webImage.url,
              painter: filterImage[key].principalOrFirstMaker,
              objectNumber: filterImage[key].objectNumber,
              hasImage: filterImage[key].showImage
            };
          });

          // Push data to cache
          app.cache.paintings.push(collectionObject);
          renderHandlebars.painter(collectionObject);

        } else {
          // We reached our targetRandom server, but it returned an error
          sections.loaderState('hide');
          app.htmlElements.errorPage.classList.remove('hide');
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

        } else {
          // There was a connection error of some sort
          sections.loaderState('hide');
          // Show error page
          app.htmlElements.errorPage.classList.remove('hide');
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
    getPainter: function(painter) {

      // clears cache by every request
      app.cache.paintings = [];

      sections.loaderState('show');
      sections.renderPainter();
      var request = new window.XMLHttpRequest();
      var url = app.config.BASE_URL + app.config.SEARCH_QUERY + painter + '&' + app.config.API_KEY_QUERY;
			request.open('GET', url, true);
			request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          var data = JSON.parse(request.responseText);

          setTimeout(function() {
            sections.loaderState('hide');
          }, 1000);

          // Filter on availability of image
          var filterImage = data.artObjects.filter(function(obj) {
            if (obj.showImage === true) {
              return obj
            }
          });

          // Mapping objects to relevant values
          var collectionObject = Object.keys(filterImage).map(function (key) {
            return {
              title: filterImage[key].title,
              paintUrl: filterImage[key].webImage.url,
              painter: filterImage[key].principalOrFirstMaker,
              objectNumber: filterImage[key].objectNumber,
              hasImage: filterImage[key].showImage
            };
          });

          // Push data to cache
          app.cache.paintings.push(collectionObject);
          renderHandlebars.painter(collectionObject);

        } else {
          // We reached our targetRandom server, but it returned an error
          sections.loaderState('hide');
          app.htmlElements.errorPage.classList.remove('hide');
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
  };

  var renderHandlebars = {
    randomPaintings: function() {
      var collection = app.cache.paintings[0];
      var collectionNew = {collection};
      var rawTemplating = app.htmlElements.randomPaintingTemplate.innerHTML;
			var compiledTemplate = Handlebars.compile(rawTemplating);
			var ourGeneratedHTML = compiledTemplate(collectionNew);
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
    painter: function() {
      var collection = app.cache.paintings[0];
      var collectionNew = {collection};
      var rawTemplating = app.htmlElements.painterTemplate.innerHTML;
			var compiledTemplate = Handlebars.compile(rawTemplating);
			var ourGeneratedHTML = compiledTemplate(collectionNew);
      var outputData = app.htmlElements.painterOutput;
      outputData.innerHTML = ourGeneratedHTML;
    },
    // painter: function(detail) {
    //   var rawTemplating = app.htmlElements.detailPaintingTemplate.innerHTML;
		// 	var compiledTemplate = Handlebars.compile(rawTemplating);
		// 	var ourGeneratedHTML = compiledTemplate(detail);
    //   var outputData = app.htmlElements.detailPaintingOuput;
    //   outputData.innerHTML = ourGeneratedHTML;
    // },
  };
  app.init();

})();
