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


export function validateParams(params, objectSchema){
  const errors = [];

  for(let key in objectSchema){
    if(!params[key]){
      errors.push({message: `O parâmetro ${key} é obrigatório!`})
    }
  }
  return errors.length > 0 ? errors : null
}


