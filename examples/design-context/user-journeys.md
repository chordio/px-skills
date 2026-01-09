# User Journeys

## Primary Journeys

### 1. Onboarding (New User)

**Entry:** Sign-up page
**Goal:** Create first project and invite team

**Steps:**
1. Sign up with email or Google
2. Create workspace (name + optional logo)
3. Create first project
4. Add first task
5. Invite team members (optional)
6. Arrive at dashboard

**Critical Moments:**
- Account creation must be frictionless
- First project should feel immediately useful
- Skip options for team invite if solo user

**Edge Cases:**
- User invited to existing workspace (different flow)
- User abandons mid-onboarding (save progress)

### 2. Daily Task Management (Core Loop)

**Entry:** Dashboard or direct link
**Goal:** See and update task status

**Steps:**
1. View assigned tasks
2. Select task to work on
3. Update status (in progress)
4. Complete task
5. Move to next task

**Critical Moments:**
- Task list must load instantly
- Status updates should be one-click
- Clear visual feedback on changes

**Edge Cases:**
- No tasks assigned (empty state)
- Blocked task (dependency visualization)
- Overdue tasks (visual indicator)

### 3. Project Creation

**Entry:** Dashboard "New Project" button
**Goal:** Set up new project with tasks

**Steps:**
1. Click "New Project"
2. Enter project name and description
3. Choose template or start blank
4. Add initial tasks (optional)
5. Invite collaborators (optional)
6. Arrive at project view

**Critical Moments:**
- Templates should provide quick start
- Bulk task creation option
- Easy to skip optional steps

### 4. Team Assignment

**Entry:** Project view or task detail
**Goal:** Assign work to team members

**Steps:**
1. Select task(s)
2. Open assignee picker
3. Search/select team member
4. Confirm assignment
5. Notification sent to assignee

**Critical Moments:**
- Assignee picker should show availability
- Bulk assignment for multiple tasks
- Visual confirmation of assignment

## Key Pages

| Page | Purpose | Key Actions |
|------|---------|-------------|
| Dashboard | Overview, navigation | View all, quick add, search |
| Project Board | Manage single project | Drag tasks, filter, add tasks |
| Task Detail | Full task context | Edit, comment, attach, assign |
| Team View | Workload visibility | Filter by person, reassign |
| Settings | Configuration | Account, workspace, integrations |

## Error States

| Scenario | Handling |
|----------|----------|
| Network error | Retry with exponential backoff, show toast |
| Permission denied | Clear message, link to request access |
| Not found (404) | Helpful message, link to dashboard |
| Server error (500) | Apologetic message, retry option |
