import os
import re
import csv
from string import Template

# Configuration
FACE_PICS_DIR = "digital invitation/fp"
EMAIL_TEMPLATE_FILE = "amp/email_template.txt"
EMAIL_OUTPUT_FILE = "docs/email_list.csv"
GITHUB_REPO_URL = "https://ReaperOAK.github.io/csefarewell2k25"  # Update this with your actual GitHub Pages URL

# Read the email template
with open(EMAIL_TEMPLATE_FILE, 'r', encoding='utf-8') as file:
    email_template = Template(file.read())

# Prepare CSV file for email sending
with open(EMAIL_OUTPUT_FILE, 'w', newline='', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile)
    # Write header
    writer.writerow(['Name', 'Email', 'Subject', 'Message'])
    
    # For each invitee
    for face_pic in os.listdir(FACE_PICS_DIR):
        if face_pic.endswith('.png'):
            invitee_name = os.path.splitext(face_pic)[0]
            safe_filename = re.sub(r'[^\w\s]', '', invitee_name).replace(' ', '_').lower()
            
            # Generate personalized invitation URL
            invitation_url = f"{GITHUB_REPO_URL}/{safe_filename}.html"
            
            # Personalize the email content
            email_subject = "Your Personal Gothic Masquerade Farewell Invitation - OBLIVION 2025"
            email_content = email_template.substitute(
                RECIPIENT_NAME=invitee_name,
                INVITATION_LINK=invitation_url
            )
            
            # Add a placeholder for email addresses - you'll need to fill these in manually or from another source
            email_address = "REPLACE_WITH_EMAIL"
            
            # Write to CSV
            writer.writerow([invitee_name, email_address, email_subject, email_content])
    
print(f"Generated email list CSV at {EMAIL_OUTPUT_FILE}")
print("Note: You need to add actual email addresses to the CSV file before sending.")