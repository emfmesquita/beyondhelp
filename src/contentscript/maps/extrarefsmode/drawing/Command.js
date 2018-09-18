import C from "../../../../Constants";

const rect = 1;
const rho = 2;
const circ = 3;
const move = 4;
const del = 5;
const resize = 6;

const allCommands = [
    rect,
    rho,
    circ,
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

    static mathlightShape(shape: number): string {
        if (shape === Command.Rect) return C.MapAreaRect;
        if (shape === Command.Rho) return C.MapAreaRhombus;
        if (shape === Command.Circ) return C.MapAreaCircle;
        return null;
    }

    static parseMathlightShape(shape: string): number {
        if (shape === C.MapAreaRect) return Command.Rect;
        if (shape === C.MapAreaRhombus) return Command.Rho;
        if (shape === C.MapAreaCircle) return Command.Circ;
        return null;
    }
}

export default Command;