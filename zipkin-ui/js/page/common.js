/*
 * Copyright 2015-2017 The OpenZipkin Authors
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
import EnvironmentUI from '../component_ui/environment';
import ErrorUI from '../component_ui/error';
import NavbarUI from '../component_ui/navbar';
import {layoutTemplate} from '../templates';
import GoToTraceUI from '../component_ui/goToTrace';
import {contextRoot} from '../publicPath';

export default component(function CommonUI() {
  this.after('initialize', function() {
    this.$node.html(layoutTemplate({contextRoot}));
    NavbarUI.attachTo('#navbar');
    ErrorUI.attachTo('#errorPanel');
    EnvironmentUI.attachTo('#environment', {config: this.attr.config});
    GoToTraceUI.attachTo('#traceIdQueryForm');
  });
});
