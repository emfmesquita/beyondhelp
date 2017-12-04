class TextFieldService {
    static onKeyDownMethod(saveFunc, caller) {
        let func = function (e: KeyboardEvent) {
            if (e.which === 13 || e.keyCode === 13) {
                saveFunc && saveFunc();
            }
        };
        func = func.bind(caller);
        return func;
    }

    static onChangeMethod(stateKey: string, caller) {
        let func = function (e) {
            const state = {};
            state[stateKey] = e.target.value;
            this.setState(state);
        };
        func = func.bind(caller);
        return func;
    }
}

export default TextFieldService;