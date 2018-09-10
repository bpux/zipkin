/*
 * Copyright 2015-2018 The OpenZipkin Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */
import {component} from 'flightjs';
import $ from 'jquery';

export default component(function backToTop() {
  this.toTop = function() {
    event.preventDefault();
    $('html, body').animate({scrollTop: 0}, 300);
    return false;
  };

  this.after('initialize', function() {
    /* handle window scroll here*/
    $(window).scroll(function() {
      if ($(this).scrollTop() > 200) {
        $('.back-to-top').fadeIn(300);
      } else {
        $('.back-to-top').fadeOut(300);
      }
    });

    this.on('click', this.toTop);
  });
});
