/**
+ * Valida una direccion de email
+ *
+ * @param {string} email - El email a ser validado
+ * @return {string} Un mensaje de error si el email es invalido, o un string vacio si el email es valido.
+ */
const validateEmail = (email) => {
    // Verifica si el email contiene el carácter "@".
    if (!email.includes("@")) {
        return "Ingrese un email válido.";
    }

    return "";
};

module.exports = {
    validateEmail,
};
