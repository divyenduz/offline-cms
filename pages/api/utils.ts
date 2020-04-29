export const not = (predicateFunc) => {
  return function () {
    return !predicateFunc.apply(this, arguments)
  }
}

export const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x)
