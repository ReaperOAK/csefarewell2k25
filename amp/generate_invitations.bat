@echo off
echo Generating personalized AMP invitations for GitHub Pages...
echo.

python amp/generate_invitations.py

echo.
echo Done!
echo Your invitations are ready in the 'docs' folder.
echo Push this folder to your GitHub repository to deploy on GitHub Pages.
pause