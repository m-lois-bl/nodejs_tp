const User = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = "secret";

exports.signUp = async (request, response) => {

    const userJSON = request.body;
    const hashedPwd = await bcrypt.hash(userJSON.password, 10);
    const userCreated = await User.create({ email : userJSON.email, password : hashedPwd });
    await userCreated.save();
    return response.status(200).json(createJsonResponse("200", "Utilisateur créé.", null));

};

exports.login = async (request, response) => {
    const userJSON = request.body;
    const foundUser = await User.findOne({ email:  userJSON.email });
    if(!foundUser){
        return response.status(401).json({ code: "701", message: `Identifiant ou mot de passe invalide.`});
    }
    await bcrypt.compare(userJSON.password, foundUser.password, (err, same) => {
        if(!same){
            return response.status(401).json({ code: "701", message: `Identifiant ou mot de passe invalide.`});
        }
        const token = jwt.sign({ email: foundUser.email }, JWT_SECRET, { expiresIn: '3 hours' });
        response.status(200).json(createJsonResponse("202", "Authentifié.e avec succès.", token));
    })

};

function createJsonResponse(code, message, data){
    return {
        code: code,
        message: message,
        date: data
    };
}