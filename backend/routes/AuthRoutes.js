import express from 'express'
import protectedRoute from '../middlewares/AuthMiddleware.js'
import { registerController , loginController, updateLocation, geocode } from '../controllers/AuthController.js'
import User from '../models/userModel.js'


const router = express.Router()

router.post('/register',registerController)

router.post('/login',loginController)

router.get('/profile', protectedRoute, (req, res) => {
    res.json({ success: true, message: "User authenticated", user: req.user });
});

router.get('/getUserById/:id', protectedRoute, async (req, res) => {
  try {
      const userId = req.params.id;
      const user = await User.findById(userId); // Adjust this line based on your User model implementation
      if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.status(200).json({ success: true, user });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
});

router.get('/check', protectedRoute, (req, res) => {
     console.log("Authenticated user:", req.user);
    res.status(200).json({ success: true, user: req.user })
  })

  router.get('/logout', (req, res) => {
    res.clearCookie('token');  // Replace 'token' with your actual cookie name
    res.status(200).json({ message: 'Logged out successfully' });
});

router.patch('/update-location',protectedRoute , updateLocation);

router.get('/geocode',geocode)


export default router
