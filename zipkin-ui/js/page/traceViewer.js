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
import FilterAllServicesUI from '../component_ui/filterAllServices';
import JsonPanelUI from '../component_ui/jsonPanel';
import ServiceFilterSearchUI from '../component_ui/serviceFilterSearch';
import SpanPanelUI from '../component_ui/spanPanel';
import TraceUI from '../component_ui/trace';
import FilterLabelUI from '../component_ui/filterLabel';
import ZoomOut from '../component_ui/zoomOutSpans';
import UploadTraceUI from '../component_ui/uploadTrace';
import {traceViewerTemplate} from '../templates';
import {contextRoot} from '../publicPath';

const TraceViewerPageComponent = component(function TraceViewerPage() {
  this.render = function(model) {
    try {
      this.$node.html(traceViewerTemplate({
        contextRoot,
        ...model
      }));
    } catch (e) {
      this.trigger('uiServerError',
                {desc: 'Failed to render template', message: e.message});
    }

    UploadTraceUI.attachTo('#traceFile');
  };

  this.attach = function() {
    FilterAllServicesUI.attachTo('#filterAllServices', {
      totalServices: $('.trace-details.services span').length
    });
    JsonPanelUI.attachTo('#jsonPanel');
    ServiceFilterSearchUI.attachTo('#serviceFilterSearch');
    SpanPanelUI.attachTo('#spanPanel');
    TraceUI.attachTo('#trace-container');
    FilterLabelUI.attachTo('.service-filter-label');
    ZoomOut.attachTo('#zoomOutSpans');
  };

  this.teardown = function() {
    ZoomOut.teardownAll();
    FilterLabelUI.teardownAll();
    TraceUI.teardownAll();
    SpanPanelUI.teardownAll();
    ServiceFilterSearchUI.teardownAll();
    JsonPanelUI.teardownAll();
    FilterAllServicesUI.teardownAll();
  };

  this.after('initialize', function() {
    window.document.title = 'Zipkin - Trace Viewer';

    this.render({});

    this.on(document, 'traceViewerPageModelView', function(ev, data) {
      this.teardown();
      this.render(data.modelview);
      this.attach();

      this.$node.find('#traceJsonLink').click(e => {
        e.preventDefault();
        this.trigger('uiRequestJsonPanel', {title: `Trace ${data.modelview.traceId}`,
                                            obj: data.trace,
                                            link: `${contextRoot}traceViewer`});
      });

      $('.annotation:not(.core)').tooltip({placement: 'left'});
    });
  });
});

export default function initializeTrace(config) {
  TraceViewerPageComponent.attachTo('.content', {config});
}
