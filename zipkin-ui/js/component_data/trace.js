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
import {getError} from '../../js/component_ui/error';
import traceToMustache from '../../js/component_ui/traceToMustache';
import {SPAN_V1} from '../spanConverter';
import {correctForClockSkew} from '../skew';

export function toContextualLogsUrl(logsUrl, traceId) {
  if (logsUrl) {
    return logsUrl.replace('{traceId}', traceId);
  }
  return logsUrl;
}

export default component(function TraceData() {
  this.after('initialize', function() {
    const traceId = this.attr.traceId;
    const logsUrl = toContextualLogsUrl(this.attr.logsUrl, traceId);
    $.ajax(`api/v2/trace/${traceId}`, {
      type: 'GET',
      dataType: 'json'
    }).done(raw => {
      const v1Trace = raw.map(SPAN_V1.convert);
      const mergedTrace = SPAN_V1.mergeById(v1Trace);
      const clockSkewCorrectedTrace = correctForClockSkew(mergedTrace);
      const modelview = traceToMustache(clockSkewCorrectedTrace, logsUrl);
      this.trigger('tracePageModelView', {modelview, trace: raw});
    }).fail(e => {
      this.trigger('uiServerError',
                   getError(`Cannot load trace ${this.attr.traceId}`, e));
    });
  });
});
