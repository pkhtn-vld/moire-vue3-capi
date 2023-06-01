export default function setInputFormat(inputClass, inputLength) {
  document.querySelectorAll(inputClass).forEach((el) => {
    // eslint-disable-next-line no-param-reassign, func-names
    el.onkeydown = function (e) {
      // eslint-disable-next-line no-param-reassign
      if (el.value.length > inputLength) el.value = el.value.substr(0, inputLength);
      return !/^[А-Яа-я\s=!"№;%:?*,_'\\|\-{}[\]()<>/+@#$%^&.`~A-Za-z]$/.test(e.key);
    };
  });
}
