handleInfoDropdown();

const logoutBtn = $("#logout-button");
const profileBtn = $("#profile-button");
// common
logoutBtn.on("click", (e) => {
    e.preventDefault();

    const id = logoutBtn.attr("data-id");
    $.ajax({
        url: `/api/auth/logout/${id}`,
        method: "GET",
        success: (res) => {
            if (!res.errors) {
                window.location.href = "/auth/login";
            } else {
                toastLogout(res.errors);
            }
        },
        error: (err) => {
            console.log(err);
            toastLogout(err.responseJSON.errors);
        }
    });
});

profileBtn.on("click", (e) => {
    e.preventDefault();
    window.location.href = "/employee/profile";
});

function toastLogout(msg) {
    const toast = `
    <div class="alert alert-danger alert-dismissible fade show" role="alert" 
    style="position: fixed; bottom: 10px; right: 10px; z-index: 9999;">
      <strong>Logout failed -</strong> ${msg}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>`;

    $("body").append(toast);

    setTimeout(() => {
        $(".alert").alert("close");
    }, 3000);
}

// employee header
function handleInfoDropdown() {
    console.log("handle")
    const infoDropdown = $(".employee-info-container");
    const accountDropdown = $(".account-dropdown");

    // open dropdown when click
    $(infoDropdown).on("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("click")
        if (accountDropdown.hasClass("active")) {
            accountDropdown.removeClass("active");
        } else {
            accountDropdown.addClass("active");
        }
    });

    // close dropdown when click outside the infoDropdown && accountDropdown
    $(document).on("click", (e) => {
        if (!$(e.target).closest(".employee-info-container").length && !$(e.target).closest(".account-dropdown").length) {
            if (accountDropdown.hasClass("active")) {
                accountDropdown.removeClass("active");
            }
        }
    });
}