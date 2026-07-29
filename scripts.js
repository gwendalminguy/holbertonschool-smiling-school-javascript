// API BASE:
const BASE_API = "https://smileschool-api.hbtn.info"

// FILTERS STATE:
let filters = {
    q: "",
    topic: "",
    sort: ""
}

async function loadFilters() {
    // Retrieve and load `sorts` and `topics` values from `smileschool-api`.
    const response = await getElements(`${BASE_API}/courses`);

    const $topics = $("#topic-options");
    const $sorts = $("#sort-options");
    const $search = $("#search-field");

    // Set `topics` values.
    response.topics.forEach(topic => {
        $topics.append($("<a>", {
            class: "dropdown-item",
            href: "#",
            "data-value": topic
        }).text(titleCase(topic)));
    });

    // Set `sorts` values.
    response.sorts.forEach(sort => {
        $sorts.append($("<a>", {
            class: "dropdown-item",
            href: "#",
            "data-value": sort
        }).text(titleCase(sort)));
    });

    // Set listeners to update state `filters` and call API.
    $search.on("keydown", function (e) {
        // I chose to wait for 'enter' to send the request (instead of a debounce),
        // because we're fetching actual results, not suggestions in a dropdown.
        if (e.key === "Enter") {
            filters.q = this.value;
            loadCourses();
        }
    });

    $topics.on("click", ".dropdown-item", function (e) {
        e.preventDefault();

        $("#current-topic").text(titleCase($(this).data("value")));
        filters.topic = $(this).data("value");
        loadCourses();
    });

    $sorts.on("click", ".dropdown-item", function (e) {
        e.preventDefault();

        $("#current-sort").text(titleCase($(this).data("value")));
        filters.sort = $(this).data("value");
        loadCourses();
    });
}

// FETCHING:
function getElements(link, params = {}) {
    // Fetch elements from `smileschool-api`.
    return $.get(link, params)
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

// TITLE FORMATTING:
function titleCase(text) {
    // Transform values to readable text ("most_recent" -> "Most Recent").
    return text
        .replaceAll("_", " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());
}

// STAR RATING:
function buildRating(item) {
    // Build and return item rating with stars.
    const $rating = $("<div>", { class: "rating" });

    for (let i = 0; i < 5; i++) {
        $rating.append($("<img>", {
            src: i < item.star ? "images/star_on.png" : "images/star_off.png",
            alt: i < item.star ? "star on" : "star off"
        }));
    }

    return $rating;
}

// CAROUSEL:
function getVisibleCards() {
    // Find out how many cards to display to make carousel responsive.
    const width = window.innerWidth;

    if (width < 576) {
        return 1;
    }

    if (width < 992) {
        return 2;
    }

    return 4;
}

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

    // Add sliders behavior.
    $carousel.find(".carousel-arrow-right").on("click", () => carousel.move(1));
    $carousel.find(".carousel-arrow-left").on("click", () => carousel.move(-1));

    return carousel;
}

async function loadCarousel(name, url) {
    // Load carousel with fetched elements.
    const $carousel = $(`#${name}-carousel`);

    setLoading(true);

    let response = await getElements(url);

    const $item = $("<div>", {class: "viewport overflow-hidden"});
    const $row = $("<div>", {class: "track d-flex flex-nowrap"});

    response.forEach(element => {
        let $col = buildCard(element);

        $row.append($col);
    });

    $item.append($row);
    $carousel.append($item);

    const carousel = createCarousel(name);
    carousel.maxSlide = $carousel.find(".carousel-card").length - getVisibleCards();

    setLoading(false);
}

// BUILDERS:
function buildQuote(quote) {
    // Build each quote.
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

function buildCard(item) {
    // Build item rating.
    const $rating = buildRating(item);

    // Build whole item.
    const $col = $("<div>", {class: "carousel-card"})
        .append($("<div>", {class: "card border"})
            .append($("<img>", {
                src: item.thumb_url,
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
            .append($("<h5>", {class: "card-title font-weight-bold"}).text(item.title))
            .append($("<p>", {class: "card-text text-muted"}).text(item["sub-title"]))
            .append($("<div>", {class: "creator d-flex align-items-center"})
                .append($("<img>", {
                    src: item.author_pic_url,
                    alt: "Creator of content",
                    width: "30px",
                    class: "rounded-circle"
                })).append($("<h6>", {class: "pl-3 m-0 main-color"}).text(item.author))
            ).append($("<div>", {class: "info pt-3 d-flex justify-content-between"})
                .append($rating)
                .append($("<span>", {class: "main-color"}).text(item.duration))
            )
        )
    );

    return $col;
}

// QUOTES:
async function loadQuotes() {
    // Build quotes section with fetched quotes.
    let $carousel = $(".quotes .carousel-inner");

    setLoading(true);

    let response = await getElements(`${BASE_API}/quotes`);

    response.forEach(quote => {
        let $element = buildQuote(quote);
        $carousel.append($element);
    });

    setLoading(false);
}

// COURSES:
async function loadCourses() {
    // Build courses section with fetched courses.
    setLoading(true);

    // Remove all content from results section.
    const $row = $(".results .row");
    $row.empty();

    let response = await getElements(`${BASE_API}/courses`, filters);

    response.courses.forEach(course => {
        let $col = buildCard(course);

        $row.append($col);
    });

    // Update results counter.
    let $counter = $(".video-count");
    $counter.text(`${response.courses.length} videos`);

    setLoading(false);
}

$(document).ready(function() {
    $("<div>", {class: "loader"}).insertBefore(".carousel-inner");
    $("<div>", {class: "loader"}).insertBefore("#search-results");

    loadFilters();

    // Timeouts are only there to actually see the loading spinner.
    setTimeout(() => { loadQuotes(); }, 300);
    setTimeout(() => { loadCarousel("videos", `${BASE_API}/latest-videos`); }, 300);
    setTimeout(() => { loadCarousel("tutorials", `${BASE_API}/popular-tutorials`); }, 300);
    setTimeout(() => { loadCourses(); }, 300);
});
