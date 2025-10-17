import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"

const requireAuth = async (req, res, next) => {

    //in request > headers you will have authorization which will have token like: authorization: Bearer a23lgjljldjgojdgojo4883lj-3-r33lj3 (token)
    const { authorization } = req.headers;

    if(!authorization){
        return res.status(401).json({ error: 'Authorization token required' })
    }

    // in authorization token is there is Bearer format like: authorization: Bearer a23lgjljldjgojdgojo4883lj-3-r33lj3 (token), meaning Bearer and then a space then the token and hence we split it, (split returns a new array) 
    const token = authorization.split(' ')[1];

    try{
        //verifying the token

        //Important: token does not contain the secret key, although it does contain other things that you have used to make it, like in our token we have used _id, secret key and expiry date to make it, so now when we use jwt.verify(), it returns the payload of the JWT. This payload will contain the claims that were originally put into the token when it was signed (or created, like in our case _id) including the ID, and the iat (issued date), and exp (expiration) timestamps
        //example, const decodedPayload = jwt.verify(token, secret key);
        //console.log(decoded)
        //output: {id: 'someId', iat: 1678886400, exp: 1679145600}
        //In case we have used other things to make it, like name and email, it would also be included in payload and in console would have came like:
        //output: {id: 'someId', name: 'some name', email: 'some email', iat: 736837837, exp: 89389389}

        const { _id } = jwt.verify(token, process.env.JWT_SECRET);

        //Find the user and attach their ID to the request object

        //req.user is not something that comes with the request sent by frontend, here actually we are ourselves attaching this with the request so that if multiple middlewares and routes are there so they will be able to access the user info.
        //This makes the user's data accessible to subsequent middleware functions and route handlers within the same request-response cycle
        // req.user = await User.findOne({ _id })  <-- this part will give you the complete info of the user, but here we only want to attach the user '_id' and hence we use select (select is not a mongoDB method, but mongoose feature that allows us to include or exclude some)
        // for example in user we have, _id, name, email and password, so if we do: req.user = await User.findOne({ _id }).select('name email');
        //in output we will get: { "name": "Alice", "email": "alice@email.com"}
        //or for example if we do: req.user = await User.findOne({ _id }).select('-password');
        //then in output we will have everything except password meaning, OUTPUT: { "_id":"349ljfl9", "name": "Alice", "email":"alice@email.com", }
        req.user = await User.findOne({ _id }).select('_id');

        next();

    }
    catch (error){
        console.error("JWT Verification error: ", error.message);

        return res.status(401).json({ error: 'Request is not Authorized'})
    }
}

export { requireAuth }