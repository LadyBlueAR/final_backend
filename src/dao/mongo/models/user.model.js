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
    documents: [
      {
        name: { type: String },
        reference: { type: String },
      },
    ],
    rol: { type: String, default: 'user' },
    status: { type: Boolean, required: true, default: false},
    last_connection: { type: Date, default: Date },
    resetToken: {type: String, default: null}
});
  
export const userModel = mongoose.model(userCollection, userSchema);
