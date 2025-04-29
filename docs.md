# CSE Farewell 2025 - OBLIVION Project Documentation

This documentation provides an overview of the project structure and explains the purpose of each file in the CSE Farewell 2025 project, codenamed "OBLIVION".

## Project Overview

The CSE Farewell 2025 project is a digital invitation and RSVP system for a farewell event for Computer Science and Engineering students. The project features:

- A stylish, dark-themed UI with golden accents
- Digital invitations with personalized links for invitees
- RSVP functionality for attendees
- Admin panel for managing invitees and sending bulk emails
- Interactive elements with animations using Framer Motion
- Responsive design for various devices
- Firebase integration for data storage

## Directory Structure

### Root Files

- **App.tsx** - The main application component that sets up routing with React Router and wraps the application with the theme provider.
- **App.css** - Global CSS styles for the application.
- **index.tsx** - Entry point for the React application, renders the App component to the DOM.
- **index.css** - Global CSS styles applied before component-specific styles.
- **firebase.ts** - Firebase configuration and initialization file.
- **types.ts** - TypeScript interfaces and types used throughout the application.
- **react-app-env.d.ts** - TypeScript declarations for the React application environment.

### `/src/amp` Directory

Contains files related to AMP (Accelerated Mobile Pages) story functionality:

- **email_template.txt** - Template for email invitations.
- **generate_invitations.bat** - Batch script for generating invitations.
- **generate_invitations.py** - Python script for generating invitations programmatically.
- **index.html** - HTML template for AMP story.
- **prepare_emails.py** - Python script for preparing emails for distribution.

### `/src/components` Directory

#### Main Components

- **Home.tsx** - Landing page component that displays the event title and provides access to the RSVP form for general invitees.
- **Invitation.tsx** - Displays personalized invitations and allows invitees to RSVP to the event.
- **AmpStory.tsx** - Provides an immersive, story-like experience for invitees with animations and interactive elements.
- **RSVPForm.tsx** - Form component for invitees to RSVP to the event, with options to accept or decline.
- **Theme.tsx** - Theme selection component that allows users to toggle between light and dark themes.

#### `/src/components/admin` Directory

Admin panel components:

- **AdminPage.tsx** - Main container for the admin functionality, handles authentication and routing between admin sections.
- **AdminLayout.tsx** - Layout component for the admin pages, includes sidebar navigation and header.
- **AdminSidebar.tsx** - Sidebar navigation component for the admin panel.
- **AdminLogin.tsx** - Login form for admin users to access the admin panel.
- **AdminDashboard.tsx** - Dashboard showing statistics and recent activity in the admin panel.
- **Dashboard.tsx** - Data visualization component showing invitee statistics.
- **InviteeList.tsx** - Displays and manages the list of invitees with search, filter, and pagination.
- **InviteeForm.tsx** - Form component for adding and editing invitees.
- **InviteeModal.tsx** - Modal dialog that contains the InviteeForm component.
- **InviteeManager.tsx** - Component for managing invitees, including adding, editing, and deleting.
- **BulkEmailSender.tsx** - Component for sending bulk email invitations to selected invitees.
- **EmailManager.tsx** - Component for managing email templates and sending functionality.

#### `/src/components/common` Directory

Reusable component utilities:

- **AudioPlayer.tsx** - Audio player component for background music throughout the application.
- **Error.tsx** - Error display component for showing error messages to users.
- **Loading.tsx** - Loading spinner component displayed during data fetching or processing.
- **ParticleEffect.tsx** - Visual effect component for creating particle animations.
- **ShapeCanvas.tsx** - Canvas component for rendering decorative geometric shapes.
- **Toast.tsx** - Notification component for displaying success or error messages.

#### `/src/components/invitation` Directory

Components specific to the invitation display:

- **InvitationCard.tsx** - Card component that frames the invitation content.
- **InvitationContent.tsx** - Content component for the invitation text and details.
- **InvitationEventDetails.tsx** - Component displaying event details (date, time, location).
- **InviteePortrait.tsx** - Component displaying the invitee's profile picture.
- **NavigationControls.tsx** - Navigation controls for the invitation flow.

#### `/src/components/modals` Directory

Modal dialog components:

- **RSVPModal.tsx** - Modal dialog for the RSVP form on the home page.

### `/src/context` Directory

React context providers:

- **ThemeContext.tsx** - Context provider for theme settings (light/dark mode).

### `/src/hooks` Directory

Custom React hooks:

- **useParallax.ts** - Custom hook for creating parallax scrolling effects.

### `/src/styles` Directory

Styled components and global styles:

- **GlobalStyles.tsx** - Global styled-components styles for the application.
- **HomeStyles.tsx** - Styled components for the Home page.
- **InvitationStyles.tsx** - Styled components for the Invitation pages.
- **RSVPFormStyles.tsx** - Styled components for the RSVP form.

## Feature Breakdown

### Authentication System

- The admin panel uses a simple authentication system with hardcoded credentials for demonstration purposes.
- `AdminLogin.tsx` handles the login process and stores an authentication token in localStorage.
- `AdminPage.tsx` checks for this token and controls access to the admin features.

### Invitee Management

- Invitees are stored in Firebase Firestore with details like name, email, and RSVP status.
- The admin panel provides CRUD operations for invitees.
- `InviteeList.tsx` displays invitees with filtering and searching capabilities.
- `InviteeForm.tsx` and `InviteeModal.tsx` provide forms for adding and editing invitees.
- Each invitee gets a unique URL based on their document ID for personal invitations.

### RSVP System

- `Invitation.tsx` handles displaying personalized invitations and collecting RSVP responses.
- `RSVPForm.tsx` contains the form for submitting attendance responses and optional messages.
- Responses are stored in the invitee's document in Firestore with attendance status and timestamp.

### Email Functionality

- `BulkEmailSender.tsx` provides an interface for sending invitations to multiple invitees at once.
- `EmailManager.tsx` handles email template management and sending functionality.
- The `/src/amp` directory contains scripts for generating and preparing emails.

### UI Components and Animation

- The application uses Framer Motion for animations throughout the UI.
- `ShapeCanvas.tsx` and `ParticleEffect.tsx` create decorative visual elements.
- `AudioPlayer.tsx` provides background music for an immersive experience.
- Themed components use styled-components for consistent styling.

### AMP Story Experience

- `AmpStory.tsx` provides an interactive, mobile-friendly experience similar to social media stories.
- Features animations, parallax effects, and interactive elements.
- Uses the Howler.js library for audio management.

## Technology Stack

- **React**: Frontend framework for building the user interface
- **TypeScript**: Typed JavaScript for improved development experience
- **Firebase**: Backend as a service for database and authentication
- **Framer Motion**: Animation library for React
- **Styled Components**: CSS-in-JS styling solution
- **React Router**: For navigation between pages
- **Howler.js**: Audio library for sound effects and music

## State Management

The application primarily uses React's built-in state management with hooks:
- `useState` for component-level state
- `useEffect` for side effects like data fetching
- Context API for theme settings across components

## Data Flow

1. Data is stored in Firebase Firestore in the "invitees" collection
2. Admin panel components fetch and display this data
3. Users access their invitations via unique URLs with their document ID
4. RSVP responses update the corresponding documents in Firestore
5. Admin dashboard shows statistics and recent activity based on this data

## Deployment

The project is built and deployed using standard React build tools:
- `npm run build` creates a production build
- The build folder contains all assets needed for deployment
- Static files include images, audio, and other resources