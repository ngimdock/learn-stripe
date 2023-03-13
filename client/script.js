const checkoutBtn = document.querySelector("#checkout-btn");

const serverUrl = "http://localhost:3000";

checkoutBtn.addEventListener("click", () => {
  fetch(`${serverUrl}/create-checkout-session`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        { id: "1", quantity: 3 },
        { id: "2", quantity: 1 },
      ],
    }),
  })
    .then((res) => {
      if (res.ok) return res.json();
      res.json().then((json) => Promise.reject(json));
    })
    .then(({ url }) => {
      console.log({ url });
      window.location = url;
    })
    .catch((err) => {
      console.log(err);
    });
});
