
function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Timeout")), ms);

    promise.then(
      val => { clearTimeout(timer); resolve(val); },
      err => { clearTimeout(timer); reject(err); }
    );
  });
}

const ok = new Promise(res => setTimeout(() => res("ok!"), 500));
withTimeout(ok, 1000).then(console.log).catch(console.error);

const slow = new Promise(res => setTimeout(() => res("lento!"), 2000));
withTimeout(slow, 1000).then(console.log).catch(console.error);