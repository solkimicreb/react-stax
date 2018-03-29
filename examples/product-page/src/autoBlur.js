export default function autoBlur() {
  function onKeyPress(ev) {
    const keyCode = ev.which || ev.keyCode;
    console.log('event', ev.keyCode);
    if (keyCode === 13) {
      ev.preventDefault();
      const tabEvent = new KeyboardEvent('keypress', {
        keyCode: 9,
        which: 9,
        key: 'Tab',
        code: 'Tab'
      });
      console.log('tab', ev.target);
      console.log(ev.target.dispatchEvent(tabEvent));
      // ev.target.blur();
    }
  }
  window.addEventListener('keypress', onKeyPress);
  return () => window.removeEventListener('keypress', onKeyPress);
}

class Form {
  onChange = () => {};
}

<Form onSubmit={onSubmit} values={{ name: 'Bob', age: 21 }}>
  <input name="name" />
  <checkbox>
</Form>;
