# Drive MVP

A Google Drive MVP (Minimum Viable Product) built with Node.js, Express, MongoDB, and React. This application provides essential cloud file storage functionality including user authentication, file upload/download/delete, and a clean modern UI.

## Features

- **User Authentication**: Register and login with JWT-based authentication
- **File Management**: Upload, download, and delete files up to 100MB
- **Search Functionality**: Search through your uploaded files
- **Pagination**: Browse through large file collections
- **Modern UI**: Clean, responsive interface built with React
- **File Type Icons**: Visual indicators for different file types
- **Secure Storage**: Files are stored securely on the server

## Tech Stack

### Backend

- Node.js & Express.js
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads
- bcryptjs for password hashing

### Frontend

- React 18
- React Router for navigation
- Lucide React for icons
- React Dropzone for file uploads
- Axios for API calls

## Prerequisites

Before running this application, make sure you have:

- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn package manager

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd MVP_Drive_clone
   ```

2. **Install dependencies**

   ```bash
   npm run install-deps
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env
   ```

   Edit `.env` file with your configuration:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/drive-mvp
   JWT_SECRET=b775df12d09a6fee19a8d866966dce45bcdfae0bc0edef4e6cccbff75f389b4d
   NODE_ENV=development
   ```

4. **Start MongoDB**
   - If using local MongoDB: `mongod`
   - If using MongoDB Atlas: ensure your connection string is correct

## Running the Application

### Development Mode

Start both frontend and backend simultaneously:

```bash
npm run dev
```

This will start:

- Backend server on `http://localhost:5000`
- React frontend on `http://localhost:3000`

### Production Mode

1. **Build the React app**

   ```bash
   npm run build
   ```

2. **Start the server**
   ```bash
   npm start
   ```

## Project Structure

```
MVP_Drive_clone/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── files/      # File management components
│   │   │   └── layout/     # Layout components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── App.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   └── index.js            # Server entry point
├── uploads/                # File storage directory
├── package.json            # Root package.json
└── README.md
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### File Management

- `POST /api/files/upload` - Upload a file
- `GET /api/files` - Get user's files (with pagination and search)
- `GET /api/files/download/:filename` - Download a file
- `DELETE /api/files/delete/:filename` - Delete a file

## Usage

1. **Register/Login**: Create an account or login to access the dashboard
2. **Upload Files**: Drag and drop files or click to browse and upload
3. **Manage Files**: View, download, or delete your uploaded files
4. **Search**: Use the search bar to find specific files
5. **Navigate**: Use pagination to browse through large file collections

## File Limits

- Maximum file size: 100MB
- Supported file types: All file types
- Files are stored permanently until deleted by the user

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- File upload validation
- CORS configuration
- Secure file storage

## Development Notes

- The application uses MongoDB for data persistence
- Files are stored in the `uploads/` directory
- All API responses follow a consistent JSON format
- Error handling is implemented throughout the application
- The UI is fully responsive and mobile-friendly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Submit a pull request

## License

This project is licensed under the MIT License.

##MongoDB Password: bz3mweuSqGrXC7sC
