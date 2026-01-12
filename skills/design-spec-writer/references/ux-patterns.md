# UX Patterns Library

Common patterns and when to use them.

## Navigation Patterns

### Tabs
**When to use:**
- Content divides into 3-7 distinct categories
- Categories are mutually exclusive
- Users typically focus on one category at a time

**Structure:**
- Tab bar at top (horizontal) or side (vertical)
- Active tab indicator
- Tab panel with content

**Considerations:**
- Handle unsaved changes when switching
- Preserve scroll position per tab
- Consider deep-linking to specific tabs

### Breadcrumbs
**When to use:**
- Hierarchical content structure
- Users need to understand location in hierarchy
- Quick navigation to parent levels

**Structure:**
- Horizontal trail: Home > Category > Subcategory > Current
- Separator: "/" or ">"
- Current page: Not a link, visually distinct

### Sidebar Navigation
**When to use:**
- Many top-level sections (>7)
- Persistent navigation needed
- Dashboard-style applications

**Structure:**
- Fixed or collapsible sidebar
- Icon + label items
- Grouping with headers
- Active state indicator

## Data Display Patterns

### Tables
**When to use:**
- Structured data with consistent attributes
- Users need to compare across rows
- Sortable, filterable data

**Structure:**
- Header row with column names
- Data rows with consistent cells
- Actions column (optional)
- Pagination or infinite scroll

**Considerations:**
- Responsive: Stack or horizontal scroll on mobile
- Row selection for bulk actions
- Loading and empty states

### Cards
**When to use:**
- Items have visual content (images)
- Varying content lengths
- Grid or masonry layout desired

**Structure:**
- Visual area (image, icon)
- Content area (title, description)
- Action area (buttons, links)

### Lists
**When to use:**
- Linear content without visual elements
- Quick scanning needed
- Actions per item

**Structure:**
- Item container
- Primary text + secondary text
- Trailing actions or metadata

## Form Patterns

### Inline Editing
**When to use:**
- Quick edits to displayed data
- Single-field updates
- Power users who edit frequently

**Structure:**
- Display mode (text)
- Edit mode (input) triggered by click/icon
- Save/cancel actions (explicit or implicit)

### Multi-Step Wizard
**When to use:**
- Complex processes (>5 fields)
- Logical groupings of inputs
- Need for progress indication

**Structure:**
- Step indicator (progress bar or stepper)
- Step content area
- Back/Next/Submit navigation
- Step validation before proceeding

### Sectioned Form
**When to use:**
- Moderate complexity (5-15 fields)
- Logical groupings but single submit
- Overview of all fields helpful

**Structure:**
- Section headers
- Grouped fields within sections
- Single submit at bottom

## Feedback Patterns

### Toast Notifications
**When to use:**
- Transient feedback (success, info)
- Non-critical messages
- Auto-dismissing appropriate

**Structure:**
- Fixed position (often bottom or top-right)
- Icon + message
- Optional action link
- Auto-dismiss after 3-5 seconds

### Inline Alerts
**When to use:**
- Contextual feedback within content
- Important but not blocking
- Persistent until addressed

**Structure:**
- Alert container in content flow
- Icon + title + description
- Optional action buttons
- Dismissible or permanent

### Modal Dialogs
**When to use:**
- Focused tasks requiring attention
- Confirmation before destructive actions
- Complex input that needs isolation

**Structure:**
- Overlay backdrop
- Centered dialog container
- Header with title + close
- Body with content
- Footer with actions

**Considerations:**
- Trap focus within modal
- Close on Escape key
- Prevent background scroll

## Action Patterns

### Confirmation
**When to use:**
- Destructive or irreversible actions
- Actions with significant consequences
- When undo is not available

**Approaches:**
1. **Modal confirmation** - For major actions
2. **Inline confirmation** - For list item actions
3. **Undo pattern** - Allow reversal instead of confirm

### Bulk Actions
**When to use:**
- Users need to act on multiple items
- Efficiency is important
- Items support same actions

**Structure:**
- Selection mechanism (checkboxes)
- Selection count indicator
- Bulk action toolbar (appears on selection)
- Select all / clear selection

### Progressive Disclosure
**When to use:**
- Advanced options exist but rarely needed
- Reduce initial complexity
- Guide users through complexity gradually

**Approaches:**
- "Advanced settings" expandable section
- "More options" link/button
- Stepped reveal based on choices

## Empty States

### No Data Yet
**Structure:**
- Illustrative icon or image
- Explanatory headline
- Supporting description
- Primary CTA to add first item

**Example:**
> **No projects yet**
> Create your first project to get started.
> [Create Project]

### No Results
**Structure:**
- Search/filter context
- Helpful message
- Suggestions to modify search

**Example:**
> **No results for "xyz"**
> Try adjusting your filters or search terms.

### Error State
**Structure:**
- Error indication
- What went wrong
- How to recover
- Retry action if applicable

## Loading Patterns

### Skeleton Screens
**When to use:**
- Known content structure
- Perceived performance improvement
- Better than spinner for content areas

### Spinners
**When to use:**
- Unknown content structure
- Short operations
- Actions in progress

### Progress Bars
**When to use:**
- Multi-step processes
- File uploads
- Operations with known duration
