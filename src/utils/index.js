export function resetAtMidnight(fn) {
  let from = new Date();
  let to = new Date(
    from.getFullYear(),
    from.getMonth(),
    from.getDate() + 1,
    0,
    0,
    0
  );
  let msToEnd = to.getTime() - from.getTime();

  setTimeout(() => {
    fn();
    resetAtMidnight();
  }, msToEnd);
}
