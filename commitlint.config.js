// 如果是使用cz-customizable适配器做了破坏Angular风格的提交说明配置，
// 那么不能使用**@commitlint/config-conventional**规则进行提交说明校验，
// 可以使用commitlint-config-cz对定制化提交说明进行校验。

// module.exports = { extends: ['@commitlint/config-conventional'] };

module.exports = {
  extends: ['cz']
};
