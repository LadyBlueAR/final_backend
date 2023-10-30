import mongoose from "mongoose";

const userCollection = 'users';

const userSchema = new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email:  {type: String, required: true, unique: true},
    age: {type: Number},
    password: {type: String, required: true},
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts',
        default: null,
      },
    rol: { type: String, default: 'user' },
});
  
export const userModel = mongoose.model(userCollection, userSchema);
