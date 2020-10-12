<template>
    <div
        :class="bem()"
        @click="click">
        <div>
            <img
                v-if="bgSrc"
                ref="bg"
                :class="bem('bg')"
                :src="bgSrc"
                :style="{
                    width: bgWidth + 'px',
                    height: bgHeight + 'px'
                }"
                @load="onBgLoad">
            <img
                :class="bem('img')"
                v-show="!start"
                ref="img"
                @load="onImgLoad"
                :style="imageStyle"
                :src="src">
        </div>
    </div>
</template>

<script>
import numeric from 'numeric';
const POINT_RADIUS = 5;

export default {
    name: 'matrix',
    props: {
        src: {
            type: String,
            required: true
        },
        bgSrc: {
            type: String,
            default: ''
        },
        bgWidth: {
            type: String,
            default: ''
        },
        bgHeight: {
            type: String,
            default: ''
        },
    },
    data() {
        return {
            points: [],
            start: false,
            dragPoint: false,
            dragPointIndex: null
        };
    },
    computed: {
        imageStyle() {
            return {
                transform: `matrix3d(${this.matrix})`,
                opacity: this.start ? 0 : 1,
            };
        },
        matrix() {
            const imgWidth = this.imgWidth;
            const imgHeight = this.imgHeight;
            if (this.start) return null;
            const x0 = 0;
            const y0 = 0;
            const x1 = 0;
            const y1 = imgHeight;
            const x2 = imgWidth;
            const y2 = 0;
            const x3 = imgWidth;
            const y3 = imgHeight;

            const uvObj = {};
            this.points.forEach(({ position }, i) => {
                uvObj['u' + i] = position.x;
                uvObj['v' + i] = position.y;
            });
            const { u0, v0, u1, v1, u2, v2, u3, v3 } = uvObj;
            let arr = [];
            const uv = [u0, v0, u1, v1, u2, v2, u3, v3];
            const xy = [x0, y0, x1, y1, x2, y2, x3, y3];
            xy.forEach((v, i) => {
                if (i % 2 === 0) {
                    const x = v;
                    const y = xy[i + 1];
                    arr.push([x, y, 1, 0, 0, 0, -uv[i] * x, -uv[i] * y]);
                } else {
                    const x = xy[i - 1];
                    const y = v;
                    arr.push([0, 0, 0, x, y, 1, -uv[i] * x, -uv[i] * y]);
                }
            });
            const h = numeric.solve(arr, uv).map(v => +v.toFixed(6));
            const matrix = [
                h[0], h[3], 0, h[6],
                h[1], h[4], 0, h[7],
                0, 0, 1, 0,
                h[2], h[5], 0, 1
            ];
            return matrix.join(', ');
        }
    },
    destroyed() {
        this.clearPoints();
    },
    watch: {
        matrix(v) {
            this.$emit('update', v);
        },
    },
    methods: {
        run() {
            if (!this.start) {
                this.clearPoints();
            }
            this.start = !this.start;
        },

        click(e) {
            if (!this.start) return;
            this.createPoint(e);
            if (this.points.length === 4) {
                this.start = false;
            }
        },

        createPoint(e) {
            const node = document.createElement('div');
            node.pointIndex = this.points.length;
            node.addEventListener('mousedown', () => {
                this.dragPoint = true;
                this.dragPointIndex = node.pointIndex;
            });
            document.addEventListener('mousemove', e => {
                if (this.dragPoint && !this.start) {
                    const x = e.layerX;
                    const y = e.layerY;
                    this.points[this.dragPointIndex].position = {
                        x,
                        y
                    };
                    this.points[this.dragPointIndex].node.style.transform = `translate(${x - POINT_RADIUS}px, ${y - POINT_RADIUS}px)`;
                }
            });
            document.addEventListener('mouseup', () => {
                if (this.dragPoint && !this.start) {
                    this.dragPoint = false;
                    this.dragPointIndex = null;
                }
            });
            node.className = this.bem('point');
            node.style.transform = `
                translate(${e.layerX - POINT_RADIUS}px,
                ${e.layerY - POINT_RADIUS}px)`;
            this.$el.appendChild(node);
            this.points.push({
                position: {
                    x: e.layerX,
                    y: e.layerY
                },
                node
            });
        },

        clearPoints() {
            this.points.forEach(p => {
                this.$el.removeChild(p.node);
            });
            this.points = [];
        },

        onImgLoad() {
            const node = this.$refs.img;
            this.$emit('imgLoad', {
                width: node.offsetWidth,
                height: node.offsetHeight
            });
            this.imgWidth = node.offsetWidth;
            this.imgHeight = node.offsetHeight;
        },

        onBgLoad() {
            const node = this.$refs.bg;
            this.$emit('bgLoad', {
                width: node.offsetWidth,
                height: node.offsetHeight
            });
        },
    }
};
</script>

<style lang="less">
.hl-matrix {
    display: flex;
    position: relative;
    z-index: 99;
    &__point {
        position: absolute;
        top: 0;
        left: 0;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: brown;
        z-index: 10;
        user-select: none;
    }
    &__img {
        position: absolute;
        top: 0;
        left: 0;
        transform-origin: 0 0;
        pointer-events: none;
    }

    &__bg {
        display: block;
        z-index: -1;
        pointer-events: none;
    }

    &__point {
        position: absolute;
        top: 0;
        left: 0;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: red;
        cursor: pointer;
    }

    >div:nth-of-type(2) {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    &__btn {
        width: 400px;
        >button {
            margin-right: 15px;
            margin-top: 10px;
            padding: 7px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
            outline: none;
        }
    }

    &__result {
        width: 400px;
        margin-top: 10px;
        background: #2254f4;
        color: #fff;
        font-size: 16px;
        padding: 10px 15px;
        margin-left: 30px;
        line-height: 30px;
        z-index: 99;
    }
}
</style>

