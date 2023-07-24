export function confirmPopover(tip: string, content: string, value: string) {
  return ElMessageBox.prompt(content, tip, {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    inputValue: value
  });
}
