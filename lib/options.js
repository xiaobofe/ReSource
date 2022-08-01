const bg = chrome.extension.getBackgroundPage();
console.log(JSON.parse(bg.localStorage.ReSourceCache || '[]').filter(Boolean));

new Vue({
  el: '#app',
  data: {
    settingJson: JSON.parse(bg.localStorage.ReSourceCache || '[]').filter(Boolean),
    dialogVisible: false,
    dialogVisibleForCard: false,
    dialogData: {},
    newCardData: {}
  },
  mounted: function () {
    this.handleSelectedOptions();
  },
  methods: {
    handleSelectedOptions() {
      this.excuteFlag = true;
      this.settingJson.forEach((item, i) => {
        item && item.options.forEach(option => {
          if (option.checked && this.$refs.multipleTable[i]) {
            this.$refs.multipleTable[i].toggleRowSelection(option);
          }
        })
      })
      this.excuteFlag = false;
    },
    handleCommand(index, [command]) {
      switch (command) {
        case 'create':
          this.handleAddClick(index);
          break;
        case 'delete':
          this.$delete(this.settingJson, index);
          bg.localStorage.ReSourceCache = JSON.stringify(this.settingJson);
          bg.updateLocalStorage();
          break;
      }
    },
    handleClose() {
      this.dialogData = {};
      this.dialogVisible = false;
    },
    handleDialogOk() {
      if (typeof this.currentIndex === "number") {
        if (typeof this.currentEditOption === "number") {
          this.settingJson[this.currentIndex].options[this.currentEditOption] = this.dialogData;
          this.currentEditOption = undefined;
        } else {
          this.settingJson[this.currentIndex].options.push({
            origin: this.dialogData.origin,
            target: this.dialogData.target
          });
        }
        this.dialogData = {};
        this.dialogVisible = false;
        bg.localStorage.ReSourceCache = JSON.stringify(this.settingJson);
        bg.updateLocalStorage();
      }
    },
    handleEditClick(scope, index) {
      this.dialogData = scope.row;
      this.dialogVisible = true;
      this.currentEditOption = scope.$index;
      this.currentIndex = index;
    },
    handleAddClick(index) {
      this.dialogVisible = true;
      this.currentIndex = index;
    },
    handleDeleteClick(scope, index) {
      this.$delete(this.settingJson[index].options, scope.$index)
    },
    handleCloseForCard() {
      this.newCardData = {};
      this.dialogVisibleForCard = false;
    },
    handleDialogOkForCard() {
      this.settingJson.push({
        name: this.newCardData.name,
        options: [],
      })
      this.dialogVisibleForCard = false;
      this.newCardData = {};
      bg.localStorage.ReSourceCache = JSON.stringify(this.settingJson);
      bg.updateLocalStorage();
    },
    handleSelectionChange(index, [selectOptions]) {
      if (this.excuteFlag) {
        return;
      }
      if (this.settingJson[index]) {
        this.settingJson[index].options.forEach((option, indexC) => {
          const indexO = selectOptions.findIndex(item => item.origin === option.origin && item.target === option.target)
          if (indexO > -1) {
            this.settingJson[index].options[indexC].checked = true;
          } else {
            this.settingJson[index].options[indexC].checked = false;
          }
        })
      }
      bg.localStorage.ReSourceCache = JSON.stringify(this.settingJson);
      bg.updateLocalStorage();
    }
  }
})