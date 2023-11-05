class UserDTO {

    constructor(user) {
        this.email = user.email;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.rol = user.rol;
        this.last_connection = user.last_connection;
    }
}

export default UserDTO;