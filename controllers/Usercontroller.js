// import User from "../Model/User.js";
// // import generateToken from "../utils/generateToken.js";

// //no 1 for register new users
// //no 2 for login users 
// //no 3 for logout users
// //no 4 for view all users (admin)

// //no1 
// const login = async(req,res) => {
   
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
  
//     if (user && (await user.matchPassword(password))&& user.isActive) {
//       generateToken(res, user._id);

//       res.json({
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role:user.role
//       });
//     } else {
//       res.status(401)
//       .json({message:'Invalid email or password or user not in active'});
//     }
  

// }

// //
// const register = async(req,res) => {

//     const {name ,password, email} = req.body;
//     console.log(req.body)
    
//     const userExiists = await User.findOne ({email});

//     if(userExiists){
//         res.status(400)
//         .json({message:'User already exists'});
//         return;
//     }
//     const user = await User.create({name ,password , email});

//     if(user) {
//         generateToken(res, user._id);

        
//         res.status (201).json({
//             _id:user._id,
//             name:user.name,
//             email:user.email,
//             role:user.role
//         });
//         } else {
//             res.status(400)
//             .json ({message:'invalid user data'});
//     } 

// }

// const logOut = async(req,res) => {

//   res.cookie('jwt', '', {
//     httpOnly: true,
//     expires: new Date(0),
//   });
//     res.status (200).json ({mes:'logout user'});

// };

// const getUserById = async(req,res) =>{

//   try { 
//     const id = req.user._id;
//     //console.log(id);
//     const user = await User.findById(id);
//     //console.log(user);
//     if(user){




//       res.status(200).json(user);
//       failed
//     } else {   
//        res.status(404).json({message: 'Users not found'});
//   }
    
//   } catch (error) {
//     res.status(500).json({message: error.message});
//   }
// }


// const getAllUsers = async(req,res) =>{

//   try { 
  
//     const users = await User.find();
//     // console.log(users);
    
//     if(users){
//       res.status(200).json(users);

//     } else {   
//        res.status(404).json({message: 'Users not found'});
//   }
    
//   } catch (error) {
//     res.status(500).json({message: error.message});
//   }
// };


// const updateUserProfile = async (req, res) => {
//   const user = await User.findById(req.user._id);

//   if (user) {
//     user.name = req.body.name || user.name;
//     // user.email = req.body.email || user.email;

//     if (req.body.password) {
//       user.password = req.body.password;
//     }

//     const updatedUser = await user.save();

//     res.json({
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//     });
//   } else {
//     res.status(404)
//     .json({message:'User not found'});
//   }
// };

// const updateUserRole = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const { role } = req.body;

//     // Check if role is provided
//     if (!role) {
//       return res.status(400).json({ message: 'Role is required' });
//     }

//     // Find the user by ID
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Update the user's role
//     user.role = role;
//     await user.save();

//     // Optionally, return the updated user data
//     res.status(200).json({ message: 'Role updated successfully', user });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


// const deactivateUser = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (!user.isActive) {
//       return res.status(400).json({ message: "User is already deactivated" });
//     }

//     user.isActive = false; // Deactivate the user
//     await user.save();

//     res.status(200).json({ message: "User deactivated successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



// const activateUser = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     if (user.isActive) {
//       return res.status(400).json({ message: "User is already active" });
//     }

//     user.isActive = true; // Activate the user
//     await user.save();

//     res.status(200).json({ message: "User activated successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };




// export {login,
//         register,
//         logOut,
//         getUserById,
//         getAllUsers,
//         updateUserProfile,
//         updateUserRole,
//         deactivateUser,
//         activateUser}; // Export the functions to be used in other files