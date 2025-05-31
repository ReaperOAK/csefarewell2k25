# CSE Farewell 2025 - OBLIVION

A digital invitation and RSVP system for the CSE Farewell event of 2025. The project features a stylish dark-themed UI with golden accents, personalized digital invitations, and an admin panel for managing invitees.

## Features

- 🎨 Dark-themed UI with golden accents
- 📧 Digital invitations with personalized links
- ✅ RSVP functionality for attendees
- 👨‍💼 Admin panel for invitee management
- ✨ Interactive animations with Framer Motion
- 📱 Responsive design for all devices
- 🔥 Firebase integration for data storage

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Firebase CLI (for deployment)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Set up your Firebase configuration:
   - Create a Firebase project
   - Copy your Firebase config to `src/firebase.ts`
   - Enable Firestore and Authentication in Firebase Console

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.

### `npm run deploy`

Deploys the application to Firebase hosting (requires Firebase CLI and proper configuration).

## Project Structure

```
├── build/               # Production build files
├── digital invitation/  # Invitation resources and assets
├── functions/          # Firebase Cloud Functions
├── public/             # Static assets
├── scripts/           # Utility scripts
├── src/               # Source code
│   ├── components/    # React components
│   ├── context/       # React context providers
│   ├── hooks/         # Custom React hooks
│   ├── styles/        # Styled components
│   └── utils/         # Utility functions
└── design/            # Design assets and mockups
```

## Technology Stack

- **Frontend:** React with TypeScript
- **Styling:** Styled Components
- **Animation:** Framer Motion
- **Backend:** Firebase (Firestore, Authentication)
- **Audio:** Howler.js
- **Routing:** React Router

## Documentation

For detailed documentation about the project structure, components, and features, please refer to the [docs.md](docs.md) file.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all CSE 2025 batch students who contributed to this project
- Special thanks to the faculty and staff for their support
