/* to apply jwt or json web token steps are follows:
install npm install jsonwebtoken
 jwt.sign(payload, secret, {expiresIn: })
 token client
 =================
 *how to store token in client side
 *. memory  --- which is not secure but ok
 *. local storage -- also ok but not totally safe can be access using XSS-cross side scripting
 *. cookie: http only
 for that 

 first install npm install cookie-parser from express.com
 set cookei for httponly. for development set secure:false but for production secure:true.
 set cors :
 app.use(cors({
    origin:['http://localhost:5173'],
    credentials:true
}));

 set axios at client side

 to send cookie from client side to servier side:
 

****/