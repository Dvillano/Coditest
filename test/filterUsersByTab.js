/**
 * Filtra los usuarios por el valor de la pestaña.
 *
 * @param {Array} problemas - El array de problemas a filtrar.
 * @param {string} tabValue - El valor de la pestaña para filtrar.
 * @return {Array} El array filtrado de problemas.
 */
const filterUsersByTab = (problems, tabValue) => {
    // Si el valor de la pestaña es "todos", retorna todos los problemas
    if (tabValue === "todos") {
        return problems;
    }
    // Filtra los problemas por el nivel correspondiente al valor de la pestaña
    return problems.filter((problems) => problems.nivel === tabValue);
};

module.exports = {
    filterUsersByTab,
};
