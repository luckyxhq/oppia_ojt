# Testing Guide for Lesson Progress Bar Feature

## Quick Start Testing

### 1. Manual Testing in Browser

#### Prerequisites
- Start the Oppia development server
- Have access to create/edit explorations

#### Step-by-Step Manual Test

**Test 1: Modal Appears for New Lesson**
1. Navigate to the exploration editor (create a new exploration or open an existing one with ≤1 state)
2. **Expected:** A modal should appear asking "How many parts do you want to divide this chapter into?"
3. Enter a number (e.g., `10`) in the input field
4. Click "Set Parts" button
5. **Expected:** Modal closes, success message appears

**Test 2: Progress Bar Displays**
1. After setting total parts, check the top navbar area
2. **Expected:** Progress bar appears showing:
   - Text: "Created 0 questions out of 10 parts"
   - Percentage: "(0%)"
   - Visual progress bar (empty/green fill)

**Test 3: Progress Updates When Adding States**
1. Add a new state/question in the editor
2. **Expected:** Progress bar updates to:
   - "Created 1 questions out of 10 parts (10%)"
   - Progress bar fill increases to 10%
3. Add another state
4. **Expected:** Updates to "Created 2 questions out of 10 parts (20%)"
5. Continue adding states and verify progress updates in real-time

**Test 4: Progress Persists After Refresh**
1. Set total parts (e.g., 10)
2. Add a few states (e.g., 3 states)
3. Refresh the page
4. **Expected:** Progress bar still shows "Created 3 questions out of 10 parts (30%)"

**Test 5: Modal Validation**
1. Try to set total parts to 0
2. **Expected:** Error message appears, "Set Parts" button disabled
3. Try to set total parts to 150 (above max)
4. **Expected:** Error message appears
5. Try to set total parts to -5
6. **Expected:** Error message appears

**Test 6: Cancel Modal**
1. Open the modal
2. Click "Cancel" button
3. **Expected:** Modal closes without setting total parts
4. Progress bar should not appear

**Test 7: Responsive Design**
1. Resize browser window to mobile size (< 768px width)
2. **Expected:** Progress bar should be hidden on small screens

---

## Running Unit Tests

### Run All Frontend Tests

```bash
# From the oppia root directory
make run_tests.frontend
```

Or using Python script:
```bash
python -m scripts.run_frontend_tests
```

### Run Specific Test Files

**Test the Service:**
```bash
# Run only the lesson parts service tests
python -m scripts.run_frontend_tests --include='**/exploration-lesson-parts.service.spec.ts'
```

**Test the Progress Bar Component:**
```bash
# Run only the progress bar component tests
python -m scripts.run_frontend_tests --include='**/lesson-progress-bar.component.spec.ts'
```

**Test the Modal Component:**
```bash
# Run only the modal component tests
python -m scripts.run_frontend_tests --include='**/set-lesson-parts-modal.component.spec.ts'
```

### Run Tests with Coverage

```bash
python -m scripts.run_frontend_tests --generate_coverage_report
```

---

## Test Checklist

### Functional Tests
- [ ] Modal appears for new lessons (≤1 state)
- [ ] Modal does not appear for existing lessons with many states
- [ ] Input validation works (min: 1, max: 100)
- [ ] Progress bar displays correctly after setting parts
- [ ] Progress updates when states are added
- [ ] Progress updates when states are deleted
- [ ] Progress persists after page refresh
- [ ] Cancel button works correctly
- [ ] Error messages display for invalid input

### Visual Tests
- [ ] Progress bar appears in correct location (navbar)
- [ ] Progress bar text is readable
- [ ] Progress bar fill animates smoothly
- [ ] Colors match Oppia design scheme
- [ ] Responsive: hidden on mobile screens
- [ ] Progress bar doesn't overlap other navbar elements

### Edge Cases
- [ ] Works with 1 part (100% immediately)
- [ ] Works with maximum parts (100)
- [ ] Handles 0% progress correctly
- [ ] Handles 100% progress correctly
- [ ] Works when states exceed total parts (shows >100%)
- [ ] Handles rapid state additions/deletions

### Integration Tests
- [ ] Service initializes correctly
- [ ] Service integrates with ExplorationStatesService
- [ ] Component subscribes to service updates
- [ ] Modal integrates with NgbModal
- [ ] localStorage persistence works
- [ ] No console errors

---

## Debugging Tips

### Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any errors related to:
   - `LessonProgressBarComponent`
   - `ExplorationLessonPartsService`
   - `SetLessonPartsModalComponent`

### Check localStorage
1. Open browser DevTools
2. Go to Application tab (Chrome) or Storage tab (Firefox)
3. Check localStorage for key: `exploration_{explorationId}_total_parts`
4. Verify the value is stored correctly

### Check Component State
1. Open browser DevTools
2. Go to Elements/Inspector tab
3. Find the progress bar component
4. Check if it's rendered in the DOM
5. Verify CSS classes are applied correctly

### Common Issues

**Issue: Progress bar not showing**
- Check if modal was completed (total parts set)
- Check browser console for errors
- Verify component is in declarations array
- Check if service is initialized

**Issue: Progress not updating**
- Check if `onRefreshGraph` event is firing
- Verify service subscriptions are active
- Check if states are actually being added/deleted

**Issue: Modal not appearing**
- Check if exploration has >1 state (modal only shows for new lessons)
- Check if `isModalOpenable` is true
- Verify modal component is registered

---

## E2E Testing (Optional)

### Create E2E Test File

Create a new E2E test file:
```
core/tests/webdriverio/explorationEditor/lessonProgressBar.spec.ts
```

### Sample E2E Test Structure

```typescript
describe('Lesson Progress Bar', () => {
  it('should display progress bar after setting total parts', async () => {
    // Navigate to editor
    // Create new exploration
    // Wait for modal
    // Set total parts
    // Verify progress bar appears
    // Add states
    // Verify progress updates
  });
});
```

### Run E2E Tests

```bash
# Run specific e2e test suite
make run_tests.e2e suite=explorationEditor
```

---

## Performance Testing

### Check for Memory Leaks
1. Open browser DevTools
2. Go to Performance/Memory tab
3. Record while:
   - Opening/closing modal multiple times
   - Adding/deleting many states
   - Refreshing page multiple times
4. Check for memory leaks

### Check Rendering Performance
1. Open browser DevTools
2. Go to Performance tab
3. Record while adding states rapidly
4. Verify no lag or jank in progress bar updates

---

## Testing Commands Summary

```bash
# Run all frontend tests
make run_tests.frontend

# Run specific test file
python -m scripts.run_frontend_tests --include='**/lesson-progress-bar.component.spec.ts'

# Run with coverage
python -m scripts.run_frontend_tests --generate_coverage_report

# Run linting
make run_tests.lint

# Run TypeScript checks
make run_tests.typescript

# Run E2E tests (if created)
make run_tests.e2e suite=explorationEditor
```

---

## Expected Test Results

### Unit Tests Should Pass
- ✅ Service initializes correctly
- ✅ Progress calculation is accurate
- ✅ Component visibility logic works
- ✅ Modal validation works
- ✅ Event subscriptions work

### Manual Tests Should Verify
- ✅ User can set total parts
- ✅ Progress bar displays correctly
- ✅ Progress updates in real-time
- ✅ Data persists across sessions
- ✅ UI is responsive and accessible

---

## Next Steps After Testing

1. **Fix any failing tests**
2. **Address any console errors**
3. **Improve edge case handling**
4. **Add more comprehensive tests if needed**
5. **Document any known issues**

---

## Quick Test Script

For quick manual testing, follow this sequence:

1. **Start server:** `make start-devserver` (or your usual command)
2. **Open browser:** Navigate to `http://localhost:8181`
3. **Create exploration:** Go to creator dashboard → Create
4. **Set parts:** Enter 10 in the modal
5. **Add states:** Add 3-4 states/questions
6. **Verify:** Check progress bar shows correct count
7. **Refresh:** Reload page and verify persistence
8. **Done!** ✅

