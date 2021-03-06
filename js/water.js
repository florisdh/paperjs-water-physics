const SPRING_FORCE = 0.017;
const DAMPING = 0.005;
const SPREAD = 0.05;

class Water {

    constructor(totalPoints) {
        this.x = 0;
        this.y = 400;

        this.clickForce = 50;
        this.clickSurface = 0.1;

        this.width = paper.view.viewSize.width;
        this.height = paper.view.viewSize.height;

        this.mesh = new paper.Path();
        this.mesh.fillColor = '#66f';
        this.mesh.onClick = this.onClick.bind(this);

        this.points = [];
        this.totalPoints = totalPoints;
        for (var i = 0; i < this.totalPoints; i++) {
            this.points.push(new WaterPoint(0, 0));
        }

        this.resize();
    }

    onClick(event) {
        const pointX = Math.round(event.point.x / this.spacing);
        const surface = Math.floor(this.width * this.clickSurface / this.spacing / 2) * 2;
        for (var i = -surface; i <= surface; i++) {
            this.splash((pointX + i) % this.totalPoints, Math.cos(i / surface * Math.PI / 2 * (0.8 + Math.random() * 0.2)) * this.clickForce);
        }
    }

    splash(x, force) {
        this.points[x].position.y += force;
    }

    updateMesh() {
        this.mesh.clear();
        this.mesh.moveTo(this.points[0].position);
        for (var i = 1; i < this.totalPoints; i++) {
            this.mesh.lineTo(this.points[i].position);
        }
        this.mesh.lineTo(this.points[this.totalPoints-1].position.x, this.height);
        this.mesh.lineTo(this.points[0].position.x, this.width);
    }

    update(event) {
        // Bounce back to original line
        this.points.forEach((node) => {
            node.velocity += SPRING_FORCE * (this.y - node.position.y);
        });

        // Calculate distance to neighbors
        for (var i = 0; i < this.totalPoints; i++) {
            if (i > 0) {
                this.points[i-1].velocity += (this.points[i].position.y - this.points[i-1].position.y) * SPREAD;
            }
            if (i < this.totalPoints - 1) {
                this.points[i+1].velocity += (this.points[i].position.y - this.points[i+1].position.y) * SPREAD;
            }
        }

        // Apply velocity
        this.points.forEach((node) => {
            node.position.y += node.velocity;
        });

        // Velocity damping
        this.points.forEach((node) => {
            node.velocity -= node.velocity * DAMPING;
        });

        this.updateMesh();
    }

    resize() {
        this.spacing = this.width / (this.totalPoints - 1);
        for (var i = 0; i < this.totalPoints; i++) {
            this.points[i].position.set(this.spacing * i, this.y);
        }
        this.updateMesh();
    }
}

class WaterPoint extends paper.Shape.Circle {
    
    constructor(x, y) {
        super({
            center: new paper.Point(x, y),
            radius: 10,
            fillColor: 'rgba(1,1,1,0)'
        });
        this.velocity = 0;
    }
}
