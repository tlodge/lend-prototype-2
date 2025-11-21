/**
 * Utility functions for broadcasting events to parent window when embedded in iframe
 */

export interface ViewChangeEvent {
  type: 'view-change';
  view: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface StorySelectEvent {
  type: 'story-select';
  storyId: string;
  storyTitle: string;
  timestamp: number;
}

export interface StoryReflectionEvent {
  type: 'story-reflection';
  storyId: string;
  response: 'helpful' | 'unsure' | 'distressing' | 'dislike';
  timestamp: number;
}

export interface MenuActionEvent {
  type: 'menu-action';
  action: string;
  timestamp: number;
}

export type IframeEvent = ViewChangeEvent | StorySelectEvent | StoryReflectionEvent | MenuActionEvent;

/**
 * Broadcast an event to the parent window if we're in an iframe
 */
export function broadcastToParent(event: IframeEvent) {
  // Only send if we're in an iframe
  if (window.self !== window.top) {
    try {
      window.parent.postMessage(event, '*'); // Use specific origin in production
    } catch (error) {
      console.warn('Failed to send message to parent window:', error);
    }
  }
}

/**
 * Broadcast a view change event
 */
export function broadcastViewChange(
  view: string,
  metadata?: Record<string, any>
) {
  broadcastToParent({
    type: 'view-change',
    view,
    timestamp: Date.now(),
    metadata,
  });
}

/**
 * Broadcast a story selection event
 */
export function broadcastStorySelect(storyId: string, storyTitle: string) {
  broadcastToParent({
    type: 'story-select',
    storyId,
    storyTitle,
    timestamp: Date.now(),
  });
}

/**
 * Broadcast a story reflection event
 */
export function broadcastStoryReflection(
  storyId: string,
  response: 'helpful' | 'unsure' | 'distressing' | 'dislike'
) {
  broadcastToParent({
    type: 'story-reflection',
    storyId,
    response,
    timestamp: Date.now(),
  });
}

/**
 * Broadcast a menu action event
 */
export function broadcastMenuAction(action: string) {
  broadcastToParent({
    type: 'menu-action',
    action,
    timestamp: Date.now(),
  });
}

