// Este módulo contiene funciones de validación para campos comunes.

// Valida un email.
export const validateEmail = (email) => {
    // Verifica si el email contiene el carácter "@".
    if (!email.includes("@")) {
        return "Ingrese un email válido.";
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
    if (name.trim() === "") {
        return "Ingrese su nombre.";
    }

    return "";
};

export const validateLastName = (lastName) => {
    if (lastName.trim() === "") {
        return "Ingrese su apellido.";
    }

    return "";
};
