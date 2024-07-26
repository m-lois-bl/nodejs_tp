const jwt = require('jsonwebtoken');

// À ajouter dans un fichier .env
const JWT_SECRET = "secret";

module.exports = (request, response, next) => {
    try {
        const token = request.headers.authorization.split(' ')[1];
        console.log(token);
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userEmail = decodedToken.email;
        request.auth = {
            userEmail: userEmail
        };
        console.log(request.auth);
        next();
    }
    catch(error){
        console.log(error);
        response.status(401).json({ error : "Action non autorisée pour l'utilisateur.ice non connecté.e." });
    }

};