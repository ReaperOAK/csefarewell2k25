import os
import shutil
from string import Template
import re

# Configuration
TEMPLATE_FILE = "amp/index.html"
OUTPUT_DIR = "docs"  # GitHub Pages will serve from the 'docs' folder
FACE_PICS_DIR = "digital invitation/fp"
RESOURCES_DIR = "amp/resources"
RSVP_LINK = "https://forms.gle/PLACEHOLDER_FORM_LINK"  # Replace with your actual form link
EVENT_DETAILS_URL = "https://PLACEHOLDER_EVENT_DETAILS" # Replace with your event details page

# Create output directory if it doesn't exist
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Copy resources to the output directory
os.makedirs(os.path.join(OUTPUT_DIR, "resources"), exist_ok=True)
for resource_file in os.listdir(RESOURCES_DIR):
    source = os.path.join(RESOURCES_DIR, resource_file)
    destination = os.path.join(OUTPUT_DIR, "resources", resource_file)
    if os.path.isfile(source):
        shutil.copy2(source, destination)
        print(f"Copied resource: {resource_file}")

# Create a fps directory in the output
os.makedirs(os.path.join(OUTPUT_DIR, "faces"), exist_ok=True)

# Copy all fps to the output
for face_pic in os.listdir(FACE_PICS_DIR):
    if face_pic.endswith('.png'):
        source = os.path.join(FACE_PICS_DIR, face_pic)
        destination = os.path.join(OUTPUT_DIR, "faces", face_pic)
        if os.path.isfile(source):
            shutil.copy2(source, destination)
            print(f"Copied fp: {face_pic}")

# Read the HTML template
with open(TEMPLATE_FILE, 'r', encoding='utf-8') as file:
    template_html = file.read()

# Create index page that lists all invitations
index_links = []

# Generate personalized AMP stories for each invitee
for face_pic in os.listdir(FACE_PICS_DIR):
    if face_pic.endswith('.png'):
        invitee_name = os.path.splitext(face_pic)[0]
        safe_filename = re.sub(r'[^\w\s]', '', invitee_name).replace(' ', '_').lower()
        face_pic_url = f"faces/{face_pic}"  # URL path for web hosting
        
        # Replace placeholders in the template
        personalized_html = template_html.replace('PLACEHOLDER_FACE_PIC', face_pic_url)
        personalized_html = personalized_html.replace('PLACEHOLDER_RSVP_LINK', f"{RSVP_LINK}?name={invitee_name}")
        personalized_html = personalized_html.replace('PLACEHOLDER_EVENT_DETAILS_URL', EVENT_DETAILS_URL)
        
        # Update video sources for GitHub Pages
        personalized_html = personalized_html.replace('class="page-background silver-mist-bg"', 
                                                     f'class="page-background">'
                                                     f'<amp-video autoplay loop layout="fill" poster="resources/full_screen_looped_video_of_gently_swirling_silver.mp4">'
                                                     f'<source src="resources/full_screen_looped_video_of_gently_swirling_silver.mp4" type="video/mp4">'
                                                     f'</amp-video')
        
        personalized_html = personalized_html.replace('class="page-background vaporous-smoke-bg"', 
                                                     f'class="page-background">'
                                                     f'<amp-video autoplay loop layout="fill" poster="resources/looping_3_second_vaporous_smoke_swirling_into_a.mp4">'
                                                     f'<source src="resources/looping_3_second_vaporous_smoke_swirling_into_a.mp4" type="video/mp4">'
                                                     f'</amp-video')
        
        personalized_html = personalized_html.replace('class="page-background gothic-ballroom-bg"', 
                                                     f'class="page-background">'
                                                     f'<amp-video autoplay loop layout="fill" poster="resources/pan_loop_of_a_dimly_lit_gothic_ballroom.mp4">'
                                                     f'<source src="resources/pan_loop_of_a_dimly_lit_gothic_ballroom.mp4" type="video/mp4">'
                                                     f'</amp-video')
        
        personalized_html = personalized_html.replace('class="page-background ember-particles-bg"', 
                                                     f'class="page-background">'
                                                     f'<amp-video autoplay loop layout="fill" poster="resources/black_with_drifting_golden_ember_particles_looped.mp4">'
                                                     f'<source src="resources/black_with_drifting_golden_ember_particles_looped.mp4" type="video/mp4">'
                                                     f'</amp-video')
        
        personalized_html = personalized_html.replace('class="page-background blood-moon-bg"', 
                                                     f'class="page-background">'
                                                     f'<amp-video autoplay loop layout="fill" poster="resources/video_of_a_blood_red_full_moon_breaking.mp4">'
                                                     f'<source src="resources/video_of_a_blood_red_full_moon_breaking.mp4" type="video/mp4">'
                                                     f'</amp-video')
        
        personalized_html = personalized_html.replace('class="page-background blurred-ballroom-bg"', 
                                                    'class="page-background">'
                                                    '<img src="resources/Semi-blurred still of the ballroom from Page 3..jpeg" layout="fill"')
        
        personalized_html = personalized_html.replace('class="page-background smoke-embers-bg"', 
                                                    'class="page-background">'
                                                    '<img src="resources/static_frame_of_swirling_smoke_and_embers.jpeg" layout="fill"')
        
        # Create personalized AMP story file
        output_file = os.path.join(OUTPUT_DIR, f"{safe_filename}.html")
        with open(output_file, 'w', encoding='utf-8') as file:
            file.write(personalized_html)
        
        print(f"Created invitation for {invitee_name}")
        
        # Add link to the index
        index_links.append(f'<li><a href="{safe_filename}.html">{invitee_name}</a></li>')

# Create the main index.html file with links to all invitations
index_html = f"""<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OBLIVION – CSE Farewell 2025 Invitations</title>
    <style>
        body {{
            font-family: 'Cinzel', serif;
            background-color: #000;
            color: #E0D7B0;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }}
        h1 {{
            color: #FFD700;
            text-align: center;
            font-size: 36px;
            margin-bottom: 40px;
        }}
        ul {{
            list-style-type: none;
            padding: 0;
            column-count: 3;
        }}
        @media (max-width: 600px) {{
            ul {{
                column-count: 2;
            }}
        }}
        @media (max-width: 400px) {{
            ul {{
                column-count: 1;
            }}
        }}
        li {{
            margin-bottom: 10px;
        }}
        a {{
            color: #E0D7B0;
            text-decoration: none;
            transition: color 0.3s;
        }}
        a:hover {{
            color: #FFD700;
        }}
        .instructions {{
            margin-top: 40px;
            padding: 20px;
            background-color: rgba(255,255,255,0.1);
            border-radius: 8px;
        }}
        .cta {{
            text-align: center;
            margin-top: 30px;
        }}
        .cta a {{
            display: inline-block;
            background-color: #FFD700;
            color: #000;
            padding: 10px 20px;
            border-radius: 4px;
            font-weight: bold;
        }}
    </style>
</head>
<body>
    <h1>OBLIVION – CSE Farewell 2025</h1>
    
    <ul>
        {"".join(index_links)}
    </ul>
    
    <div class="instructions">
        <h2>Instructions</h2>
        <p>Find your name in the list above and click to view your personalized invitation.</p>
        <p>Each invitation is a captivating AMP Story that will guide you through the details of the Farewell event.</p>
    </div>
    
    <div class="cta">
        <a href="{RSVP_LINK}">RSVP NOW</a>
    </div>
</body>
</html>"""

with open(os.path.join(OUTPUT_DIR, "index.html"), 'w', encoding='utf-8') as file:
    file.write(index_html)

print(f"\nGenerated {len(index_links)} personalized invitations in '{OUTPUT_DIR}'")
print("\nCreated main index.html with links to all invitations")
print("\nReady to be pushed to GitHub Pages!")