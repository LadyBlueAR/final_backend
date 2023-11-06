import MailingService from "../services/mailing.service.js";
import UserDTO from "../DTOs/user.dto.js";
import { userModel } from "../dao/mongo/models/user.model.js";
import jwt from 'jsonwebtoken';
import { createHash } from "../utils.js";
import bcrypt from 'bcrypt';

const ms = new MailingService();

export default class UserController {

  static async requestPasswordReset (req,res) {
    const mail = req.body.email;

    try {
        const user = await userModel.findOne({ email: mail });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const resetToken = jwt.sign(
            { email: user.email },
            'claveDeRecuperacion',
            { expiresIn: '1h' }
          );

        const hashedResetToken = await createHash(resetToken);
        user.resetToken = hashedResetToken;
        await user.save();

        await ms.sendSimpleMail({
            from: 'anabelag1991@gmail.com',
            to: mail,
            subject: 'Link de Recuperación de Contraseña',
            html: `
  <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
  <a href="https://ecommerce-coder-guet.onrender.com/reset?token=${resetToken}&email=${mail}">Restablecer contraseña</a>
`,
            attachments: []
        })
        return res.status(200).json({status: "success", message: "Correo enviado con éxito"});
    } catch (error) {
        return res.status(500).json({ message: 'Hubo un problema al procesar la solicitud' });
    }
  }

  static async changePassword (req, res){
    const { newPassword, confirmPassword, email } = req.body;
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({message: "Usuario no encontrado"});
    }
    const isPasswordMatch = await bcrypt.compareSync(newPassword, user.password);
    if (isPasswordMatch) {
        return res.status(400).json({ status: "error", message: "La nueva contraseña no puede ser igual a la anterior" });
    } else if(newPassword != confirmPassword) {
        return res.status(401).json({ message: "Las contraseñas no coinciden"});
    } else {
        const hashedPassword = await createHash(newPassword);
        user.password = hashedPassword;
        user.save();
        res.status(200).render('login');
    }
  }

  static async changeRole ( req, res) {
    const { uid } = req.params;
    const user = await userModel.findById(uid);

    if (user.rol === "user" && user.status === true) {
      await userModel.findByIdAndUpdate(uid, { rol: "premium"});
      return res.status(200).json({ status: "success", message: `El usuario ${user.email} es ahora un usuario premium`});
    } else if (user.rol === "user" && user.status === false) {
      return res.status(404).json({status: "error", message: `El usuario ${user.email} no puede ser pasado a premium debido a que le faltan cargar documentos.` });
    } else if (user.rol === "premium") {
      await userModel.findByIdAndUpdate(uid, { rol: "user"});
      res.status(200).json({ status: "success", message: `El usuario ${user.email} es ahora un usuario común`});
    }
  }

  static async uploadSingle (req, res) {
    if (!req.file) {
      return res.status(400).send({status: "error", message: "No se pudo guardar la imagen"});
    }
    const user = req.session.user;
    const file = req.file;
    try {
      const uploadedFile = {
        name: file.filename,
        reference: file.path
      }
      await userModel.findByIdAndUpdate(user._id, {
        $push: {documents: uploadedFile}
      });
      return res.status(201).send({status: "success", message: "Imagen cargada con éxito"});
    } catch (error) {
      return res.status(400).send({status: "error", message: "No se pudo actualizar el usuario en la base de datos"});
    }
  }

  static async uploadMultiple(req, res) {
    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ status: "error", message: "No se pudieron guardar las imágenes" });
    }
    const user = req.session.user;
    const uploadedFiles = req.files.map(file => {
      return {
        name: file.filename,
        reference: file.path
      }
    });

    try {
      for (const file of uploadedFiles) {
        await userModel.findByIdAndUpdate(user._id, { 
          $push: { documents: file }
        });
      }  
      res.status(201).send({ status: "success", message: "Imágenes cargadas con éxito", uploadedFiles });
    } catch (error) {
      res.status(500).send({ status: "error", message: "Error al actualizar el usuario en la base de datos" });
    }

  }

  static async getAllUsers(req, res) {
    const users = await userModel.find();
    const userDTO = [];

    for (const user of users) {
      const userDTOInstance = new UserDTO(user);
      userDTO.push(userDTOInstance);
    }
    res.status(200).json({ status : "success", payload: userDTO});    
  }

  static async deleteInactive(req,res) {
    const users = await userModel.find();
    const currentDate = new Date();
    const usersDeleted = [];

    for (const user of users) {
      const last_connection = user.last_connection;
      const last_connectionDate = new Date(last_connection);
      const timeDifference = currentDate - last_connectionDate;
      const minutesDifference = timeDifference / (1000 * 60 * 60);
      if (minutesDifference > 48) {
        await userModel.findByIdAndRemove(user._id);
        usersDeleted.push(user.email);
      }
    }
    if (usersDeleted.length > 0) { 
      return res.status(200).send("Los siguientes usuarios fueron eliminados por inactividad: " + JSON.stringify(usersDeleted));
    } else {
      return res.status(200).send("No hay usuarios inactivos");
    }
  }
  
  static async deleteUser (req, res) {
    const uid = req.params.uid;
    try {
      await userModel.findByIdAndDelete(uid);
      return res.status(201).send("Usuario Eliminado");
    } catch (error) {
      return res.status(500).send("No se pudo eliminar el usuario");
    }
  }
}
