import { userModel } from "../dao/mongo/models/user.model.js";

async function checkDocuments(req,res, next) {
    const uid = req.params.uid;
    const user = await userModel.findById(uid);

    if (user.rol === "user") {
      const documentsToCheck = ["idDocument", "proofOfAddress", "bankStatement"];
      const missingDocuments = [];
  
  
      for (const doc of documentsToCheck) {
        const isDocumentUploaded = user.documents.some(userDoc => userDoc.name.includes(doc));
    
        if (!isDocumentUploaded) {
          missingDocuments.push(doc);
        }
      }  
      if (missingDocuments.length === 0) {
        await userModel.findByIdAndUpdate(uid, { status: true});
        next();
      } else {
        res.status(404).send({status: "error", message:`Los siguientes documentos no han sido cargados: ${missingDocuments.join(", ")}`})
        await userModel.findByIdAndUpdate(uid, { status: false});
      }
    } else if (user.rol === "premium") {
      next();
    }
  
  }

  export { checkDocuments };