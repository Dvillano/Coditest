// Importa los módulos necesarios
const { filterUsersByTab } = require("./filterUsersByTab");

describe("filterUsersByTab", () => {
    it('Debe devolver todos los problemas cuando tabValue es "todos"', () => {
        // Define una lista de problemas de ejemplo
        const problemas = [
            { nivel: "principiante", título: "Problema 1" },
            { nivel: "interintermedio", título: "Problema 2" },
            { nivel: "avanzado", título: "Problema 3" },
        ];

        // Llama a la función con "todos" como tabValue
        const problemasFiltrados = filterUsersByTab(problemas, "todos");

        // Expectativas
        expect(problemasFiltrados).toEqual(problemas);
    });

    it("Debe filtrar problemas por tabValue", () => {
        // Define una lista de problemas de ejemplo y el tabValue deseado
        const problemas = [
            { nivel: "principiante", título: "Problema 1" },
            { nivel: "intermedio", título: "Problema 2" },
            { nivel: "avanzado", título: "Problema 3" },
        ];
        const tabValue = "intermedio";

        // Llama a la función con el tabValue específico
        const problemasFiltrados = filterUsersByTab(problemas, tabValue);

        // Expectativas
        expect(problemasFiltrados).toEqual([
            { nivel: "intermedio", título: "Problema 2" },
        ]);
    });

    it("Debe devolver un array vacío cuando no se encuentren problemas coincidentes", () => {
        // Define una lista de problemas de ejemplo y un tabValue sin coincidencias
        const problemas = [
            { nivel: "principiante", título: "Problema 1" },
            { nivel: "principiante", título: "Problema 2" },
        ];
        const tabValue = "intermedio";

        // Llama a la función con el tabValue específico
        const problemasFiltrados = filterUsersByTab(problemas, tabValue);

        // Expectativas
        expect(problemasFiltrados).toEqual([]);
    });
});
