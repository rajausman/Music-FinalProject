let users = [
     {"userId": 1,"username":"Usman","password":"613727"},
     {"userId": 2,"username":"Haider","password":"613727"} 
    ];

module.exports = class User {

    static authUser(user) {
        const index = users.findIndex(p => p.username === user.username && p.password === user.password);
        if (index > -1) {
            return users[index].username;
        } else {
            
            throw new Error('User NOT Found');
        }
    }

}