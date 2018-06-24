class ErrorService {
    static log(msg: string) {
        console.error(`Beyond Help: ${msg}`);
    }

    static tryCatch(handler: Function, msg: string): boolean {
        try {
            handler();
            return true;
        } catch (e) {
            ErrorService.log(msg);
            console.error(e);
            return false;
        }
    }
}

export default ErrorService;