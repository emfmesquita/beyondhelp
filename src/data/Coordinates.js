import C from "../Constants";

const middle = (coord1: number, coord2: number) => Math.floor((coord1 + coord2) / 2);

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
        this.rectBoundsCache = null;
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

    rectBounds() {
        if (this.rectBoundsCache) return this.rectBoundsCache;

        const p1 = { x: this.x(1), y: this.y(1) };
        const p2 = { x: this.x(2), y: this.y(2) };
        this.rectBoundsCache = {
            lX: p1.x < p2.x ? p1.x : p2.x,
            hX: p1.x < p2.x ? p2.x : p1.x,
            lY: p1.y < p2.y ? p1.y : p2.y,
            hY: p1.y < p2.y ? p2.y : p1.y
        };
        return this.rectBoundsCache;
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
        const bounds = rect.rectBounds();

        this.coords.forEach(point => {
            if (!inside) return false;
            if (point.x < bounds.lX || point.x > bounds.hX ||
                point.y < bounds.lY || point.y > bounds.hY) inside = false;
        });

        if (!inside || this.r === undefined) return inside;

        const thisP1 = this.coords[0];
        const lowerX = thisP1.x - this.r;
        const higherX = thisP1.x + this.r;
        const lowerY = thisP1.y - this.r;
        const higherY = thisP1.y + this.r;
        if (lowerX < bounds.lX || higherX > bounds.hX ||
            lowerY < bounds.lY || higherY > bounds.hY) inside = false;

        return inside;
    }

    translateInsideRect(rect: Coordinates) {
        const bounds = rect.rectBounds();

        let lowerX = 0;
        let higherX = 0;
        let lowerY = 0;
        let higherY = 0;
        if (this.r === undefined) {
            const xs = this.coords.map(point => point.x);
            const ys = this.coords.map(point => point.y);
            lowerX = Math.min(...xs);
            higherX = Math.max(...xs);
            lowerY = Math.min(...ys);
            higherY = Math.max(...ys);
        } else {
            const thisP1 = this.coords[0];
            lowerX = thisP1.x - this.r;
            higherX = thisP1.x + this.r;
            lowerY = thisP1.y - this.r;
            higherY = thisP1.y + this.r;
        }

        let deltaX = 0;
        let deltaY = 0;
        if (lowerX < bounds.lX) deltaX = bounds.lX - lowerX;
        if (higherX > bounds.hX) deltaX = bounds.hX - higherX;
        if (lowerY < bounds.lY) deltaY = bounds.lY - lowerY;
        if (higherY > bounds.hY) deltaY = bounds.hY - higherY;

        this.translateWithDelta(deltaX, deltaY);
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

    safeRect(min: 5) {
        const x1 = this.x(1);
        const x2 = this.x(2);
        const y1 = this.y(1);
        const y2 = this.y(2);
        if (Math.abs(x2 - x1) < min) this.x(2, x1 + (x2 > x1 ? min : - min));
        if (Math.abs(y2 - y1) < min) this.y(2, y1 + (y2 > y1 ? min : - min));
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

    static clone(coords: Coordinates): Coordinates {
        return coords.clone();
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

    static rect(x1: number, y1: number, x2: number, y2: number): Coordinates {
        return new Coordinates(x1, y1).add(x2, y2);
    }

    static rectToRho(x1: number, y1: number, x2: number, y2: number): Coordinates {
        const middleX = middle(x1, x2);
        const middleY = middle(y1, y2);
        return new Coordinates(middleX, y1).add(x2, middleY).add(middleX, y2).add(x1, middleY);
    }

    static rectCoordsToRho(rectCoords: Coordinates): Coordinates {
        return Coordinates.rectToRho(rectCoords.x(1), rectCoords.y(1), rectCoords.x(2), rectCoords.y(2));
    }

    static rhoToRect(rho: Coordinates): Coordinates {
        return new Coordinates(rho.x(4), rho.y(1)).add(rho.x(2), rho.y(3));
    }

    static strRectToRho(rectCoords: string): Coordinates {
        return Coordinates.rectCoordsToRho(Coordinates.parse(rectCoords));
    }

    static rectToCir(x1: number, y1: number, x2: number, y2: number): Coordinates {
        const x = Math.abs(x2 - x1);
        const y = Math.abs(y2 - y1);
        const r = Math.round(Math.sqrt(x * x + y * y));
        return new Coordinates(x1, y1).radius(r || 1);
    }

    static rectCoordsToCir(rectCoords: Coordinates): Coordinates {
        return Coordinates.rectToCir(rectCoords.x(1), rectCoords.y(1), rectCoords.x(2), rectCoords.y(2));
    }

    static rectToComment(x1: number, y1: number, x2: number, y2: number): Coordinates {
        const leftX = Math.min(x1, x2);
        const rightX = Math.max(x1, x2);
        const topY = Math.min(y1, y2);
        const botY = Math.max(y1, y2);

        const coords = new Coordinates(leftX, topY).add(rightX, topY).add(rightX, botY);

        const middleX = middle(x1, x2);
        const leftBaseX = middleX - 2;
        const rightBaseX = middleX + 3;
        const tipY = botY + 5;
        const tipX = middleX - 1;

        coords.add(rightBaseX, botY).add(tipX, tipY).add(leftBaseX, botY);
        coords.add(leftX, botY);
        return coords;
    }

    static rectCoordsToComment(rectCoords: Coordinates): Coordinates {
        return Coordinates.rectToComment(rectCoords.x(1), rectCoords.y(1), rectCoords.x(2), rectCoords.y(2));
    }

    static strRectToComment(rectCoords: string): Coordinates {
        const coords = Coordinates.parse(rectCoords);
        return Coordinates.rectToComment(coords.x(1), coords.y(1), coords.x(2), coords.y(2));
    }

    static commentToRect(comment: Coordinates): Coordinates {
        return new Coordinates(comment.x(1), comment.y(1)).add(comment.x(3), comment.y(3));
    }

    static areaTypeToShape(type: string) {
        if ([C.MapAreaRhombus, C.MapAreaComment].includes(type)) return "poly";
        return type;
    }
}

export default Coordinates;