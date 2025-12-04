# Lesson Progress Bar Implementation Guide

## Overview
This document outlines the implementation plan for adding a creator-side progress bar to the Oppia lesson editor. The progress bar will show creators how many questions/parts they have created out of their target total (e.g., "Created 5 questions out of 10 parts").

## Integration Approach
**This feature will be INTEGRATED into the existing exploration editor page**, not created as a new page. The progress bar will appear in the top navbar area of the editor, always visible to creators while they work.

## Implementation Steps

### Step 1: Create Service for Lesson Parts Management
**Location:** `/core/templates/pages/exploration-editor-page/services/`
**Files:**
- `exploration-lesson-parts.service.ts`
- `exploration-lesson-parts.service.spec.ts`

**Purpose:** Manage total parts count and track created parts

**Key Methods:**
- `setTotalParts(total: number): void` - Set target number of parts
- `getTotalParts(): number` - Get target number of parts
- `getCreatedParts(): number` - Get current count of created states
- `getProgressPercentage(): number` - Calculate progress (0-100)
- `initialize(totalParts: number): void` - Initialize service

### Step 2: Create Progress Bar Component
**Location:** `/core/templates/pages/exploration-editor-page/`
**Files:**
- `lesson-progress-bar.component.ts`
- `lesson-progress-bar.component.html`
- `lesson-progress-bar.component.css`
- `lesson-progress-bar.component.spec.ts`

**Purpose:** Display visual progress bar with percentage and text

**Features:**
- Visual progress bar (percentage-based width)
- Text display: "Created X questions out of Y parts"
- Percentage indicator
- Responsive design

### Step 3: Create Setup Modal Component
**Location:** `/core/templates/pages/exploration-editor-page/modal-templates/`
**Files:**
- `set-lesson-parts-modal.component.ts`
- `set-lesson-parts-modal.component.html`
- `set-lesson-parts-modal.component.spec.ts`

**Purpose:** Prompt creator to set total number of parts when creating new lesson

**Features:**
- Input field for number of parts
- Validation (minimum 1, maximum reasonable limit)
- Save button
- Cancel option

### Step 4: Integrate into Editor Page
**Location:** `/core/templates/pages/exploration-editor-page/exploration-editor-page.component.html`

**Integration Point:**
Add progress bar component in the navbar section:
```html
<div class="navbar-text">
  <h1>{{ getNavbarText() }}</h1>
  <span class="e2e-test-autosave-indicator autosave-indicator" *ngIf="autosaveIsInProgress">
    &emsp;Auto Saving ...
  </span>
  <!-- Progress Bar Component -->
  <oppia-lesson-progress-bar></oppia-lesson-progress-bar>
</div>
```

### Step 5: Initialize Service in Editor Component
**Location:** `/core/templates/pages/exploration-editor-page/exploration-editor-page.component.ts`

**Changes:**
- Inject `ExplorationLessonPartsService`
- In `initExplorationPage()`, check if `totalParts` is set
- If not set, show setup modal
- Subscribe to state changes to update progress

### Step 6: Connect to State Changes
**Location:** `/core/templates/pages/exploration-editor-page/services/exploration-states.service.ts`

**Changes:**
- Emit events when states are added/deleted
- Update created parts count automatically
- Or listen to `onRefreshGraph` event in progress service

### Step 7: Persist Data
**Location:** `/core/templates/pages/exploration-editor-page/services/exploration-save.service.ts`

**Changes:**
- Include `total_lesson_parts` in save payload
- Load `total_lesson_parts` when exploration loads

### Step 8: Update Exploration Model (Optional - Backend)
**Location:** `/core/templates/domain/exploration/exploration.model.ts`

**Changes:**
- Add `total_lesson_parts?: number` field to exploration data structure
- May require backend API changes to persist this field

### Step 9: Register Components in Module
**Location:** `/core/templates/pages/exploration-editor-page/exploration-editor-page.module.ts`

**Changes:**
- Add `LessonProgressBarComponent` to declarations
- Add `SetLessonPartsModalComponent` to declarations
- Ensure service is provided

### Step 10: Add Styling
**Location:** `lesson-progress-bar.component.css`

**Styles Needed:**
- Progress bar container
- Progress bar fill (animated width based on percentage)
- Text styling
- Responsive design for mobile
- Color scheme matching Oppia design

## File Structure

```
oppia/
├── core/
│   └── templates/
│       └── pages/
│           └── exploration-editor-page/
│               ├── lesson-progress-bar/
│               │   ├── lesson-progress-bar.component.ts
│               │   ├── lesson-progress-bar.component.html
│               │   ├── lesson-progress-bar.component.css
│               │   └── lesson-progress-bar.component.spec.ts
│               ├── modal-templates/
│               │   └── set-lesson-parts-modal/
│               │       ├── set-lesson-parts-modal.component.ts
│               │       ├── set-lesson-parts-modal.component.html
│               │       └── set-lesson-parts-modal.component.spec.ts
│               └── services/
│                   ├── exploration-lesson-parts.service.ts
│                   └── exploration-lesson-parts.service.spec.ts
```

## Files Created and Modified

### New Files Created

#### 1. Service Files
**`core/templates/pages/exploration-editor-page/services/exploration-lesson-parts.service.ts`**
- **Purpose:** Core service that manages lesson parts tracking
- **What it does:**
  - Stores the total number of parts a creator wants to create
  - Calculates the number of created parts by counting states
  - Computes progress percentage (0-100%)
  - Emits events when total parts changes
  - Provides methods to initialize, set, and get total parts
  - Tracks whether the service has been initialized

**`core/templates/pages/exploration-editor-page/services/exploration-lesson-parts.service.spec.ts`**
- **Purpose:** Unit tests for the lesson parts service
- **What it does:**
  - Tests service initialization
  - Tests progress calculation
  - Tests state counting
  - Tests event emissions
  - Validates edge cases (zero parts, negative values, etc.)

#### 2. Progress Bar Component Files
**`core/templates/pages/exploration-editor-page/lesson-progress-bar/lesson-progress-bar.component.ts`**
- **Purpose:** TypeScript component for the progress bar
- **What it does:**
  - Subscribes to lesson parts service updates
  - Subscribes to state changes via `ExplorationStatesService.onRefreshGraph`
  - Updates progress display in real-time
  - Manages component visibility based on initialization status
  - Calculates and displays created parts, total parts, and percentage

**`core/templates/pages/exploration-editor-page/lesson-progress-bar/lesson-progress-bar.component.html`**
- **Purpose:** HTML template for the progress bar UI
- **What it does:**
  - Displays text: "Created X questions out of Y parts"
  - Shows percentage: "(Z%)"
  - Renders visual progress bar with fill based on percentage
  - Only visible when service is initialized and total parts > 0

**`core/templates/pages/exploration-editor-page/lesson-progress-bar/lesson-progress-bar.component.css`**
- **Purpose:** Styling for the progress bar component
- **What it does:**
  - Styles the progress bar container and text
  - Defines progress bar fill with green color (#4caf50)
  - Implements smooth transitions for progress updates
  - Provides responsive design (hides on mobile screens < 768px)
  - Matches Oppia's navbar color scheme

**`core/templates/pages/exploration-editor-page/lesson-progress-bar/lesson-progress-bar.component.spec.ts`**
- **Purpose:** Unit tests for the progress bar component
- **What it does:**
  - Tests component initialization
  - Tests visibility logic
  - Tests progress updates
  - Tests subscription handling

#### 3. Modal Component Files
**`core/templates/pages/exploration-editor-page/modal-templates/set-lesson-parts-modal.component.ts`**
- **Purpose:** Modal component for setting total lesson parts
- **What it does:**
  - Displays modal asking creator how many parts to divide chapter into
  - Provides input field for number of parts (1-100)
  - Validates input (minimum 1, maximum 100)
  - Shows error messages for invalid input
  - Saves total parts to service and localStorage on confirm
  - Handles cancel action
  - Auto-focuses input field when modal opens

**`core/templates/pages/exploration-editor-page/modal-templates/set-lesson-parts-modal.component.html`**
- **Purpose:** HTML template for the setup modal
- **What it does:**
  - Displays modal header: "Set Lesson Parts"
  - Shows explanatory text about dividing chapter into parts
  - Provides number input field with validation
  - Displays error messages for invalid input
  - Includes Cancel and Set Parts buttons

**`core/templates/pages/exploration-editor-page/modal-templates/set-lesson-parts-modal.component.spec.ts`**
- **Purpose:** Unit tests for the setup modal component
- **What it does:**
  - Tests input validation
  - Tests modal confirmation flow
  - Tests cancel action
  - Tests error handling

### Modified Files

#### 1. Module Registration
**`core/templates/pages/exploration-editor-page/exploration-editor-page.module.ts`**
- **Changes Made:**
  - Added import for `LessonProgressBarComponent`
  - Added import for `SetLessonPartsModalComponent`
  - Added import for `ExplorationLessonPartsService`
  - Added `LessonProgressBarComponent` to `declarations` array
  - Added `SetLessonPartsModalComponent` to `declarations` array
  - Added `SetLessonPartsModalComponent` to `entryComponents` array
  - Added `ExplorationLessonPartsService` to `providers` array
- **What it does:**
  - Registers new components with Angular module system
  - Makes components available for use in templates
  - Provides the service as a singleton for dependency injection

#### 2. Editor Page Template
**`core/templates/pages/exploration-editor-page/exploration-editor-page.component.html`**
- **Changes Made:**
  - Added `<oppia-lesson-progress-bar></oppia-lesson-progress-bar>` component in the navbar section
  - Placed after the "Auto Saving..." indicator
- **What it does:**
  - Displays the progress bar in the top navbar
  - Makes progress visible to creators at all times
  - Integrates seamlessly with existing navbar elements

#### 3. Editor Page Component
**`core/templates/pages/exploration-editor-page/exploration-editor-page.component.ts`**
- **Changes Made:**
  - Added import for `SetLessonPartsModalComponent`
  - Added import for `ExplorationLessonPartsService`
  - Injected `ExplorationLessonPartsService` in constructor
  - Added `initializeLessonParts()` method
  - Added `showSetLessonPartsModal()` method
  - Called `initializeLessonParts()` in `initExplorationPage()` method
- **What it does:**
  - Initializes lesson parts service when exploration loads
  - Checks if total parts is already set (from localStorage)
  - Shows setup modal for new lessons (when state count <= 1)
  - Saves total parts to localStorage for persistence
  - Integrates modal with existing modal management system

### Summary of File Changes 

**Total Files Created:** 8
- 1 Service file + 1 test file
- 1 Component (4 files: .ts, .html, .css, .spec.ts)
- 1 Modal component (3 files: .ts, .html, .spec.ts)

**Total Files Modified:** 3
- 1 Module file (registration)
- 1 Template file (HTML integration)
- 1 Component file (TypeScript logic)

**Total Lines of Code Added:** ~800+ lines
- Service: ~150 lines
- Progress Bar Component: ~200 lines
- Modal Component: ~150 lines
- Integration: ~100 lines
- Tests: ~200 lines

## Key Implementation Details

### Progress Calculation
```typescript
getProgressPercentage(): number {
  if (this.totalParts === 0) return 0;
  const created = this.explorationStatesService.getStateNames().length;
  return Math.round((created / this.totalParts) * 100);
}
```

### State Counting
- Use `ExplorationStatesService.getStateNames().length` to count created states
- Each state represents one "part" or "question" in the lesson

### Initialization Flow
1. User creates new exploration
2. On first load, check if `totalParts` is set
3. If not set, show modal asking "How many parts do you want to divide this chapter into?"
4. User enters number (e.g., 10)
5. Save to exploration data
6. Display progress bar showing 0/10

### Update Flow
1. User adds new state/question
2. `ExplorationStatesService` emits state change event
3. Progress service recalculates `createdParts`
4. Progress bar component updates automatically
5. Display shows updated count (e.g., 1/10, 2/10, etc.)

## UI/UX Considerations

### Visual Design
- Progress bar should be clearly visible but not intrusive
- Use Oppia's color scheme (blue #00609c for primary)
- Show percentage and fraction (e.g., "5/10 (50%)")
- Smooth animations when progress updates

### Placement
- Top navbar area (always visible)
- Below or next to "Exploration Editor" title
- Responsive: adjust for mobile screens

### User Experience
- Modal appears only once (for new lessons)
- Progress updates in real-time
- Can edit total parts in Settings tab (optional)
- Clear visual feedback

## Testing Checklist

- [ ] Service initializes correctly
- [ ] Progress bar displays correctly
- [ ] Modal appears for new lessons
- [ ] Progress updates when states are added
- [ ] Progress updates when states are deleted
- [ ] Data persists after save
- [ ] Data loads correctly on page refresh
- [ ] Responsive design works on mobile
- [ ] Edge cases: 0 parts, 100% complete, etc.
- [ ] Unit tests for service
- [ ] Unit tests for component
- [ ] E2E tests for user flow

## Future Enhancements (Optional)

1. Allow editing total parts in Settings tab
2. Show progress breakdown by state type
3. Add milestones/achievements (e.g., "Halfway there!")
4. Export progress report
5. Show estimated completion time

## Notes

- This is a **frontend-only** feature initially
- Backend persistence may be needed for production
- Follows Oppia's existing patterns and conventions
- Maintains consistency with existing UI components

