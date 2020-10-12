<template>
    <div :class="bem()">
        <div :class="bem('inputs')" v-show="!isRun">
            <div>
                <div>图片地址</div>
                <input v-model="src" placeholder="图片地址(必填)"/>
            </div>
            <div>
                <div>背景地址</div>
                <input v-model="bgSrc" placeholder="背景地址(必填)"/>
            </div>
            <div>
                <div>背景图片宽</div>
                <input v-model="bgWidth" placeholder="背景图片宽(不填使用原图宽)"/>
            </div>
            <div>
                <div>背景图片高</div>
                <input v-model="bgHeight" placeholder="背景图片高(不填使用原图高)"/>
            </div>
            <button @click="run">开始</button>
        </div>

        <div :class="bem('matrix', { hide: !isRun })">
            <Matrix
                ref="matrix"
                :src="src"
                :bgSrc="bgSrc"
                :bgWidth="bgWidth"
                :bgHeight="bgHeight"
                @imgLoad="onImgLoad"
                @bgLoad="onBgLoad"
                @update="m => matrix = m"/>
            <div>
                <div :class="bem('help')">
                    使用说明：在背景图点击4次，按照左上、左下、右上、右下顺序点击，
                    会生成对应红点，点击完后拖拽红点进行图片变换
                </div>
                <div :class="bem('result')">
                    变换参数：<br>
                    {{ `transform: matrix3d(${matrix});`}}<br>
                    transform-origin: 0 0;
                </div>
                <div :class="bem('result')">
                    图片宽: {{ img.w }}px <br>
                    图片高: {{ img.h }}px <br>
                    背景图片宽: {{ bg.w }}px <br>
                    背景图片高:  {{ bg.h }}px <br>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Matrix from './components/matrix';

export default {
    name: 'home',
    components: {
        Matrix
    },
    data() {
        return {
            src: 'https://st-gdx.dancf.com/gaodingx/0/uxms/design/20200109-161446-a4dd.png?x-oss-process=image/format,webp',
            bgSrc: 'https://st-gdx.dancf.com/assets/20200116-174457-d8ef.png',
            bgWidth: '',
            bgHeight: '',
            origrinBgWidth: '',
            origrinBgHeight: '',
            origrinImgWidth: '',
            origrinImgHeight: '',
            matrix: 0,
            isRun: false
        };
    },
    computed: {
        img() {
            return {
                w: this.origrinImgWidth,
                h: this.origrinImgHeight
            };
        },
        bg() {
            if (this.bgWidth && this.bgHeight) {
                return {
                    w: this.bgWidth,
                    h: this.bgHeight
                };
            }
            if (this.bgWidth) {
                return {
                    w: this.bgWidth,
                    h: this.bgWidth * this.origrinBgHeight / this.origrinBgWidth
                };
            }
            if (this.bgHeight) {
                return {
                    w: this.bgHeight * this.origrinBgWidth / this.origrinBgHeight,
                    h: this.bgHeight
                };
            }
            return {
                w: this.origrinBgWidth,
                h: this.origrinBgHeight
            }
        }
    },
    methods: {
        run() {
            this.isRun = true;
            this.$refs.matrix.run();
        },
        onImgLoad({ width, height }) {
            this.origrinImgWidth = width;
            this.origrinImgHeight = height;
        },
        onBgLoad({ width, height }) {
            this.origrinBgWidth = width;
            this.origrinBgHeight = height;
        }
    }
};
</script>

<style lang="less">
.hl-home {
    display: flex;
    align-items: flex-start;

    &__matrix {
        display: flex;
        align-items: flex-start;

        &--hide {
            position: absolute;
            opacity: 0;
            pointer-events: none;
        }
    }

    &__help {
        width: 400px;
        margin-top: 10px;
        margin-left: 10px;
        color: red;
    }

    &__result {
        width: 400px;
        margin-top: 10px;
        background: #2254f4;
        color: #fff;
        font-size: 16px;
        padding: 10px 15px;
        margin-left: 10px;
        line-height: 30px;
        border-radius: 4px;
    }

    &__inputs {
        width: 500px;
        margin-top: 10px;
        margin-left: 10px;
        >div {
            width: 100%;
            display: flex;
            align-items: center;
            margin-bottom: 10px;
            >div {
                width: 100px;
            }

            >input {
                width: 100%;
                margin-left: 10px;
                padding: 10px;
            }
        }

        button {
            margin-top: 20px;
            padding: 8px 35px;
            cursor: pointer;
        }
    }
}
</style>