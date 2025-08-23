Medium2 – Developer Documentation (dev branch)
Medium2 is a full-stack web application inspired by Medium, built to support Authentication (Sign In/Sign Up), Homepage (show all articles to users) and an Admin Dashboard for managing articles.

This branch (dev) contains the latest merged features, including:

Authentication (Sign In / Sign Up)

Admin Dashboard with CRUD operations

Home Page with card components

Shared services and UI components

🚀 Features

🔐 Authentication
Sign Up: Allows users to create a new account with form validation.

Sign In: Existing users can log in securely.

Integrated with backend authentication services (JWT/session support as per backend implementation).

🖥️ Admin Dashboard
Article Listing:

Uses AG Grid for tabular display of all articles

Columns: Title, Last Modified Date, Description, Author, Actions

CRUD Operations:

View Article → Opens in read-only mode (route: /article/:id)

Edit Article → Navigates to edit page (route: /article/:id/edit)

Delete Article → Prompts confirmation, deletes via ArticlesService.deleteArticle(), updates table in real-time

Add Article → Opens a right-side Material Drawer, validates form, adds article via ArticlesService.addArticle(), auto-closes on success

🛠️ Tech Stack
Frontend: Angular (with Material UI & AG Grid)

Backend: Node.js / Express (assumed, configurable API)

Authentication: JWT-based (configurable)

UI Components: Angular Material, AG Grid

⚙️ Project Setup
1. Clone the repository
bash
git clone [www.github.com/hiteshjtg/articles-manager](https://github.com/hiteshjtg/article-manager)
cd medium2
git checkout dev
2. Install dependencies
bash
npm install

4. Run the development server
ng serve
Runs the frontend in development mode at:
=> http://localhost:4200


📌 Routes Overview
Auth

/signin → Login Page

/signup → Register Page

Admin Dashboard

/dashboard → List of articles

/article/:id → View article

/article/:id/edit → Edit article

/add-article (Drawer opens via button in dashboard)
