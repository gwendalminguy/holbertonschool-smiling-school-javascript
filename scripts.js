function getQuotes() {
    return $.get("https://smileschool-api.hbtn.info/quotes")
        .fail(function(error) {
            console.error(error);
            alert("Server Error");
        });
}

async function loadQuotes() {
    let $carousel = $(".carousel-inner");

    setLoading(true);

    let response = await getQuotes();

    response.forEach(quote => {
        console.log(quote);

        // Building each quote element
        const $element = $("<div>", {class: `carousel-item ${quote.id === 1 ? "active" : ""}`}) // Setting first item to 'active'
            .append($("<div>", {class: "row mx-auto align-items-center"})
                .append($("<div>", {class: "col-12 col-sm-2 col-lg-2 offset-lg-1 text-center"})
                    .append($("<img>", {
                        src: quote.pic_url,
                        class: "d-block align-self-center",
                        alt: `Carousel Pic ${quote.id}`
                    }))
                ).append($("<div>", {class: "col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0"})
                    .append($("<div>", {class: "quote-text"})
                        .append($("<p>", {class: "text-white"})
                            .text(quote.text))
                        .append($("<h4>", {class: "text-white font-weight-bold"})
                            .text("Person Name"))
                        .append($("<span>", {class: "text-white"})
                            .text(quote.name)))
                )
            );

        $carousel.append($element);
    });

    setLoading(false);
}

function setLoading(loading) {
    $(".loader").toggle(loading);
    $(".carousel-inner").toggle(!loading);
}

$(document).ready(function() {
    $("<div>", {class: "loader"}).insertBefore(".carousel-inner");
    setTimeout(() => { loadQuotes(); }, 500); // Adding a delay to actually see the loading spinner
});
