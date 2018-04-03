
export class LabelForce {
    lab: Array<{ name: string, x: number, y: number, width: number, height: number }> = [];
    anc: Array<any> = [];
    w: number = 1; // Box Width
    h: number = 1; // Box Height
    labeler: {};
    maxMove = 5.0;
    maxAngle = 0.5;
    acc: 0;
    rej: 0;
    weight = {
        length: 0.2,        // Leader Line Length
        intersection: 1.0,  // Leader Line Intersection
        lab2: 30.0,         // this.label Overlap
        lab_anc: 30.0,      // this.label Anchor Overlap
        orient: 3.0         // Orient Bias
    }

    user_energy = false;
    user_schedule = false;
    user_defined_energy;
    user_defined_schedule;

    // energy function, tailored for this.label placement
    energy(index): number {

        // energy function, tailored for this.label placement
        let m = this.lab.length,
            ener = 0,
            dx = this.lab[index].x - this.anc[index].x,
            dy = this.anc[index].y - this.lab[index].y,
            dist = Math.sqrt(dx * dx + dy * dy),
            overlap = true,
            amount = 0,
            theta = 0;

        // penalty for length of leader line
        if (dist > 0) ener += dist * this.weight.length;

        // this.label orientation bias
        dx /= dist;
        dy /= dist;
        if (dx > 0 && dy > 0) { ener += 0 * this.weight.orient; }
        else if (dx < 0 && dy > 0) { ener += 1 * this.weight.orient; }
        else if (dx < 0 && dy < 0) { ener += 2 * this.weight.orient; }
        else { ener += 3 * this.weight.orient; }

        var x21 = this.lab[index].x,
            y21 = this.lab[index].y - this.lab[index].height + 2.0,
            x22 = this.lab[index].x + this.lab[index].width,
            y22 = this.lab[index].y + 2.0;
        var x11, x12, y11, y12, x_overlap, y_overlap, overlap_area;

        for (var i = 0; i < m; i++) {
            if (i != index) {

                // penalty for intersection of leader lines
                overlap = this.intersect(this.anc[index].x, this.lab[index].x,
                    this.anc[i].x, this.lab[i].x,
                    this.anc[index].y, this.lab[index].y,
                    this.anc[i].y, this.lab[i].y);
                if (overlap) ener += this.weight.intersection;

                // penalty for this.label-this.label overlap
                x11 = this.lab[i].x;
                y11 = this.lab[i].y - this.lab[i].height + 2.0;
                x12 = this.lab[i].x + this.lab[i].width;
                y12 = this.lab[i].y + 2.0;
                x_overlap = Math.max(0, Math.min(x12, x22) - Math.max(x11, x21));
                y_overlap = Math.max(0, Math.min(y12, y22) - Math.max(y11, y21));
                overlap_area = x_overlap * y_overlap;
                ener += (overlap_area * this.weight.lab2);
            }

            // penalty for this.label-anchor overlap
            x11 = this.anc[i].x - this.anc[i].r;
            y11 = this.anc[i].y - this.anc[i].r;
            x12 = this.anc[i].x + this.anc[i].r;
            y12 = this.anc[i].y + this.anc[i].r;
            x_overlap = Math.max(0, Math.min(x12, x22) - Math.max(x11, x21));
            y_overlap = Math.max(0, Math.min(y12, y22) - Math.max(y11, y21));
            overlap_area = x_overlap * y_overlap;
            ener += (overlap_area * this.weight.lab_anc);

        }
        return ener;
    }
    mcmove(currT): void {
        // Monte Carlo translation move

        // select a random this.label
        var i = Math.floor(Math.random() * this.lab.length);

        // save old coordinates
        var x_old = this.lab[i].x;
        var y_old = this.lab[i].y;

        // old energy
        var old_energy;
        if (this.user_energy) { old_energy = this.user_defined_energy(i, this.lab, this.anc) }
        else { old_energy = this.energy(i) }

        // random translation
        this.lab[i].x += (Math.random() - 0.5) * this.maxMove;
        this.lab[i].y += (Math.random() - 0.5) * this.maxMove;

        // hard wall boundaries
        if (this.lab[i].x > this.w) this.lab[i].x = x_old;
        if (this.lab[i].x < 0) this.lab[i].x = x_old;
        if (this.lab[i].y > this.h) this.lab[i].y = y_old;
        if (this.lab[i].y < 0) this.lab[i].y = y_old;

        // new energy
        var new_energy;
        if (this.user_energy) { new_energy = this.user_defined_energy(i, this.lab, this.anc) }
        else { new_energy = this.energy(i) }

        // delta E
        var delta_energy = new_energy - old_energy;

        if (Math.random() < Math.exp(-delta_energy / currT)) {
            this.acc += 1;
        } else {
            // move back to old coordinates
            this.lab[i].x = x_old;
            this.lab[i].y = y_old;
            this.rej += 1;
        }
    };

    mcrotate(currT) {
        // Monte Carlo rotation move

        // select a random this.label
        var i = Math.floor(Math.random() * this.lab.length);

        // save old coordinates
        var x_old = this.lab[i].x;
        var y_old = this.lab[i].y;

        // old energy
        var old_energy;
        if (this.user_energy) { old_energy = this.user_defined_energy(i, this.lab, this.anc) }
        else { old_energy = this.energy(i) }

        // random angle
        var angle = (Math.random() - 0.5) * this.maxAngle;

        var s = Math.sin(angle);
        var c = Math.cos(angle);

        // translate this.label (relative to anchor at origin):
        this.lab[i].x -= this.anc[i].x
        this.lab[i].y -= this.anc[i].y

        // rotate this.label
        var x_new = this.lab[i].x * c - this.lab[i].y * s,
            y_new = this.lab[i].x * s + this.lab[i].y * c;

        // translate this.label back
        this.lab[i].x = x_new + this.anc[i].x
        this.lab[i].y = y_new + this.anc[i].y

        // hard wall boundaries
        if (this.lab[i].x > this.w) this.lab[i].x = x_old;
        if (this.lab[i].x < 0) this.lab[i].x = x_old;
        if (this.lab[i].y > this.h) this.lab[i].y = y_old;
        if (this.lab[i].y < 0) this.lab[i].y = y_old;

        // new energy
        var new_energy;
        if (this.user_energy) { new_energy = this.user_defined_energy(i, this.lab, this.anc) }
        else { new_energy = this.energy(i) }

        // delta E
        var delta_energy = new_energy - old_energy;

        if (Math.random() < Math.exp(-delta_energy / currT)) {
            this.acc += 1;
        } else {
            // move back to old coordinates
            this.lab[i].x = x_old;
            this.lab[i].y = y_old;
            this.rej += 1;
        }
    };


    intersect = function (x1, x2, x3, x4, y1, y2, y3, y4) {

        var mua, mub;
        var denom, numera, numerb;

        denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
        numera = (x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3);
        numerb = (x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3);
        mua = numera / denom;
        mub = numerb / denom;
        if (!(mua < 0 || mua > 1 || mub < 0 || mub > 1)) {
            return true;
        }
        return false;
    }

    cooling_schedule(currT, initialT, nsweeps) {
        // linear cooling
        return (currT - (initialT / nsweeps));
    }

    start(nsweeps) {
        // main simulated annealing function
        var m = this.lab.length,
            currT = 1.0,
            initialT = 1.0;

        for (var i = 0; i < nsweeps; i++) {
            for (var j = 0; j < m; j++) {
                if (Math.random() < 0.5) { this.mcmove(currT); }
                else { this.mcrotate(currT); }
            }
            currT = this.cooling_schedule(currT, initialT, nsweeps);
        }
    };

    width(x): LabelForce {
        // users insert graph width
        //if (!arguments.length) { return this.w; }
        this.w = x;
        return this;
    };

    height(x): LabelForce {
        // users insert graph height
        // if (!arguments.length) return h;
        this.h = x;
        return this;
    };

    label(x: Array<{ name: string, x: number, y: number, width: number, height: number }>): LabelForce {
        // users insert label positions
        // if (!arguments.length) return lab;
        this.lab = x;
        return this;
    };

    anchor(x): LabelForce {
        // users insert anchor positions
        // if (!arguments.length) return anc;
        this.anc = x;
        return this;
    };

    altEnergy(x): LabelForce {
        // user defined energy
        // if (!arguments.length) return energy;
        this.user_defined_energy = x;
        this.user_energy = true;
        return this;
    };

    altSchedule(x): LabelForce {
        // user defined cooling_schedule
        // if (!arguments.length) return cooling_schedule;
        this.user_defined_schedule = x;
        this.user_schedule = true;
        return this;
    };

}
