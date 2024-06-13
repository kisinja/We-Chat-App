import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDb } from './db.js';
import { register } from './controllers/auth.js';
import multer from 'multer';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import postRoutes from './routes/post.js';
import { verifyToken } from './middleware/auth.js';
import { createPost } from './controllers/post.js';

// DATA 
import User from './models/User.js';
import Post from './models/Post.js';
import { users, posts } from './data/index.js';

// Express configuration
const app = express();

// Middleware configuration
app.use(express.json());
app.use(morgan('common'));
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cors());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/assets", express.static(path.join(__dirname, 'public/assets')));

dotenv.config();

// Port configuration
const PORT = process.env.PORT || 5000;

// File Storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/assets');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.originalname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});
const upload = multer({ storage });

// Routes with files
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// Routes without files
app.use('/auth', authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes);

const startServer = async () => {
    try {
        connectDb();
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

        /* User.insertMany(users);
        Post.insertMany(posts); */
    } catch (error) {
        console.log(error.message);
    }
};

startServer();

app.get('/api', (req, res) => {
    res.send('API is running').status(200);
});