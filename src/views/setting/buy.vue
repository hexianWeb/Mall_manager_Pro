<template>
  <div v-loading="loading" class="bg-white p-4 rounded">
    <el-form :model="form" label-width="160px">
      <el-tabs v-model="activeName">
        <el-tab-pane label="支付设置" name="first">
          <el-table :data="tableData" border stripe>
            <el-table-column label="支付方式" align="left">
              <template #default="{ row }">
                <div class="flex items-center">
                  <el-image
                    :src="row.src"
                    fit="fill"
                    :lazy="true"
                    style="width: 40px; height: 40px"
                    class="rounded mr-2"
                  ></el-image>
                  <div>
                    <h6>{{ row.name }}</h6>
                    <small class="flex text-gray-500 mt-1">{{ row.desc }}</small>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template #default="{ row }">
                <el-button type="primary" size="small" text @click="open(row.key)">配置</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="购物设置" name="second">
          <el-form-item label="未支付订单">
            <div>
              <el-input v-model="form.close_order_minute" placeholder="未支付订单" type="number">
                <template #append> 分钟后自动关闭 </template>
              </el-input>
              <small class="text-gray-500 flex mt-1"> 订单下单未付款，n分钟后自动关闭，设置0不自动关闭 </small>
            </div>
          </el-form-item>
          <el-form-item label="已发货订单">
            <div>
              <el-input v-model="form.auto_received_day" placeholder="已发货订单" type="number">
                <template #append> 天后自动确认收货 </template>
              </el-input>
              <small class="text-gray-500 flex mt-1"> 如果在期间未确认收货，系统自动完成收货，设置0不自动收货 </small>
            </div>
          </el-form-item>
          <el-form-item label="已完成订单">
            <div>
              <el-input v-model="form.after_sale_day" placeholder="已完成订单" type="number">
                <template #append> 天内允许申请售后 </template>
              </el-input>
              <small class="text-gray-500 flex mt-1">
                订单完成后 ，用户在n天内可以发起售后申请，设置0不允许申请售后
              </small>
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="default" @click="submit">保存</el-button>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>

    <FormDrawer ref="formDrawerRef" drawer-title="配置" @submit="submit">
      <!-- 阿里支付 -->
      <el-form v-if="drawerType == 'alipay'" :model="form" label-width="80px">
        <el-form-item label="app_id">
          <el-input v-model="form.alipay.app_id" placeholder="app_id" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="ali_public_key">
          <el-input
            v-model="form.alipay.ali_public_key"
            placeholder="ali_public_key"
            style="width: 90%"
            type="textarea"
            rows="4"
          ></el-input>
        </el-form-item>
        <el-form-item label="private_key">
          <el-input
            v-model="form.alipay.private_key"
            placeholder="private_key"
            style="width: 90%"
            type="textarea"
            rows="4"
          ></el-input>
        </el-form-item>
      </el-form>
      <!-- 微信支付 -->
      <el-form v-else :model="form" label-width="80px">
        <el-form-item label="公众号 APPID">
          <el-input v-model="form.wxpay.app_id" placeholder="app_id" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="小程序 APPID">
          <el-input v-model="form.wxpay.miniapp_id" placeholder="miniapp_id" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="小程序 secret">
          <el-input v-model="form.wxpay.secret" placeholder="secret" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="appid">
          <el-input v-model="form.wxpay.appid" placeholder="appid" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="商户号">
          <el-input v-model="form.wxpay.mch_id" placeholder="商户号" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="API 密钥">
          <el-input v-model="form.wxpay.key" placeholder="API 密钥" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="cert_client">
          <el-upload
            :action="uploadAction"
            :headers="{
              token
            }"
            accept=".pem"
            :limit="1"
            :on-success="uploadClientSuccess"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <p class="text-red-500">
                {{ form.wxpay.cert_client ? form.wxpay.cert_client : '还未配置' }}
              </p>
              <div class="el-upload__tip">例如：apiclient_cert.pem</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="cert_key">
          <el-upload
            :action="uploadAction"
            :headers="{
              token
            }"
            accept=".pem"
            :limit="1"
            :on-success="uploadKeySuccess"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <p class="text-red-500">
                {{ form.wxpay.cert_key ? form.wxpay.cert_key : '还未配置' }}
              </p>
              <div class="el-upload__tip">例如：apiclient_key.pem</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
    </FormDrawer>
  </div>
</template>
<script setup lang="ts">
import type { UploadFile, UploadFiles } from 'element-plus';
import type { Alipay, Wxpay } from '@/api/sysconfig/type';
import { getSysconfig, setSysconfig, uploadAction } from '@/api/sysconfig/index';
import FormDrawer from '@/base-ui/formDrawer/FormDrawer.vue';
import { useUserStore } from '@/stores/modules/login';

interface Form {
  close_order_minute: number;
  auto_received_day: number;
  after_sale_day: number;
  alipay: Alipay;
  wxpay: Wxpay;
}

const userStore = useUserStore();
const token = userStore.getToken;
const activeName = ref('first');
const tableData = [
  {
    name: '支付宝支付',
    desc: '该系统支持即时到账接口',
    src: '/alipay.png',
    key: 'alipay'
  },
  {
    name: '微信支付',
    desc: '该系统支持微信网页支付和扫码支付',
    src: '/wepay.png',
    key: 'wxpay'
  }
];

const form = reactive<Form>({
  close_order_minute: 30,
  auto_received_day: 7,
  after_sale_day: 23,
  alipay: {
    app_id: '****已配置****',
    ali_public_key: '****已配置****',
    private_key: '****已配置****'
  },
  wxpay: {
    app_id: '****已配置****',
    miniapp_id: '****已配置****',
    secret: '****已配置****',
    appid: '****已配置****',
    mch_id: '****已配置****',
    key: '****已配置****',
    cert_client: '****已配置****.pem',
    cert_key: '****已配置****.pem'
  }
});

const loading = ref(false);

async function getData() {
  loading.value = true;
  try {
    const res = await getSysconfig(); // Assuming getSysconfig() is an asynchronous function
    Object.assign(form, res); // Assign properties from res to form
  } catch (error) {
    console.error('Error fetching data:', error);
  } finally {
    loading.value = false;
  }
}

getData();

const submit = () => {
  loading.value = true;
  setSysconfig({
    ...form
  })
    .then(() => {
      ElMessage({
        message: '修改成功',
        type: 'success'
      });
      getData();
    })
    .catch(() => {
      ElNotification({
        title: 'Error',
        message: '权限不足！禁止操作',
        type: 'error'
      });
    })
    .finally(() => {
      loading.value = false;
    });
};

const drawerType = ref('alipay');
const formDrawerRef = ref<typeof FormDrawer>();
const open = (key: string) => {
  drawerType.value = key;
  formDrawerRef.value!.open();
};

function uploadClientSuccess(response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) {
  form.wxpay.cert_client = response.data;
}

function uploadKeySuccess(response: any, uploadFile: UploadFile, uploadFiles: UploadFiles) {
  form.wxpay.cert_key = response.data;
}
</script>
