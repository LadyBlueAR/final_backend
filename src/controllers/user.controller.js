import MailingService from "../services/mailing.service.js";
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
            { expiresIn: '1m' }
          );

        const hashedResetToken = await createHash(resetToken);
        user.resetToken = hashedResetToken;
        await user.save();

        await ms.sendSimpleMail({
            from: 'anabelag1991@gmail.com',
            to: mail,
            subject: 'Prueba Link Recuperación',
            html: `
  <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
  <a href="http://localhost:8080/reset?token=${resetToken}&email=${mail}">Restablecer contraseña</a>
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
    const isPasswordMatch = await bcrypt.compareSync(newPassword, user.password);
    if (isPasswordMatch) {
        console.log("La contraseña nueva no puede ser igual a la anterior");
        return res.status(400).json({ error: "La nueva contraseña no puede ser igual a la anterior" });
    } else if(newPassword != confirmPassword) {
        console.log("Las contraseñas no coinciden");
        return res.status(404).json({ error: "Las contraseñas no coinciden"});
    } else {
        console.log("LA CONTRASEÑA SE CAMBIARA");
        const hashedPassword = await createHash(newPassword);
        user.password = hashedPassword;
        user.save();
        res.render('login');
        //return res.status(200).json({ status: "success", message:"Contraseña cambiada con éxito"});
    }
  }

  static async changeRole ( req, res) {
    const { uid } = req.params;
    const user = await userModel.findById(uid);
    switch (user.rol) {
      case "user":
        await userModel.findByIdAndUpdate(uid, { rol: "premium"});
        break;
      case "premium":
        await userModel.findByIdAndUpdate(uid, { rol: "user"});
        break;
    }
    res.send("ruta de cambio de usuarios");
  }
}
