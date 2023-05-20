const container = document.getElementById("container")
setInterval(() => {
    if (container.innerText === "Hello") {
        container.innerText = "Hello!!!"
        return
    }

    container.innerText = "Hello"
}, 500)