🚀 MovieWhen Project Command Cheat Sheet

1. Daily Development (Local)

Use these when you are working on the code on your own computer.

npm run dev

What it does: Starts the local development server.

When to use: Every time you start coding. Open http://localhost:5173 to see your changes in real-time.

npm install

What it does: Downloads all the libraries (like React, Lucide icons, etc.) listed in your settings.

When to use: If you clone the project to a new computer or if you get "module not found" errors.

2. Saving Your Work (Git)

Use these to save your progress to GitHub.

git status

What it does: Shows which files you have changed.

When to use: Before you commit, to double-check what you are saving.

git add .

What it does: Gets all your changed files ready to be saved.

When to use: When you are happy with your edits and ready to save.

git commit -m "Your message here"

What it does: Saves the "staged" files with a descriptive label.

Example: git commit -m "Added new movies to the list"

git push

What it does: Uploads your saved commits to GitHub.com.

When to use: After you commit, to make sure your code is safe in the cloud.

3. Deployment (Going Live)

Use these to update the actual website (www.moviewhen.com).

npm run build

What it does: Compresses your code and assets into a tiny, optimized package in the dist folder.

When to use: Automatically run before deploy, but you can run it manually to check for errors.

npm run deploy

What it does: Builds the project AND pushes it to the live website.

When to use: whenever you want the world to see your latest changes.

Note: Since we added the public/CNAME file, this command will no longer break your custom domain!

4. "In Case of Emergency"

If things act weird or crash:

rm -rf node_modules package-lock.json (Mac/Linux) or delete folder manually (Windows)

Then run: npm install

What it does: Deletes all installed libraries and reinstalls them fresh. Fixes 90% of weird "it was working yesterday" bugs.run build