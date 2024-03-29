# About the 2Dooz app
An encrypted, easy-to-use, and free-to-use task-planning web application, using a React/Node/PostgreSQL stack. 

For live usage, one can visit: https://www.2dooz.today/

## How it works
As a motivating factor, each to-do requires setting a start-time and an end-time for a selected date; after creating a stream of to-dos, with the process of having to plan a route forward, hour-by-hour & minute-by-minute, one's productivity can get a boost just by rethinking the "order of operations" or anticipating what comes next.

### Desktop - gui
For device-types with screen-widths greater than 768px, the task-planning view renders a left-hand sidebar & right-hand task-planning interface. Within the sidebar, the application uses the "react-timepicker" library to specify the date & month; once the date is chosen, tasks with: (a) start-times on that selected date, which are yet incomplete, render in the "incomplete tasks" top-side of the panel, and tasks with (b) completion-times on that selected date render in the "complete tasks" bottom-side of the panel.
![image](https://github.com/blah148/encrypted_task_planner/assets/30613762/d9696102-4fb1-4a73-92d5-e5745453721a)

### Mobile - gui
To fit the elements on smaller screen-widths, the components stack instead, with a date-selector carousel on top, and the tasks panel split-up between 2 selector tabs; one for yet-to-complete "2 Dooz" and one for "Finished tasks". 
![image](https://github.com/blah148/encrypted_task_planner/assets/30613762/f7443871-e4c0-405d-ab13-6b3148481981)

### Modifying the code
From a higher-level, the foldering of the files is organized in this way:
- Node: server file (app.js)... [navigate here & cmd: "node app.js" to run the server locally]
  - React: installation (package.json)... [navigate here & cmd: "npm run build" for production, or "npm init" for development locally]
    - React components: code for various components such as the sidebar, homepage, menu; the App.js entry-point; CSS files

#### Node
At the moment, the Node code is entirely in a single-file, with language & queries designed specifically to speak with a Supabase.com database; Supabase has always-free plans for live deployment. All http requests for functionality are in the app.js code, whether it's the initial user registration, creating a new entry in Supabase, logging users-in, verifying users with JWT secure cookies, or creating/modifying tasks, which can involve adding, retrieving, encrypting/decrypting, marking-as-complete/incomplete, and deleting tasks. It's worth mentioning that the server/database is only for logged-in users, for cross-device and cross-browser adding/retrieving of tasks.
Libraries: express, passport, cors, bcrypt, crypto, jsonwebtoken, cookie-parser, moment-timezone

#### React
For the React code, the main entry-point begins with the App.js "super-parent" file, containing the URL paths and function components for the lower-level "lieutenants", such as the home page, registration page, login page, and privacy policy. An attempt has been made to name those sub-parent-pages intuitively, such as "1_Home.js". In addition, the CSS files for styling those components are stored alongside the .js components. For guests, only the React front-end is needed, without any database or active server; while tasks are stored in localStorage instead, this seemed like a more user-friendly alternative than no functionality at all.
Libraries: react-router-dom, react-date-picker, axios

## Contact & support
For any questions, please feel welcome to send a message or post in the "issues" panel in case there are bugs. In the "MIT"-fashion, the code is freely distributable; while attribution is much appreciated, it's not strictly needed! Thank you for visiting this repository.
