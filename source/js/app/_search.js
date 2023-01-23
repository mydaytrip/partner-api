//= require ../lib/_jquery.highlight
(function() {
   'use strict';
   var content, searchResults, index;
   var highlightOpts = { element: 'span', className: 'search-highlight' };
   function populate() {
      var documents = [];
      $('h1, h2').each(function() {
         var title = $(this);
         var body = title.nextUntil('h1, h2');

         documents.push({
            id: title.prop('id'),
            title: title.text(),
            body: body.text()
            });
         });

      var options = {
         shouldSort: true,
         includeMatches: true,
         threshold: 0.6,
         minMatchCharLength: 2,
         keys: ['title', 'body']
         };

      index = new Fuse(documents, options);
      }

   function bind() {
      content = $('.content');
      searchResults = $('.search-results');
      $('#input-search').on('keyup', search);
      }
   function highlight() {
      if (this.value) {
         content.highlight(this.value, highlightOpts);
         }
      }
   function unhighlight() {
      content.unhighlight(highlightOpts);
      }
   function search(event) {
      unhighlight();
      searchResults.addClass('visible');
      if (event.keyCode === 27)  //ESC key clears the field
         this.value = '';
      function displayResult(index, result) {
         var ref = result.item.id;
         var elem = document.getElementById(ref);
         searchResults.append('<li><a href=#' + ref + '>' + $(elem).text() + '</a></li>');
         }
      if (this.value) {
         var results = index.search(this.value);
         if (results.length) {
            searchResults.empty();
            $.each(results, displayResult);
            highlight.call(this);
            }
         else {
            searchResults.html('<li></li>');
            $('.search-results li').text('No Results Found for "' + this.value + '"');
            }
         }
      else {
         unhighlight();
         searchResults.removeClass('visible');
         }
      }
   $(populate);
   $(bind);
})();
