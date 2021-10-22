var save = document.getElementsByClassName("save");
var trash = document.getElementsByClassName("far fa-trash-alt");

Array.from(save).forEach(function (element) {
  element.addEventListener("click", function () {
    const name = this.parentNode.querySelector(".produceName").innerText;
    const season = this.parentNode.childNodes[3].innerText;

    fetch("save", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        season: season,
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((data) => {
        console.log(data);
        window.location.reload(true);
      });
  });
});

Array.from(trash).forEach(function (element) {
  element.addEventListener("click", function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText;
    const season = this.parentNode.parentNode.childNodes[3].innerText;
    fetch("delete", {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        season: season,
      }),
    }).then(function (response) {
      window.location.reload();
    });
  });
});
