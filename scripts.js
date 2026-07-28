// FETCHING:
function getElements(link) {
    // Fetch quotes informations from `smileschool-api`.
    return $.get(link)
        .fail(function(error) {
            console.error(error);
            alert("Server Error");
        });
}

// LOADING:
function setLoading(loading) {
    // Set a loading spinner while fetching content.
    $(".loader").toggle(loading);
    $(".carousel-inner").toggle(!loading);
}

// CAROUSEL:
function createCarousel(name) {
    // Create a carousel.
    const $carousel = $(`#${name}-carousel`);
    const $track = $carousel.find(".track");

    const carousel = {
        name: name,
        currentSlide: 0,
        maxSlide: 0,
        $track,

        move(direction) {
            const cardWidth = $carousel.find(".carousel-card").outerWidth(true);

            // Check if there is a previous/next card to move to.
            if ((direction > 0 && this.currentSlide < this.maxSlide) ||
                (direction < 0 && this.currentSlide > 0)
            ) {
                this.currentSlide += direction;
            }

            $track.css("transform", `translateX(-${this.currentSlide * cardWidth}px)`);
        }
    };

    // Add sliders behavior
    $carousel.find(".carousel-arrow-right").on("click", () => carousel.move(1));
    $carousel.find(".carousel-arrow-left").on("click", () => carousel.move(-1));

    return carousel;
}

// QUOTES:
function buildQuoteElement(quote) {
    // Building each quote element.
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

    return $element;
}

async function loadQuotes() {
    // Build quotes section with fetched quotes.
    let $carousel = $(".quotes .carousel-inner");

    setLoading(true);

    let response = await getElements("https://smileschool-api.hbtn.info/quotes");

    response.forEach(quote => {
        let $element = buildQuoteElement(quote);
        $carousel.append($element);
    });

    setLoading(false);
}

// POPULAR TUTORIALS:
function buildTutorialElement(tutorial) {
    // Build tutorial rating.
    const $rating = $("<div>", { class: "rating" });

    for (let i = 0 ; i < 5 ; i++) {
        $rating.append($("<img>", {
            src: i < tutorial.star ? "images/star_on.png" : "images/star_off.png",
            alt: i < tutorial.star ? "star on" : "star off"
        }));
    }

    // Build whole tutorial element.
    const $col = $("<div>", {class: "carousel-card"})
        .append($("<div>", {class: "card"})
            .append($("<img>", {
                src: tutorial.thumb_url,
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
            .append($("<h5>", {class: "card-title font-weight-bold"}).text(tutorial.title))
            .append($("<p>", {class: "card-text text-muted"}).text(tutorial["sub-title"]))
            .append($("<div>", {class: "creator d-flex align-items-center"})
                .append($("<img>", {
                    src: tutorial.author_pic_url,
                    alt: "Creator of tutorial",
                    width: "30px",
                    class: "rounded-circle"
                })).append($("<h6>", {class: "pl-3 m-0 main-color"}).text(tutorial.author))
            ).append($("<div>", {class: "info pt-3 d-flex justify-content-between"})
                .append($rating)
                .append($("<span>", {class: "main-color"}).text(tutorial.duration))
            )
        )
    );

    return $col;
}

async function loadTutorials() {
    // Build tutorials section with fetched videos.
    const name = "tutorials"
    const $carousel = $(`#${name}-carousel`);

    setLoading(true);

    let response = await getElements("https://smileschool-api.hbtn.info/popular-tutorials");

    const $item = $("<div>", {class: "viewport overflow-hidden"});
    const $row = $("<div>", {class: "track d-flex flex-nowrap"});

    response.forEach(tutorial => {
        let $col = buildTutorialElement(tutorial);

        $row.append($col);
    });

    $item.append($row);
    $carousel.append($item);

    const carousel = createCarousel(name);
    carousel.maxSlide = $carousel.find(".carousel-card").length - 4;

    setLoading(false);
}

// LATEST VIDEOS:
function buildVideoElement(video) {
    // Build video rating.
    const $rating = $("<div>", { class: "rating" });

    for (let i = 0 ; i < 5 ; i++) {
        $rating.append($("<img>", {
            src: i < video.star ? "images/star_on.png" : "images/star_off.png",
            alt: i < video.star ? "star on" : "star off"
        }));
    }

    // Build whole video element.
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

    return $col;
}

async function loadVideos() {
    // Build videos section with fetched videos.
    const name = "videos"
    const $carousel = $(`#${name}-carousel`);

    setLoading(true);

    let response = await getElements("https://smileschool-api.hbtn.info/latest-videos");

    const $item = $("<div>", {class: "viewport overflow-hidden"});
    const $row = $("<div>", {class: "track d-flex flex-nowrap"});

    response.forEach(video => {
        let $col = buildVideoElement(video);

        $row.append($col);
    });

    $item.append($row);
    $carousel.append($item);

    const carousel = createCarousel(name);
    carousel.maxSlide = $carousel.find(".carousel-card").length - 4;

    setLoading(false);
}

$(document).ready(function() {
    $("<div>", {class: "loader"}).insertBefore(".carousel-inner");

    setTimeout(() => { loadQuotes(); }, 500);
    setTimeout(() => { loadTutorials(); }, 500);
    setTimeout(() => { loadVideos(); }, 500);
});
