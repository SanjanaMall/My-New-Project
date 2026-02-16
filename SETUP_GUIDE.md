# College Guide Website - SETUP & DEPLOYMENT GUIDE

## ✅ What Has Been Fixed

### 1. **Backend Architecture**
- ✓ Created proper User Model (`models/User.js`) with Mongoose schema
- ✓ Fixed auth routes (`routes/auth.js`) with comprehensive error handling
- ✓ Added password hashing with bcryptjs
- ✓ Implemented JWT authentication
- ✓ Added input validation and security checks

### 2. **Server Configuration** 
- ✓ Updated `server.js` with all missing endpoints
- ✓ Added MongoDB connection retry logic
- ✓ Configured CORS with safe origins
- ✓ Added error handling middleware
- ✓ Added 404 handler
- ✓ Served all frontend routes

### 3. **Frontend - Authentication**
- ✓ Implemented login/register functions
- ✓ Added token storage in localStorage
- ✓ Proper auth state management
- ✓ Added logout functionality
- ✓ Form validation on frontend

### 4. **Frontend - Features**
- ✓ Fixed duplicate `sendMessage()` function
- ✓ Implemented intelligent chatbot
- ✓ Added theme toggle (light/dark mode)
- ✓ PDF export functionality
- ✓ Learning path tracking
- ✓ Responsive navigation bar

### 5. **Pages Updated/Created**
- ✓ `index.html` - Complete home page with auth and guidance
- ✓ `dashboard.html` - User learning path dashboard
- ✓ `branches.html` - Enhanced education branches info
- ✓ `channels.html` - Comprehensive learning resources
- ✓ `research.html` - Trending research topics
- ✓ `guidance.html` - Personalized guidance page
- ✓ `simulator.html` - NEW: Interactive career simulator

### 6. **Data & Configuration**
- ✓ Populated `resources.json` with example resources
- ✓ Created `datasets.json` with course data
- ✓ Updated `.env` with clear instructions
- ✓ Added proper styling for all components

### 7. **UI/UX Improvements**
- ✓ Added professional navbar to all pages
- ✓ Consistent card-based design
- ✓ Smooth animations and transitions
- ✓ Dark mode support throughout
- ✓ Mobile responsive design
- ✓ Improved form styling

---

## 🚀 HOW TO RUN THE PROJECT

### **Step 1: Setup MongoDB (FREE)**

1. Go to: https://www.mongodb.com/cloud/atlas
2. Click "Try Free"
3. Create an account
4. Create a free cluster
5. Create a database user (username & password)
6. Whitelist your IP (or use 0.0.0.0 for anywhere)
7. Get your connection string
8. Copy the connection string and update `.env`

### **Step 2: Configure Environment Variables**

1. Open `.env` file in the project
2. Replace `MONGODB_URI` with your actual MongoDB connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/collegeguide?retryWrites=true&w=majority
   ```
3. Change `JWT_SECRET` to a strong random string
4. Keep `PORT=3000`

### **Step 3: Start the Server**

**Option A: Development Mode (with auto-reload)**
```bash
```

**Option B: Production Mode**
```bash
npm start
```

The server will start at: **http://localhost:3000**

### **Step 4: Test the Application**

1. Open http://localhost:3000 in your browser
2. Click "Register" or "Create Account"
3. Fill in the form:
   - Email: test@example.com
   - Password: password123
   - Year: 2nd Year
   - Coding Experience: Intermediate
4. Click Register - you'll be logged in automatically
5. Explore all features:
   - Check Dashboard
   - Try Career Simulator
   - Browse Branches, Resources, Research
   - Use the Chatbot
   - Toggle Dark Mode

---

## 📁 PROJECT STRUCTURE

```
college-guide-websites/
├── models/
│   └── User.js                 # Mongoose User schema
├── routes/
│   └── auth.js                 # Authentication endpoints
├── public/
│   ├── index.html              # Home page with auth
│   ├── dashboard.html          # Learning path dashboard
│   ├── branches.html           # Education branches
│   ├── channels.html           # Learning resources
│   ├── research.html           # Research topics
│   ├── guidance.html           # Personalized guidance
│   ├── simulator.html          # Career simulator
│   ├── script.js               # All JavaScript logic
│   ├── styles.css              # All styling
│   └── jspdf.min.js            # PDF export library
├── data/
│   ├── resources.json          # Learning resources
│   └── datasets.json           # Course datasets
├── server.js                   # Express server
├── .env                        # Environment variables
├── package.json                # NPM dependencies
└── README.md                   # Project documentation
```

---

## 🔑 API ENDPOINTS

### **Authentication**
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login to account
- `POST /api/auth/logout` - Logout (frontend clears token)

### **User Profile**
- `GET /api/auth/profile` - Get user profile (requires auth)
- `PUT /api/auth/profile` - Update profile & learning path (requires auth)

### **Resources**
- `GET /api/auth/resources` - Get personalized resources (query: ?year=1st&interests=python)
- `POST /api/auth/rate` - Rate a resource (requires auth)

---

## 🔐 SECURITY FEATURES

✓ Password hashing with bcryptjs
✓ JWT-based authentication
✓ Input validation on all endpoints
✓ CORS configured for safe origins
✓ Error handling without exposing sensitive info
✓ Secure token storage in localStorage (frontend)

---

## 📱 RESPONSIVE DESIGN

The site is fully responsive and works on:
- Desktop (1920px+)
- Laptop (1024px)
- Tablet (768px)
- Mobile (375px+)

---

## 🌙 DARK MODE

- Toggle button in top-right corner
- Automatically detects system preference
- Saves user preference in localStorage
- Smooth transitions between themes

---

## ⚙️ CUSTOMIZATION TIPS

### Add More Learning Resources
Edit `data/resources.json`:
```json
{
  "id": "unique-id",
  "title": "Course Title",
  "url": "https://example.com",
  "type": "free",
  "tags": ["python", "beginner"],
  "suitableYears": ["1st", "2nd"],
  "thumbnail": "https://image-url.jpg"
}
```

### Customize Career Paths
Edit `public/simulator.html` and update the `careerPaths` object

### Add More Branches
Edit `public/branches.html` and add new `<div class="branch-item">` sections

---

## 🐛 TROUBLESHOOTING

### "MongoDB Connection Error"
- Check `.env` file has correct connection string
- Verify MongoDB Atlas IP is whitelisted
- Ensure database user credentials are correct

### "Port 3000 already in use"
- Change PORT in `.env` to 3001
- Or kill the process: `lsof -ti:3000 | xargs kill -9`

### "Login not working"
- Clear browser cache and localStorage
- Check MongoDB collections are created
- Verify JWT_SECRET in `.env` is set

### "CSS not loading"
- Clear browser cache (Ctrl+Shift+Delete)
- Restart server

---

## 📈 DEPLOYMENT

### **Ready for Deployment on:**
- Heroku
- AWS
- DigitalOcean
- Render
- Railway

### **Before Deploying:**
1. Set strong `JWT_SECRET`
2. Configure production MongoDB URI
3. Set `NODE_ENV=production`
4. Enable HTTPS
5. Update CORS origins to your domain

---

## 📞 SUPPORT

For issues or questions:
1. Check error messages in browser console (F12)
2. Check server logs in terminal
3. Verify `.env` configuration
4. Clear cache and restart browser

---

## 🎉 YOU'RE ALL DONE!

The application is now fully functional with:
- User authentication ✓
- Personalized learning paths ✓
- Interactive career simulator ✓
- Resource recommendations ✓
- Theme customization ✓
- Responsive design ✓

**Start the server and enjoy!** 🚀
