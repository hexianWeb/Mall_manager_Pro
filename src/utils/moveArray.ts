export function moveElement<T>(arr: T[], fromIndex: number, toIndex: number): T[] {
  const newArr = [...arr];
  const [element] = newArr.splice(fromIndex, 1);
  newArr.splice(toIndex, 0, element);
  return newArr;
}

// 上移
export function useArrayMoveUp<T>(arr: T[], index: number): T[] {
  return moveElement(arr, index, index - 1);
}

// 下移
export function useArrayMoveDown<T>(arr: T[], index: number): T[] {
  return moveElement(arr, index, index + 1);
}

// sku排列算法 计算笛卡尔积
export function cartesianProductOf(...args: any[][]) {
  return args.reduce(
    function (a, b) {
      var ret: any = [];
      a.forEach(function (a) {
        b.forEach(function (b) {
          ret.push(a.concat([b]));
        });
      });
      return ret;
    },
    [[]]
  );
}
