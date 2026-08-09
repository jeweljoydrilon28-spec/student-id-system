# Student ID Card System

A simple browser-based student registration and printable ID card generator.

## Features
- Add, edit, delete and search student records
- Upload student photo
- Generate front/back ID cards
- QR code on the back
- Print using the browser print dialog
- Uses localStorage, so no server/database is required for Version 1

## Run locally
Open `index.html` in a browser.

## Publish with GitHub Pages
1. Create a GitHub repository.
2. Upload all files and folders in this project.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`.
6. Save and wait for GitHub Pages to publish the site.

## Important limitation
This first version stores records only in the browser's localStorage. That means data is not shared between computers or browsers. For a real school-wide system, the next version should use a backend/database such as Firebase or Supabase and proper administrator authentication.
