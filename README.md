# Admin Dashboard - Medium2

This branch (`adminDashboard`) contains the **Admin Dashboard** implementation for our Medium2 platform.  
It provides CRUD-related functionality for managing articles, specifically **View**, **Edit**, and **Delete** operations.

---

##  Features

### 1. **View Article**
- Clicking the **View** icon in the table opens the article in **read-only mode**.
- Implemented using route path parameters:  
    article/:id

### 2. **Edit Article**
- Clicking the **Edit** icon navigates to the edit page:
    article/:id/edit

### 3. **Delete Article**
- Clicking the **Delete** icon prompts for confirmation.
- If confirmed:
- Deletes the article using the `ArticlesService.deleteArticle()` method.
- Updates the AG Grid table in real-time by removing the deleted article from the `articles[]` array.

### 4. **Add Article**
- Clicking the **Add Article** icon open a drawer.
- If form is filled correctly as per validations and requirements:
- Add the article using the `ArticlesService.AddArticle()` method.


## UI Components

- **AG Grid** for listing articles with columns:
- Title
- Last Modified Date
- Description
- Author Name
- Actions: View, Edit, Delete
- **Material Drawer** for creating a new article:
- Opens from the right side.
- Closes automatically after successful creation.
