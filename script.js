window.addEventListener("load", () => {

    const text = `"We always feel that space is out of our reach. Not anymore."`;
    const quote = document.getElementById("quote");

    let i = 0;

    function typeWriter() {
        if (i < text.length) {
            quote.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 35);
        }
    }

    typeWriter();

});