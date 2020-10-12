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
                <div>图片宽</div>
                <input v-model="imgWidth" placeholder="图片宽(不填使用原图宽)"/>
            </div>
            <div>
                <div>图片高</div>
                <input v-model="imgHeight" placeholder="图片高(不填使用原图高)"/>
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
                :imgWidth="imgWidth"
                :imgHeight="imgHeight"
                :bgWidth="bgWidth"
                :bgHeight="bgHeight"
                @update="m => matrix = m"
                :style="{
                    width: '300px'
                }"/>
            <div :class="bem('result')">
                <div>
                    采集结果图片样式：<br>
                    {{ `transform: matrix3d(${matrix});`}}<br>
                    transform-origin: 0 0;
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
            imgWidth: '',
            imgHeight: '',
            bgWidth: '',
            bgHeight: '',
            matrix: 0,
            isRun: false
        };
    },
    methods: {
        run() {
            this.isRun = true;
            this.$refs.matrix.run();
        },
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

    &__result {
        width: 400px;
        margin-top: 10px;
        background: #2254f4;
        color: #fff;
        font-size: 16px;
        padding: 10px 15px;
        margin-left: 10px;
        line-height: 30px;
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