import assert from "assert";

function evaluateUserCode(userCode, testCases) {
    try {
        const evalFn = new Function(`return ${userCode}`)();
        const results = testCases.map(
            (testCase) => evalFn(testCase.input) === testCase.outputEsperado
        );
        return results.every((result) => result);
    } catch (error) {
        console.error(error);
        return false;
    }
}

export default evaluateUserCode;
