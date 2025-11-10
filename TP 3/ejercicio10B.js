
function allSettledLite(promises) {
  return Promise.all(promises.map(p => 
    p.then(
      value => ({ status:'fulfilled', value }),
      reason => ({ status:'rejected', reason })
    )
  ));
}

const ok = () => Promise.resolve(42);
const fail = () => Promise.reject("error");
allSettledLite([ok(), fail()]).then(console.log);

