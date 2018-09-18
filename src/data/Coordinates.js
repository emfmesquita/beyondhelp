class Point {
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.r;
    }

    toString() {
        return `${this.x},${this.y}`;
    }
}

class Coordinates {
    constructor(x1: number, y1: number) {
        this.coords = [];
        if (x1 !== undefined) this.add(x1, y1);
    }

    add(x: number, y: number): Coordinates {
        this.coords.push(new Point(x, y));
        return this;
    }

    radius(r: number): Coordinates {
        this.r = r;
        return this;
    }

    x(n: number, value: number): number {
        if (value !== undefined) {
            if (!this.coords[n - 1]) this.coords[n - 1] = new Point();
            this.coords[n - 1].x = value;
        }
        return this.coords[n - 1].x;
    }

    y(n: number, value: number): number {
        if (value !== undefined) {
            if (!this.coords[n - 1]) this.coords[n - 1] = new Point();
            this.coords[n - 1].y = value;
        }
        return this.coords[n - 1].y;
    }

    translateWithDelta(deltaX: number, deltaY: number): Coordinates {
        this.coords.forEach(point => {
            if (!point) return;
            if (point.x !== undefined) point.x += deltaX;
            if (point.y !== undefined) point.y += deltaY;
        });
        return this;
    }

    translate(movingCoords: Coordinates): Coordinates {
        const deltaX = movingCoords.x(2) - movingCoords.x(1);
        const deltaY = movingCoords.y(2) - movingCoords.y(1);
        return this.translateWithDelta(deltaX, deltaY);
    }

    isInsideRect(rect: Coordinates): boolean {
        let inside = true;

        const p1 = { x: rect.x(1), y: rect.y(1) };
        const p2 = { x: rect.x(2), y: rect.y(2) };

        this.coords.forEach(point => {
            if (!inside) return false;
            if (point.x < p1.x && point.x < p2.x ||
                point.x > p1.x && point.x > p2.x ||
                point.y < p1.y && point.y < p2.y ||
                point.y > p1.y && point.y > p2.y) inside = false;
        });

        if (!inside || this.r === undefined) return inside;

        const thisP1 = this.coords[0];
        const lowerX = thisP1.x - this.r;
        const higherX = thisP1.x + this.r;
        const lowerY = thisP1.y - this.r;
        const higherY = thisP1.y + this.r;
        if (lowerX < p1.x && lowerX < p2.x ||
            higherX > p1.x && higherX > p2.x ||
            lowerY < p1.y && lowerY < p2.y ||
            higherY > p1.y && higherY > p2.y) inside = false;

        return inside;
    }

    clone(): Coordinates {
        const result = new Coordinates();
        result.radius(this.r);
        this.coords.forEach(point => {
            if (!point) {
                result.coords.push(undefined);
            } else {
                result.add(point.x, point.y);
            }
        });
        return result;
    }

    rectWidth(): number {
        return Math.abs(this.x(2) - this.x(1));
    }

    rectHeight(): number {
        return Math.abs(this.y(2) - this.y(1));
    }

    safeRect() {
        const x1 = this.x(1);
        const x2 = this.x(2);
        const y1 = this.y(1);
        const y2 = this.y(2);
        if (x1 === x2) this.x(2, x1 + 1);
        if (y1 === y2) this.y(2, y1 + 1);
    }

    rectCenter(): Coordinates {
        const x = Math.round((this.x(1) + this.x(2)) / 2);
        const y = Math.round((this.y(1) + this.y(2)) / 2);
        return new Coordinates(x, y);
    }

    toString(): string {
        const base = this.coords.join(",");
        if (this.r === undefined) return base;
        return `${base}${base ? "," : ""}${this.r ? this.r : ""}`;
    }

    static parse(coords: string): Coordinates {
        const coordsSplited = coords.split(",");
        const toNumber = (idx: number) => Number.parseInt(coordsSplited[idx]);
        const result = new Coordinates();
        for (let i = 0; i < coordsSplited.length; i += 2) {
            if (i + 1 < coordsSplited.length) result.add(toNumber(i), toNumber(i + 1));
            else result.radius(toNumber(i));
        }
        return result;
    }
}

export default Coordinates;