import {
  defaultTweenSettings,
} from './consts.js';

import {
  replaceObjectProps,
  mergeObjects,
  is,
} from './helpers.js';

import {
  getRelativeValue,
} from './values.js';

import {
  getTimingsFromAnimations,
} from './timings.js';

import {
  animate,
} from './animate.js';

import {
  activeInstances,
} from './engine.js';

function parseTimelineOffset(timelineOffset, timelineDuration) {
  if (is.und(timelineOffset)) return timelineDuration;
  if (is.num(timelineOffset)) return timelineOffset;
  return getRelativeValue(timelineOffset, tlDuration); // NEEDS FIX
}

export function createTimeline(params = {}) {
  let tl = animate(params);
  tl.duration = 0;
  tl.add = function(instanceParams, timelineOffset) {
    const tlIndex = activeInstances.indexOf(tl);
    const children = tl.children;
    if (tlIndex > -1) activeInstances.splice(tlIndex, 1);
    let insParams = mergeObjects(instanceParams, replaceObjectProps(defaultTweenSettings, params));
    insParams.targets = insParams.targets || params.targets;
    const tlDuration = tl.duration;
    insParams.autoplay = false;
    insParams.direction = tl.direction;
    insParams.timelineOffset = parseTimelineOffset(timelineOffset, tlDuration);
    tl.seekSilently(insParams.timelineOffset);
    const ins = animate(insParams);
    const totalDuration = ins.duration + insParams.timelineOffset;
    children.push(ins);
    const timings = getTimingsFromAnimations(children, params);
    tl.delay = timings.delay;
    tl.endDelay = timings.endDelay;
    tl.duration = timings.duration;
    tl.seekSilently(0);
    tl.reset();
    if (tl.autoplay) tl.play();
    return tl;
  }
  return tl;
}