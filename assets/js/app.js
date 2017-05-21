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
      searchForm: document.querySelector('.search'),
      searchField: document.querySelector('#search-field'),
      searchBtn: document.querySelector('#search-btn'),
      searchFeedback: document.querySelector('.search-feedback'),
      randomPaintingTemplate: document.querySelector('#random-paintings-template'),
      randomPaintingOuput: document.querySelector('#random-paintings-output'),
      searchTemplate: document.querySelector('#search-template'),
      searchOutput: document.querySelector('#search-output'),
      detailPaintingTemplate: document.querySelector('#detail-painting-template'),
      detailPaintingOuput: document.querySelector('#detail-painting-output'),
      painterTemplate: document.querySelector('#painter-template'),
      painterOutput: document.querySelector('#painter-output'),
      emptyResult: document.querySelector('.empty-result'),
      errorPage: document.querySelector('.error'),
      loader: document.querySelector('.loader'),
      backBtn: document.querySelector('.back-button'),
    },
    init: function() {
      router.init();
      search.init();
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
        },
      });
    }
  };

  // Section for Initializing when a div has to disappear
  var sections = {
    loaderState(state) {
      if (state === 'show') {
        app.htmlElements.loader.classList.remove('hide')
      } else {
        app.htmlElements.loader.classList.add('hide');
      }
    },
    renderRandom() {
      app.htmlElements.painterOutput.classList.add('hide');
      app.htmlElements.detailPaintingOuput.classList.add('hide');
      app.htmlElements.emptyResult.classList.add('hide');
    },
    renderSearch() {
      app.htmlElements.randomPaintingOuput.classList.add('hide');
      app.htmlElements.detailPaintingOuput.classList.add('hide');
      app.htmlElements.emptyResult.classList.add('hide');
    },
    renderDetail() {
      app.htmlElements.searchForm.classList.add('hide');
      app.htmlElements.randomPaintingOuput.classList.add('hide');
      app.htmlElements.painterOutput.classList.add('hide');
      app.htmlElements.emptyResult.classList.add('hide');
      app.htmlElements.detailPaintingOuput.classList.remove('hide');
      app.htmlElements.searchOutput.classList.add('hide');
      app.htmlElements.backBtn.classList.remove('hide');
    },
    renderPainter() {
      app.htmlElements.searchForm.classList.add('hide');
      app.htmlElements.randomPaintingOuput.classList.add('hide');
      app.htmlElements.detailPaintingOuput.classList.add('hide');
      app.htmlElements.emptyResult.classList.add('hide');
    },
  };

  // Search
  var search = {
    init: function() {
      var searchForm = app.htmlElements.searchForm;
      var searchField = app.htmlElements.searchField;
      searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        collection.getSearch(searchField.value);
      });
    }
  };

  var collection = {
    getSearch: function(searchQuery) {
      console.log(searchQuery);
      // Clears cache by every request
      app.cache.paintings = [];

      sections.loaderState('show');
      sections.renderSearch();
      var request = new window.XMLHttpRequest();
      var url = app.config.BASE_URL + app.config.SEARCH_QUERY + searchQuery + '&' + app.config.API_KEY_QUERY;
			request.open('GET', url, true);
			request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          var data = JSON.parse(request.responseText);

          if (searchQuery.length > 0) {
        		app.htmlElements.searchFeedback.innerHTML = "U zocht op " + "'" + searchQuery + "'";
        	} else{
        		app.htmlElements.searchFeedback.innerHTML = "U heeft het zoekveld leeggelaten.";
        	};

          if(data.artObjects.length === 0){
            app.htmlElements.emptyResult.classList.remove('hide');
          };

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

          // Pass data to handlebars function
          renderHandlebars.search(collectionObject);

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

    getRandom: function() {

      // clears cache by every request
      app.cache.paintings = [];

      sections.loaderState('show');
      sections.renderRandom();
      var request = new window.XMLHttpRequest();
      var url = app.config.BASE_URL + app.config.SEARCH_QUERY + '' + '&' + app.config.API_KEY_QUERY;
			request.open('GET', url, true);
			request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          // Success!
          var data = JSON.parse(request.responseText);
          console.log(data);

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
              showImage: filterImage[key].showImage
            };
          });

          // Reduce objects amounts how many objects are available
          var countObjects = data.artObjects.reduce(function (allNames, name) {
            if (name in allNames) {
              allNames[name]++;
            }
            else {
              allNames[name] = 1;
            }
            return allNames;
          }, {});

          console.log(countObjects);

          // Sort put paints on sequence according the width
          var paintWidth = data.artObjects.sort(function (a, b) {
            return a.webImage.width - b.webImage.width;
          });

          console.log(paintWidth);

          // Push data to cache
          app.cache.paintings.push(collectionObject);
          // Pass data to handlebars function
          renderHandlebars.randomPaintings(collectionObject);

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

      // clears cache by every request
      app.cache.paintings = [];

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
          // Pass data to handlebars function
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
    search: function() {
      var collection = app.cache.paintings[0];
      var collectionNew = {collection};
      var rawTemplating = app.htmlElements.searchTemplate.innerHTML;
			var compiledTemplate = Handlebars.compile(rawTemplating);
			var ourGeneratedHTML = compiledTemplate(collectionNew);
      var outputData = app.htmlElements.searchOutput;
      outputData.innerHTML = ourGeneratedHTML;
    },
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
  };
  app.init();

})();
