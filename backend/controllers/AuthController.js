import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import User from '../models/userModel.js'


export const registerController = async(req,res)=>{
    try{
      
        const {name , email , phone ,password , blood_group , city} = req.body

        if(!name || !email || !phone || !password || !blood_group || !city)
        {
            return res.send({error : 'All fields are necessary'})
        }

        const existingUser = await User.findOne({email})

        if(existingUser)
            {
                return res.status(200).send({
                    message : "Already registered please login" 
                    
                })
            }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password , salt)

        const newUser = new User({
            name, email, phone, password: hashedPassword, blood_group, city 
        })

        await newUser.save()


        res.status(201).send({
            success : true,
             message : "user registered successfully",newUser
         })
    }
    catch(err)
    {
        console.log(err)
        res.status(500).send({
            success : false,
            message : 'Error in Registration ',
            error : err.message
        })
    }
}


export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "login credentials failed"
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "user not registered"
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(404).send({
        success: false,
        message: "wrong login credentials"
      })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

    // Set token in an HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true, // not accessible via JavaScript
      secure: process.env.NODE_ENV === "production", // only use HTTPS in production
      sameSite: "strict", // helps prevent CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    })

    return res.status(201).send({
      success: true,
      message: "login success",
    })
  } catch (err) {
    console.log(err)
    res.status(500).send({
      success: false,
      message: "Failed to login",
      error: err.message
    })
  }
}
