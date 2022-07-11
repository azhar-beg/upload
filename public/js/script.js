const serveFile = (event) => {
  // const xhr = new XMLHttpRequest();
  // xhr.open('POST', '/add-comment');
  // xhr.onload = () => {
  //   generateHtml(xhr);
  // };
  const form = document.querySelector('form')
  const formData = new FormData(form);
  console.log(formData);
  // xhr.send(new URLSearchParams(formData).toString());
};

const main = () => {
  const button = document.querySelector('#submit');
  button.addEventListener('click', (event) => {
    serveFile(event);
  });
};

window.onload = main;
