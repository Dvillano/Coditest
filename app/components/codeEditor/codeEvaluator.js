import React from "react";

function CodeEvaluator({ userCode, testCases }) {
    const evaluateUserCode = () => {
        try {
            const evalFn = new Function(`return ${userCode}`)();
            const results = testCases.map(
                (testCase) => evalFn(testCase.input) === testCase.outputEsperado
            );

            return results;
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    const results = evaluateUserCode();

    return (
        <div className="code-evaluator">
            <h3>Pruebas:</h3>
            <ul>
                {testCases.map((testCase, index) => (
                    <li
                        key={index}
                        className={results[index] ? "pass" : "fail"}
                    >
                        {`Prueba ${index + 1}: `}
                        {results[index] ? "Pasó" : "Falló"}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CodeEvaluator;
