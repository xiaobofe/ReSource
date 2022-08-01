const bg = chrome.extension.getBackgroundPage();
const settingJson = JSON.parse(bg.localStorage.ReSourceCache || '[]').filter(Boolean);
new Vue({
  el: '#popup',
  data: {
    settingJson: settingJson,
    activeNames: settingJson.map(item => item.name),
    show: Boolean(settingJson.length)
  },
  mounted: function() {
    for (let item of this.settingJson) {
      if (item.options && item.options.length) {
        this.show = true;
        break;
      }
      this.show = false;
    }
  },
  methods: {
    handleSelectionChange(index, indexOption, [checked]) {
      if (this.settingJson[index]) {
        this.settingJson[index].options[indexOption].checked = checked;
      }
      bg.localStorage.ReSourceCache = JSON.stringify(this.settingJson);
      bg.updateLocalStorage();
    }
  }
})