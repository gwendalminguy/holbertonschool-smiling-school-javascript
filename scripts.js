// GLOBAL VARIABLES (CAROUSEL)
let currentSlide = 0;
let maxSlide = 0;

// QUOTES
function getQuotes() {
    // Fetch quotes informations from `smileschool-api`.
    return $.get("https://smileschool-api.hbtn.info/quotes")
        .fail(function(error) {
            console.error(error);
            alert("Server Error");
        });
}

async function loadQuotes() {
    // Build quotes section with fetched quotes.
    let $carousel = $(".quotes .carousel-inner");

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

// VIDEOS
function getVideos() {
    // Fetch videos informations from `smileschool-api`.
    return $.get("https://smileschool-api.hbtn.info/popular-tutorials")
        .fail(function(error) {
            console.error(error);
            alert("Server Error");
        });
}

async function loadVideos() {
    // Build videos section with fetched videos.
    let $carousel = $(".popular .carousel-inner");

    setLoading(true);

    let response = await getVideos();

    const $item = $("<div>", {class: "viewport overflow-hidden"});
    const $row = $("<div>", {class: "track d-flex flex-nowrap"});

    response.forEach(video => {
        console.log(video);

        // Building video rating
        const $rating = $("<div>", { class: "rating" });

        for (let i = 0 ; i < 5 ; i++) {
            $rating.append($("<img>", {
                src: i < video.star ? "images/star_on.png" : "images/star_off.png",
                alt: i < video.star ? "star on" : "star off"
            }));
        }

        // Building whole video element
        const $col = $("<div>", {class: "carousel-card"})
            .append($("<div>", {class: "card"})
                .append($("<img>", {
                    src: video.thumb_url,
                    class: "card-img-top",
                    alt: "Video thumbnail"
                })).append($("<div>", {class: "card-img-overlay text-center"})
                .append($("<img>", {
                    src: "images/play.png",
                    alt: "Play",
                    width: "64px",
                    class: "align-self-center play-overlay"
                }))
            ).append($("<div>", {class: "card-body"})
                .append($("<h5>", {class: "card-title font-weight-bold"}).text(video.title))
                .append($("<p>", {class: "card-text text-muted"}).text(video["sub-title"]))
                .append($("<div>", {class: "creator d-flex align-items-center"})
                    .append($("<img>", {
                        src: video.author_pic_url,
                        alt: "Creator of video",
                        width: "30px",
                        class: "rounded-circle"
                    })).append($("<h6>", {class: "pl-3 m-0 main-color"}).text(video.author))
                ).append($("<div>", {class: "info pt-3 d-flex justify-content-between"})
                    .append($rating)
                    .append($("<span>", {class: "main-color"}).text(video.duration))
                )
            )
        );

        $row.append($col);
    });

    $item.append($row);
    $carousel.append($item);

    maxSlide = $(".carousel-card").length - 4;

    setLoading(false);
}

// CAROUSEL (VIDEOS)
function addCarouselControl() {
    // Add behavior to the slider buttons
    // of the carousel (left/right arrows).
    $(".popular .arrow-right").on("click", function () {
        moveCarousel(1);
    });

    $(".popular .arrow-left").on("click", function () {
        moveCarousel(-1);
    });
}

function moveCarousel(direction) {
    // Move carousel cards to the right/left
    // according to the sign of `direction`.
    const cardWidth = $(".carousel-card").outerWidth(true);

    const $track = $(".track");

    if ((direction > 0 && currentSlide < maxSlide) || (direction < 0 && currentSlide > 0)) {
        currentSlide += direction;
    }

    $track.css(
        "transform",
        `translateX(-${currentSlide * cardWidth}px)`
    );
}

// LOADING
function setLoading(loading) {
    // Set a loading spinner while fetching content.
    $(".loader").toggle(loading);
    $(".carousel-inner").toggle(!loading);
}

$(document).ready(function() {
    $("<div>", {class: "loader"}).insertBefore(".carousel-inner");

    setTimeout(() => { loadQuotes(); }, 500);
    setTimeout(() => { loadVideos(); }, 500);

    addCarouselControl();
});
