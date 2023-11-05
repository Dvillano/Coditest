const { validateEmail } = require("./validateEmail");

describe("validateEmail", () => {
    it("Debe retornar un mensaje de error si el email es invalido", () => {
        const invalidEmail = "invalidemail.com";
        const result = validateEmail(invalidEmail);
        expect(result).toBe("Ingrese un email válido.");
    });

    it("Debe retornar un string vacio para un email valido", () => {
        const validEmail = "valid@email.com";
        const result = validateEmail(validEmail);
        expect(result).toBe("");
    });

    it('Debe retornar un string vacio para un email con el simbolo "@"', () => {
        const emailWithAtSymbol = "email@example.com";
        const result = validateEmail(emailWithAtSymbol);
        expect(result).toBe("");
    });
});
