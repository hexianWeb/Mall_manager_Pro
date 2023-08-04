<template>
  <div>
    <editor v-model="editorContent" :init="init" :disabled="disabled" :id="tinymceId" ref="editorRef"></editor>
    <ChooseImage :preview="false" ref="ChooseImageRef" :limit="1" v-model="selectedImage" />
  </div>
</template>

<script setup lang="ts">
import Editor from '@tinymce/tinymce-vue';
//引入tinymce开启本地模式
import tinymce from 'tinymce/tinymce';
// 使用模块加载捆绑 TinyMCE 模型
import 'tinymce/models/dom';
//在js中引入所需的主题和组件
import 'tinymce/skins/content/default/content.css';
import 'tinymce/themes/silver';
import 'tinymce/themes/silver/theme';
import 'tinymce/icons/default'; //引入编辑器图标icon，不引入则不显示对应图标

//在TinyMce.vue中接着引入相关插件
import 'tinymce/icons/default/icons'; //自定义icon  操作图标
import 'tinymce/plugins/image'; // 插入上传图片插件
import 'tinymce/plugins/media'; // 插入视频插件
import 'tinymce/plugins/table'; // 插入表格插件
import 'tinymce/plugins/lists'; // 列表插件
import 'tinymce/plugins/link';
import 'tinymce/plugins/wordcount'; // 字数统计插件
import 'tinymce/plugins/code'; // 源码
import 'tinymce/plugins/fullscreen'; //全屏
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/preview';
import ChooseImage from '@cp/chooseImage/src/index.vue';

const ChooseImageRef = ref<typeof ChooseImage>();
const selectedImage = ref<string>('');
const emit = defineEmits(['update:modelValue']);
//这里我选择将数据定义在props里面，方便在不同的页面也可以配置出不同的编辑器，当然也可以直接在组件中直接定义
const props = defineProps({
  modelValue: {
    type: String,
    default: () => {
      return '';
    }
  },
  baseUrl: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  plugins: {
    type: [String, Array],
    default: 'link lists code table wordcount preview fullscreen media searchreplace '
  }, //必填
  toolbar: {
    type: [String, Array],
    default:
      'undo redo  | bold italic underline | fontselect fontsizeselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | bdmap indent2em lineheight formatpainter axupimgs  imageUpload | media| searchreplace  | bullist numlist | '
  }
});
//用于接收外部传递进来的富文本
const editorRef = ref(null);
const editorContent = ref(props.modelValue);
const tinymceId = ref('vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + ''));
//定义一个对象 init初始化
const init = reactive({
  selector: '#' + tinymceId.value, //富文本编辑器的id,
  language_url: '/tinymce/zh-Hans/langs/zh-Hans.js',
  language: 'zh-Hans',
  skin_url: '/tinymce/skins/ui/oxide',
  height: 700, //编辑器高度
  branding: false, //是否禁用“Powered by TinyMCE”
  menubar: true, //顶部菜单栏显示
  image_dimensions: true, //去除宽高属性
  plugins: props.plugins, //这里的数据是在props里面就定义好了的
  toolbar: props.toolbar, //这里的数据是在props里面就定义好了的
  toolbar_mode: 'sliding',
  font_formats: 'Arial=arial,helvetica,sans-serif; 宋体=SimSun; 微软雅黑=Microsoft Yahei; Impact=impact,chicago;', //字体
  fontsize_formats: '11px 12px 14px 16px 18px 24px 30px 36px 48px 64px 72px', //文字大小
  // paste_convert_word_fake_lists: false, // 插入word文档需要该属性
  paste_webkit_styles: 'all',
  paste_merge_formats: true,
  nonbreaking_force_tab: false,
  paste_auto_cleanup_on_paste: false,
  file_picker_types: 'media',
  setup: function (editor: any) {
    editor.ui.registry.addIcon(
      'image',
      `<svg t="1664002320321" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4420" width="24" height="24"><path d="M125.9 185h772.2v653.9H125.9z" fill="#1F53CC" p-id="4421"></path><path d="M164.7 217.2h694.6v516.7H164.7z" fill="#FECD44" p-id="4422"></path><path d="M458.9 734l-8.6-43.8-101.5-102.8-135 146.6z" fill="#FC355D" p-id="4423"></path><path d="M306.9 348.7m-66.7 0a66.7 66.7 0 1 0 133.4 0 66.7 66.7 0 1 0-133.4 0Z" fill="#FFFFFF" p-id="4424"></path><path d="M384.6 734h474.7V608.8L687.8 400.1z" fill="#FC355D" p-id="4425"></path><path d="M422.5 662l-37.9 72 52.1-57.5z" fill="#BF2847" p-id="4426"></path><path d="M302.5 778.9h418.9v16.7H302.5z" fill="#00F0D4" p-id="4427"></path></svg>`
    );
    editor.ui.registry.addButton('imageUpload', {
      tooltip: '插入图片',
      icon: 'image',
      onAction() {
        ChooseImageRef.value?.open(() => {
          editor.insertContent(`<img src="${selectedImage.value}" style="width:100%;"/>`);
          selectedImage.value = '';
        });
      }
    });
  },
  content_css: '/tinymce/skins/content/default/content.css', //以css文件方式自定义可编辑区域的css样式，css文件需自己创建并引入
  // 文件上传  需要的话添加
  // 上传视频
  file_picker_callback: (callback: any, value: any, meta: any) => {
    if (meta.filetype == 'media') {
      // callback('movie.mp4', { source2: 'alt.ogg', poster: 'image.jpg' });
      let input = document.createElement('input');
      input.setAttribute('type', 'file');
      input.setAttribute('accept', '.mp3, .mp4');
      input.click();
      input.onchange = function (v: any) {
        // console.log(v.target.files[0]); //视频文件信息   上传即可    规定视频格式大小需重写逻辑  获取视频时长
      };
    }
  }
});
//监听富文本中的数据变化
watch(
  () => editorContent.value,
  () => {
    emit('update:modelValue', editorContent.value);
  }
);

//在onMounted中初始化编辑器
onMounted(() => {
  tinymce.init({});
});
</script>
<style>
.tox-tinymce {
  width: 100%;
  touch-action: none !important;
}
</style>
