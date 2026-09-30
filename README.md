## Building Todoist from Scratch Using React (Custom Hooks, Context), Firebase & React Testing Library (http://bit.ly/CognitiveSurge)

This application (a Todoist clone) was built using create-react-app as a base, and the technologies used were React (Custom Hooks, Context), Firebase & React Testing Library. I'm hoping this gives people a better understanding of React, and I've also included SCSS in this tutorial, but the main focus is to build a real application using React! If you clone this application, click the Pizza icon on the top right, it enables dark mode!

Subscribe to my YouTube channel here: http://bit.ly/CognitiveSurge where I build projects like this! And don't forget, you can contribute to this project (highly encouraged!). One thing I didn't get time to do was incorporate accessibility into this application, so I'd love to see that added!

![Preview](todoist-preview.png?raw=true)

## Running locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v12 or later recommended)
- A Firebase project — copy `src/firebase.js.example` to `src/firebase.js` and fill in your Firebase config values.

### Install dependencies

```bash
npm install
```

### Available scripts

| Command | Description |
|---|---|
| `npm start` | Runs the app in development mode at [http://localhost:3000](http://localhost:3000). The page reloads automatically on file changes. |
| `npm test` | Launches the test runner in interactive watch mode using React Testing Library. |
| `npm run build` | Builds the app for production into the `build/` folder. The output is minified and optimised for best performance. |
| `npm run eject` | **One-way operation.** Copies all configuration files and dependencies into the project so you have full control over them. Cannot be undone. |
