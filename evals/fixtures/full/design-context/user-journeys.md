# User Journeys

## Create a Task

**Goal:** User wants to quickly capture a new task

### Flow
1. User clicks "+ New Task" button (visible on dashboard or within a project)
2. Inline creation field appears in-context (NOT a modal for quick adds)
3. User types task title and presses Enter
4. Task is created with defaults:
   - No assignee
   - No due date
   - Added to current project (or Inbox if on dashboard)
5. Task appears in the list immediately
6. User can click to expand and add more details

### Key Principles
- **Minimum friction:** One click + type + enter = done
- **Progressive disclosure:** Start simple, expand for details
- **Context-aware:** Task goes where it makes sense

---

## Invite a Teammate

**Goal:** User wants to add a new team member

### Flow
1. User navigates to Team Settings
2. Clicks "Invite" button (primary action)
3. Modal opens with:
   - Email input field
   - Role selector (Admin / Member / Viewer)
   - Brief description of each role's permissions
4. User enters email, selects role
5. Clicks "Send Invite"
6. Confirmation shown with what happens next
7. Pending invite appears in team list with status badge

### Key Principles
- **Clarity on permissions:** User should understand what each role can do
- **Confirmation:** Show success and set expectations
- **Visibility:** Pending invites are clearly visible

---

## Edit Profile

**Goal:** User wants to update their personal information

### Flow
1. User clicks avatar in top-right corner
2. Dropdown shows with "Profile Settings" option
3. Profile page loads with:
   - Current avatar (click to change)
   - Name field (pre-filled)
   - Email field (pre-filled, with note if verified)
   - Notification preferences
4. User makes changes
5. Clicks "Save Changes" button
6. Success feedback shown
7. Changes reflected immediately across app

### Key Principles
- **Pre-filled:** Don't make users re-enter existing info
- **Immediate feedback:** Show that changes were saved
- **Non-destructive:** Email changes may require verification

---

## Complete a Task

**Goal:** User marks a task as done

### Flow
1. User hovers over task in list
2. Checkbox appears (or is always visible based on density setting)
3. User clicks checkbox
4. Task shows completion animation (subtle strikethrough, fade)
5. Task moves to "Completed" section (or remains in place with visual indicator)
6. Undo option available briefly (toast or inline)

### Key Principles
- **Satisfying:** Completion should feel good (subtle animation)
- **Recoverable:** Easy to undo accidental completions
- **Flexible:** Where completed tasks go depends on user preference

---

## Quick Navigation

**Goal:** User wants to jump to a specific project or task

### Flow
1. User presses Cmd+K (or clicks search in nav)
2. Command palette opens
3. User starts typing
4. Results show in real-time:
   - Recent items first
   - Projects, Tasks, People all searchable
5. User presses Enter or clicks result
6. Navigates directly to that item

### Key Principles
- **Speed:** Results appear as user types
- **Keyboard-first:** Full operation without mouse
- **Smart ranking:** Recent and relevant items first
