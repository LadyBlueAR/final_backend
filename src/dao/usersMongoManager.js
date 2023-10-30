import { userModel } from '../dao/mongo/models/user.model.js';
import { createHash, isValidPassword } from '../utils.js';

export default class UsersMongoManager {
  async createUser(data) {
    const { first_name, last_name, email, age, password } = data;
    try {
      const userExists = await userModel.findOne({ email });
      if (userExists) {
        throw new Error('El usuario ya existe');
      }
      const newUser = {
        first_name,
        last_name,
        email,
        age,
        password: createHash(password),
      };
      const result = await userModel.create(newUser);
      return result;
    } catch (error) {
      throw new Error(`Error al crear el usuario: ${error}`);
    }
  }

  async getUserByEmail(email) {
    try {
      const user = await userModel.findOne({ email });
      return user;
    } catch (error) {
      throw new Error(`Error al buscar el usuario: ${error}`);
    }
  }

  async authenticateUser(email, password) {
    try {
      const user = await userModel.findOne({ email });
      if (!user) {
        throw new Error('Usuario no encontrado');
      }
      if (!isValidPassword(user, password)) {
        throw new Error('Contraseña incorrecta');
      }
      return user;
    } catch (error) {
      throw new Error(`Error al autenticar al usuario: ${error}`);
    }
  }

  async findUserById(id) {
    try {
      const user = await userModel.findById(id);
      return user;
    } catch (error) {
      throw new Error(`Error al buscar el usuario: ${error}`);
    }
  }

  async asignCartToUser(id) {
    try {
    } catch (error) {
      
    }
  }
}
