import bcrypt from "bcryptjs";
import { 
  getAll,
  createUser,
  updateUser,
 } from "../models/userModel.js"; 

export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await getAll();
    res.json({
      message: "GET all users success",
      data: rows,
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Server Error',
      serverMessage: err,
    });
  }
};

export const createNewUser = async (req, res) => {
  const { username, email, password, full_name } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const values = [username, email, hashedPassword, full_name];

    await createUser(values);

    res.status(201).json({
        message: 'CREATE new users success',
    });
  } catch (err) {
    res.status(500).json({ 
      message: 'Server Error',
      serverMessage: err,
    });
  }
};

export const updateUserWithId = async (req, res) => {
  const { id } = req.params;
  const { body } = req;
  const profile_picture = req.file.path;

  try { 
    await updateUser(body, profile_picture, id);

    res.json({
      message: `UPDATE user with id_user ${id} success`,
      data: {
        user_id: id,
        ...body,
        profile_picture: profile_picture,
      }
    })
  } catch (err) {
    res.status(500).json({ 
      message: 'Server Error',
      serverMessage: err,
    });
  }
}
