# OBLIVION – CSE Farewell 2025

A collection of personalized AMP Story invitations for the OBLIVION CSE Farewell event.

## Setup and Deployment Guide

### Prerequisites

- [Git](https://git-scm.com/downloads)
- [Python 3.x](https://www.python.org/downloads/)
- GitHub account

### Step 1: Generate the Invitations

1. Clone this repository or download it to your local machine
2. Run the batch script to generate all personalized invitations:
   ```
   amp\generate_invitations.bat
   ```
3. This will create a `docs` folder with all the personalized AMP stories

### Step 2: Push to GitHub

1. Create a new GitHub repository (if you haven't already)
2. Initialize Git in your local folder:
   ```
   git init
   git add .
   git commit -m "Initial commit with personalized invitations"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/csefarewell2k25.git
   git push -u origin main
   ```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "GitHub Pages" section
4. Select the Source as "main" branch and "/docs" folder
5. Click "Save"
6. Wait a few minutes for your site to be published
7. Your site will be available at `https://YOUR_USERNAME.github.io/csefarewell2k25/`

### Step 4: Send Email Invitations

1. Update the GitHub Pages URL in the `prepare_emails.py` script
2. Run the email preparation script:
   ```
   python amp/prepare_emails.py
   ```
3. Open the generated `docs/email_list.csv` file
4. Add actual email addresses for each invitee
5. Use a mail merge tool or email marketing service to send personalized emails

## Folder Structure

- `amp/` - Contains the template and generation scripts
- `digital invitation/face pic/` - Contains profile pictures for each invitee
- `docs/` - Generated output ready for GitHub Pages

## Customization

- Update `RSVP_LINK` in `generate_invitations.py` with your actual form link
- Update `EVENT_DETAILS_URL` in `generate_invitations.py` with your event details page
- Modify `email_template.txt` to change the email content

## Resources

The AMP stories use the following resources:
- Video backgrounds for various pages
- Face pictures in summoning circle design
- Custom CSS animations and effects

## Credits

Created by STCET CSE Farewell Committee 2025