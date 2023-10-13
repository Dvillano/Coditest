export const validateEmail = (email) => {
    if (!email.includes("@")) {
        return "Ingrese un email valido.";
    }

    return "";
};

export const validatePassword = (password) => {
    if (password.length < 6) {
        return "La contraseña debe tener al menos 6 caracteres.";
    }

    return "";
};

export const validateName = (name) => {
    if (name.length == 0) {
        return "Ingrese su nombre.";
    }

    return "";
};

export const validateLastName = (lastName) => {
    if (lastName.length == 0) {
        return "Ingrese su apellido.";
    }

    return "";
};
