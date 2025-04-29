import os
import shutil
from string import Template

# Configuration
TEMPLATE_FILE = "amp/index.html"
OUTPUT_DIR = "digital invitation/output"
FACE_PICS_DIR = "digital invitation/face pic"
RSVP_LINK = "https://forms.gle/PLACEHOLDER_FORM_LINK"  # Replace with your actual form link
EVENT_DETAILS_URL = "https://PLACEHOLDER_EVENT_DETAILS" # Replace with your event details page

# Create output directory if it doesn't exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Read the HTML template
with open(TEMPLATE_FILE, 'r', encoding='utf-8') as file:
    template_html = file.read()

# Create a Template object
template = Template(template_html)

# List all face pics
face_pics = [f for f in os.listdir(FACE_PICS_DIR) if f.endswith('.png')]

# Generate personalized AMP stories for each invitee
for face_pic in face_pics:
    invitee_name = os.path.splitext(face_pic)[0]
    face_pic_path = f"../face pic/{face_pic}"  # Relative path from output directory
    
    # Replace placeholders
    personalized_html = template_html.replace('PLACEHOLDER_FACE_PIC', face_pic_path)
    personalized_html = personalized_html.replace('PLACEHOLDER_RSVP_LINK', f"{RSVP_LINK}?name={invitee_name}")
    personalized_html = personalized_html.replace('PLACEHOLDER_EVENT_DETAILS_URL', EVENT_DETAILS_URL)
    
    # Create personalized AMP story file
    output_file = os.path.join(OUTPUT_DIR, f"{invitee_name}.html")
    with open(output_file, 'w', encoding='utf-8') as file:
        file.write(personalized_html)
    
    print(f"Created invitation for {invitee_name}")

print(f"\nGenerated {len(face_pics)} personalized invitations in '{OUTPUT_DIR}'")
print("\nNote: The AMP stories contain placeholders for various media resources.")
print("Replace the PLACEHOLDER_* references with actual media files before deployment.")