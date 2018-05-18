export default function autoBlur(container = window) {
  function onKeyPress(event) {
    const keyCode = event.which || event.keyCode;
    if (keyCode === 13 && event.target.matches("input, select")) {
      const form = event.target.form;
      if (form) {
        const inputs = Array.from(
          form.querySelectorAll(
            "input:not([readonly]), select:not([readonly]), textarea:not([readonly])"
          )
        );
        const index = inputs.indexOf(document.activeElement) + 1;
        const input = inputs[index];
        if (input) {
          input.focus();
          input.select();
        } else {
          document.activeElement.blur();
        }
      } else {
        document.activeElement.blur();
      }
    }
  }
  container.addEventListener("keypress", onKeyPress);
  return () => container.removeEventListener("keypress", onKeyPress);
}
