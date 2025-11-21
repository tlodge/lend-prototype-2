# Iframe Event Broadcasting

This prototype broadcasts events to the parent window when embedded in an iframe. The parent website can listen to these events to provide contextual information to users.

## Event Types

### 1. View Change Event
Broadcast whenever the user navigates to a different screen.

```typescript
{
  type: 'view-change';
  view: string; // 'search' | 'library' | 'playback' | 'safety' | 'calm' | 'personalization' | 'disengagement' | 'playlist'
  timestamp: number;
  metadata?: {
    viewedStoriesCount?: number;
    currentlyPlayingStory?: string;
    voiceModeActive?: boolean;
  };
}
```

### 2. Story Select Event
Broadcast when a user selects a story to watch.

```typescript
{
  type: 'story-select';
  storyId: string;
  storyTitle: string;
  timestamp: number;
}
```

### 3. Story Reflection Event
Broadcast when a user provides feedback on a story.

```typescript
{
  type: 'story-reflection';
  storyId: string;
  response: 'helpful' | 'unsure' | 'distressing' | 'dislike';
  timestamp: number;
}
```

### 4. Menu Action Event
Broadcast when a user interacts with the floating menu.

```typescript
{
  type: 'menu-action';
  action: string; // 'settings' | 'history' | 'help' | 'exit'
  timestamp: number;
}
```

## Parent Website Implementation

### Basic Setup

```javascript
// Listen for messages from the iframe
window.addEventListener('message', (event) => {
  // Verify origin for security (replace with your prototype URL)
  // if (event.origin !== 'https://tlodge.github.io') return;
  
  const data = event.data;
  
  switch (data.type) {
    case 'view-change':
      handleViewChange(data.view, data.metadata);
      break;
    case 'story-select':
      handleStorySelect(data.storyId, data.storyTitle);
      break;
    case 'story-reflection':
      handleStoryReflection(data.storyId, data.response);
      break;
    case 'menu-action':
      handleMenuAction(data.action);
      break;
  }
});

function handleViewChange(view, metadata) {
  console.log('User is now on:', view);
  // Update your UI with contextual information based on the view
  // Example:
  const viewInfo = {
    'search': 'The user is searching for narratives using the conversational interface.',
    'library': 'The user is browsing available stories.',
    'playback': 'The user is watching a narrative.',
    'safety': 'The user has indicated a story was distressing and is viewing safety options.',
    'calm': 'The user is viewing calming activities.',
    'personalization': 'The user is reviewing their preferences.',
    'disengagement': 'The user is ending their session.',
    'playlist': 'The user is managing their playlist.',
  };
  
  updateContextualInfo(viewInfo[view] || '');
}

function handleStorySelect(storyId, storyTitle) {
  console.log('User selected story:', storyTitle);
  // Provide information about the selected story
}

function handleStoryReflection(storyId, response) {
  console.log('User feedback:', response, 'for story:', storyId);
  // Track user feedback
}

function handleMenuAction(action) {
  console.log('Menu action:', action);
  // Handle menu interactions
}
```

### TypeScript Example

```typescript
interface ViewChangeEvent {
  type: 'view-change';
  view: string;
  timestamp: number;
  metadata?: {
    viewedStoriesCount?: number;
    currentlyPlayingStory?: string;
    voiceModeActive?: boolean;
  };
}

interface StorySelectEvent {
  type: 'story-select';
  storyId: string;
  storyTitle: string;
  timestamp: number;
}

interface StoryReflectionEvent {
  type: 'story-reflection';
  storyId: string;
  response: 'helpful' | 'unsure' | 'distressing' | 'dislike';
  timestamp: number;
}

interface MenuActionEvent {
  type: 'menu-action';
  action: string;
  timestamp: number;
}

type IframeEvent = ViewChangeEvent | StorySelectEvent | StoryReflectionEvent | MenuActionEvent;

window.addEventListener('message', (event: MessageEvent<IframeEvent>) => {
  // Verify origin
  if (event.origin !== 'https://tlodge.github.io') return;
  
  switch (event.data.type) {
    case 'view-change':
      handleViewChange(event.data);
      break;
    case 'story-select':
      handleStorySelect(event.data);
      break;
    case 'story-reflection':
      handleStoryReflection(event.data);
      break;
    case 'menu-action':
      handleMenuAction(event.data);
      break;
  }
});
```

## Security Note

In production, you should verify the `event.origin` to ensure messages are coming from your trusted prototype domain:

```javascript
if (event.origin !== 'https://tlodge.github.io') {
  return; // Ignore messages from untrusted sources
}
```

## View Descriptions

- **search**: Conversational search interface for finding narratives
- **library**: Story library showing available narratives
- **playback**: Video/audio playback with reflection options
- **safety**: Safety and support options (shown after distressing content)
- **calm**: Calming activities and resources
- **personalization**: User preference settings
- **disengagement**: Session ending/disengagement flow
- **playlist**: Playlist creation and management

