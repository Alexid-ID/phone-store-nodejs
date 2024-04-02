$(document).ready(function () {
    handleUploadImage();
    updateImage();
    changePassword();
});

function handleUploadImage() {
    const imagePreview = $(".image-preview");
    const imageUpload = $(".image-upload");
    const imageInput = $(imageUpload).find("#input-file");
    // Image preview
    imageInput.on("change", function (e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {
            imagePreview.attr("src", e.target.result);
        };
        reader.readAsDataURL(file);
    });
}

function updateImage() {
    const updateAvatarBtn = $("#update-avatar");
    const imageInput = $(".image-upload").find("#input-file");
    const userId = $("#currentUser").val();

    updateAvatarBtn.on("click", function (e) {
        e.preventDefault();
        let formData = new FormData();
        formData.append("image", imageInput[0].files[0] ? imageInput[0].files[0] : "");

        if (userId === undefined) {
            setToastMsg(400, "Update avatar failed");
            return;
        }

        $.ajax({
            url: `/api/account/avatar/${userId}`,
            type: "PUT",
            data: formData,
            contentType: false,
            processData: false,
            success: function (data) {
                console.log("update avatar success");
                // console.log(data);
                if (data.status === 500) {
                    setToastMsg(400, "Update avatar failed");
                } else {
                    setToastMsg(200, "Update avatar successfully");
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            },
            error: function (error) {
                console.log(error);
                setToastMsg(400, "Update avatar failed");
            },
        });
    });
}

function changePassword() {
    const resetPassForm = $('#change-pass');
    const buttonReset = $(resetPassForm).find('#changePassBtn');
    const error = $(resetPassForm).find('#pass-error-message');

    buttonReset.click(function (e) {
        e.preventDefault();

        const newPass = $(resetPassForm).find('#newPass').val().trim();
        const confirmPass = $(resetPassForm).find('#confirmPass').val().trim();
        const id = $("#currentUser").val();
        console.log(id, newPass, confirmPass);

        if (newPass !== confirmPass) {
            error.html(`<div class="alert alert-danger" role="alert">
                            Passwords do not match!
                        </div>`);
            return;
        }

        if (id === undefined) {
            setToastMsg(400, "Update password failed");
            return;
        }

        $.ajax({
            url: '/api/auth/reset-password/' + id,
            method: 'POST',
            data: {
                newPassword: newPass,
                confirmPassword: confirmPass
            },
            success: function (data) {
                // console.log(data);
                if (data.status !== "success") {
                    setToastMsg(400, "Update password failed");
                    $(resetPassForm).find('#newPass').val("");
                    $(resetPassForm).find('#confirmPass').val("");
                } else {
                    setToastMsg(200, "Update password successfully");
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                }
            },
            error: function (err) {
                console.log(err);
                setToastMsg(400, "Update password failed")
                $(resetPassForm).find('#newPass').val("");
                $(resetPassForm).find('#confirmPass').val("");
            }
        })

    })
}

function setToastMsg(status, msg) {
    const toastContainer = $(".toast-container");
    toastContainer.empty();
    let toastHtml = `
	<div
		id="toast-msg"
		class="alert alert-${status === 200 ? "success" : "danger"}
		 alert-dismissible border-0 fade show"
		role="alert"
		style="position: fixed; margin: 1rem; right: 0; bottom: 0; z-index: 9999;"
	>
		<i class="dripicons-checkmark mr-2"></i>
		<button type="button" class="close" data-dismiss="alert" aria-label="Close">
			<span aria-hidden="true">&times;</span>
		</button>
		<span class="msg">
		<strong>${status === 200 ? "Success" : "Failed"}
		 - </strong>${msg}</span>
	</div>
	`;

    toastContainer.html(toastHtml);
    setTimeout(() => {
        $("#toast-msg").alert("close");
    }, 3000);
}