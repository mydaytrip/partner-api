/*
Copyright (c) 2017-2022 individual contributors to center-key/node-slate
Copyright (c) 2015 SD Elements, Inc.
Copyright (c) 2008-2013 Concur Technologies, Inc.

Licensed under the Apache License, Version 2.0 (the "License"); you may
not use this file except in compliance with the License. You may obtain
a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations
under the License.
*/
(function(global) {
   'use strict';
   var languages = [];
   global.setupLanguages =   setupLanguages;
   global.activateLanguage = activateLanguage;
   function activateLanguage(language) {
      if (!language) return;
      if (language === '') return;
      $('.lang-selector a').removeClass('active');
      $('.lang-selector a[data-language-name=' + language + ']').addClass('active');
      for (var i=0; i < languages.length; i++) {
         $('.highlight.' + languages[i]).hide();
         $('.lang-specific.' + languages[i]).hide();
         }
      $('.highlight.' + language).show();
      $('.lang-specific.' + language).show();
      global.toc.calculateHeights();
      if ($(window.location.hash).get(0))  //scroll to the new location of the position
         $(window.location.hash).get(0).scrollIntoView(true);
      }
   function parseUrl(str) {
      // parseUrl and stringifyUrl are from https://github.com/sindresorhus/query-string
      // MIT licensed
      // https://github.com/sindresorhus/query-string/blob/7bee64c16f2da1a326579e96977b9227bf6da9e6/license
      if (typeof str !== 'string')
         return {};
      str = str.trim().replace(/^(\?|#|&)/, '');
      if (!str)
         return {};
      function processParam(ret, param) {
         var parts = param.replace(/\+/g, ' ').split('=');
         var key = parts[0];
         var val = parts[1];
         key = decodeURIComponent(key);
         // missing `=` should be `null`:
         // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
         val = val === undefined ? null : decodeURIComponent(val);
         if (!ret.hasOwnProperty(key))
            ret[key] = val;
         else if (Array.isArray(ret[key]))
            ret[key].push(val);
         else
            ret[key] = [ret[key], val];
         return ret;
         }
      return str.split('&').reduce(processParam, {});
      }
   function stringifyUrl(obj) {
      function makePair(key) {
         var val = obj[key];
         if (Array.isArray(val)) {
            return val.sort().map(function(val2) {
               return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
            }).join('&');
            }
         return encodeURIComponent(key) + '=' + encodeURIComponent(val);
         }
      return obj ? Object.keys(obj).sort().map(makePair).join('&') : '';
      }
   function getLanguageFromQueryString() {
      // Gets the language set in the query string
      if (location.search.length >= 1) {
         var language = parseUrl(location.search).language;
         if (language)
            return language;
         else if (jQuery.inArray(location.search.substring(1), languages) != -1)
            return location.search.substring(1);
         }
      return false;
      }
   function generateNewQueryString(language) {
      // Returns a new query string with the new language in it
      var url = parseUrl(location.search);
      if (url.language) {
         url.language = language;
         return stringifyUrl(url);
         }
      return language;
      }
   function pushURL(language) {
      // If a button is clicked, add the state to the history
      if (!history)
         return undefined;
      var hash = window.location.hash;
      if (hash)
         hash = hash.replace(/^#+/, '');
      history.pushState({}, '', '?' + generateNewQueryString(language) + '#' + hash);
      localStorage.setItem('language', language);  //save language as next default
      }
   function setupLanguages(l) {
      var defaultLanguage = localStorage.getItem('language');
      languages = l;
      var presetLanguage = getLanguageFromQueryString();
      if (presetLanguage) {
         activateLanguage(presetLanguage);  //language is in the URL, so use that language!
         localStorage.setItem('language', presetLanguage);
         }
      else if ((defaultLanguage !== null) && (jQuery.inArray(defaultLanguage, languages) != -1)) {
         activateLanguage(defaultLanguage);  //use last language selected
         }
      else {
         activateLanguage(languages[0]);  //no language selected, so use the default
         }
      }
   function setup() {
      function doActivateLang(event) {
         var language = $(event.target).data('language-name');
         pushURL(language);
         activateLanguage(language);
         return false;
         }
      $('.lang-selector a').on({ click: doActivateLang });  //events for language tabs
      window.onpopstate = function() { activateLanguage(getLanguageFromQueryString()); };
      }
   $(setup);
})(window);
