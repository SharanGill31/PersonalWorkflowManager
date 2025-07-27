import express from 'express'
import cors from 'cors'
import "dotenv/config"
import { connectDB } from './config/db.js'
import userRouter from './routes/userRoute.js'
import taskRouter from './routes/taskRoute.js'

// Import path only in production
let path;
if (process.env.NODE_ENV === 'production') {
    const pathModule = await import('path');
    const { fileURLToPath } = await import('url');
    path = pathModule.default;
    // Get current directory for ES modules
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
}

const app = express();
const port = process.env.PORT || 4000;

//MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//DB CONNECT 
connectDB();

// PRODUCTION ONLY: Serve static files from React build
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('public'));
}

//API Routes
app.use("/api/user", userRouter)
app.use("/api/tasks", taskRouter);

// Development route (only in development)
if (process.env.NODE_ENV !== 'production') {
    app.get('/', (req,res)=>{
        res.send('API WORKING')
    })
}

// PRODUCTION ONLY: Handle React routing, return all requests to React app
if (process.env.NODE_ENV === 'production') {
    const { fileURLToPath } = await import('url');
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    // Handle common SPA routes explicitly
    app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
    app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
    app.get('/complete', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
    app.get('/pending', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
    app.get('/profile', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
    app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
    app.get('/signup', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
}

app.listen(port,()=>{
    console.log(`Server Started on http://localhost:${port}`)
})
