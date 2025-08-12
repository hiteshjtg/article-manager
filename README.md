# Medium2

This is a simple web application built with Angular and Firebase. It features user authentication (sign-up and sign-in) and a homepage that displays articles from a Firestore database.

Features
    User Authentication

        User registration with email and password.

        User sign-in.

        Automatic login after a successful registration.

        Session management using tokens stored in localStorage.

        User-friendly error messages for common issues (e.g., email in use, invalid credentials).

    Article Display

        Fetches a list of articles from a Firestore collection.

        Displays articles in a clean, card-based layout using Angular Material.

        Handles and correctly formats complex data from Firestore, including Timestamp dates and tags stored as a JSON string.
