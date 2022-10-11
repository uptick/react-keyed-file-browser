"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NAVIGATE_URL = exports.DOCS_RENDERED = exports.STORY_THREW_EXCEPTION = exports.STORIES_EXPAND_ALL = exports.STORIES_COLLAPSE_ALL = exports.STORY_CHANGED = exports.STORY_ERRORED = exports.STORY_MISSING = exports.STORY_RENDERED = exports.STORY_RENDER = exports.STORY_ADDED = exports.STORY_INIT = exports.REGISTER_SUBSCRIPTION = exports.FORCE_RE_RENDER = exports.PREVIEW_KEYDOWN = exports.SELECT_STORY = exports.STORIES_CONFIGURED = exports.SET_STORIES = exports.GET_STORIES = exports.SET_CURRENT_STORY = exports.GET_CURRENT_STORY = exports.CHANNEL_CREATED = exports["default"] = void 0;
var events; // Enables: `import Events from ...`

(function (events) {
  events["CHANNEL_CREATED"] = "channelCreated";
  events["GET_CURRENT_STORY"] = "getCurrentStory";
  events["SET_CURRENT_STORY"] = "setCurrentStory";
  events["GET_STORIES"] = "getStories";
  events["SET_STORIES"] = "setStories";
  events["STORIES_CONFIGURED"] = "storiesConfigured";
  events["SELECT_STORY"] = "selectStory";
  events["PREVIEW_KEYDOWN"] = "previewKeydown";
  events["STORY_ADDED"] = "storyAdded";
  events["STORY_CHANGED"] = "storyChanged";
  events["STORY_UNCHANGED"] = "storyUnchanged";
  events["FORCE_RE_RENDER"] = "forceReRender";
  events["REGISTER_SUBSCRIPTION"] = "registerSubscription";
  events["STORY_INIT"] = "storyInit";
  events["STORY_RENDER"] = "storyRender";
  events["STORY_RENDERED"] = "storyRendered";
  events["STORY_MISSING"] = "storyMissing";
  events["STORY_ERRORED"] = "storyErrored";
  events["STORY_THREW_EXCEPTION"] = "storyThrewException";
  events["STORIES_COLLAPSE_ALL"] = "storiesCollapseAll";
  events["STORIES_EXPAND_ALL"] = "storiesExpandAll";
  events["DOCS_RENDERED"] = "docsRendered";
  events["NAVIGATE_URL"] = "navigateUrl";
})(events || (events = {}));

var _default = events; // Enables: `import * as Events from ...` or `import { CHANNEL_CREATED } as Events from ...`
// This is the preferred method

exports["default"] = _default;
var CHANNEL_CREATED = events.CHANNEL_CREATED,
    GET_CURRENT_STORY = events.GET_CURRENT_STORY,
    SET_CURRENT_STORY = events.SET_CURRENT_STORY,
    GET_STORIES = events.GET_STORIES,
    SET_STORIES = events.SET_STORIES,
    STORIES_CONFIGURED = events.STORIES_CONFIGURED,
    SELECT_STORY = events.SELECT_STORY,
    PREVIEW_KEYDOWN = events.PREVIEW_KEYDOWN,
    FORCE_RE_RENDER = events.FORCE_RE_RENDER,
    REGISTER_SUBSCRIPTION = events.REGISTER_SUBSCRIPTION,
    STORY_INIT = events.STORY_INIT,
    STORY_ADDED = events.STORY_ADDED,
    STORY_RENDER = events.STORY_RENDER,
    STORY_RENDERED = events.STORY_RENDERED,
    STORY_MISSING = events.STORY_MISSING,
    STORY_ERRORED = events.STORY_ERRORED,
    STORY_CHANGED = events.STORY_CHANGED,
    STORIES_COLLAPSE_ALL = events.STORIES_COLLAPSE_ALL,
    STORIES_EXPAND_ALL = events.STORIES_EXPAND_ALL,
    STORY_THREW_EXCEPTION = events.STORY_THREW_EXCEPTION,
    DOCS_RENDERED = events.DOCS_RENDERED,
    NAVIGATE_URL = events.NAVIGATE_URL;
exports.NAVIGATE_URL = NAVIGATE_URL;
exports.DOCS_RENDERED = DOCS_RENDERED;
exports.STORY_THREW_EXCEPTION = STORY_THREW_EXCEPTION;
exports.STORIES_EXPAND_ALL = STORIES_EXPAND_ALL;
exports.STORIES_COLLAPSE_ALL = STORIES_COLLAPSE_ALL;
exports.STORY_CHANGED = STORY_CHANGED;
exports.STORY_ERRORED = STORY_ERRORED;
exports.STORY_MISSING = STORY_MISSING;
exports.STORY_RENDERED = STORY_RENDERED;
exports.STORY_RENDER = STORY_RENDER;
exports.STORY_ADDED = STORY_ADDED;
exports.STORY_INIT = STORY_INIT;
exports.REGISTER_SUBSCRIPTION = REGISTER_SUBSCRIPTION;
exports.FORCE_RE_RENDER = FORCE_RE_RENDER;
exports.PREVIEW_KEYDOWN = PREVIEW_KEYDOWN;
exports.SELECT_STORY = SELECT_STORY;
exports.STORIES_CONFIGURED = STORIES_CONFIGURED;
exports.SET_STORIES = SET_STORIES;
exports.GET_STORIES = GET_STORIES;
exports.SET_CURRENT_STORY = SET_CURRENT_STORY;
exports.GET_CURRENT_STORY = GET_CURRENT_STORY;
exports.CHANNEL_CREATED = CHANNEL_CREATED;