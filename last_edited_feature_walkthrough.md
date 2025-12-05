# Walkthrough: Implementing the "Last Edited" Timestamp Feature

This walkthrough documents the changes made to implement the dynamic "Last Edited" timestamp in the Oppia exploration editor. This feature ensures the timestamp reflects the actual last modification time (including autosaves) and updates in real-time.

## Overview
The goal was to replace a hardcoded "Last edited 4 hours ago" message with a live timestamp that updates whenever the user edits the exploration. This required changes across the stack: from the backend logic that retrieves the data, to the frontend service that manages it, and finally the UI component that displays it.

---

## Step 1: Updating the Frontend Model
**File:** `core/templates/domain/exploration/exploration.model.ts`

First, we needed to ensure the frontend knew to expect a "last updated" timestamp from the backend.

*   **Change:** Added the `last_updated_msecs` field to the `ExplorationBackendDict` interface.
*   **Why:** This interface defines the shape of the data object received from the backend. Adding this field allows TypeScript to recognize and use the timestamp.

```typescript
export interface ExplorationBackendDict {
  // ... other fields
  exploration_metadata: ExplorationMetadataBackendDict;
  last_updated_msecs?: number; // <--- Added this optional field
}
```

## Step 2: Populating Data in the Backend
**File:** `core/domain/exp_services.py`

Next, we updated the backend to actually correct timestamp data.

*   **Change:** In the `get_user_exploration_data` function, we added logic to calculate the latest timestamp.
*   **Logic:**
    1.  It takes the `last_updated` time from the saved exploration.
    2.  It checks if there are any *unsaved draft changes* (`draft_change_list_last_updated`).
    3.  If a draft exists and is newer than the saved exploration, it uses the draft's timestamp.
    4.  It converts this time to milliseconds and adds it to the response dictionary as `last_updated_msecs`.

```python
    # Logic to pick the latest time between saved version and draft
    last_updated = exploration.last_updated
    if (
        exp_user_data and
        exp_user_data.draft_change_list_last_updated and
        exp_user_data.draft_change_list_last_updated > last_updated
    ):
        last_updated = exp_user_data.draft_change_list_last_updated

    editor_dict = {
        # ...
        'last_updated_msecs': utils.get_time_in_millisecs(last_updated), # <--- Added this to response
    }
```

## Step 3: Handling Real-Time Updates in the Service
**File:** `core/templates/pages/exploration-editor-page/services/exploration-data.service.ts`

The frontend service needed to notify the UI whenever the data changed, especially during autosaves.

*   **Change 1 (Event Emitter):** Added `onExplorationDataUpdated = new EventEmitter<void>();`. This allows other components to subscribe to updates.
*   **Change 2 (Save):** In the `save()` method (manual save), we emit this event after a successful response.
*   **Change 3 (Autosave):** In `_autosaveChangeListAsync()` (automatic save while typing), we manually update `last_updated_msecs` to `Date.now()` and emit the event. This ensures the "Last Edited" text changes immediately as you type, without waiting for a full page reload.

```typescript
// On autosave success:
if (this.data) {
    this.data.last_updated_msecs = Date.now(); // Update time locally
    this.onExplorationDataUpdated.emit();      // Notify UI
}
```

## Step 4: Updating the UI Component
**File:** `core/templates/pages/exploration-editor-page/last-edited-indicator/last-edited-indicator.component.ts`

Finally, we updated the component to listen for these updates and display the time.

*   **Change 1 (Logic):** Updated `updateLastEditedText` to read `explorationData.last_updated_msecs` instead of using a hardcoded localized string.
*   **Change 2 (Subscription):** In `ngOnInit`, we subscribed to `onExplorationDataUpdated`. Whenever the service emits this event (on save/autosave), the component recalculates the "time ago" string immediately.

```typescript
    ngOnInit(): void {
        // ...
        // Listen for data updates (saves/autosaves)
        this.updateSubscription.add(
            this.explorationDataService.onExplorationDataUpdated.subscribe(() => {
                this.updateLastEditedText();
            })
        );
    }

    private updateLastEditedText(): void {
        // ...
        if (explorationData && explorationData.last_updated_msecs) {
            this.lastEditedText = `Last edited ${this.timeAgoService.getTimeAgo(
                new Date(explorationData.last_updated_msecs) // Convert ms to Date
            )}`;
        }
        // ...
    }
```

## Step 5: Registering the Component
**File:** `core/templates/pages/exploration-editor-page/exploration-editor-page.module.ts`

*   **Change:** Added `LastEditedIndicatorComponent` to the `declarations` array. This was a necessary setup step to fix an initial error where the component wasn't recognized by Angular.
