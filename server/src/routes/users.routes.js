import Router from "express";
import { 
    loggedOutUser, 
    LoginUser, 
    refreshAccessToken, 
    registerUser, 

} from "../controllers/Users.controllers.js";
import { upload } from "../middlewares/Multer.middlewares.js";
import { verifyJWT } from "../middlewares/Auth.middlewares.js";

const router = Router();

// Registration route (with avatar and cover image upload)
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
);

// Login route
router.route("/login").post(LoginUser);

// Secured routes
router.route("/logout").post(verifyJWT, loggedOutUser);
router.route("/refresh-token").post(refreshAccessToken);

// routes/users.routes.js
router.get('/me', verifyJWT, (req, res) => {
    if (req.user) {
        res.status(200).json({ user: req.user });
    } else {
        res.status(401).json({ message: 'User not authenticated' });
    }
});



export default router;
