
const util = require('../utility/util');
let users = util.getUsers();
 
module.exports = class User {

    static authUser(user) {
        const index = users.findIndex(p => p.username === user.username && p.password === user.password);
        if (index > -1) {
            return  this.getUserToken(users[index]);
        } else {
            
           return {status:404, message:"user not found"};
        }
    }


     static getUserToken (user) {
       const tokenString = user.username+""+Date.now();
       return { token : tokenString, username: user.username, userId: user.userId };
    }

}