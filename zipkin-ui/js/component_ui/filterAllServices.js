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

export default component(function filterAllServices() {
  this.$expandAll = $();
  this.$collapseAll = $();
  this.totalServices = 0;
  this.filtered = {};
  this.currentFilterCount = 0;

  this.toggleFilter = function(e) {
    this.trigger(document, $(e.target).val());
  };

  this.filterAdded = function(e, data) {
    if (this.filtered[data.value]) return;

    this.filtered[data.value] = true;
    this.currentFilterCount += 1;

    if (this.currentFilterCount === this.totalServices) {
      this.$expandAll.addClass('active');
    } else {
      this.$collapseAll.removeClass('active');
    }
  };

  this.filterRemoved = function(e, data) {
    if (!this.filtered[data.value]) return;

    this.filtered[data.value] = false;
    this.currentFilterCount -= 1;

    if (this.currentFilterCount === 0) {
      this.$collapseAll.addClass('active');
    } else {
      this.$expandAll.removeClass('active');
    }
  };

  this.after('initialize', function(node, data) {
    this.totalServices = data.totalServices;
    this.$expandAll = this.$node.find('[value="uiExpandAllSpans"]');
    this.$collapseAll = this.$node.find('[value="uiCollapseAllSpans"]');

    this.on('.btn', 'click', this.toggleFilter);
    this.on(document, 'uiAddServiceNameFilter', this.filterAdded);
    this.on(document, 'uiRemoveServiceNameFilter', this.filterRemoved);
  });
});
