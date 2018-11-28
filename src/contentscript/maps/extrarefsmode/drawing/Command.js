import C from "../../../../Constants";

const rect = 1;
const rho = 2;
const circ = 3;
const comment = 7;
const move = 4;
const del = 5;
const resize = 6;

const allCommands = [
    rect,
    rho,
    circ,
    comment,
    move,
    del,
    resize
];

class Command {
    static get Rect(): number {
        return rect;
    }

    static get Rho(): number {
        return rho;
    }

    static get Circ(): number {
        return circ;
    }

    static get Comment(): number {
        return comment;
    }

    static get Move(): number {
        return move;
    }

    static get Delete(): number {
        return del;
    }

    static get Resize(): number {
        return resize;
    }

    static get AllCommands(): number[] {
        return allCommands;
    }

    static commandToAreaType(command: number): string {
        if (command === Command.Rect) return C.MapAreaRect;
        if (command === Command.Rho) return C.MapAreaRhombus;
        if (command === Command.Circ) return C.MapAreaCircle;
        if (command === Command.Comment) return C.MapAreaComment;
        return null;
    }
}

export default Command;